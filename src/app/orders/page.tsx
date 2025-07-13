import { OrderList } from "@/components/order-list";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function OrdersPage() {
  return (
    <div className="space-y-6">
       <Card>
        <CardHeader>
          <CardTitle>Generación de Listas de Pedidos</CardTitle>
          <CardDescription>
            Genere listas de pedidos mensuales basadas en los menús programados en el calendario.
          </CardDescription>
        </CardHeader>
      </Card>
      <OrderList />
    </div>
  );
}
