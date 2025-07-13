import { IngredientManager } from "@/components/ingredient-manager";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function IngredientsPage() {
  return (
    <div className="space-y-6">
       <Card>
        <CardHeader>
          <CardTitle>Gestión de Ingredientes</CardTitle>
          <CardDescription>
            Defina ingredientes como conceptos alimentarios generales. Cada ingrediente puede agrupar varios artículos del catálogo.
          </CardDescription>
        </CardHeader>
      </Card>
      <IngredientManager />
    </div>
  );
}
