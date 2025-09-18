import { Bell, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function Header() {
  return (
    <header className="h-16 bg-card border-b border-border px-6 flex items-center justify-between shadow-soft">
      <div className="flex items-center gap-4">
        <h2 className="text-lg font-semibold text-foreground">
          Sistema de Controle de Estoque
        </h2>
      </div>
      
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="h-5 w-5" />
          <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs bg-danger">
            3
          </Badge>
        </Button>
        
        <Button variant="ghost" size="sm" className="gap-2">
          <User className="h-5 w-5" />
          Administrador
        </Button>
      </div>
    </header>
  );
}