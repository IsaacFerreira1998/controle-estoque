import { StatsCard } from "@/components/dashboard/StatsCard";
import { AdvancedCharts } from "@/components/dashboard/AdvancedCharts";
import { ExcelExportButton } from "@/components/excel/ExcelExportButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, PackagePlus, PackageMinus, AlertTriangle, TrendingUp, TrendingDown, BarChart3 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";

const movimentacaoData = [
  { mes: "Jan", entradas: 120, saidas: 80 },
  { mes: "Fev", entradas: 150, saidas: 95 },
  { mes: "Mar", entradas: 180, saidas: 110 },
  { mes: "Abr", entradas: 140, saidas: 125 },
  { mes: "Mai", entradas: 200, saidas: 140 },
  { mes: "Jun", entradas: 170, saidas: 155 }
];

const estoqueData = [
  { categoria: "Eletrônicos", valor: 35 },
  { categoria: "Móveis", valor: 25 },
  { categoria: "Ferramentas", valor: 20 },
  { categoria: "Materiais", valor: 15 },
  { categoria: "Outros", valor: 5 }
];

const COLORS = ["hsl(217 91% 60%)", "hsl(142 71% 45%)", "hsl(48 96% 53%)", "hsl(0 84% 60%)", "hsl(220 9% 46%)"];

const alertas = [
  { produto: "Parafusos Phillips 6mm", estoque: 5, minimo: 50, categoria: "Ferramentas" },
  { produto: "Cabo HDMI 2m", estoque: 2, minimo: 20, categoria: "Eletrônicos" },
  { produto: "Mesa Escritório", estoque: 1, minimo: 5, categoria: "Móveis" }
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Dashboard EstoqueMax</h1>
          <p className="text-muted-foreground">
            Visão geral completa do sistema de estoque - BI Integrado
          </p>
        </div>
        <ExcelExportButton fileName="Dashboard_EstoqueMax_BI" />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total de Produtos"
          value="1,234"
          change="+12% desde o mês passado"
          icon={Package}
          variant="stock"
        />
        <StatsCard
          title="Entradas do Mês"
          value="186"
          change="+8% desde o mês passado"
          icon={PackagePlus}
          variant="entry"
        />
        <StatsCard
          title="Saídas do Mês"
          value="142"
          change="+4% desde o mês passado"
          icon={PackageMinus}
          variant="exit"
        />
        <StatsCard
          title="Produtos em Falta"
          value="23"
          change="Requer atenção"
          icon={AlertTriangle}
          variant="exit"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Movimentação Mensal */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Movimentação Mensal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={movimentacaoData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="entradas" fill="hsl(142 71% 45%)" name="Entradas" />
                <Bar dataKey="saidas" fill="hsl(0 84% 60%)" name="Saídas" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Distribuição por Categoria */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              Estoque por Categoria
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={estoqueData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ categoria, valor }) => `${categoria}: ${valor}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="valor"
                >
                  {estoqueData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Business Intelligence - Análises Avançadas */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold gradient-text">Business Intelligence</h2>
          <div className="flex-1"></div>
          <Button className="gradient-primary" size="sm">
            <TrendingUp className="h-4 w-4 mr-2" />
            Relatório Completo
          </Button>
        </div>
        <AdvancedCharts />
      </div>
    </div>
  );
}