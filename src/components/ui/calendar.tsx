"use client"

import * as React from "react"
import dynamic from "next/dynamic"
import { Skeleton } from "./skeleton"
import type { CalendarProps } from "./calendar-core"

const CalendarCore = dynamic(() => import("./calendar-core").then(mod => mod.Calendar), {
  ssr: false,
  loading: () => (
    <div className="rounded-md border w-full p-3">
      <div className="flex items-center justify-between mb-4">
        <Skeleton className="h-8 w-2/5" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-8 rounded-md" />
          <Skeleton className="h-8 w-8 rounded-md" />
        </div>
      </div>
      <div className="grid grid-cols-7 gap-y-2">
        {/* Days of week */}
        {[...Array(7)].map((_, i) => (
            <Skeleton key={i} className="h-8 w-8 rounded-md mx-auto" />
        ))}
        {/* Calendar days */}
        {[...Array(35)].map((_, i) => (
          <Skeleton key={i} className="h-9 w-9 rounded-md mx-auto" />
        ))}
      </div>
       <div className="text-sm text-muted-foreground p-4 border-t mt-4">
          <div className="flex items-center gap-2">
             <Skeleton className="h-5 w-24" />
          </div>
           <Skeleton className="h-4 w-4/5 mt-2" />
        </div>
    </div>
  ),
})

const Calendar = (props: CalendarProps) => {
    return <CalendarCore {...props} />;
};


Calendar.displayName = "Calendar"

export { Calendar }
