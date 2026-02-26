import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Package, PackagePlus, PackageMinus, AlertTriangle, Download, Filter, X } from "lucide-react";
import { lerProdutos, lerEntradas, lerSaidas } from "@/utils/storageUtils";
import { exportarProdutosExcel, exportarMovimentacoesExcel } from "@/utils/excelExport";
import { useToast } from "@/hooks/use-toast";

type Tab = "produtos" | "entradas" | "saidas";

export default function Consultas() {
  const { toast } = useToast();
  const [tab, setTab] = useState<Tab>("produtos");
  const [busca, setBusca] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState("todos");
  const [filtroStatus, setFiltroStatus] = useState("todos");

  // Dados reais
  const produtos = lerProdutos();
  const entradas = lerEntradas();
  const saidas = lerSaidas();

  // Categorias únicas dos produtos reais
  const categorias = useMemo(() => {
    const cats = new Set(produtos.map((p: any) => p.categoria).filter(Boolean));
    return Array.from(cats) as string[];
  }, [produtos.length]);

  // Filtros aplicados
  const produtosFiltrados = useMemo(() => {
    return produtos.filter((p: any) => {
      const buscaOk =
        !busca ||
        p.nome?.toLowerCase().includes(busca.toLowerCase()) ||
        p.codigo?.toLowerCase().includes(busca.toLowerCase()) ||
        p.categoria?.toLowerCase().includes(busca.toLowerCase()) ||
        p.fornecedor?.toLowerCase().includes(busca.toLowerCase()) ||
        p.localizacao?.toLowerCase().includes(busca.toLowerCase());

      const categoriaOk = filtroCategoria === "todos" || p.categoria === filtroCategoria;

      const status = Number(p.estoque) <= Number(p.minimo) ? "critico" : "ok";
      const statusOk = filtroStatus === "todos" || status === filtroStatus;

      return buscaOk && categoriaOk && statusOk;
    });
  }, [produtos, busca, filtroCategoria, filtroStatus]);

  const entradasFiltradas = useMemo(() => {
    if (!busca) return entradas;
    return entradas.filter((e: any) =>
      e.produto?.toLowerCase().includes(busca.toLowerCase()) ||
      e.fornecedor?.toLowerCase().includes(busca.toLowerCase()) ||
      e.responsavel?.toLowerCase().includes(busca.toLowerCase()) ||
      e.notaFiscal?.toLowerCase().includes(busca.toLowerCase())
    );
  }, [entradas, busca]);

  const saidasFiltradas = useMemo(() => {
    if (!busca) return saidas;
    return saidas.filter((s: any) =>
      s.produto?.toLowerCase().includes(busca.toLowerCase()) ||
      s.responsavel?.toLowerCase().includes(busca.toLowerCase()) ||
      s.projeto?.toLowerCase().includes(busca.toLowerCase()) ||
      s.empresa?.toLowerCase().includes(busca.toLowerCase())
    );
  }, [saidas, busca]);

  const limparFiltros = () => {
    setBusca("");
    setFiltroCategoria("todos");
    setFiltroStatus("todos");
  };

  const temFiltros = busca || filtroCategoria !== "todos" || filtroStatus !== "todos";

  // Stats
  const criticos = produtos.filter((p: any) => Number(p.estoque) <= Number(p.minimo)).length;
  const valorTotal = produtos.reduce((acc: number, p: any) => acc + Number(p.estoque ?? 0) * Number(p.preco ?? 0), 0);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Search className="h-6 w-6 text-primary" />
            Consultas
          </h1>
          <p className="text-sm text-muted-foreground">
            {produtos.length} produtos · {entradas.length} entradas · {saidas.length} saídas
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => { exportarProdutosExcel(); toast({ title: "✅ Exportado!" }); }}>
            <Download className="h-4 w-4 mr-1" /> Produtos
          </Button>
          <Button variant="outline" size="sm" onClick={() => { exportarMovimentacoesExcel(); toast({ title: "✅ Exportado!" }); }}>
            <Download className="h-4 w-4 mr-1" /> Movimentações
          </Button>
        </div>
      </div>

      {/* Cards de resumo */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Produtos", value: produtos.length, icon: Package, color: "text-primary" },
          { label: "Entradas", value: entradas.length, icon: PackagePlus, color: "text-entry" },
          { label: "Saídas", value: saidas.length, icon: PackageMinus, color: "text-exit" },
          { label: "Críticos", value: criticos, icon: AlertTriangle, color: "text-destructive" },
        ].map(({ label, value, icon: Icon, color }) => (
          <Card key={label} className="shadow-soft">
            <CardContent className="pt-4 pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">{label}</p>
                  <p className="text-xl font-bold">{value}</p>
                </div>
                <Icon className={`h-5 w-5 ${color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Busca e Filtros */}
      <Card className="shadow-soft">
        <CardContent className="pt-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input className="pl-9" placeholder="Buscar produto, código, responsável, fornecedor..." value={busca} onChange={(e) => setBusca(e.target.value)} />
            </div>
            {tab === "produtos" && (
              <>
                <Select value={filtroCategoria} onValueChange={setFiltroCategoria}>
                  <SelectTrigger className="w-full sm:w-44">
                    <Filter className="h-3.5 w-3.5 mr-1" />
                    <SelectValue placeholder="Categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todas categorias</SelectItem>
                    {categorias.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Select value={filtroStatus} onValueChange={setFiltroStatus}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    <SelectItem value="ok">Estoque OK</SelectItem>
                    <SelectItem value="critico">Crítico</SelectItem>
                  </SelectContent>
                </Select>
              </>
            )}
            {temFiltros && (
              <Button variant="ghost" size="sm" onClick={limparFiltros} className="text-muted-foreground">
                <X className="h-4 w-4 mr-1" /> Limpar
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Abas */}
      <div className="flex gap-1 border-b">
        {(["produtos", "entradas", "saidas"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-medium capitalize transition-smooth border-b-2 -mb-px ${tab === t ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
          >
            {{
              produtos: `Produtos (${produtosFiltrados.length})`,
              entradas: `Entradas (${entradasFiltradas.length})`,
              saidas: `Saídas (${saidasFiltradas.length})`,
            }[t]}
          </button>
        ))}
      </div>

      {/* Conteúdo */}
      {tab === "produtos" && (
        <Card className="shadow-soft">
          <CardContent className="pt-4">
            {produtosFiltrados.length === 0 ? (
              <p className="text-center text-muted-foreground py-10 text-sm">
                {produtos.length === 0 ? "Nenhum produto cadastrado. Cadastre em Produtos." : "Nenhum produto encontrado para a busca."}
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-2 text-xs text-muted-foreground font-medium">Código</th>
                      <th className="text-left py-2 px-2 text-xs text-muted-foreground font-medium">Produto</th>
                      <th className="text-left py-2 px-2 text-xs text-muted-foreground font-medium hidden md:table-cell">Categoria</th>
                      <th className="text-left py-2 px-2 text-xs text-muted-foreground font-medium hidden lg:table-cell">Fornecedor</th>
                      <th className="text-right py-2 px-2 text-xs text-muted-foreground font-medium">Estoque</th>
                      <th className="text-right py-2 px-2 text-xs text-muted-foreground font-medium hidden sm:table-cell">Valor Unit.</th>
                      <th className="text-center py-2 px-2 text-xs text-muted-foreground font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {produtosFiltrados.map((p: any) => {
                      const critico = Number(p.estoque) <= Number(p.minimo);
                      return (
                        <tr key={p.codigo} className="hover:bg-muted/30 transition-smooth">
                          <td className="py-2.5 px-2 font-mono text-xs text-muted-foreground">{p.codigo}</td>
                          <td className="py-2.5 px-2 font-medium">{p.nome}</td>
                          <td className="py-2.5 px-2 hidden md:table-cell text-muted-foreground">{p.categoria}</td>
                          <td className="py-2.5 px-2 hidden lg:table-cell text-muted-foreground">{p.fornecedor}</td>
                          <td className="py-2.5 px-2 text-right font-semibold">
                            <span className={critico ? "text-destructive" : ""}>{p.estoque}</span>
                            <span className="text-xs text-muted-foreground ml-1">/{p.minimo}</span>
                          </td>
                          <td className="py-2.5 px-2 text-right hidden sm:table-cell text-muted-foreground">
                            {Number(p.preco).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                          </td>
                          <td className="py-2.5 px-2 text-center">
                            <Badge
                              variant={critico ? "destructive" : "secondary"}
                              className="text-xs"
                            >
                              {critico ? "Crítico" : "OK"}
                            </Badge>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                <p className="text-xs text-muted-foreground mt-3 text-right">
                  Valor total em estoque: {valorTotal.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {tab === "entradas" && (
        <Card className="shadow-soft">
          <CardContent className="pt-4">
            {entradasFiltradas.length === 0 ? (
              <p className="text-center text-muted-foreground py-10 text-sm">
                {entradas.length === 0 ? "Nenhuma entrada registrada." : "Nenhuma entrada encontrada."}
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-2 text-xs text-muted-foreground font-medium">Data</th>
                      <th className="text-left py-2 px-2 text-xs text-muted-foreground font-medium">Produto</th>
                      <th className="text-right py-2 px-2 text-xs text-muted-foreground font-medium">Qtd</th>
                      <th className="text-left py-2 px-2 text-xs text-muted-foreground font-medium hidden md:table-cell">Fornecedor</th>
                      <th className="text-left py-2 px-2 text-xs text-muted-foreground font-medium hidden md:table-cell">NF</th>
                      <th className="text-left py-2 px-2 text-xs text-muted-foreground font-medium hidden lg:table-cell">Responsável</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {entradasFiltradas.map((e: any) => (
                      <tr key={e.id} className="hover:bg-muted/30 transition-smooth">
                        <td className="py-2.5 px-2 text-muted-foreground whitespace-nowrap">
                          {new Date(e.data + "T00:00:00").toLocaleDateString("pt-BR")}
                        </td>
                        <td className="py-2.5 px-2 font-medium">{e.produto}</td>
                        <td className="py-2.5 px-2 text-right">
                          <Badge className="bg-entry/10 text-entry border-entry/20 text-xs">+{e.quantidade}</Badge>
                        </td>
                        <td className="py-2.5 px-2 hidden md:table-cell text-muted-foreground">{e.fornecedor}</td>
                        <td className="py-2.5 px-2 hidden md:table-cell font-mono text-xs text-muted-foreground">{e.notaFiscal}</td>
                        <td className="py-2.5 px-2 hidden lg:table-cell text-muted-foreground">{e.responsavel}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {tab === "saidas" && (
        <Card className="shadow-soft">
          <CardContent className="pt-4">
            {saidasFiltradas.length === 0 ? (
              <p className="text-center text-muted-foreground py-10 text-sm">
                {saidas.length === 0 ? "Nenhuma saída registrada." : "Nenhuma saída encontrada."}
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-2 text-xs text-muted-foreground font-medium">Data/Hora</th>
                      <th className="text-left py-2 px-2 text-xs text-muted-foreground font-medium">Produto</th>
                      <th className="text-right py-2 px-2 text-xs text-muted-foreground font-medium">Qtd</th>
                      <th className="text-left py-2 px-2 text-xs text-muted-foreground font-medium hidden md:table-cell">Responsável</th>
                      <th className="text-left py-2 px-2 text-xs text-muted-foreground font-medium hidden md:table-cell">Projeto</th>
                      <th className="text-left py-2 px-2 text-xs text-muted-foreground font-medium hidden lg:table-cell">Empresa</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {saidasFiltradas.map((s: any) => (
                      <tr key={s.id} className="hover:bg-muted/30 transition-smooth">
                        <td className="py-2.5 px-2 text-muted-foreground whitespace-nowrap">
                          {new Date(s.data + "T00:00:00").toLocaleDateString("pt-BR")}
                          {s.hora && <span className="ml-1 text-xs">às {s.hora}</span>}
                        </td>
                        <td className="py-2.5 px-2 font-medium">{s.produto}</td>
                        <td className="py-2.5 px-2 text-right">
                          <Badge className="bg-exit/10 text-exit border-exit/20 text-xs">-{s.quantidade}</Badge>
                        </td>
                        <td className="py-2.5 px-2 hidden md:table-cell text-muted-foreground">{s.responsavel}</td>
                        <td className="py-2.5 px-2 hidden md:table-cell text-muted-foreground">{s.projeto}</td>
                        <td className="py-2.5 px-2 hidden lg:table-cell text-muted-foreground">{s.empresa}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}