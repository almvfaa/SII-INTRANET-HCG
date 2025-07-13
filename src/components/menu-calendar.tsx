"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { Calendar } from "@/components/ui/calendar";
import { useLocalStorage } from '@/lib/hooks/use-local-storage';
import type { ScheduledMenu } from '@/lib/types';
import { MenuDialog } from './menu-dialog';
import { format, isSameDay } from 'date-fns';

export function MenuCalendar() {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();

  const [scheduledMenus, setScheduledMenus] = useLocalStorage<ScheduledMenu[]>('scheduled-menus', []);

  useEffect(() => {
    // This ensures the date is only set on the client, avoiding hydration mismatch.
    setDate(new Date());
  }, []);

  const handleDayClick = (day: Date) => {
    setSelectedDate(day);
    setDialogOpen(true);
  };
  
  const selectedMenu = useMemo(() => {
    if (!selectedDate) return undefined;
    const formattedDate = format(selectedDate, 'yyyy-MM-dd');
    return scheduledMenus.find(m => m.date === formattedDate);
  }, [selectedDate, scheduledMenus]);
  
  const menuDays = useMemo(() => {
    return scheduledMenus.map(m => {
        // The date from local storage might be a string, so we need to parse it.
        // Adding a day to correct for timezone issues when creating the date object.
        const [year, month, day] = m.date.split('-').map(Number);
        return new Date(year, month - 1, day);
    });
  }, [scheduledMenus]);

  const modifiers = {
    hasMenu: (day: Date) => menuDays.some(menuDay => isSameDay(day, menuDay)),
  };

  const modifiersStyles = {
    hasMenu: {
      fontWeight: 'bold',
      color: 'hsl(var(--primary))',
      textDecoration: 'underline',
      textDecorationStyle: 'wavy' as const,
      textUnderlineOffset: '0.2em'
    },
  };

  return (
    <>
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        onDayClick={handleDayClick}
        className="rounded-md border w-full"
        modifiers={modifiers}
        modifiersStyles={modifiersStyles}
        footer={
          <div className="text-sm text-muted-foreground p-4 border-t">
            <div className="flex items-center gap-2">
              <span style={modifiersStyles.hasMenu} className="font-bold underline">Día con menú</span>
            </div>
            <p className="mt-2">Seleccione una fecha para ver o generar un menú.</p>
          </div>
        }
      />
      <MenuDialog
        isOpen={isDialogOpen}
        setOpen={setDialogOpen}
        date={selectedDate}
        menu={selectedMenu}
        scheduledMenus={scheduledMenus}
        setScheduledMenus={setScheduledMenus}
      />
    </>
  );
}
