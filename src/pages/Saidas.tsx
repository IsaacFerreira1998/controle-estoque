import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { PackageMinus, Plus, Calendar, Building2, User, Trash2, X, Search, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { lerSaidas, lerProdutos, registrarSaida, desfazerSaida } from "@/utils/storageUtils";

interface Saida {
  id: number;
  data: string;
  hora: string;
  produto: string;
  codigo: string;
  quantidade: number;
  responsavel: string;
  projeto: string;
  empresa: string;
  destino: string;
  observacoes?: string;
}

const vazio = {
  data: new Date().toISOString().split("T")[0],
  hora: new Date().toTimeString().slice(0, 5),
  produto: "",
  codigo: "",
  quantidade: "",
  responsavel: "",
  projeto: "",
  empresa: "",
  destino: "",
  observacoes: "",
};

export default function Saidas() {
  const { toast } = useToast();
  const [mostrarForm, setMostrarForm] = useState(false);
  const [saidas, setSaidas] = useState<Saida[]>(() => lerSaidas());
  const [form, setForm] = useState(vazio);
  const [busca, setBusca] = useState("");

  const produtosCadastrados = lerProdutos();
  const produtoSelecionado = produtosCadastrados.find(
    (p: any) => p.codigo === form.codigo
  );
  const estoqueAtual = Number(produtoSelecionado?.estoque ?? 0);
  const qtdSolicitada = Number(form.quantidade ?? 0);
  const estoqueInsuficiente = produtoSelecionado && qtdSolicitada > estoqueAtual;

  const set = (key: string, val: string) => setForm((f) => ({ ...f, [key]: val }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.produto || !form.quantidade || qtdSolicitada <= 0) {
      toast({ title: "Preencha todos os campos obrigatórios.", variant: "destructive", description: "" });
      return;
    }

    const resultado = registrarSaida({
      data: form.data,
      hora: form.hora,
      produto: produtoSelecionado?.nome ?? form.produto,
      codigo: form.codigo,
      quantidade: qtdSolicitada,
      responsavel: form.responsavel,
      projeto: form.projeto,
      empresa: form.empresa,
      destino: form.destino,
      observacoes: form.observacoes,
    });

    if (!resultado.ok) {
      toast({ title: "❌ Não foi possível registrar", description: resultado.msg, variant: "destructive" });
      return;
    }

    setSaidas(lerSaidas());
    toast({ title: "✅ Saída registrada!", description: resultado.msg });
    setMostrarForm(false);
    setForm({ ...vazio, data: new Date().toISOString().split("T")[0], hora: new Date().toTimeString().slice(0, 5) });
  };

  const handleDeletar = (saida: Saida) => {
    desfazerSaida(saida.id);
    setSaidas(lerSaidas());
    toast({
      title: "🔄 Saída removida",
      description: `${saida.quantidade} un. de "${saida.produto}" devolvidas ao estoque.`,
    });
  };

  const saidasFiltradas = saidas.filter(
    (s) =>
      s.produto.toLowerCase().includes(busca.toLowerCase()) ||
      s.responsavel.toLowerCase().includes(busca.toLowerCase()) ||
      s.projeto.toLowerCase().includes(busca.toLowerCase()) ||
      s.empresa.toLowerCase().includes(busca.toLowerCase())
  );

  const totalUnidades = saidas.reduce((a, s) => a + s.quantidade, 0);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <PackageMinus className="h-6 w-6 text-exit" />
            Controle de Saídas
          </h1>
          <p className="text-sm text-muted-foreground">
            {saidas.length} registro(s) · {totalUnidades.toLocaleString("pt-BR")} unidades retiradas
          </p>
        </div>
        <Button onClick={() => setMostrarForm(!mostrarForm)} className="gradient-danger">
          <Plus className="h-4 w-4 mr-2" />
          Nova Saída
        </Button>
      </div>

      {/* Formulário */}
      {mostrarForm && (
        <Card className="border-exit/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2 text-exit">
              <PackageMinus className="h-4 w-4" />
              Registrar Nova Saída
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <Label className="text-xs">Data *</Label>
                <Input type="date" value={form.data} onChange={(e) => set("data", e.target.value)} required />
              </div>

              <div>
                <Label className="text-xs">Hora *</Label>
                <Input type="time" value={form.hora} onChange={(e) => set("hora", e.target.value)} required />
              </div>

              {/* PRODUTO — lê do cadastro real */}
              <div className="lg:col-span-1">
                <Label className="text-xs">Produto *</Label>
                {produtosCadastrados.length > 0 ? (
                  <Select
                    onValueChange={(v) => {
                      const p = produtosCadastrados.find((x: any) => x.codigo === v);
                      setForm((f) => ({ ...f, codigo: v, produto: p?.nome ?? v, quantidade: "" }));
                    }}
                  >
                    <SelectTrigger className={estoqueAtual === 0 && produtoSelecionado ? "border-destructive" : ""}>
                      <SelectValue placeholder="Selecione um produto" />
                    </SelectTrigger>
                    <SelectContent>
                      {produtosCadastrados.map((p: any) => (
                        <SelectItem key={p.codigo} value={p.codigo} disabled={Number(p.estoque) === 0}>
                          {p.codigo} — {p.nome}
                          <span className={`ml-2 text-xs ${Number(p.estoque) === 0 ? "text-destructive" : "text-muted-foreground"}`}>
                            ({p.estoque} em estoque{Number(p.estoque) === 0 ? " — SEM ESTOQUE" : ""})
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input value={form.produto} onChange={(e) => set("produto", e.target.value)} placeholder="Nome do produto" required />
                )}
              </div>

              <div>
                <Label className="text-xs">Quantidade *</Label>
                <Input
                  type="number"
                  min="1"
                  max={estoqueAtual || undefined}
                  value={form.quantidade}
                  onChange={(e) => set("quantidade", e.target.value)}
                  placeholder="2"
                  required
                  className={estoqueInsuficiente ? "border-destructive" : ""}
                />
                {produtoSelecionado && (
                  <div className={`flex items-center gap-1 text-xs mt-1 ${estoqueInsuficiente ? "text-destructive" : "text-muted-foreground"}`}>
                    {estoqueInsuficiente && <AlertTriangle className="h-3 w-3" />}
                    Disponível: {estoqueAtual} un.
                    {estoqueInsuficiente && " — quantidade maior que o estoque!"}
                  </div>
                )}
              </div>

              <div>
                <Label className="text-xs">Responsável *</Label>
                <Input value={form.responsavel} onChange={(e) => set("responsavel", e.target.value)} placeholder="Nome do responsável" required />
              </div>

              <div>
                <Label className="text-xs">Projeto</Label>
                <Input value={form.projeto} onChange={(e) => set("projeto", e.target.value)} placeholder="Obra A, Escritório..." />
              </div>

              <div>
                <Label className="text-xs">Empresa</Label>
                <Input value={form.empresa} onChange={(e) => set("empresa", e.target.value)} placeholder="Nome da empresa" />
              </div>

              <div>
                <Label className="text-xs">Destino / Local</Label>
                <Input value={form.destino} onChange={(e) => set("destino", e.target.value)} placeholder="Sala 102, Oficina..." />
              </div>

              <div className="md:col-span-2">
                <Label className="text-xs">Observações</Label>
                <Input value={form.observacoes} onChange={(e) => set("observacoes", e.target.value)} placeholder="Informações adicionais..." />
              </div>

              <div className="lg:col-span-3 flex gap-2">
                <Button type="submit" className="gradient-danger" disabled={!!estoqueInsuficiente}>
                  Confirmar Saída
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
          placeholder="Buscar por produto, responsável, projeto ou empresa..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
      </div>

      {/* Histórico */}
      <Card className="shadow-soft">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Histórico de Saídas
            <Badge variant="secondary" className="ml-auto">{saidasFiltradas.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {saidasFiltradas.length === 0 ? (
            <p className="text-center text-muted-foreground py-10 text-sm">
              {busca ? "Nenhuma saída encontrada para a busca." : "Nenhuma saída registrada ainda."}
            </p>
          ) : (
            <div className="divide-y">
              {saidasFiltradas.map((s) => (
                <div key={s.id} className="py-3 flex items-center justify-between gap-4">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="w-2 h-2 rounded-full bg-exit mt-2 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="font-medium text-sm truncate">{s.produto}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(s.data + "T00:00:00").toLocaleDateString("pt-BR")} às {s.hora}
                        {s.responsavel && ` · `}
                        {s.responsavel && <span className="inline-flex items-center gap-0.5"><User className="h-3 w-3" />{s.responsavel}</span>}
                        {s.projeto && ` · `}
                        {s.projeto && <span className="inline-flex items-center gap-0.5"><Building2 className="h-3 w-3" />{s.projeto}</span>}
                      </p>
                      {(s.empresa || s.destino) && (
                        <p className="text-xs text-muted-foreground">
                          {s.empresa}{s.empresa && s.destino && " → "}{s.destino}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Badge className="bg-exit/10 text-exit border-exit/20 font-semibold">
                      -{s.quantidade} un.
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0 hover:text-destructive"
                      onClick={() => handleDeletar(s)}
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