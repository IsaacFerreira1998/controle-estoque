import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ExcelExportButton } from "@/components/excel/ExcelExportButton";
import { Plus, Search, Edit, Trash2, Package, FileSpreadsheet } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const produtos = [
  {
    id: 1,
    codigo: "ELE001",
    nome: "Monitor LED 24\"",
    categoria: "Eletrônicos",
    fornecedor: "TechCorp",
    localizacao: "A1-B2",
    estoque: 15,
    minimo: 10,
    preco: 450.00
  },
  {
    id: 2,
    codigo: "FER002",
    nome: "Chave Phillips 6mm",
    categoria: "Ferramentas",
    fornecedor: "ToolMax",
    localizacao: "C3-D1",
    estoque: 5,
    minimo: 50,
    preco: 12.50
  },
  {
    id: 3,
    codigo: "MOV003",
    nome: "Mesa Escritório",
    categoria: "Móveis",
    fornecedor: "MobiliaCorp",
    localizacao: "E5-F2",
    estoque: 3,
    minimo: 5,
    preco: 250.00
  }
];

const categorias = ["Eletrônicos", "Ferramentas", "Móveis", "Materiais", "Outros"];

export default function Produtos() {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [busca, setBusca] = useState("");
  const { toast } = useToast();

  const [novoProduto, setNovoProduto] = useState({
    codigo: "",
    nome: "",
    categoria: "",
    fornecedor: "",
    localizacao: "",
    estoque: "",
    minimo: "",
    preco: "",
    descricao: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Produto cadastrado!",
      description: `${novoProduto.nome} foi adicionado com sucesso.`,
    });
    setMostrarFormulario(false);
    setNovoProduto({
      codigo: "",
      nome: "",
      categoria: "",
      fornecedor: "",
      localizacao: "",
      estoque: "",
      minimo: "",
      preco: "",
      descricao: ""
    });
  };

  const produtosFiltrados = produtos.filter(produto =>
    produto.nome.toLowerCase().includes(busca.toLowerCase()) ||
    produto.codigo.toLowerCase().includes(busca.toLowerCase()) ||
    produto.categoria.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Produtos</h1>
          <p className="text-muted-foreground">
            Gerencie o cadastro completo de produtos do estoque
          </p>
        </div>
        <div className="flex gap-2">
          <ExcelExportButton fileName="Produtos_EstoqueMax" />
          <Button 
            onClick={() => setMostrarFormulario(!mostrarFormulario)}
            className="gradient-primary"
          >
            <Plus className="h-4 w-4 mr-2" />
            Novo Produto
          </Button>
        </div>
      </div>

      {/* Formulário de Cadastro */}
      {mostrarFormulario && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Cadastrar Produto
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="codigo">Código</Label>
                <Input
                  id="codigo"
                  value={novoProduto.codigo}
                  onChange={(e) => setNovoProduto({...novoProduto, codigo: e.target.value})}
                  placeholder="ELE001"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="nome">Nome do Produto</Label>
                <Input
                  id="nome"
                  value={novoProduto.nome}
                  onChange={(e) => setNovoProduto({...novoProduto, nome: e.target.value})}
                  placeholder="Monitor LED 24&quot;"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="categoria">Categoria</Label>
                <Select onValueChange={(value) => setNovoProduto({...novoProduto, categoria: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {categorias.map(categoria => (
                      <SelectItem key={categoria} value={categoria}>
                        {categoria}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="fornecedor">Fornecedor</Label>
                <Input
                  id="fornecedor"
                  value={novoProduto.fornecedor}
                  onChange={(e) => setNovoProduto({...novoProduto, fornecedor: e.target.value})}
                  placeholder="TechCorp"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="localizacao">Localização</Label>
                <Input
                  id="localizacao"
                  value={novoProduto.localizacao}
                  onChange={(e) => setNovoProduto({...novoProduto, localizacao: e.target.value})}
                  placeholder="A1-B2"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="preco">Preço</Label>
                <Input
                  id="preco"
                  type="number"
                  step="0.01"
                  value={novoProduto.preco}
                  onChange={(e) => setNovoProduto({...novoProduto, preco: e.target.value})}
                  placeholder="450.00"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="estoque">Estoque Inicial</Label>
                <Input
                  id="estoque"
                  type="number"
                  value={novoProduto.estoque}
                  onChange={(e) => setNovoProduto({...novoProduto, estoque: e.target.value})}
                  placeholder="15"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="minimo">Estoque Mínimo</Label>
                <Input
                  id="minimo"
                  type="number"
                  value={novoProduto.minimo}
                  onChange={(e) => setNovoProduto({...novoProduto, minimo: e.target.value})}
                  placeholder="10"
                  required
                />
              </div>
              
              <div className="space-y-2 md:col-span-2 lg:col-span-3">
                <Label htmlFor="descricao">Descrição</Label>
                <Textarea
                  id="descricao"
                  value={novoProduto.descricao}
                  onChange={(e) => setNovoProduto({...novoProduto, descricao: e.target.value})}
                  placeholder="Descrição detalhada do produto..."
                />
              </div>
              
              <div className="md:col-span-2 lg:col-span-3 flex gap-2">
                <Button type="submit" className="gradient-success">
                  Cadastrar Produto
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

      {/* Busca */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome, código ou categoria..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Lista de Produtos */}
      <Card>
        <CardHeader>
          <CardTitle>Produtos Cadastrados ({produtosFiltrados.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Código</th>
                  <th className="text-left p-2">Produto</th>
                  <th className="text-left p-2">Categoria</th>
                  <th className="text-left p-2">Fornecedor</th>
                  <th className="text-left p-2">Localização</th>
                  <th className="text-left p-2">Estoque</th>
                  <th className="text-left p-2">Preço</th>
                  <th className="text-left p-2">Status</th>
                  <th className="text-left p-2">Ações</th>
                </tr>
              </thead>
              <tbody>
                {produtosFiltrados.map((produto) => (
                  <tr key={produto.id} className="border-b hover:bg-muted/50 transition-smooth">
                    <td className="p-2 font-mono text-sm">{produto.codigo}</td>
                    <td className="p-2 font-medium">{produto.nome}</td>
                    <td className="p-2">
                      <Badge variant="outline">{produto.categoria}</Badge>
                    </td>
                    <td className="p-2">{produto.fornecedor}</td>
                    <td className="p-2 font-mono text-sm">{produto.localizacao}</td>
                    <td className="p-2">
                      <span className={produto.estoque <= produto.minimo ? "text-exit font-semibold" : ""}>
                        {produto.estoque}
                      </span>
                    </td>
                    <td className="p-2">R$ {produto.preco.toFixed(2)}</td>
                    <td className="p-2">
                      {produto.estoque <= produto.minimo ? (
                        <Badge variant="destructive">Baixo</Badge>
                      ) : (
                        <Badge className="bg-entry text-entry-foreground">OK</Badge>
                      )}
                    </td>
                    <td className="p-2">
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}