"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { CatalogItem } from "@/lib/types";
import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

const formSchema = z.object({
  code: z.string().min(1, "El código es requerido"),
  description: z.string().min(1, "La descripción es requerida"),
  unit: z.string().min(1, "La unidad es requerida"),
});

type CatalogFormValues = z.infer<typeof formSchema>;

interface CatalogFormProps {
  onSubmit: (data: CatalogFormValues) => void;
  initialData?: CatalogItem;
  onCancel: () => void;
}

export function CatalogForm({ onSubmit, initialData, onCancel }: CatalogFormProps) {
  const form = useForm<CatalogFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      code: "",
      description: "",
      unit: "",
    },
  });

  useEffect(() => {
    form.reset(initialData);
  }, [initialData, form]);

  const title = initialData ? 'Editar Artículo' : 'Crear Artículo';

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Código</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: 001-A" {...field} disabled={!!initialData} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción del Artículo</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Manzana Roja" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="unit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Unidad de Medida</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Kg, Un, L" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancelar
              </Button>
              <Button type="submit">Guardar</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
