"use client";

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useLocalStorage } from '@/lib/hooks/use-local-storage';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { generateDailyMenu, generateMenuSuggestions } from '@/ai/flows';
import type { ScheduledMenu, Profile } from '@/lib/types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { Loader2, Sparkles } from 'lucide-react';

interface MenuDialogProps {
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  date?: Date;
  menu?: ScheduledMenu;
  scheduledMenus: ScheduledMenu[];
  setScheduledMenus: (menus: ScheduledMenu[]) => void;
}

const formSchema = z.object({
  serviceProfileId: z.string().min(1, 'Debe seleccionar un perfil de servicio.'),
  pathologyProfileId: z.string().min(1, 'Debe seleccionar un perfil de patología.'),
});

export function MenuDialog({ isOpen, setOpen, date, menu, scheduledMenus, setScheduledMenus }: MenuDialogProps) {
  const [serviceProfiles] = useLocalStorage<Profile[]>('service-profiles', []);
  const [pathologyProfiles] = useLocalStorage<Profile[]>('pathology-profiles', []);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      serviceProfileId: menu?.serviceProfileId || '',
      pathologyProfileId: menu?.pathologyProfileId || '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!date) return;
    setIsGenerating(true);
    try {
      const serviceProfile = serviceProfiles.find(p => p.id === values.serviceProfileId);
      const pathologyProfile = pathologyProfiles.find(p => p.id === values.pathologyProfileId);

      if (!serviceProfile || !pathologyProfile) {
        toast({ variant: 'destructive', title: 'Error', description: 'Perfiles no encontrados.' });
        return;
      }
      
      const result = await generateDailyMenu({
        serviceProfile: `${serviceProfile.name}: ${serviceProfile.rules}`,
        pathologyProfile: `${pathologyProfile.name}: ${pathologyProfile.rules}`,
        date: format(date, 'yyyy-MM-dd'),
      });
      
      const newMenu: ScheduledMenu = {
        date: format(date, 'yyyy-MM-dd'),
        serviceProfileId: values.serviceProfileId,
        pathologyProfileId: values.pathologyProfileId,
        menu: result.menu,
      };

      const existingMenuIndex = scheduledMenus.findIndex(m => m.date === newMenu.date);
      if (existingMenuIndex > -1) {
        const updatedMenus = [...scheduledMenus];
        updatedMenus[existingMenuIndex] = newMenu;
        setScheduledMenus(updatedMenus);
      } else {
        setScheduledMenus([...scheduledMenus, newMenu]);
      }

      toast({ title: 'Éxito', description: 'Menú generado y guardado correctamente.' });
      setOpen(false);

    } catch (error) {
      console.error(error);
      toast({ variant: 'destructive', title: 'Error', description: 'No se pudo generar el menú.' });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateSuggestions = async () => {
    if (!menu) return;
    setIsSuggesting(true);
    setSuggestions([]);
    try {
      const pathologyProfile = pathologyProfiles.find(p => p.id === menu.pathologyProfileId);
      const result = await generateMenuSuggestions({
        menu: menu.menu,
        dietaryRestrictions: pathologyProfile?.rules || 'Ninguna',
      });
      setSuggestions(result.suggestions);
    } catch(error) {
       console.error(error);
       toast({ variant: 'destructive', title: 'Error', description: 'No se pudieron generar sugerencias.' });
    } finally {
      setIsSuggesting(false);
    }
  };
  
  const handleClose = () => {
    form.reset();
    setSuggestions([]);
    setOpen(false);
  }

  const getProfileName = (id: string, type: 'service' | 'pathology') => {
    const profiles = type === 'service' ? serviceProfiles : pathologyProfiles;
    return profiles.find(p => p.id === id)?.name || 'Desconocido';
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <ScrollArea className="max-h-[80vh] pr-6">
        <DialogHeader>
          <DialogTitle>
            Menú para {date ? format(date, "EEEE, d 'de' MMMM", { locale: es }) : ''}
          </DialogTitle>
          <DialogDescription>
            {menu ? 'Vea el menú programado o genere uno nuevo.' : 'Genere un nuevo menú para esta fecha.'}
          </DialogDescription>
        </DialogHeader>

        {menu ? (
          <div className="py-4 space-y-4">
            <div className="prose prose-sm dark:prose-invert rounded-md border p-4 bg-muted/50">
              <h4 className="font-bold">Perfil de Servicio: <span className="font-normal">{getProfileName(menu.serviceProfileId, 'service')}</span></h4>
              <h4 className="font-bold">Perfil de Patología: <span className="font-normal">{getProfileName(menu.pathologyProfileId, 'pathology')}</span></h4>
              <hr className="my-2"/>
              <pre className="text-sm whitespace-pre-wrap font-body bg-transparent p-0">{menu.menu}</pre>
            </div>

            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="suggestions">
                <AccordionTrigger>
                   <Button variant="outline" size="sm" onClick={handleGenerateSuggestions} disabled={isSuggesting}>
                      {isSuggesting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                      Generar Sugerencias Alternativas
                    </Button>
                </AccordionTrigger>
                <AccordionContent>
                  {isSuggesting && <p className="text-sm text-muted-foreground">Generando sugerencias...</p>}
                  {suggestions.length > 0 && (
                     <div className="prose prose-sm dark:prose-invert mt-2">
                       <ul className="pl-5">
                         {suggestions.map((s, i) => <li key={i}>{s}</li>)}
                       </ul>
                     </div>
                  )}
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="regenerate">
                <AccordionTrigger>Regenerar Menú</AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm text-muted-foreground mb-4">Seleccione nuevos perfiles para generar un menú diferente para esta fecha.</p>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      {/* Form content for regeneration */}
                      <FormField
                        control={form.control}
                        name="serviceProfileId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Perfil de Servicio</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger><SelectValue placeholder="Seleccione un perfil" /></SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {serviceProfiles.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="pathologyProfileId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Perfil de Patología</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger><SelectValue placeholder="Seleccione un perfil" /></SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {pathologyProfiles.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button type="submit" disabled={isGenerating}>
                        {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                        Regenerar Menú
                      </Button>
                    </form>
                  </Form>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        ) : (
          <div className="py-4">
             <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="serviceProfileId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Perfil de Servicio</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger><SelectValue placeholder="Seleccione un perfil de servicio" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {serviceProfiles.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="pathologyProfileId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Perfil de Patología</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger><SelectValue placeholder="Seleccione un perfil de patología" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {pathologyProfiles.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter className="pt-4">
                    <Button type="button" variant="ghost" onClick={handleClose}>Cancelar</Button>
                    <Button type="submit" disabled={isGenerating}>
                      {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                      Generar Menú con IA
                    </Button>
                </DialogFooter>
              </form>
            </Form>
          </div>
        )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
