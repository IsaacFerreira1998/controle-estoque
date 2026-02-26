import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { PackageMinus, Plus, Calendar, Building2, User, Trash2, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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

const STORAGE_KEY = "estoquemax-saidas";

const saidasIniciais: Saida[] = [
  {
    id: 1,
    data: "2024-01-15",
    produto: "Monitor LED 24\"",
    codigo: "ELE001",
    quantidade: 2,
    responsavel: "Carlos Lima",
    projeto: "Escritório Matriz",
    empresa: "TechSolutions",
    destino: "Sala 102",
    hora: "14:30"
  },
  {
    id: 2,
    data: "2024-01-14",
    produto: "Chave Phillips 6mm",
    codigo: "FER002",
    quantidade: 15,
    responsavel: "Ana Costa",
    projeto: "Manutenção Predial",
    empresa: "ManuCorp",
    destino: "Oficina",
    hora: "09:15"
  },
  {
    id: 3,
    data: "2024-01-13",
    produto: "Mesa Escritório",
    codigo: "MOV003",
    quantidade: 1,
    responsavel: "Roberto Santos",
    projeto: "Nova Filial",
    empresa: "Construtora ABC",
    destino: "Sala Reunião",
    hora: "16:45"
  }
];

function carregarSaidas(): Saida[] {
  try {
    const salvo = localStorage.getItem(STORAGE_KEY);
    if (salvo) return JSON.parse(salvo);
  } catch { }
  return saidasIniciais;
}

function salvarSaidas(saidas: Saida[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(saidas));
}

const produtos = [
  { codigo: "ELE001", nome: "Monitor LED 24\"", estoque: 15 },
  { codigo: "FER002", nome: "Chave Phillips 6mm", estoque: 5 },
  { codigo: "MOV003", nome: "Mesa Escritório", estoque: 3 }
];

const projetos = ["Escritório Matriz", "Manutenção Predial", "Nova Filial", "Obra Centro", "Reforma Geral"];
const empresas = ["TechSolutions", "ManuCorp", "Construtora ABC", "Outros"];

const novaSaidaVazia = {
  data: new Date().toISOString().split('T')[0],
  hora: new Date().toTimeString().slice(0, 5),
  produto: "",
  quantidade: "",
  responsavel: "",
  projeto: "",
  empresa: "",
  destino: "",
  observacoes: ""
};

export default function Saidas() {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [saidas, setSaidas] = useState<Saida[]>(carregarSaidas);
  const { toast } = useToast();

  const [novaSaida, setNovaSaida] = useState(novaSaidaVazia);

  const produtoSelecionado = produtos.find(p => p.codigo === novaSaida.produto);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (produtoSelecionado && parseInt(novaSaida.quantidade) > produtoSelecionado.estoque) {
      toast({
        title: "Estoque insuficiente!",
        description: `Quantidade solicitada (${novaSaida.quantidade}) maior que o estoque disponível (${produtoSelecionado.estoque}).`,
        variant: "destructive"
      });
      return;
    }

    const nova: Saida = {
      id: Date.now(),
      data: novaSaida.data,
      hora: novaSaida.hora,
      produto: produtoSelecionado?.nome || novaSaida.produto,
      codigo: novaSaida.produto,
      quantidade: Number(novaSaida.quantidade),
      responsavel: novaSaida.responsavel,
      projeto: novaSaida.projeto,
      empresa: novaSaida.empresa,
      destino: novaSaida.destino,
      observacoes: novaSaida.observacoes
    };

    const atualizadas = [nova, ...saidas];
    setSaidas(atualizadas);
    salvarSaidas(atualizadas);

    toast({
      title: "Saída registrada!",
      description: `Saída de ${nova.quantidade} unidades de ${nova.produto} registrada com sucesso.`,
    });

    setMostrarFormulario(false);
    setNovaSaida({
      ...novaSaidaVazia,
      data: new Date().toISOString().split('T')[0],
      hora: new Date().toTimeString().slice(0, 5)
    });
  };

  const handleDeletar = (saida: Saida) => {
    const atualizadas = saidas.filter(s => s.id !== saida.id);
    setSaidas(atualizadas);
    salvarSaidas(atualizadas);
    toast({
      title: "Saída removida!",
      description: `Registro de saída de ${saida.produto} foi excluído.`,
      variant: "destructive"
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <PackageMinus className="h-8 w-8 text-exit" />
            Controle de Saídas
          </h1>
          <p className="text-muted-foreground">
            Registre retiradas de produtos do estoque
          </p>
        </div>
        <Button
          onClick={() => setMostrarFormulario(!mostrarFormulario)}
          className="gradient-danger"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nova Saída
        </Button>
      </div>

      {/* Formulário de Saída */}
      {mostrarFormulario && (
        <Card className="border-exit/20 bg-gradient-to-br from-exit/5 to-exit/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-exit">
              <PackageMinus className="h-5 w-5" />
              Registrar Nova Saída
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="data">Data da Saída</Label>
                <Input
                  id="data"
                  type="date"
                  value={novaSaida.data}
                  onChange={(e) => setNovaSaida({ ...novaSaida, data: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="hora">Hora</Label>
                <Input
                  id="hora"
                  type="time"
                  value={novaSaida.hora}
                  onChange={(e) => setNovaSaida({ ...novaSaida, hora: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="produto">Produto</Label>
                <Select onValueChange={(value) => setNovaSaida({ ...novaSaida, produto: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o produto" />
                  </SelectTrigger>
                  <SelectContent>
                    {produtos.map(produto => (
                      <SelectItem key={produto.codigo} value={produto.codigo}>
                        {produto.codigo} - {produto.nome} (Estoque: {produto.estoque})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantidade">Quantidade</Label>
                <div className="relative">
                  <Input
                    id="quantidade"
                    type="number"
                    min="1"
                    value={novaSaida.quantidade}
                    onChange={(e) => setNovaSaida({ ...novaSaida, quantidade: e.target.value })}
                    placeholder="2"
                    max={produtoSelecionado?.estoque || 999}
                    required
                  />
                  {produtoSelecionado && (
                    <div className="text-xs text-muted-foreground mt-1">
                      Disponível: {produtoSelecionado.estoque} unidades
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="responsavel">Responsável pela Retirada</Label>
                <Input
                  id="responsavel"
                  value={novaSaida.responsavel}
                  onChange={(e) => setNovaSaida({ ...novaSaida, responsavel: e.target.value })}
                  placeholder="Carlos Lima"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="projeto">Projeto Vinculado</Label>
                <Select onValueChange={(value) => setNovaSaida({ ...novaSaida, projeto: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o projeto" />
                  </SelectTrigger>
                  <SelectContent>
                    {projetos.map(projeto => (
                      <SelectItem key={projeto} value={projeto}>
                        {projeto}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="empresa">Empresa</Label>
                <Select onValueChange={(value) => setNovaSaida({ ...novaSaida, empresa: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a empresa" />
                  </SelectTrigger>
                  <SelectContent>
                    {empresas.map(empresa => (
                      <SelectItem key={empresa} value={empresa}>
                        {empresa}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="destino">Destino/Local</Label>
                <Input
                  id="destino"
                  value={novaSaida.destino}
                  onChange={(e) => setNovaSaida({ ...novaSaida, destino: e.target.value })}
                  placeholder="Sala 102"
                  required
                />
              </div>

              <div className="space-y-2 md:col-span-2 lg:col-span-3">
                <Label htmlFor="observacoes">Observações</Label>
                <Input
                  id="observacoes"
                  value={novaSaida.observacoes}
                  onChange={(e) => setNovaSaida({ ...novaSaida, observacoes: e.target.value })}
                  placeholder="Observações adicionais..."
                />
              </div>

              <div className="md:col-span-2 lg:col-span-3 flex gap-2">
                <Button type="submit" className="gradient-danger">
                  Registrar Saída
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setMostrarFormulario(false)}
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Histórico de Saídas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Histórico de Saídas ({saidas.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {saidas.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Nenhuma saída registrada ainda.
            </p>
          ) : (
            <div className="space-y-4">
              {saidas.map((saida) => (
                <div key={saida.id} className="border border-exit/20 bg-gradient-to-r from-exit/5 to-transparent rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-exit rounded-full"></div>
                      <div>
                        <h4 className="font-semibold">{saida.produto}</h4>
                        <p className="text-sm text-muted-foreground">
                          Código: {saida.codigo}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-exit text-exit-foreground">
                        -{saida.quantidade} unidades
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeletar(saida)}
                        className="hover:text-destructive"
                        title="Remover registro"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Data/Hora:</span>
                      <p className="font-medium">
                        {new Date(saida.data + "T00:00:00").toLocaleDateString('pt-BR')} às {saida.hora}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Responsável:</span>
                      <p className="font-medium flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {saida.responsavel}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Projeto:</span>
                      <p className="font-medium flex items-center gap-1">
                        <Building2 className="h-3 w-3" />
                        {saida.projeto}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Empresa:</span>
                      <p className="font-medium">{saida.empresa}</p>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-exit/10">
                    <span className="text-xs text-muted-foreground">
                      Destino: {saida.destino}
                      {saida.observacoes && ` — ${saida.observacoes}`}
                    </span>
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