"use client";

import React, { useState } from 'react';
import { useLocalStorage } from '@/lib/hooks/use-local-storage';
import type { Ingredient, CatalogItem } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Badge } from './ui/badge';
import { MultiSelect } from './ui/multi-select';
import Image from 'next/image';

export function IngredientManager() {
  const [ingredients, setIngredients] = useLocalStorage<Ingredient[]>('ingredients', []);
  const [catalogItems] = useLocalStorage<CatalogItem[]>('catalog-items', []);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [editingIngredient, setEditingIngredient] = useState<Ingredient | null>(null);

  const openDialog = (ingredient: Ingredient | null = null) => {
    setEditingIngredient(ingredient);
    setDialogOpen(true);
  };

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const imageUrl = formData.get('imageUrl') as string;
    const linkedItemCodesString = formData.get('linkedItemCodes') as string;
    const linkedItemCodes = linkedItemCodesString ? linkedItemCodesString.split(',') : [];

    if (editingIngredient) {
      setIngredients(ingredients.map(i => i.id === editingIngredient.id ? { ...i, name, description, imageUrl, linkedItemCodes } : i));
    } else {
      const newIngredient: Ingredient = { id: crypto.randomUUID(), name, description, imageUrl, linkedItemCodes };
      setIngredients([...ingredients, newIngredient]);
    }
    setDialogOpen(false);
    setEditingIngredient(null);
  };

  const handleDelete = (id: string) => {
    setIngredients(ingredients.filter(i => i.id !== id));
  };
  
  const getCatalogItemDescription = (code: string) => catalogItems.find(item => item.code === code)?.description || 'Desconocido';

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Ingredientes</CardTitle>
            <Button size="sm" onClick={() => openDialog()}>
              <PlusCircle className="mr-2 h-4 w-4" /> Nuevo Ingrediente
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Imagen</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead>Artículos Vinculados</TableHead>
                <TableHead className="w-[100px] text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ingredients.length > 0 ? ingredients.map(ing => (
                <TableRow key={ing.id}>
                  <TableCell>
                    {ing.imageUrl ? (
                      <div className="relative h-16 w-16">
                         <Image
                          src={ing.imageUrl}
                          alt={ing.name}
                          fill
                          sizes="64px"
                          className="rounded-md object-cover"
                        />
                      </div>
                    ) : (
                      <div className="flex h-16 w-16 items-center justify-center rounded-md bg-muted text-xs text-muted-foreground">
                        Sin imagen
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{ing.name}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{ing.description}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {ing.linkedItemCodes.map(code => <Badge key={code} variant="secondary">{getCatalogItemDescription(code)}</Badge>)}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                      <Button variant="ghost" size="icon" onClick={() => openDialog(ing)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                       <AlertDialog>
                        <AlertDialogTrigger asChild>
                           <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                             <Trash2 className="h-4 w-4" />
                           </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>¿Está seguro?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Esta acción eliminará permanentemente el ingrediente.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(ing.id)} className="bg-destructive hover:bg-destructive/90">Eliminar</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              )) : (
                 <TableRow>
                  <TableCell colSpan={5} className="text-center">No hay ingredientes definidos.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingIngredient ? 'Editar' : 'Nuevo'} Ingrediente</DialogTitle>
             <DialogDescription>
              Defina un ingrediente y vincule los artículos del catálogo correspondientes.
            </DialogDescription>
          </DialogHeader>
          <IngredientForm
            key={editingIngredient?.id || 'new'}
            catalogItems={catalogItems}
            initialData={editingIngredient}
            onSubmit={(data) => {
              if (editingIngredient) {
                setIngredients(ingredients.map(i => i.id === editingIngredient.id ? { ...editingIngredient, ...data } : i));
              } else {
                setIngredients([...ingredients, { id: crypto.randomUUID(), ...data }]);
              }
              setDialogOpen(false);
              setEditingIngredient(null);
            }}
            onCancel={() => {
              setDialogOpen(false);
              setEditingIngredient(null);
            }}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}

// Separate form component for better state management
interface IngredientFormProps {
  catalogItems: CatalogItem[];
  initialData: Ingredient | null;
  onSubmit: (data: Omit<Ingredient, 'id'>) => void;
  onCancel: () => void;
}

function IngredientForm({ catalogItems, initialData, onSubmit, onCancel }: IngredientFormProps) {
  const [name, setName] = useState(initialData?.name || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [imageUrl, setImageUrl] = useState(initialData?.imageUrl || '');
  const [selectedItems, setSelectedItems] = useState(initialData?.linkedItemCodes || []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name, description, imageUrl, linkedItemCodes: selectedItems });
  };
  
  const catalogOptions = catalogItems.map(item => ({ value: item.code, label: `${item.code} - ${item.description}`}));

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-4 py-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nombre del Ingrediente</Label>
          <Input id="name" value={name} onChange={e => setName(e.target.value)} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Descripción</Label>
          <Textarea id="description" value={description} onChange={e => setDescription(e.target.value)} rows={2} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="imageUrl">URL de Imagen (Opcional)</Label>
          <Input id="imageUrl" value={imageUrl} onChange={e => setImageUrl(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Artículos del Catálogo Vinculados</Label>
          <MultiSelect
            options={catalogOptions}
            selected={selectedItems}
            onChange={setSelectedItems}
            placeholder="Seleccione artículos..."
          />
        </div>
      </div>
      <DialogFooter>
        <Button type="button" variant="ghost" onClick={onCancel}>Cancelar</Button>
        <Button type="submit">Guardar Ingrediente</Button>
      </DialogFooter>
    </form>
  )
}
