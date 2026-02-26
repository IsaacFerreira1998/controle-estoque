import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Package,
  PackagePlus,
  PackageMinus,
  BarChart3,
  Search,
  Settings
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Produtos", href: "/produtos", icon: Package },
  { name: "Entradas", href: "/entradas", icon: PackagePlus },
  { name: "Saídas", href: "/saidas", icon: PackageMinus },
  { name: "Consultas", href: "/consultas", icon: Search },
  { name: "Relatórios", href: "/relatorios", icon: BarChart3 },
  { name: "Configurações", href: "/configuracoes", icon: Settings },
];

export function Sidebar() {
  const location = useLocation();

  return (
    <div className="w-64 bg-card border-r border-border flex flex-col shadow-soft">
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center shadow-medium">
            <Package className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-primary leading-none">
              EstoqueMax
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Controle de Estoque
            </p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link key={item.name} to={item.href}>
              <Button
                variant={isActive ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start gap-3 transition-smooth",
                  isActive && "gradient-primary text-primary-foreground shadow-medium"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Button>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border">
        <div className="text-xs text-muted-foreground text-center">
          © 2025 EstoqueMax — Controle de Estoque
        </div>
      </div>
    </div>
  );
}