import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string;
  change: string;
  icon: LucideIcon;
  variant?: "default" | "entry" | "exit" | "stock";
}

export function StatsCard({ title, value, change, icon: Icon, variant = "default" }: StatsCardProps) {
  const variants = {
    default: "border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10",
    entry: "border-entry/20 bg-gradient-to-br from-entry/5 to-entry/10",
    exit: "border-exit/20 bg-gradient-to-br from-exit/5 to-exit/10",
    stock: "border-stock/20 bg-gradient-to-br from-stock/5 to-stock/10"
  };

  const iconVariants = {
    default: "text-primary",
    entry: "text-entry",
    exit: "text-exit",
    stock: "text-stock"
  };

  return (
    <Card className={cn("transition-smooth hover:shadow-medium", variants[variant])}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className={cn("h-5 w-5", iconVariants[variant])} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground mt-1">
          {change}
        </p>
      </CardContent>
    </Card>
  );
}