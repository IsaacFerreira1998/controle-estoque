import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area, RadialBarChart, RadialBar
} from 'recharts';
import { TrendingUp, TrendingDown, Package, AlertTriangle, ShoppingCart, Truck } from "lucide-react";

// Dados de exemplo mais robustos
const estoquePorCategoria = [
  { categoria: "Eletrônicos", quantidade: 45, valor: 67500, cor: "#8B5CF6" },
  { categoria: "Ferramentas", quantidade: 35, valor: 15750, cor: "#06B6D4" },
  { categoria: "Móveis", quantidade: 25, valor: 8900, cor: "#10B981" },
  { categoria: "Materiais", quantidade: 45, valor: 3270, cor: "#F59E0B" },
  { categoria: "Outros", quantidade: 20, valor: 2100, cor: "#EF4444" }
];

const movimentacoesMensais = [
  { mes: "Jan", entradas: 120, saidas: 80, saldo: 40 },
  { mes: "Fev", entradas: 150, saidas: 95, saldo: 55 },
  { mes: "Mar", entradas: 180, saidas: 110, saldo: 70 },
  { mes: "Abr", entradas: 140, saidas: 130, saldo: 10 },
  { mes: "Mai", entradas: 200, saidas: 150, saldo: 50 },
  { mes: "Jun", entradas: 175, saidas: 140, saldo: 35 }
];

const topProdutos = [
  { produto: "Notebook Dell", valor: 15000, vendas: 12 },
  { produto: "Furadeira Bosch", valor: 8500, vendas: 19 },
  { produto: "Mesa Escritório", valor: 7200, vendas: 8 },
  { produto: "Impressora HP", valor: 6800, vendas: 15 },
  { produto: "Cadeira Ergonômica", valor: 5900, vendas: 11 }
];

const alertasEstoque = [
  { produto: "Parafusos M6", nivel: 15, minimo: 50, status: "crítico" },
  { produto: "Tinta Branca", nivel: 25, minimo: 40, status: "baixo" },
  { produto: "Cabo USB", nivel: 8, minimo: 30, status: "crítico" },
  { produto: "Papel A4", nivel: 35, minimo: 50, status: "baixo" }
];

const performanceFornecedores = [
  { fornecedor: "TechCorp", entregas: 95, pontualidade: 98, qualidade: 96 },
  { fornecedor: "ToolMax", entregas: 88, pontualidade: 85, qualidade: 92 },
  { fornecedor: "MobiliaCorp", entregas: 78, pontualidade: 90, qualidade: 89 },
  { fornecedor: "MaterialPro", entregas: 82, pontualidade: 88, qualidade: 94 }
];

const COLORS = ['#8B5CF6', '#06B6D4', '#10B981', '#F59E0B', '#EF4444'];

export function AdvancedCharts() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {/* Gráfico de Pizza - Estoque por Categoria */}
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Estoque por Categoria
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={estoquePorCategoria}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="quantidade"
                label={({ categoria, percent }: any) => `${categoria} ${(percent * 100).toFixed(0)}%`}
              >
                {estoquePorCategoria.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.cor} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => [`${value} itens`, 'Quantidade']} />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Gráfico de Barras - Movimentações Mensais */}
      <Card className="col-span-1 lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Movimentações Mensais
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={movimentacoesMensais}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="entradas" fill="#10B981" name="Entradas" />
              <Bar dataKey="saidas" fill="#EF4444" name="Saídas" />
              <Bar dataKey="saldo" fill="#8B5CF6" name="Saldo" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Top Produtos por Valor */}
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Top Produtos por Valor
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={topProdutos} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="produto" type="category" width={100} />
              <Tooltip formatter={(value: number) => [`R$ ${value}`, 'Valor']} />
              <Bar dataKey="valor" fill="#06B6D4" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Alertas de Estoque */}
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            Alertas de Estoque
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {alertasEstoque.map((alerta, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex flex-col">
                  <span className="font-medium text-sm">{alerta.produto}</span>
                  <span className="text-xs text-muted-foreground">
                    Atual: {alerta.nivel} | Mínimo: {alerta.minimo}
                  </span>
                </div>
                <div className={`px-2 py-1 rounded text-xs font-medium ${
                  alerta.status === 'crítico' 
                    ? 'bg-red-100 text-red-800' 
                    : 'bg-orange-100 text-orange-800'
                }`}>
                  {alerta.status.toUpperCase()}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance de Fornecedores */}
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5" />
            Performance Fornecedores
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <RadialBarChart data={performanceFornecedores} innerRadius="20%" outerRadius="90%">
              <RadialBar
                dataKey="pontualidade"
                cornerRadius={10}
                fill="#8B5CF6"
              />
              <Tooltip />
            </RadialBarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Área Chart - Evolução do Valor do Estoque */}
      <Card className="col-span-1 lg:col-span-3">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Evolução do Valor do Estoque
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={movimentacoesMensais}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip formatter={(value: number) => [`R$ ${(value * 1000).toLocaleString('pt-BR')}`, 'Valor']} />
              <Area 
                type="monotone" 
                dataKey="entradas" 
                stackId="1"
                stroke="#10B981" 
                fill="#10B981" 
                fillOpacity={0.6}
                name="Entradas"
              />
              <Area 
                type="monotone" 
                dataKey="saidas" 
                stackId="1"
                stroke="#EF4444" 
                fill="#EF4444" 
                fillOpacity={0.6}
                name="Saídas"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}