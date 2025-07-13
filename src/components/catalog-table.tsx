"use client";

import { CatalogItem } from "@/lib/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2, Pencil } from "lucide-react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

interface CatalogTableProps {
  items: CatalogItem[];
  onEdit: (item: CatalogItem) => void;
  onDelete: (code: string) => void;
}

export function CatalogTable({ items, onEdit, onDelete }: CatalogTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Lista de Artículos</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Código</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead>Unidad</TableHead>
                <TableHead>Imagen</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.length > 0 ? (
                items.map((item) => (
                  <TableRow key={item.code}>
                    <TableCell className="font-medium">{item.code}</TableCell>
                    <TableCell>{item.description}</TableCell>
                    <TableCell>{item.unit}</TableCell>
                    <TableCell>
                      {item.imageUrl ? (
                        <div className="relative h-16 w-16">
                           <Image
                            src={item.imageUrl}
                            alt={item.description}
                            fill
                            className="rounded-md object-cover"
                          />
                        </div>
                      ) : (
                        <div className="flex h-16 w-16 items-center justify-center rounded-md bg-muted text-xs text-muted-foreground">
                          Sin imagen
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => onEdit(item)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => onDelete(item.code)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    No hay artículos en el catálogo.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
