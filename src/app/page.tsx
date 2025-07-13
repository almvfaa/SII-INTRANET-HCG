import { MenuCalendar } from "@/components/menu-calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Panel Principal</CardTitle>
          <CardDescription>
            Visualice, genere y gestione los menús diarios. Haga clic en un día para ver detalles o crear un nuevo menú.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <MenuCalendar />
        </CardContent>
      </Card>
    </div>
  );
}
