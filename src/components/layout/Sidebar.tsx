import { cn } from "@/lib/utils";
import { LayoutDashboard, Package, PackagePlus, PackageMinus, BarChart3, Search, Settings } from "lucide-react";
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
    <div className="w-60 flex flex-col" style={{ background: "hsl(var(--sidebar-background))" }}>
      {/* Logo */}
      <div className="px-5 py-5 border-b" style={{ borderColor: "hsl(var(--sidebar-border))" }}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center flex-shrink-0">
            <Package className="h-4 w-4 text-white" />
          </div>
          <div>
            <h1 className="text-sm font-bold leading-none" style={{ color: "hsl(var(--sidebar-accent-foreground))" }}>
              EstoqueMax
            </h1>
            <p className="text-xs mt-0.5" style={{ color: "hsl(var(--sidebar-foreground))" }}>
              Controle de Estoque
            </p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link key={item.name} to={item.href} className="block">
              <div
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-smooth cursor-pointer",
                  isActive
                    ? "text-white"
                    : "hover:text-white"
                )}
                style={
                  isActive
                    ? { background: "hsl(var(--sidebar-primary))", color: "white" }
                    : { color: "hsl(var(--sidebar-foreground))" }
                }
                onMouseEnter={(e) => {
                  if (!isActive) {
                    (e.currentTarget as HTMLElement).style.background = "hsl(var(--sidebar-accent))";
                    (e.currentTarget as HTMLElement).style.color = "hsl(var(--sidebar-accent-foreground))";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    (e.currentTarget as HTMLElement).style.background = "transparent";
                    (e.currentTarget as HTMLElement).style.color = "hsl(var(--sidebar-foreground))";
                  }
                }}
              >
                <item.icon className="h-4 w-4 flex-shrink-0" />
                {item.name}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-5 py-3 border-t" style={{ borderColor: "hsl(var(--sidebar-border))" }}>
        <p className="text-xs" style={{ color: "hsl(var(--sidebar-foreground))" }}>
          © 2025 EstoqueMax
        </p>
      </div>
    </div>
  );
}