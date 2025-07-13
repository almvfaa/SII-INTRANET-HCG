import { ProfileManager } from "@/components/profile-manager";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ProfilesPage() {
  return (
    <div className="space-y-6">
       <Card>
        <CardHeader>
          <CardTitle>Gestión de Perfiles</CardTitle>
          <CardDescription>
            Defina perfiles de servicio y patología con sus respectivas reglas dietéticas. 
            Estos perfiles se utilizarán para la generación de menús por IA.
          </CardDescription>
        </CardHeader>
      </Card>
      <ProfileManager />
    </div>
  );
}