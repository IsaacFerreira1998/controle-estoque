import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart3, Download, FileText, Calendar, TrendingUp, Package, Users, Building2 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Area, AreaChart } from "recharts";

const dadosMovimentacao = [
  { mes: "Jan", entradas: 120, saidas: 80, valor: 45000 },
  { mes: "Fev", entradas: 150, saidas: 95, valor: 52000 },
  { mes: "Mar", entradas: 180, saidas: 110, valor: 68000 },
  { mes: "Abr", entradas: 140, saidas: 125, valor: 58000 },
  { mes: "Mai", entradas: 200, saidas: 140, valor: 75000 },
  { mes: "Jun", entradas: 170, saidas: 155, valor: 62000 }
];

const dadosCategoria = [
  { categoria: "Eletrônicos", quantidade: 45, valor: 67500 },
  { categoria: "Ferramentas", quantidade: 120, valor: 15000 },
  { categoria: "Móveis", quantidade: 25, valor: 37500 },
  { categoria: "Materiais", quantidade: 80, valor: 24000 },
  { categoria: "Outros", quantidade: 30, valor: 18000 }
];

const dadosFornecedores = [
  { fornecedor: "TechCorp", pedidos: 15, valor: 45000 },
  { fornecedor: "ToolMax", pedidos: 28, valor: 32000 },
  { fornecedor: "MobiliaCorp", pedidos: 12, valor: 28000 },
  { fornecedor: "Outros", pedidos: 25, valor: 35000 }
];

const dadosConsumo = [
  { projeto: "Escritório Matriz", consumo: 85000, responsavel: "João Silva" },
  { projeto: "Obra Centro", consumo: 62000, responsavel: "Maria Santos" },
  { projeto: "Filial Norte", consumo: 45000, responsavel: "Pedro Costa" },
  { projeto: "Manutenção", consumo: 28000, responsavel: "Ana Lima" }
];

const COLORS = ["hsl(217 91% 60%)", "hsl(142 71% 45%)", "hsl(48 96% 53%)", "hsl(0 84% 60%)", "hsl(220 9% 46%)"];

