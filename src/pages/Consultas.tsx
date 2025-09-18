import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Download, Eye, Package, Calendar, TrendingUp, TrendingDown } from "lucide-react";

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
    preco: 450.00,
    ultimaEntrada: "2024-01-15",
    ultimaSaida: "2024-01-14"
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
    preco: 12.50,
    ultimaEntrada: "2024-01-10",
    ultimaSaida: "2024-01-12"
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
    preco: 250.00,
    ultimaEntrada: "2024-01-08",
    ultimaSaida: "2024-01-13"
  }
];

const movimentacoes = [
  {
    id: 1,
    data: "2024-01-15",
    tipo: "entrada",
    produto: "Monitor LED 24\"",
    quantidade: 10,
    responsavel: "João Silva",
    documento: "NF-12345"
  },
  {
    id: 2,
    data: "2024-01-14",
    tipo: "saida",
    produto: "Monitor LED 24\"",
    quantidade: 2,
    responsavel: "Carlos Lima",
    documento: "REQ-001"
  },
  {
    id: 3,
    data: "2024-01-13",
    tipo: "saida",
    produto: "Mesa Escritório",
    quantidade: 1,
    responsavel: "Roberto Santos",
    documento: "REQ-002"
  }
];

export default function Consultas() {
  const [filtros, setFiltros] = useState({
    busca: "",
    categoria: "",
    fornecedor: "",
    status: "",
    dataInicio: "",
    dataFim: ""
  });

  const [tipoConsulta, setTipoConsulta] = useState("produtos");

  const categorias = ["Eletrônicos", "Ferramentas", "Móveis", "Materiais", "Outros"];
  const fornecedores = ["TechCorp", "ToolMax", "MobiliaCorp"];

  const produtosFiltrados = produtos.filter(produto => {
    const matchBusca = !filtros.busca || 
      produto.nome.toLowerCase().includes(filtros.busca.toLowerCase()) ||
      produto.codigo.toLowerCase().includes(filtros.busca.toLowerCase());
    
    const matchCategoria = !filtros.categoria || produto.categoria === filtros.categoria;
    const matchFornecedor = !filtros.fornecedor || produto.fornecedor === filtros.fornecedor;
    
    const matchStatus = !filtros.status || 
      (filtros.status === "baixo" && produto.estoque <= produto.minimo) ||
      (filtros.status === "ok" && produto.estoque > produto.minimo);

    return matchBusca && matchCategoria && matchFornecedor && matchStatus;
  });

  const movimentacoesFiltradas = movimentacoes.filter(mov => {
    const matchBusca = !filtros.busca || 
      mov.produto.toLowerCase().includes(filtros.busca.toLowerCase()) ||
      mov.responsavel.toLowerCase().includes(filtros.busca.toLowerCase());
    
    const dataMovimentacao = new Date(mov.data);
    const matchDataInicio = !filtros.dataInicio || dataMovimentacao >= new Date(filtros.dataInicio);
    const matchDataFim = !filtros.dataFim || dataMovimentacao <= new Date(filtros.dataFim);

    return matchBusca && matchDataInicio && matchDataFim;
  });

  const limparFiltros = () => {
    setFiltros({
      busca: "",
      categoria: "",
      fornecedor: "",
      status: "",
      dataInicio: "",
      dataFim: ""
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Search className="h-8 w-8 text-primary" />
          Consultas Avançadas
        </h1>
        <p className="text-muted-foreground">
          Realize consultas detalhadas no sistema
        </p>
      </div>

      {/* Tipo de Consulta */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-2">
            <Button 
              variant={tipoConsulta === "produtos" ? "default" : "outline"}
              onClick={() => setTipoConsulta("produtos")}
            >
              <Package className="h-4 w-4 mr-2" />
              Produtos
            </Button>
            <Button 
              variant={tipoConsulta === "movimentacoes" ? "default" : "outline"}
              onClick={() => setTipoConsulta("movimentacoes")}
            >
              <Calendar className="h-4 w-4 mr-2" />
              Movimentações
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros de Busca
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="busca">Busca Geral</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="busca"
                  placeholder="Nome, código, responsável..."
                  value={filtros.busca}
                  onChange={(e) => setFiltros({...filtros, busca: e.target.value})}
                  className="pl-10"
                />
              </div>
            </div>

            {tipoConsulta === "produtos" && (
              <>
                <div className="space-y-2">
                  <Label>Categoria</Label>
                  <Select onValueChange={(value) => setFiltros({...filtros, categoria: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todas as categorias" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Todas as categorias</SelectItem>
                      {categorias.map(categoria => (
                        <SelectItem key={categoria} value={categoria}>
                          {categoria}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Fornecedor</Label>
                  <Select onValueChange={(value) => setFiltros({...filtros, fornecedor: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todos os fornecedores" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Todos os fornecedores</SelectItem>
                      {fornecedores.map(fornecedor => (
                        <SelectItem key={fornecedor} value={fornecedor}>
                          {fornecedor}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Status do Estoque</Label>
                  <Select onValueChange={(value) => setFiltros({...filtros, status: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todos os status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Todos os status</SelectItem>
                      <SelectItem value="ok">Estoque OK</SelectItem>
                      <SelectItem value="baixo">Estoque Baixo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            {tipoConsulta === "movimentacoes" && (
              <>
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
              </>
            )}
          </div>

          <div className="flex gap-2 mt-4">
            <Button onClick={limparFiltros} variant="outline">
              Limpar Filtros
            </Button>
            <Button className="gradient-primary">
              <Download className="h-4 w-4 mr-2" />
              Exportar Excel
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Resultados */}
      {tipoConsulta === "produtos" ? (
        <Card>
          <CardHeader>
            <CardTitle>
              Produtos Encontrados ({produtosFiltrados.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {produtosFiltrados.map((produto) => (
                <div key={produto.id} className="border rounded-lg p-4 hover:shadow-medium transition-smooth">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-lg">{produto.nome}</h4>
                      <p className="text-muted-foreground">{produto.codigo}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">{produto.estoque}</p>
                      <p className="text-sm text-muted-foreground">unidades</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Categoria:</span>
                      <p className="font-medium">{produto.categoria}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Localização:</span>
                      <p className="font-medium">{produto.localizacao}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Preço:</span>
                      <p className="font-medium">R$ {produto.preco.toFixed(2)}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Status:</span>
                      {produto.estoque <= produto.minimo ? (
                        <Badge variant="destructive">Baixo</Badge>
                      ) : (
                        <Badge className="bg-entry text-entry-foreground">OK</Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-between items-center mt-4 pt-3 border-t">
                    <div className="text-xs text-muted-foreground">
                      Última entrada: {new Date(produto.ultimaEntrada).toLocaleDateString('pt-BR')} | 
                      Última saída: {new Date(produto.ultimaSaida).toLocaleDateString('pt-BR')}
                    </div>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                      Detalhes
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>
              Movimentações Encontradas ({movimentacoesFiltradas.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {movimentacoesFiltradas.map((mov) => (
                <div key={mov.id} className={`border rounded-lg p-4 ${
                  mov.tipo === "entrada" 
                    ? "border-entry/20 bg-gradient-to-r from-entry/5 to-transparent" 
                    : "border-exit/20 bg-gradient-to-r from-exit/5 to-transparent"
                }`}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${
                        mov.tipo === "entrada" ? "bg-entry" : "bg-exit"
                      }`}></div>
                      <div>
                        <h4 className="font-semibold">{mov.produto}</h4>
                        <p className="text-sm text-muted-foreground">
                          {new Date(mov.data).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {mov.tipo === "entrada" ? (
                        <TrendingUp className="h-4 w-4 text-entry" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-exit" />
                      )}
                      <Badge className={
                        mov.tipo === "entrada" 
                          ? "bg-entry text-entry-foreground" 
                          : "bg-exit text-exit-foreground"
                      }>
                        {mov.tipo === "entrada" ? "+" : "-"}{mov.quantidade} unidades
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Responsável:</span>
                      <p className="font-medium">{mov.responsavel}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Documento:</span>
                      <p className="font-medium">{mov.documento}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}