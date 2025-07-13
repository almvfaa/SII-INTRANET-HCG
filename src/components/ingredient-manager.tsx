"use client";

import React, { useState } from 'react';
import { useLocalStorage } from '@/lib/hooks/use-local-storage';
import type { Ingredient, FoodItem } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Checkbox } from './ui/checkbox';
import { ScrollArea } from './ui/scroll-area';
import { Badge } from './ui/badge';

export function IngredientManager() {
  const [ingredients, setIngredients] = useLocalStorage<Ingredient[]>('ingredients', []);
  const [foodItems] = useLocalStorage<FoodItem[]>('food-items', []);
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
    const selectedItems = foodItems.filter(item => formData.has(item.id)).map(item => item.id);

    if (editingIngredient) {
      setIngredients(ingredients.map(i => i.id === editingIngredient.id ? { ...i, name, description, itemIds: selectedItems } : i));
    } else {
      const newIngredient: Ingredient = { id: crypto.randomUUID(), name, description, itemIds: selectedItems };
      setIngredients([...ingredients, newIngredient]);
    }
    setDialogOpen(false);
    setEditingIngredient(null);
  };

  const handleDelete = (id: string) => {
    setIngredients(ingredients.filter(i => i.id !== id));
  };
  
  const getFoodItemName = (id: string) => foodItems.find(item => item.id === id)?.name || 'Desconocido';

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
                <TableHead>Nombre</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead>Artículos Vinculados</TableHead>
                <TableHead className="w-[100px] text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ingredients.length > 0 ? ingredients.map(ing => (
                <TableRow key={ing.id}>
                  <TableCell className="font-medium">{ing.name}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{ing.description}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {ing.itemIds.map(id => <Badge key={id} variant="secondary">{getFoodItemName(id)}</Badge>)}
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
                  <TableCell colSpan={4} className="text-center">No hay ingredientes definidos.</TableCell>
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
          <form onSubmit={handleSave}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre del Ingrediente</Label>
                <Input id="name" name="name" defaultValue={editingIngredient?.name} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Descripción</Label>
                <Textarea id="description" name="description" defaultValue={editingIngredient?.description} rows={2} />
              </div>
              <div className="space-y-2">
                <Label>Artículos del Catálogo Vinculados</Label>
                <ScrollArea className="h-40 rounded-md border p-2">
                  <div className="space-y-2">
                    {foodItems.map(item => (
                      <div key={item.id} className="flex items-center space-x-2">
                         <Checkbox
                           id={item.id}
                           name={item.id}
                           defaultChecked={editingIngredient?.itemIds.includes(item.id)}
                         />
                         <Label htmlFor={item.id} className="font-normal">{item.name}</Label>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setDialogOpen(false)}>Cancelar</Button>
              <Button type="submit">Guardar Ingrediente</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
