"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { useLocalStorage } from '@/lib/hooks/use-local-storage';
import type { ScheduledMenu, Profile } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { DateRange } from 'react-day-picker';
import { addDays, format, isWithinInterval } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar as CalendarIcon, Download } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Calendar } from './ui/calendar';
import { cn } from '@/lib/utils';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';

export function OrderList() {
  const [scheduledMenus] = useLocalStorage<ScheduledMenu[]>('scheduled-menus', []);
  const [serviceProfiles] = useLocalStorage<Profile[]>('service-profiles', []);
  const [pathologyProfiles] = useLocalStorage<Profile[]>('pathology-profiles', []);
  
  const [date, setDate] = useState<DateRange | undefined>(undefined);

  useEffect(() => {
    setDate({
      from: new Date(),
      to: addDays(new Date(), 30),
    });
  }, []);

  const filteredMenus = useMemo(() => {
    if (!date?.from || !date?.to) return [];
    return scheduledMenus
      .filter(menu => {
        const menuDate = new Date(menu.date);
        return isWithinInterval(menuDate, { start: date.from!, end: date.to! });
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [scheduledMenus, date]);

  const getProfileName = (id: string, type: 'service' | 'pathology') => {
    const profiles = type === 'service' ? serviceProfiles : pathologyProfiles;
    return profiles.find(p => p.id === id)?.name || 'Desconocido';
  }

  const handlePrint = () => {
    window.print();
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle>Seleccionar Rango de Fechas</CardTitle>
              <CardDescription>Elija el período para el cual desea generar la lista de pedidos.</CardDescription>
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date"
                  variant={"outline"}
                  className={cn(
                    "w-full sm:w-[300px] justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date?.from ? (
                    date.to ? (
                      <>
                        {format(date.from, "LLL dd, y")} -{" "}
                        {format(date.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(date.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={date?.from}
                  selected={date}
                  onSelect={setDate}
                  numberOfMonths={2}
                  locale={es}
                />
              </PopoverContent>
            </Popover>
          </div>
        </CardHeader>
      </Card>
      
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Menús Programados</CardTitle>
            <Button size="sm" onClick={handlePrint}>
              <Download className="mr-2 h-4 w-4" /> Imprimir Lista
            </Button>
          </div>
          <CardDescription>
            A continuación se muestran todos los menús programados para el rango de fechas seleccionado.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredMenus.length > 0 ? (
            <Accordion type="single" collapsible className="w-full">
              {filteredMenus.map(menu => (
                <AccordionItem value={menu.date} key={menu.date}>
                  <AccordionTrigger className="font-medium text-lg">
                    {format(new Date(menu.date), "EEEE, d 'de' MMMM, yyyy", { locale: es })}
                  </AccordionTrigger>
                  <AccordionContent>
                     <div className="prose prose-sm dark:prose-invert rounded-md border p-4 bg-muted/50">
                        <h4 className="font-bold">Perfil de Servicio: <span className="font-normal">{getProfileName(menu.serviceProfileId, 'service')}</span></h4>
                        <h4 className="font-bold">Perfil de Patología: <span className="font-normal">{getProfileName(menu.pathologyProfileId, 'pathology')}</span></h4>
                        <hr className="my-2"/>
                        <pre className="text-sm whitespace-pre-wrap font-body bg-transparent p-0">{menu.menu}</pre>
                      </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <p className="text-muted-foreground text-center py-8">No hay menús programados para este rango de fechas.</p>
          )}
        </CardContent>
      </Card>

    </div>
  );
}
