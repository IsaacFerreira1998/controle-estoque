import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { PackagePlus, Plus, Calendar, FileText, Trash2, X, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { lerEntradas, lerProdutos, registrarEntrada, desfazerEntrada } from "@/utils/storageUtils";

interface Entrada {
  id: number;
  data: string;
  produto: string;
  codigo: string;
  quantidade: number;
  fornecedor: string;
  notaFiscal: string;
  responsavel: string;
  destino: string;
  observacoes?: string;
}

const vazio = {
  data: new Date().toISOString().split("T")[0],
  produto: "",
  codigo: "",
  quantidade: "",
  fornecedor: "",
  notaFiscal: "",
  responsavel: "",
  destino: "",
  observacoes: "",
};

export default function Entradas() {
  const { toast } = useToast();
  const [mostrarForm, setMostrarForm] = useState(false);
  const [entradas, setEntradas] = useState<Entrada[]>(() => lerEntradas());
  const [form, setForm] = useState(vazio);
  const [busca, setBusca] = useState("");

  // Lê produtos reais do localStorage para popular o Select
  const produtosCadastrados = lerProdutos();
  const produtoSelecionado = produtosCadastrados.find(
    (p: any) => p.codigo === form.codigo
  );

  const set = (key: string, val: string) => setForm((f) => ({ ...f, [key]: val }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.produto || !form.quantidade || Number(form.quantidade) <= 0) {
      toast({ title: "Preencha todos os campos obrigatórios.", variant: "destructive", description: "" });
      return;
    }

    const resultado = registrarEntrada({
      data: form.data,
      produto: produtoSelecionado?.nome ?? form.produto,
      codigo: form.codigo,
      quantidade: Number(form.quantidade),
      fornecedor: form.fornecedor,
      notaFiscal: form.notaFiscal,
      responsavel: form.responsavel,
      destino: form.destino,
      observacoes: form.observacoes,
    });

    if (!resultado.ok) {
      toast({ title: "❌ Erro", description: resultado.msg, variant: "destructive" });
      return;
    }

    setEntradas(lerEntradas());
    toast({ title: "✅ Entrada registrada!", description: resultado.msg });
    setMostrarForm(false);
    setForm({ ...vazio, data: new Date().toISOString().split("T")[0] });
  };

  const handleDeletar = (entrada: Entrada) => {
    desfazerEntrada(entrada.id);
    setEntradas(lerEntradas());
    toast({
      title: "🔄 Entrada removida",
      description: `${entrada.quantidade} un. de "${entrada.produto}" devolvidas ao cálculo de estoque.`,
      variant: "destructive",
    });
  };

  const entradasFiltradas = entradas.filter(
    (e) =>
      e.produto.toLowerCase().includes(busca.toLowerCase()) ||
      e.fornecedor.toLowerCase().includes(busca.toLowerCase()) ||
      e.responsavel.toLowerCase().includes(busca.toLowerCase()) ||
      e.notaFiscal.toLowerCase().includes(busca.toLowerCase())
  );

  const totalUnidades = entradas.reduce((a, e) => a + e.quantidade, 0);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <PackagePlus className="h-6 w-6 text-entry" />
            Controle de Entradas
          </h1>
          <p className="text-sm text-muted-foreground">
            {entradas.length} registro(s) · {totalUnidades.toLocaleString("pt-BR")} unidades no total
          </p>
        </div>
        <Button onClick={() => setMostrarForm(!mostrarForm)} className="gradient-success">
          <Plus className="h-4 w-4 mr-2" />
          Nova Entrada
        </Button>
      </div>

      {/* Formulário */}
      {mostrarForm && (
        <Card className="border-entry/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2 text-entry">
              <PackagePlus className="h-4 w-4" />
              Registrar Nova Entrada
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <Label className="text-xs">Data *</Label>
                <Input type="date" value={form.data} onChange={(e) => set("data", e.target.value)} required />
              </div>

              {/* Produto vindo do cadastro real */}
              <div>
                <Label className="text-xs">Produto *</Label>
                {produtosCadastrados.length > 0 ? (
                  <Select
                    onValueChange={(v) => {
                      const p = produtosCadastrados.find((x: any) => x.codigo === v);
                      setForm((f) => ({ ...f, codigo: v, produto: p?.nome ?? v }));
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um produto" />
                    </SelectTrigger>
                    <SelectContent>
                      {produtosCadastrados.map((p: any) => (
                        <SelectItem key={p.codigo} value={p.codigo}>
                          {p.codigo} — {p.nome}
                          <span className="text-muted-foreground ml-2">({p.estoque} em estoque)</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    value={form.produto}
                    onChange={(e) => set("produto", e.target.value)}
                    placeholder="Nome do produto"
                    required
                  />
                )}
                {produtosCadastrados.length === 0 && (
                  <p className="text-xs text-warning mt-1">⚠️ Nenhum produto cadastrado. Cadastre em Produtos primeiro.</p>
                )}
              </div>

              <div>
                <Label className="text-xs">Quantidade *</Label>
                <Input
                  type="number"
                  min="1"
                  value={form.quantidade}
                  onChange={(e) => set("quantidade", e.target.value)}
                  placeholder="10"
                  required
                />
                {produtoSelecionado && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Estoque atual: {produtoSelecionado.estoque} un.
                  </p>
                )}
              </div>

              <div>
                <Label className="text-xs">Fornecedor *</Label>
                <Input value={form.fornecedor} onChange={(e) => set("fornecedor", e.target.value)} placeholder="Nome do fornecedor" required />
              </div>

              <div>
                <Label className="text-xs">Nota Fiscal *</Label>
                <Input value={form.notaFiscal} onChange={(e) => set("notaFiscal", e.target.value)} placeholder="NF-00000" required />
              </div>

              <div>
                <Label className="text-xs">Responsável *</Label>
                <Input value={form.responsavel} onChange={(e) => set("responsavel", e.target.value)} placeholder="Nome do responsável" required />
              </div>

              <div>
                <Label className="text-xs">Destino / Local</Label>
                <Input value={form.destino} onChange={(e) => set("destino", e.target.value)} placeholder="Almoxarifado, Depósito A..." />
              </div>

              <div className="md:col-span-2">
                <Label className="text-xs">Observações</Label>
                <Input value={form.observacoes} onChange={(e) => set("observacoes", e.target.value)} placeholder="Informações adicionais..." />
              </div>

              <div className="lg:col-span-3 flex gap-2">
                <Button type="submit" className="gradient-success">
                  Confirmar Entrada
                </Button>
                <Button type="button" variant="outline" onClick={() => setMostrarForm(false)}>
                  <X className="h-4 w-4 mr-1" /> Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Busca */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          className="pl-9"
          placeholder="Buscar por produto, fornecedor, responsável ou NF..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
      </div>

      {/* Histórico */}
      <Card className="shadow-soft">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Histórico de Entradas
            <Badge variant="secondary" className="ml-auto">{entradasFiltradas.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {entradasFiltradas.length === 0 ? (
            <p className="text-center text-muted-foreground py-10 text-sm">
              {busca ? "Nenhuma entrada encontrada para a busca." : "Nenhuma entrada registrada ainda."}
            </p>
          ) : (
            <div className="divide-y">
              {entradasFiltradas.map((e) => (
                <div key={e.id} className="py-3 flex items-center justify-between gap-4">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="w-2 h-2 rounded-full bg-entry mt-2 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="font-medium text-sm truncate">{e.produto}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(e.data + "T00:00:00").toLocaleDateString("pt-BR")} · {e.fornecedor}
                        {e.notaFiscal && ` · `}
                        {e.notaFiscal && <span className="inline-flex items-center gap-0.5"><FileText className="h-3 w-3" />{e.notaFiscal}</span>}
                        {e.responsavel && ` · ${e.responsavel}`}
                      </p>
                      {e.destino && <p className="text-xs text-muted-foreground">→ {e.destino}</p>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Badge className="bg-entry/10 text-entry border-entry/20 font-semibold">
                      +{e.quantidade} un.
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0 hover:text-destructive"
                      onClick={() => handleDeletar(e)}
                      title="Remover e devolver ao estoque"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}