export default function Relatorios() {
  const [filtros, setFiltros] = useState({
    dataInicio: "2024-01-01",
    dataFim: "2024-06-30",
    categoria: "",
    fornecedor: "",
    projeto: ""
  });

  const [tipoRelatorio, setTipoRelatorio] = useState("movimentacao");

  const gerarRelatorio = (tipo: string) => {
    // Simular geração de relatório
    console.log(`Gerando relatório: ${tipo}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <BarChart3 className="h-8 w-8 text-primary" />
          Relatórios e Análises
        </h1>
        <p className="text-muted-foreground">
          Análises detalhadas e relatórios do estoque
        </p>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros para Relatórios</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dataInicio">Data Início</Label>
              <Input
                id="dataInicio"
                type="date"
                value={filtros.dataInicio}
                onChange={(e) => setFiltros({...filtros, dataInicio: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dataFim">Data Fim</Label>
              <Input
                id="dataFim"
                type="date"
                value={filtros.dataFim}
                onChange={(e) => setFiltros({...filtros, dataFim: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label>Categoria</Label>
              <Select onValueChange={(value) => setFiltros({...filtros, categoria: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas as categorias" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todas</SelectItem>
                  <SelectItem value="eletronicos">Eletrônicos</SelectItem>
                  <SelectItem value="ferramentas">Ferramentas</SelectItem>
                  <SelectItem value="moveis">Móveis</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Projeto</Label>
              <Select onValueChange={(value) => setFiltros({...filtros, projeto: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os projetos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos</SelectItem>
                  <SelectItem value="escritorio">Escritório Matriz</SelectItem>
                  <SelectItem value="obra">Obra Centro</SelectItem>
                  <SelectItem value="filial">Filial Norte</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Botões de Relatórios Rápidos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Button 
          className="h-20 flex flex-col gap-2 gradient-primary"
          onClick={() => gerarRelatorio('movimentacao')}
        >
          <TrendingUp className="h-6 w-6" />
          <span>Movimentação Mensal</span>
        </Button>
        
        <Button 
          className="h-20 flex flex-col gap-2 gradient-success"
          onClick={() => gerarRelatorio('estoque')}
        >
          <Package className="h-6 w-6" />
          <span>Estoque Atual</span>
        </Button>
        
        <Button 
          className="h-20 flex flex-col gap-2 bg-warning text-warning-foreground"
          onClick={() => gerarRelatorio('consumo')}
        >
          <Users className="h-6 w-6" />
          <span>Consumo por Responsável</span>
        </Button>
        
        <Button 
          className="h-20 flex flex-col gap-2 bg-muted text-muted-foreground hover:bg-muted/80"
          onClick={() => gerarRelatorio('fornecedores')}
        >
          <Building2 className="h-6 w-6" />
          <span>Análise de Fornecedores</span>
        </Button>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Movimentação Mensal */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Movimentação Mensal
              </span>
              <Button variant="outline" size="sm" onClick={() => gerarRelatorio('movimentacao')}>
                <Download className="h-4 w-4 mr-1" />
                Excel
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={dadosMovimentacao}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="entradas" stackId="1" stroke="hsl(142 71% 45%)" fill="hsl(142 71% 45%)" fillOpacity={0.6} />
                <Area type="monotone" dataKey="saidas" stackId="2" stroke="hsl(0 84% 60%)" fill="hsl(0 84% 60%)" fillOpacity={0.6} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Valor por Categoria */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Package className="h-5 w-5 text-primary" />
                Valor por Categoria
              </span>
              <Button variant="outline" size="sm" onClick={() => gerarRelatorio('categoria')}>
                <Download className="h-4 w-4 mr-1" />
                Excel
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={dadosCategoria}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ categoria, valor }) => `${categoria}: R$ ${valor.toLocaleString()}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="valor"
                >
                  {dadosCategoria.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`R$ ${Number(value).toLocaleString()}`, "Valor"]} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Performance de Fornecedores */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-primary" />
                Performance de Fornecedores
              </span>
              <Button variant="outline" size="sm" onClick={() => gerarRelatorio('fornecedores')}>
                <Download className="h-4 w-4 mr-1" />
                Excel
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dadosFornecedores}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="fornecedor" />
                <YAxis />
                <Tooltip formatter={(value) => [`R$ ${Number(value).toLocaleString()}`, "Valor Total"]} />
                <Bar dataKey="valor" fill="hsl(217 91% 60%)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Consumo por Projeto */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Consumo por Projeto
              </span>
              <Button variant="outline" size="sm" onClick={() => gerarRelatorio('consumo')}>
                <Download className="h-4 w-4 mr-1" />
                Excel
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dadosConsumo.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div>
                    <h4 className="font-semibold">{item.projeto}</h4>
                    <p className="text-sm text-muted-foreground">Responsável: {item.responsavel}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">R$ {item.consumo.toLocaleString()}</p>
                    <div className="w-32 bg-muted rounded-full h-2 mt-1">
                      <div 
                        className="bg-primary h-2 rounded-full" 
                        style={{width: `${(item.consumo / 85000) * 100}%`}}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Relatórios Detalhados */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Relatórios Detalhados
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg hover:shadow-medium transition-smooth">
              <h4 className="font-semibold mb-2">Relatório de Estoque Mínimo</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Produtos que atingiram o estoque mínimo
              </p>
              <Button variant="outline" className="w-full" onClick={() => gerarRelatorio('estoque-minimo')}>
                <Download className="h-4 w-4 mr-2" />
                Gerar Excel
              </Button>
            </div>

            <div className="p-4 border rounded-lg hover:shadow-medium transition-smooth">
              <h4 className="font-semibold mb-2">Relatório de Movimentação</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Entradas e saídas detalhadas por período
              </p>
              <Button variant="outline" className="w-full" onClick={() => gerarRelatorio('movimentacao-detalhada')}>
                <Download className="h-4 w-4 mr-2" />
                Gerar Excel
              </Button>
            </div>

            <div className="p-4 border rounded-lg hover:shadow-medium transition-smooth">
              <h4 className="font-semibold mb-2">Relatório de Consumo</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Consumo por responsável e projeto
              </p>
              <Button variant="outline" className="w-full" onClick={() => gerarRelatorio('consumo-detalhado')}>
                <Download className="h-4 w-4 mr-2" />
                Gerar Excel
              </Button>
            </div>

            <div className="p-4 border rounded-lg hover:shadow-medium transition-smooth">
              <h4 className="font-semibold mb-2">Relatório de Fornecedores</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Performance e análise de fornecedores
              </p>
              <Button variant="outline" className="w-full" onClick={() => gerarRelatorio('fornecedores-detalhado')}>
                <Download className="h-4 w-4 mr-2" />
                Gerar Excel
              </Button>
            </div>

            <div className="p-4 border rounded-lg hover:shadow-medium transition-smooth">
              <h4 className="font-semibold mb-2">Relatório de Localização</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Produtos por localização no estoque
              </p>
              <Button variant="outline" className="w-full" onClick={() => gerarRelatorio('localizacao')}>
                <Download className="h-4 w-4 mr-2" />
                Gerar Excel
              </Button>
            </div>

            <div className="p-4 border rounded-lg hover:shadow-medium transition-smooth">
              <h4 className="font-semibold mb-2">Relatório Financeiro</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Análise de custos e valores de estoque
              </p>
              <Button variant="outline" className="w-full" onClick={() => gerarRelatorio('financeiro')}>
                <Download className="h-4 w-4 mr-2" />
                Gerar Excel
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}