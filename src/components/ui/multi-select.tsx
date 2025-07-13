"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { Command as CommandPrimitive } from "cmdk";

const multiSelectVariants = cva(
  "flex items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "",
        form: "w-full",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

interface MultiSelectProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof multiSelectVariants> {
  options: { label: string; value: string }[];
  selected: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
}

const MultiSelect = React.forwardRef<
  HTMLDivElement,
  MultiSelectProps
>(
  (
    {
      options,
      selected,
      onChange,
      variant,
      className,
      placeholder = "Select options",
      ...props
    },
    ref
  ) => {
    const [open, setOpen] = React.useState(false);
    const [inputValue, setInputValue] = React.useState("");
    const inputRef = React.useRef<HTMLInputElement>(null);

    const handleSelect = (value: string) => {
      onChange([...selected, value]);
    };

    const handleDeselect = (value: string) => {
      onChange(selected.filter((v) => v !== value));
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if ((e.key === "Backspace" || e.key === "Delete") && !inputValue && selected.length > 0) {
        handleDeselect(selected[selected.length - 1]);
      }
    };
    
    const filteredOptions = options.filter(option => 
        !selected.includes(option.value) && 
        option.label.toLowerCase().includes(inputValue.toLowerCase())
    );

    return (
      <Command
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            setOpen(false);
            inputRef.current?.blur();
          }
        }}
        className="overflow-visible bg-transparent"
      >
        <div
          ref={ref}
          className={cn(multiSelectVariants({ variant }), className)}
          onClick={() => {
            setOpen(true);
            inputRef.current?.focus();
          }}
          {...props}
        >
          <div className="flex w-full flex-wrap items-center gap-2">
            {selected.map((value) => {
              const option = options.find((o) => o.value === value);
              return (
                <Badge key={value} variant="secondary" className="gap-1.5">
                  {option?.label}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeselect(value);
                    }}
                    className="rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              );
            })}
            <CommandPrimitive.Input
              ref={inputRef}
              value={inputValue}
              onValueChange={setInputValue}
              onBlur={() => setOpen(false)}
              onFocus={() => setOpen(true)}
              onKeyDown={handleKeyDown}
              placeholder={selected.length > 0 ? "" : placeholder}
              className="ml-2 flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
            />
          </div>
        </div>
        <div className="relative mt-2">
          {open && filteredOptions.length > 0 ? (
            <div className="absolute top-0 z-10 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
              <CommandGroup className="h-full overflow-auto">
                {filteredOptions.map((option) => (
                  <CommandItem
                    key={option.value}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onSelect={() => {
                      handleSelect(option.value);
                      setInputValue("");
                    }}
                    className={"cursor-pointer"}
                  >
                    {option.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </div>
          ) : null}
        </div>
      </Command>
    );
  }
);

MultiSelect.displayName = "MultiSelect";

export { MultiSelect };
