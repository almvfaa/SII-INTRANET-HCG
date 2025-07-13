"use client";

import React, { useState } from 'react';
import { useLocalStorage } from '@/lib/hooks/use-local-storage';
import type { CatalogItem } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { CatalogTable } from './catalog-table';
import { CatalogForm } from './catalog-form';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export function CatalogManager() {
  const [items, setItems] = useLocalStorage<CatalogItem[]>('catalog-items', [
    // Mock data for demonstration
    { code: 'FRU-001', description: 'Manzana Fuji', unit: 'Kg' },
    { code: 'VEG-002', description: 'Zanahoria', unit: 'Kg' },
    { code: 'PRO-003', description: 'Pechuga de Pollo', unit: 'Kg' },
  ]);
  const [isFormOpen, setFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<CatalogItem | null>(null);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const handleAddNew = () => {
    setEditingItem(null);
    setFormOpen(true);
  };

  const handleEdit = (item: CatalogItem) => {
    setEditingItem(item);
    setFormOpen(true);
  };

  const confirmDelete = (code: string) => {
    setItemToDelete(code);
  };

  const handleDelete = () => {
    if (itemToDelete) {
      setItems(items.filter(i => i.code !== itemToDelete));
      setItemToDelete(null);
    }
  };

  const handleSubmit = (data: Omit<CatalogItem, 'code'> & { code: string }) => {
    if (editingItem) {
      // Update existing item
      setItems(items.map(i => i.code === editingItem.code ? data : i));
    } else {
      // Add new item
       if (items.some(i => i.code === data.code)) {
        // Here you may want to show an error to the user
        alert("Error: El código del artículo ya existe.");
        return;
      }
      setItems([...items, data]);
    }
    setFormOpen(false);
    setEditingItem(null);
  };

  const handleCancel = () => {
    setFormOpen(false);
    setEditingItem(null);
  };

  if (isFormOpen) {
    return (
      <CatalogForm
        onSubmit={handleSubmit}
        initialData={editingItem || undefined}
        onCancel={handleCancel}
      />
    );
  }

  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center">
         <h2 className="text-2xl font-bold tracking-tight">Catálogo de Artículos</h2>
        <Button size="sm" onClick={handleAddNew}>
          <PlusCircle className="mr-2 h-4 w-4" /> Nuevo Artículo
        </Button>
      </div>
      <CatalogTable items={items} onEdit={handleEdit} onDelete={confirmDelete} />
      
      <AlertDialog open={!!itemToDelete} onOpenChange={() => setItemToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Está seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará permanentemente el artículo del catálogo.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setItemToDelete(null)}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
