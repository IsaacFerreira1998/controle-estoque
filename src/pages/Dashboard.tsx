import { useState, useEffect } from "react";
import { Package, PackagePlus, PackageMinus, AlertTriangle, TrendingUp, TrendingDown } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExcelExportButton } from "@/components/excel/ExcelExportButton";
import { lerProdutosDoStorage, lerEntradasDoStorage, lerSaidasDoStorage } from "@/utils/excelExport";

const COLORS = ["hsl(222 83% 54%)", "hsl(145 63% 40%)", "hsl(37 92% 50%)", "hsl(4 86% 55%)", "hsl(280 70% 55%)"];

export default function Dashboard() {
  const [agora, setAgora] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setAgora(new Date()), 60000);
    return () => clearInterval(t);
  }, []);

  // Dados reais do localStorage
  const produtos = lerProdutosDoStorage();
  const entradas = lerEntradasDoStorage();
  const saidas = lerSaidasDoStorage();

  // KPIs reais
  const totalProdutos = produtos.length;
  const valorTotalEstoque = produtos.reduce((acc, p) => acc + p.valorTotal, 0);
  const produtosCriticos = produtos.filter(p => p.estoque <= p.estoqueMinimo);
  const unidadesEmEstoque = produtos.reduce((acc, p) => acc + p.estoque, 0);

  // Entradas e saídas do mês atual
  const mesAtual = agora.toISOString().slice(0, 7);
  const entradasMes = entradas.filter(e => (e.data ?? "").startsWith(mesAtual));
  const saidasMes = saidas.filter(s => (s.data ?? "").startsWith(mesAtual));
  const qtdEntradasMes = entradasMes.reduce((acc, e) => acc + e.quantidade, 0);
  const qtdSaidasMes = saidasMes.reduce((acc, s) => acc + s.quantidade, 0);

  // Gráfico de movimentação por mês (últimos 6 meses)
  const movPorMes = (() => {
    const meses: Record<string, { mes: string; entradas: number; saidas: number }> = {};
    for (let i = 5; i >= 0; i--) {
      const d = new Date(agora.getFullYear(), agora.getMonth() - i, 1);
      const key = d.toISOString().slice(0, 7);
      const label = d.toLocaleDateString("pt-BR", { month: "short" }).replace(".", "");
      meses[key] = { mes: label.charAt(0).toUpperCase() + label.slice(1), entradas: 0, saidas: 0 };
    }
    entradas.forEach(e => { if (meses[e.data?.slice(0, 7) ?? ""]) meses[e.data.slice(0, 7)].entradas += e.quantidade; });
    saidas.forEach(s => { if (meses[s.data?.slice(0, 7) ?? ""]) meses[s.data.slice(0, 7)].saidas += s.quantidade; });
    return Object.values(meses);
  })();

  // Estoque por categoria
  const porCategoria = (() => {
    const acc: Record<string, number> = {};
    produtos.forEach(p => { acc[p.categoria] = (acc[p.categoria] ?? 0) + p.estoque; });
    return Object.entries(acc).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  })();

  const fmt = (n: number) => n.toLocaleString("pt-BR");
  const fmtR = (n: number) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            {agora.toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
          </p>
        </div>
        <ExcelExportButton fileName="Dashboard_EstoqueMax" />
      </div>

      {/* Alerta de críticos */}
      {produtosCriticos.length > 0 && (
        <div className="flex items-start gap-3 p-3 rounded-lg border border-destructive/30 bg-destructive/5 text-sm">
          <AlertTriangle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
          <div>
            <span className="font-medium text-destructive">{produtosCriticos.length} produto(s) com estoque crítico: </span>
            <span className="text-muted-foreground">{produtosCriticos.slice(0, 3).map(p => p.nome).join(", ")}{produtosCriticos.length > 3 ? ` +${produtosCriticos.length - 3} mais` : ""}</span>
          </div>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="shadow-soft">
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Produtos</span>
              <div className="w-7 h-7 rounded-md bg-primary/10 flex items-center justify-center">
                <Package className="h-3.5 w-3.5 text-primary" />
              </div>
            </div>
            <p className="text-2xl font-bold">{fmt(totalProdutos)}</p>
            <p className="text-xs text-muted-foreground mt-1">{fmt(unidadesEmEstoque)} unidades em estoque</p>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Valor Total</span>
              <div className="w-7 h-7 rounded-md bg-success/10 flex items-center justify-center">
                <TrendingUp className="h-3.5 w-3.5 text-success" />
              </div>
            </div>
            <p className="text-xl font-bold">{fmtR(valorTotalEstoque)}</p>
            <p className="text-xs text-muted-foreground mt-1">valor do estoque atual</p>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Entradas (mês)</span>
              <div className="w-7 h-7 rounded-md bg-entry/10 flex items-center justify-center">
                <PackagePlus className="h-3.5 w-3.5 text-entry" />
              </div>
            </div>
            <p className="text-2xl font-bold">{fmt(qtdEntradasMes)}</p>
            <p className="text-xs text-muted-foreground mt-1">{entradasMes.length} registro(s) este mês</p>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                {produtosCriticos.length > 0 ? "Críticos" : "Saídas (mês)"}
              </span>
              <div className={`w-7 h-7 rounded-md flex items-center justify-center ${produtosCriticos.length > 0 ? "bg-destructive/10" : "bg-exit/10"}`}>
                {produtosCriticos.length > 0
                  ? <AlertTriangle className="h-3.5 w-3.5 text-destructive" />
                  : <PackageMinus className="h-3.5 w-3.5 text-exit" />
                }
              </div>
            </div>
            <p className="text-2xl font-bold">
              {produtosCriticos.length > 0 ? produtosCriticos.length : fmt(qtdSaidasMes)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {produtosCriticos.length > 0 ? "precisam de reposição" : `${saidasMes.length} registro(s) este mês`}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card className="shadow-soft">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Movimentação — Últimos 6 Meses</CardTitle>
          </CardHeader>
          <CardContent>
            {movPorMes.every(m => m.entradas === 0 && m.saidas === 0) ? (
              <div className="h-52 flex items-center justify-center text-muted-foreground text-sm">
                Registre entradas e saídas para ver o gráfico
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={movPorMes} barGap={2}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="mes" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Bar dataKey="entradas" fill="hsl(145 63% 40%)" name="Entradas" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="saidas" fill="hsl(4 86% 55%)" name="Saídas" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Estoque por Categoria</CardTitle>
          </CardHeader>
          <CardContent>
            {porCategoria.length === 0 ? (
              <div className="h-52 flex items-center justify-center text-muted-foreground text-sm">
                Cadastre produtos para ver a distribuição
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={porCategoria} cx="50%" cy="50%" outerRadius={75} dataKey="value" nameKey="name"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {porCategoria.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip formatter={(v) => [`${v} un.`, "Estoque"]} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Produtos Críticos */}
      {produtosCriticos.length > 0 && (
        <Card className="shadow-soft">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-destructive" />
              Reposição Necessária
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {produtosCriticos.slice(0, 5).map((p, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div>
                    <p className="text-sm font-medium">{p.nome}</p>
                    <p className="text-xs text-muted-foreground">{p.categoria} · {p.fornecedor}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant="destructive" className="text-xs">
                      {p.estoque} / {p.estoqueMinimo} mín
                    </Badge>
                  </div>
                </div>
              ))}
              {produtosCriticos.length > 5 && (
                <p className="text-xs text-muted-foreground pt-1">
                  + {produtosCriticos.length - 5} outros produtos críticos
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Últimas movimentações */}
      {(entradas.length > 0 || saidas.length > 0) && (
        <Card className="shadow-soft">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Últimas Movimentações</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {[...entradas.slice(-3).map(e => ({ ...e, tipo: "entrada" })),
              ...saidas.slice(-3).map(s => ({ ...s, tipo: "saida" }))]
                .sort((a, b) => b.data.localeCompare(a.data))
                .slice(0, 6)
                .map((m, i) => (
                  <div key={i} className="flex items-center justify-between py-1.5 border-b last:border-0">
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 ${m.tipo === "entrada" ? "bg-entry/10" : "bg-exit/10"}`}>
                        {m.tipo === "entrada"
                          ? <PackagePlus className="h-3 w-3 text-entry" />
                          : <PackageMinus className="h-3 w-3 text-exit" />
                        }
                      </div>
                      <div>
                        <p className="text-sm font-medium">{m.produto}</p>
                        <p className="text-xs text-muted-foreground">{m.tipo === "entrada" ? "Entrada" : "Saída"} · {m.responsavel}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-semibold ${m.tipo === "entrada" ? "text-entry" : "text-exit"}`}>
                        {m.tipo === "entrada" ? "+" : "-"}{m.quantidade} un.
                      </p>
                      <p className="text-xs text-muted-foreground">{m.data}</p>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Estado vazio */}
      {totalProdutos === 0 && (
        <Card className="shadow-soft text-center py-12">
          <CardContent>
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold text-lg mb-2">Bem-vindo ao EstoqueMax!</h3>
            <p className="text-sm text-muted-foreground">
              Comece cadastrando seus produtos na aba <strong>Produtos</strong> e depois registre entradas e saídas.
              O dashboard será preenchido automaticamente com dados reais.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}