"use client";

import React, { useState } from 'react';
import { useLocalStorage } from '@/lib/hooks/use-local-storage';
import type { Profile } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

export function ProfileManager() {
  const [serviceProfiles, setServiceProfiles] = useLocalStorage<Profile[]>('service-profiles', []);
  const [pathologyProfiles, setPathologyProfiles] = useLocalStorage<Profile[]>('pathology-profiles', []);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [editingProfile, setEditingProfile] = useState<Profile | null>(null);
  const [profileType, setProfileType] = useState<'service' | 'pathology'>('service');

  const openDialog = (type: 'service' | 'pathology', profile: Profile | null = null) => {
    setProfileType(type);
    setEditingProfile(profile);
    setDialogOpen(true);
  };

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const rules = formData.get('rules') as string;

    const currentProfiles = profileType === 'service' ? serviceProfiles : pathologyProfiles;
    const setProfiles = profileType === 'service' ? setServiceProfiles : setPathologyProfiles;

    if (editingProfile) {
      // Edit
      setProfiles(currentProfiles.map(p => p.id === editingProfile.id ? { ...p, name, rules } : p));
    } else {
      // Create
      const newProfile: Profile = { id: crypto.randomUUID(), name, rules, type: profileType };
      setProfiles([...currentProfiles, newProfile]);
    }
    setDialogOpen(false);
    setEditingProfile(null);
  };

  const handleDelete = (id: string, type: 'service' | 'pathology') => {
    const setProfiles = type === 'service' ? setServiceProfiles : setPathologyProfiles;
    const currentProfiles = type === 'service' ? serviceProfiles : pathologyProfiles;
    setProfiles(currentProfiles.filter(p => p.id !== id));
  };
  
  const ProfileTable = ({ profiles, type }: { profiles: Profile[], type: 'service' | 'pathology' }) => (
     <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="capitalize">{type === 'service' ? 'Servicios' : 'Patologías'}</CardTitle>
          <Button size="sm" onClick={() => openDialog(type)}>
            <PlusCircle className="mr-2 h-4 w-4" /> Nuevo Perfil
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Reglas Dietéticas</TableHead>
              <TableHead className="w-[100px] text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {profiles.length > 0 ? profiles.map(profile => (
              <TableRow key={profile.id}>
                <TableCell className="font-medium">{profile.name}</TableCell>
                <TableCell className="text-sm text-muted-foreground max-w-sm truncate">{profile.rules}</TableCell>
                <TableCell className="text-right">
                  <div className="flex gap-2 justify-end">
                    <Button variant="ghost" size="icon" onClick={() => openDialog(type, profile)}>
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
                            Esta acción no se puede deshacer. Esto eliminará permanentemente el perfil.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(profile.id, type)} className="bg-destructive hover:bg-destructive/90">Eliminar</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={3} className="text-center">No hay perfiles.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );

  return (
    <>
      <Tabs defaultValue="service">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="service">Perfiles de Servicio</TabsTrigger>
          <TabsTrigger value="pathology">Perfiles de Patología</TabsTrigger>
        </TabsList>
        <TabsContent value="service">
          <ProfileTable profiles={serviceProfiles} type="service" />
        </TabsContent>
        <TabsContent value="pathology">
          <ProfileTable profiles={pathologyProfiles} type="pathology" />
        </TabsContent>
      </Tabs>
      
      <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingProfile ? 'Editar' : 'Nuevo'} Perfil de {profileType === 'service' ? 'Servicio' : 'Patología'}</DialogTitle>
             <DialogDescription>
              Complete los detalles del perfil. Las reglas dietéticas ayudarán a la IA a generar menús apropiados.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSave}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Nombre</Label>
                <Input id="name" name="name" defaultValue={editingProfile?.name} className="col-span-3" required />
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="rules" className="text-right pt-2">Reglas</Label>
                <Textarea id="rules" name="rules" defaultValue={editingProfile?.rules} className="col-span-3" rows={5} placeholder="Ej: bajo en sodio, sin gluten, alto en fibra..." />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setDialogOpen(false)}>Cancelar</Button>
              <Button type="submit">Guardar Perfil</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
