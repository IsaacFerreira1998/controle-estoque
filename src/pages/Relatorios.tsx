import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart3, Download, FileSpreadsheet, Calendar, TrendingUp, Package, Users, Building2, Database, AlertTriangle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Area, AreaChart } from "recharts";
import { ExcelExportButton } from "@/components/excel/ExcelExportButton";
import {
  exportarProdutosExcel,
  exportarEntradasExcel,
  exportarSaidasExcel,
  exportarMovimentacoesExcel,
  exportToExcelBI,
  montarDashboardExcel,
  lerProdutosDoStorage,
  lerEntradasDoStorage,
  lerSaidasDoStorage,
  exportarPowerBICompleto,
  exportarPowerBIProdutos,
  exportarPowerBISaidas,
  exportarPowerBIEntradas,
} from "@/utils/excelExport";
import { useToast } from "@/hooks/use-toast";

const COLORS = ["hsl(217 91% 60%)", "hsl(142 71% 45%)", "hsl(48 96% 53%)", "hsl(0 84% 60%)", "hsl(220 9% 46%)"];

export default function Relatorios() {
  const { toast } = useToast();

  const [filtros, setFiltros] = useState({
    dataInicio: "",
    dataFim: "",
    categoria: "",
    projeto: ""
  });

  // Carrega dados reais do localStorage
  const produtos = lerProdutosDoStorage();
  const entradas = lerEntradasDoStorage();
  const saidas = lerSaidasDoStorage();

  // Dados para gráficos
  const dadosCategoria = (() => {
    const agrupado: Record<string, { quantidade: number; valor: number }> = {};
    produtos.forEach(p => {
      if (!agrupado[p.categoria]) agrupado[p.categoria] = { quantidade: 0, valor: 0 };
      agrupado[p.categoria].quantidade += p.estoque;
      agrupado[p.categoria].valor += p.valorTotal;
    });
    return Object.entries(agrupado).map(([categoria, d]) => ({ categoria, ...d }));
  })();

  // Movimentações agrupadas por mês
  const dadosMovimentacao = (() => {
    const meses: Record<string, { mes: string; entradas: number; saidas: number }> = {};
    entradas.forEach(e => {
      const m = e.data?.slice(0, 7) ?? "";
      if (!meses[m]) meses[m] = { mes: m, entradas: 0, saidas: 0 };
      meses[m].entradas += e.quantidade;
    });
    saidas.forEach(s => {
      const m = s.data?.slice(0, 7) ?? "";
      if (!meses[m]) meses[m] = { mes: m, entradas: 0, saidas: 0 };
      meses[m].saidas += s.quantidade;
    });
    return Object.values(meses)
      .sort((a, b) => a.mes.localeCompare(b.mes))
      .slice(-6)
      .map(d => ({ ...d, mes: d.mes.slice(5, 7) + "/" + d.mes.slice(0, 4) }));
  })();

  // Consumo por projeto (das saídas)
  const dadosConsumo = (() => {
    const proj: Record<string, { projeto: string; consumo: number; responsavel: string }> = {};
    saidas.forEach(s => {
      const p = s.projeto || "Sem projeto";
      if (!proj[p]) proj[p] = { projeto: p, consumo: 0, responsavel: s.responsavel };
      proj[p].consumo += s.quantidade;
    });
    return Object.values(proj).sort((a, b) => b.consumo - a.consumo).slice(0, 5);
  })();

  const maxConsumo = dadosConsumo[0]?.consumo || 1;

  const produtosCriticos = produtos.filter(p => p.estoque <= p.estoqueMinimo);

  const toastOk = (arquivo: string) =>
    toast({ title: "✅ Exportado com sucesso!", description: arquivo });

  const toastErr = () =>
    toast({ title: "❌ Erro ao exportar", variant: "destructive", description: "Tente novamente." });

  const exportar = (fn: () => string | number, label: string) => {
    try {
      const resultado = fn();
      if (typeof resultado === "string") toastOk(resultado);
      else toast({ title: "✅ CSV exportado!", description: `${resultado} registros exportados.` });
    } catch {
      toastErr();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <BarChart3 className="h-8 w-8 text-primary" />
            Relatórios e Análises
          </h1>
          <p className="text-muted-foreground">
            {produtos.length} produtos · {entradas.length} entradas · {saidas.length} saídas
          </p>
        </div>
        <ExcelExportButton fileName="EstoqueMax_Relatorio" />
      </div>

      {/* Alertas de Estoque Crítico */}
      {produtosCriticos.length > 0 && (
        <Card className="border-destructive/30 bg-destructive/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              {produtosCriticos.length} produto(s) com estoque crítico
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {produtosCriticos.map(p => (
                <span key={p.codigo} className="text-sm bg-destructive/10 text-destructive px-2 py-1 rounded-md font-medium">
                  {p.nome} — {p.estoque}/{p.estoqueMinimo} (mín)
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Botões de Relatórios Rápidos — TODOS FUNCIONAM */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Button
          className="h-20 flex flex-col gap-2 gradient-primary"
          onClick={() => exportar(() => exportarMovimentacoesExcel("Movimentacao_Mensal"), "movimentação")}
        >
          <TrendingUp className="h-6 w-6" />
          <span>Movimentação Mensal</span>
        </Button>

        <Button
          className="h-20 flex flex-col gap-2 gradient-success"
          onClick={() => exportar(() => exportarProdutosExcel("Estoque_Atual"), "estoque")}
        >
          <Package className="h-6 w-6" />
          <span>Estoque Atual</span>
        </Button>

        <Button
          className="h-20 flex flex-col gap-2 bg-warning text-warning-foreground"
          onClick={() => exportar(() => exportarSaidasExcel("Consumo_Responsavel"), "consumo")}
        >
          <Users className="h-6 w-6" />
          <span>Consumo por Responsável</span>
        </Button>

        <Button
          className="h-20 flex flex-col gap-2 bg-muted text-foreground hover:bg-muted/80"
          onClick={() => exportar(() => exportarEntradasExcel("Analise_Fornecedores"), "fornecedores")}
        >
          <Building2 className="h-6 w-6" />
          <span>Análise de Fornecedores</span>
        </Button>
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
              <Input id="dataInicio" type="date" value={filtros.dataInicio}
                onChange={(e) => setFiltros({ ...filtros, dataInicio: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dataFim">Data Fim</Label>
              <Input id="dataFim" type="date" value={filtros.dataFim}
                onChange={(e) => setFiltros({ ...filtros, dataFim: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Categoria</Label>
              <Select onValueChange={(v) => setFiltros({ ...filtros, categoria: v })}>
                <SelectTrigger><SelectValue placeholder="Todas as categorias" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="Eletrônicos">Eletrônicos</SelectItem>
                  <SelectItem value="Ferramentas">Ferramentas</SelectItem>
                  <SelectItem value="Móveis">Móveis</SelectItem>
                  <SelectItem value="Materiais">Materiais</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Projeto</Label>
              <Select onValueChange={(v) => setFiltros({ ...filtros, projeto: v })}>
                <SelectTrigger><SelectValue placeholder="Todos os projetos" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="Escritório Matriz">Escritório Matriz</SelectItem>
                  <SelectItem value="Obra Centro">Obra Centro</SelectItem>
                  <SelectItem value="Filial Norte">Filial Norte</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Gráficos com dados reais */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Movimentação Mensal */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Movimentação Mensal
              </span>
              <Button variant="outline" size="sm"
                onClick={() => exportar(() => exportarMovimentacoesExcel(), "movimentação")}
              >
                <Download className="h-4 w-4 mr-1" /> Excel
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {dadosMovimentacao.length === 0 ? (
              <p className="text-center text-muted-foreground py-12">Sem movimentações para exibir.</p>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={dadosMovimentacao}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="mes" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="entradas" stroke="hsl(142 71% 45%)" fill="hsl(142 71% 45%)" fillOpacity={0.5} name="Entradas" />
                  <Area type="monotone" dataKey="saidas" stroke="hsl(0 84% 60%)" fill="hsl(0 84% 60%)" fillOpacity={0.5} name="Saídas" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Estoque por Categoria */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Package className="h-5 w-5 text-primary" />
                Estoque por Categoria
              </span>
              <Button variant="outline" size="sm"
                onClick={() => exportar(() => exportarProdutosExcel(), "produtos")}
              >
                <Download className="h-4 w-4 mr-1" /> Excel
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {dadosCategoria.length === 0 ? (
              <p className="text-center text-muted-foreground py-12">Sem produtos cadastrados.</p>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={dadosCategoria}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ categoria, quantidade }) => `${categoria}: ${quantidade}`}
                    outerRadius={90}
                    dataKey="quantidade"
                  >
                    {dadosCategoria.map((_, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => [`${v} unidades`, "Estoque"]} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Consumo por Projeto */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Saídas por Projeto
              </span>
              <Button variant="outline" size="sm"
                onClick={() => exportar(() => exportarSaidasExcel(), "saídas")}
              >
                <Download className="h-4 w-4 mr-1" /> Excel
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {dadosConsumo.length === 0 ? (
              <p className="text-center text-muted-foreground py-12">Sem saídas registradas.</p>
            ) : (
              <div className="space-y-3">
                {dadosConsumo.map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div>
                      <h4 className="font-semibold text-sm">{item.projeto}</h4>
                      <p className="text-xs text-muted-foreground">Resp: {item.responsavel}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{item.consumo} un.</p>
                      <div className="w-28 bg-muted rounded-full h-1.5 mt-1">
                        <div className="bg-primary h-1.5 rounded-full" style={{ width: `${(item.consumo / maxConsumo) * 100}%` }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top Fornecedores (Entradas) */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-primary" />
                Entradas por Fornecedor
              </span>
              <Button variant="outline" size="sm"
                onClick={() => exportar(() => exportarEntradasExcel(), "entradas")}
              >
                <Download className="h-4 w-4 mr-1" /> Excel
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {entradas.length === 0 ? (
              <p className="text-center text-muted-foreground py-12">Sem entradas registradas.</p>
            ) : (() => {
              const fornData = entradas.reduce((acc, e) => {
                const f = e.fornecedor || "Desconhecido";
                acc[f] = (acc[f] || 0) + e.quantidade;
                return acc;
              }, {} as Record<string, number>);
              const chartData = Object.entries(fornData).map(([fornecedor, pedidos]) => ({ fornecedor, pedidos }));
              return (
                <ResponsiveContainer width="100%" height={248}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="fornecedor" />
                    <YAxis />
                    <Tooltip formatter={(v) => [`${v} unidades`, "Quantidade"]} />
                    <Bar dataKey="pedidos" fill="hsl(217 91% 60%)" name="Unidades recebidas" />
                  </BarChart>
                </ResponsiveContainer>
              );
            })()}
          </CardContent>
        </Card>
      </div>

      {/* Relatórios Detalhados — todos exportam de verdade */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5" />
            Exportações Individuais
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

            <div className="p-4 border rounded-lg hover:shadow-medium transition-smooth">
              <h4 className="font-semibold mb-1">Estoque Mínimo</h4>
              <p className="text-sm text-muted-foreground mb-3">
                {produtosCriticos.length} produto(s) crítico(s) detectado(s)
              </p>
              <Button variant="outline" className="w-full"
                onClick={() => {
                  try {
                    const data = montarDashboardExcel();
                    exportToExcelBI(data, 'Relatorio_EstoqueMinimo');
                    toastOk("Relatorio_EstoqueMinimo.xlsx");
                  } catch { toastErr(); }
                }}
              >
                <Download className="h-4 w-4 mr-2" /> Gerar Excel
              </Button>
            </div>

            <div className="p-4 border rounded-lg hover:shadow-medium transition-smooth">
              <h4 className="font-semibold mb-1">Movimentação Completa</h4>
              <p className="text-sm text-muted-foreground mb-3">
                {entradas.length + saidas.length} registros no total
              </p>
              <Button variant="outline" className="w-full"
                onClick={() => exportar(() => exportarMovimentacoesExcel("Relatorio_Movimentacao"), "movimentação")}
              >
                <Download className="h-4 w-4 mr-2" /> Gerar Excel
              </Button>
            </div>

            <div className="p-4 border rounded-lg hover:shadow-medium transition-smooth">
              <h4 className="font-semibold mb-1">Relatório de Saídas</h4>
              <p className="text-sm text-muted-foreground mb-3">
                {saidas.length} saídas registradas
              </p>
              <Button variant="outline" className="w-full"
                onClick={() => exportar(() => exportarSaidasExcel("Relatorio_Consumo"), "saídas")}
              >
                <Download className="h-4 w-4 mr-2" /> Gerar Excel
              </Button>
            </div>

            <div className="p-4 border rounded-lg hover:shadow-medium transition-smooth">
              <h4 className="font-semibold mb-1">Relatório de Entradas</h4>
              <p className="text-sm text-muted-foreground mb-3">
                {entradas.length} entradas registradas
              </p>
              <Button variant="outline" className="w-full"
                onClick={() => exportar(() => exportarEntradasExcel("Relatorio_Fornecedores"), "entradas")}
              >
                <Download className="h-4 w-4 mr-2" /> Gerar Excel
              </Button>
            </div>

            <div className="p-4 border rounded-lg hover:shadow-medium transition-smooth">
              <h4 className="font-semibold mb-1">Catálogo de Produtos</h4>
              <p className="text-sm text-muted-foreground mb-3">
                {produtos.length} produtos cadastrados
              </p>
              <Button variant="outline" className="w-full"
                onClick={() => exportar(() => exportarProdutosExcel("Relatorio_Catalogo"), "produtos")}
              >
                <Download className="h-4 w-4 mr-2" /> Gerar Excel
              </Button>
            </div>

            <div className="p-4 border rounded-lg hover:shadow-medium transition-smooth border-yellow-400/40 bg-yellow-400/5">
              <h4 className="font-semibold mb-1 flex items-center gap-2">
                <Database className="h-4 w-4 text-yellow-500" />
                Exportar para Power BI
              </h4>
              <p className="text-sm text-muted-foreground mb-3">
                CSV com BOM UTF-8 para importar no Power BI Desktop
              </p>
              <div className="flex flex-col gap-2">
                <Button variant="outline" className="w-full text-xs"
                  onClick={() => exportar(() => exportarPowerBIProdutos(), "produtos CSV")}
                >
                  <Database className="h-3 w-3 mr-2 text-yellow-500" /> CSV Produtos
                </Button>
                <Button variant="outline" className="w-full text-xs"
                  onClick={() => exportar(() => exportarPowerBICompleto(), "movimentações CSV")}
                >
                  <Database className="h-3 w-3 mr-2 text-yellow-500" /> CSV Movimentações
                </Button>
              </div>
            </div>

          </div>
        </CardContent>
      </Card>
    </div>
  );
}