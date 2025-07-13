import { CatalogManager } from "@/components/catalog-manager";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function CatalogPage() {
  return (
    <div className="space-y-6">
       <Card>
        <CardHeader>
          <CardTitle>Catálogo de Artículos</CardTitle>
          <CardDescription>
            Mantenga un catálogo de artículos alimenticios disponibles con detalles como información nutricional y proveedor.
          </CardDescription>
        </CardHeader>
      </Card>
      <CatalogManager />
    </div>
  );
}