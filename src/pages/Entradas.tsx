import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { PackagePlus, Plus, Calendar, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const entradas = [
  {
    id: 1,
    data: "2024-01-15",
    produto: "Monitor LED 24\"",
    codigo: "ELE001",
    quantidade: 10,
    fornecedor: "TechCorp",
    notaFiscal: "NF-12345",
    responsavel: "João Silva",
    destino: "Estoque Principal"
  },
  {
    id: 2,
    data: "2024-01-14",
    produto: "Chave Phillips 6mm",
    codigo: "FER002",
    quantidade: 100,
    fornecedor: "ToolMax",
    notaFiscal: "NF-12346",
    responsavel: "Maria Santos",
    destino: "Almoxarifado"
  },
  {
    id: 3,
    data: "2024-01-13",
    produto: "Mesa Escritório",
    codigo: "MOV003",
    quantidade: 5,
    fornecedor: "MobiliaCorp",
    notaFiscal: "NF-12347",
    responsavel: "Pedro Costa",
    destino: "Depósito"
  }
];

const produtos = [
  { codigo: "ELE001", nome: "Monitor LED 24\"" },
  { codigo: "FER002", nome: "Chave Phillips 6mm" },
  { codigo: "MOV003", nome: "Mesa Escritório" }
];

const fornecedores = ["TechCorp", "ToolMax", "MobiliaCorp", "Outros"];
const destinos = ["Estoque Principal", "Almoxarifado", "Depósito", "Obra A", "Obra B"];

export default function Entradas() {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const { toast } = useToast();

  const [novaEntrada, setNovaEntrada] = useState({
    data: new Date().toISOString().split('T')[0],
    produto: "",
    quantidade: "",
    fornecedor: "",
    notaFiscal: "",
    responsavel: "",
    destino: "",
    observacoes: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Entrada registrada!",
      description: `Entrada de ${novaEntrada.quantidade} unidades registrada com sucesso.`,
    });
    setMostrarFormulario(false);
    setNovaEntrada({
      data: new Date().toISOString().split('T')[0],
      produto: "",
      quantidade: "",
      fornecedor: "",
      notaFiscal: "",
      responsavel: "",
      destino: "",
      observacoes: ""
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <PackagePlus className="h-8 w-8 text-entry" />
            Controle de Entradas
          </h1>
          <p className="text-muted-foreground">
            Registre novas entradas de produtos no estoque
          </p>
        </div>
        <Button 
          onClick={() => setMostrarFormulario(!mostrarFormulario)}
          className="gradient-success"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nova Entrada
        </Button>
      </div>

      {/* Formulário de Entrada */}
      {mostrarFormulario && (
        <Card className="border-entry/20 bg-gradient-to-br from-entry/5 to-entry/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-entry">
              <PackagePlus className="h-5 w-5" />
              Registrar Nova Entrada
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="data">Data da Entrada</Label>
                <Input
                  id="data"
                  type="date"
                  value={novaEntrada.data}
                  onChange={(e) => setNovaEntrada({...novaEntrada, data: e.target.value})}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="produto">Produto</Label>
                <Select onValueChange={(value) => setNovaEntrada({...novaEntrada, produto: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o produto" />
                  </SelectTrigger>
                  <SelectContent>
                    {produtos.map(produto => (
                      <SelectItem key={produto.codigo} value={produto.codigo}>
                        {produto.codigo} - {produto.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="quantidade">Quantidade</Label>
                <Input
                  id="quantidade"
                  type="number"
                  value={novaEntrada.quantidade}
                  onChange={(e) => setNovaEntrada({...novaEntrada, quantidade: e.target.value})}
                  placeholder="10"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="fornecedor">Fornecedor</Label>
                <Select onValueChange={(value) => setNovaEntrada({...novaEntrada, fornecedor: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o fornecedor" />
                  </SelectTrigger>
                  <SelectContent>
                    {fornecedores.map(fornecedor => (
                      <SelectItem key={fornecedor} value={fornecedor}>
                        {fornecedor}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="notaFiscal">Nota Fiscal</Label>
                <Input
                  id="notaFiscal"
                  value={novaEntrada.notaFiscal}
                  onChange={(e) => setNovaEntrada({...novaEntrada, notaFiscal: e.target.value})}
                  placeholder="NF-12345"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="responsavel">Responsável</Label>
                <Input
                  id="responsavel"
                  value={novaEntrada.responsavel}
                  onChange={(e) => setNovaEntrada({...novaEntrada, responsavel: e.target.value})}
                  placeholder="João Silva"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="destino">Destino</Label>
                <Select onValueChange={(value) => setNovaEntrada({...novaEntrada, destino: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o destino" />
                  </SelectTrigger>
                  <SelectContent>
                    {destinos.map(destino => (
                      <SelectItem key={destino} value={destino}>
                        {destino}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2 md:col-span-2 lg:col-span-3">
                <Label htmlFor="observacoes">Observações</Label>
                <Input
                  id="observacoes"
                  value={novaEntrada.observacoes}
                  onChange={(e) => setNovaEntrada({...novaEntrada, observacoes: e.target.value})}
                  placeholder="Observações adicionais..."
                />
              </div>
              
              <div className="md:col-span-2 lg:col-span-3 flex gap-2">
                <Button type="submit" className="gradient-success">
                  Registrar Entrada
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setMostrarFormulario(false)}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Histórico de Entradas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Histórico de Entradas ({entradas.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {entradas.map((entrada) => (
              <div key={entrada.id} className="border border-entry/20 bg-gradient-to-r from-entry/5 to-transparent rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-entry rounded-full"></div>
                    <div>
                      <h4 className="font-semibold">{entrada.produto}</h4>
                      <p className="text-sm text-muted-foreground">
                        Código: {entrada.codigo}
                      </p>
                    </div>
                  </div>
                  <Badge className="bg-entry text-entry-foreground">
                    +{entrada.quantidade} unidades
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Data:</span>
                    <p className="font-medium">{new Date(entrada.data).toLocaleDateString('pt-BR')}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Fornecedor:</span>
                    <p className="font-medium">{entrada.fornecedor}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Nota Fiscal:</span>
                    <p className="font-medium flex items-center gap-1">
                      <FileText className="h-3 w-3" />
                      {entrada.notaFiscal}
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Destino:</span>
                    <p className="font-medium">{entrada.destino}</p>
                  </div>
                </div>
                
                <div className="mt-3 pt-3 border-t border-entry/10">
                  <span className="text-xs text-muted-foreground">
                    Responsável: {entrada.responsavel}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}