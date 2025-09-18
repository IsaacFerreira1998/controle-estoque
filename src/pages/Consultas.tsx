import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Package, Calendar, Users, Building2, BarChart3, FileText, Filter } from "lucide-react";
import { FiltrosAvancados } from "@/components/consultas/FiltrosAvancados";
import { ResultadoProdutos } from "@/components/consultas/ResultadoProdutos";
import { ResultadoMovimentacoes } from "@/components/consultas/ResultadoMovimentacoes";
import { useToast } from "@/hooks/use-toast";

// Dados de exemplo expandidos
const produtosCompletos = [
  {
    id: 1,
    codigo: "ELE001",
    nome: "Monitor LED 24\" Samsung",
    categoria: "Eletrônicos",
    fornecedor: "TechCorp",
    localizacao: "A1-B2",
    estoque: 15,
    minimo: 10,
    preco: 450.00,
    ultimaEntrada: "2024-01-15",
    ultimaSaida: "2024-01-14",
    valorTotal: 6750.00,
    dataUltimaMovimentacao: "2024-01-15",
    status: "Ativo",
    descricao: "Monitor LED 24 polegadas Full HD com entrada HDMI e VGA",
    peso: 3.5,
    dimensoes: "54x32x8 cm"
  },
  {
    id: 2,
    codigo: "FER002",
    nome: "Chave Phillips 6mm Stanley",
    categoria: "Ferramentas",
    fornecedor: "ToolMax",
    localizacao: "C3-D1",
    estoque: 5,
    minimo: 50,
    preco: 12.50,
    ultimaEntrada: "2024-01-10",
    ultimaSaida: "2024-01-12",
    valorTotal: 62.50,
    dataUltimaMovimentacao: "2024-01-12",
    status: "Ativo",
    descricao: "Chave de fenda Phillips 6mm cabo emborrachado",
    peso: 0.15,
    dimensoes: "20x3x2 cm"
  },
  {
    id: 3,
    codigo: "MOV003",
    nome: "Mesa Escritório Executive",
    categoria: "Móveis",
    fornecedor: "MobiliaCorp",
    localizacao: "E5-F2",
    estoque: 3,
    minimo: 5,
    preco: 250.00,
    ultimaEntrada: "2024-01-08",
    ultimaSaida: "2024-01-13",
    valorTotal: 750.00,
    dataUltimaMovimentacao: "2024-01-13",
    status: "Ativo",
    descricao: "Mesa de escritório executiva em MDF com gavetas",
    peso: 45.0,
    dimensoes: "120x60x75 cm"
  },
  {
    id: 4,
    codigo: "MAT004",
    nome: "Papel A4 Sulfite 500 folhas",
    categoria: "Materiais",
    fornecedor: "PapelCorp",
    localizacao: "B2-C3",
    estoque: 0,
    minimo: 20,
    preco: 15.00,
    ultimaEntrada: "2024-01-05",
    ultimaSaida: "2024-01-16",
    valorTotal: 0.00,
    dataUltimaMovimentacao: "2024-01-16",
    status: "Ativo",
    descricao: "Papel sulfite A4 branco 75g/m² pacote com 500 folhas",
    peso: 2.5,
    dimensoes: "21x29.7x5 cm"
  }
];

const movimentacoesCompletas = [
  {
    id: 1,
    data: "2024-01-15",
    hora: "14:30",
    tipo: "entrada" as const,
    produto: "Monitor LED 24\" Samsung",
    codigo: "ELE001",
    quantidade: 10,
    responsavel: "João Silva",
    documento: "NF-12345",
    fornecedor: "TechCorp",
    destino: "Estoque Principal",
    valorUnitario: 450.00,
    valorTotal: 4500.00,
    observacoes: "Entrega conforme pedido 2024-001"
  },
  {
    id: 2,
    data: "2024-01-14",
    hora: "09:15",
    tipo: "saida" as const,
    produto: "Monitor LED 24\" Samsung",
    codigo: "ELE001",
    quantidade: 2,
    responsavel: "Carlos Lima",
    documento: "REQ-001",
    projeto: "Escritório Matriz",
    empresa: "TechSolutions",
    destino: "Sala 102",
    valorUnitario: 450.00,
    valorTotal: 900.00,
    observacoes: "Para instalação no novo escritório"
  },
  {
    id: 3,
    data: "2024-01-13",
    hora: "16:45",
    tipo: "saida" as const,
    produto: "Mesa Escritório Executive",
    codigo: "MOV003",
    quantidade: 1,
    responsavel: "Roberto Santos",
    documento: "REQ-002",
    projeto: "Nova Filial",
    empresa: "Construtora ABC",
    destino: "Sala Reunião",
    valorUnitario: 250.00,
    valorTotal: 250.00
  },
  {
    id: 4,
    data: "2024-01-12",
    hora: "11:20",
    tipo: "saida" as const,
    produto: "Chave Phillips 6mm Stanley",
    codigo: "FER002",
    quantidade: 15,
    responsavel: "Ana Costa",
    documento: "REQ-003",
    projeto: "Manutenção Predial",
    empresa: "ManuCorp",
    destino: "Oficina",
    valorUnitario: 12.50,
    valorTotal: 187.50
  },
  {
    id: 5,
    data: "2024-01-10",
    hora: "08:30",
    tipo: "entrada" as const,
    produto: "Chave Phillips 6mm Stanley",
    codigo: "FER002",
    quantidade: 100,
    responsavel: "Maria Santos",
    documento: "NF-12346",
    fornecedor: "ToolMax",
    destino: "Almoxarifado",
    valorUnitario: 12.50,
    valorTotal: 1250.00
  }
];

const fornecedoresCompletos = [
  {
    id: 1,
    nome: "TechCorp",
    cnpj: "12.345.678/0001-90",
    telefone: "(11) 9999-1111",
    email: "contato@techcorp.com",
    endereco: "Rua da Tecnologia, 123",
    status: "Ativo",
    totalPedidos: 15,
    valorTotal: 45000.00,
    ultimoPedido: "2024-01-15"
  },
  {
    id: 2,
    nome: "ToolMax",
    cnpj: "23.456.789/0001-90",
    telefone: "(11) 9999-2222",
    email: "vendas@toolmax.com",
    endereco: "Av. das Ferramentas, 456",
    status: "Ativo",
    totalPedidos: 28,
    valorTotal: 32000.00,
    ultimoPedido: "2024-01-10"
  },
  {
    id: 3,
    nome: "MobiliaCorp",
    cnpj: "34.567.890/0001-90",
    telefone: "(11) 9999-3333",
    email: "comercial@mobiliacorp.com",
    endereco: "Rua dos Móveis, 789",
    status: "Ativo",
    totalPedidos: 12,
    valorTotal: 28000.00,
    ultimoPedido: "2024-01-08"
  }
];

export default function Consultas() {
  const { toast } = useToast();
  
  const [tipoConsulta, setTipoConsulta] = useState("produtos");
  const [mostrarFiltros, setMostrarFiltros] = useState(true);
  
  const [filtros, setFiltros] = useState({
    // Filtros gerais
    busca: "",
    dataInicio: "",
    dataFim: "",
    
    // Filtros específicos de produtos
    categoria: "",
    fornecedor: "",
    statusEstoque: "",
    localizacao: "",
    
    // Filtros específicos de movimentações
    tipoMovimentacao: "",
    responsavel: "",
    projeto: "",
    
    // Filtros específicos de fornecedores
    statusFornecedor: "",
    valorMinimo: "",
    valorMaximo: "",
    
    // Filtros específicos de relatórios
    periodo: "",
    tipoRelatorio: "",
    formato: "",
    agrupamento: ""
  });

  const aplicarFiltros = () => {
    toast({
      title: "Filtros aplicados!",
      description: `Consulta realizada com ${getResultados().length} resultados encontrados.`,
    });
  };

  const limparFiltros = () => {
    setFiltros({
      busca: "",
      dataInicio: "",
      dataFim: "",
      categoria: "",
      fornecedor: "",
      statusEstoque: "",
      localizacao: "",
      tipoMovimentacao: "",
      responsavel: "",
      projeto: "",
      statusFornecedor: "",
      valorMinimo: "",
      valorMaximo: "",
      periodo: "",
      tipoRelatorio: "",
      formato: "",
      agrupamento: ""
    });
    
    toast({
      title: "Filtros limpos!",
      description: "Todos os filtros foram removidos.",
    });
  };

  const getResultados = () => {
    switch (tipoConsulta) {
      case "produtos":
        return produtosCompletos.filter(produto => {
          const matchBusca = !filtros.busca || 
            produto.nome.toLowerCase().includes(filtros.busca.toLowerCase()) ||
            produto.codigo.toLowerCase().includes(filtros.busca.toLowerCase()) ||
            produto.descricao.toLowerCase().includes(filtros.busca.toLowerCase());
          
          const matchCategoria = !filtros.categoria || produto.categoria === filtros.categoria;
          const matchFornecedor = !filtros.fornecedor || produto.fornecedor === filtros.fornecedor;
          const matchLocalizacao = !filtros.localizacao || produto.localizacao.includes(filtros.localizacao);
          
          const matchStatus = !filtros.statusEstoque || 
            (filtros.statusEstoque === "baixo" && produto.estoque <= produto.minimo) ||
            (filtros.statusEstoque === "ok" && produto.estoque > produto.minimo) ||
            (filtros.statusEstoque === "zerado" && produto.estoque === 0);

          return matchBusca && matchCategoria && matchFornecedor && matchLocalizacao && matchStatus;
        });
        
      case "movimentacoes":
        return movimentacoesCompletas.filter(mov => {
          const matchBusca = !filtros.busca || 
            mov.produto.toLowerCase().includes(filtros.busca.toLowerCase()) ||
            mov.responsavel.toLowerCase().includes(filtros.busca.toLowerCase()) ||
            mov.codigo.toLowerCase().includes(filtros.busca.toLowerCase());
          
          const matchTipo = !filtros.tipoMovimentacao || mov.tipo === filtros.tipoMovimentacao;
          const matchResponsavel = !filtros.responsavel || mov.responsavel.toLowerCase().includes(filtros.responsavel.toLowerCase());
          const matchProjeto = !filtros.projeto || mov.projeto === filtros.projeto;
          
          const dataMovimentacao = new Date(mov.data);
          const matchDataInicio = !filtros.dataInicio || dataMovimentacao >= new Date(filtros.dataInicio);
          const matchDataFim = !filtros.dataFim || dataMovimentacao <= new Date(filtros.dataFim);

          return matchBusca && matchTipo && matchResponsavel && matchProjeto && matchDataInicio && matchDataFim;
        });
        
      case "fornecedores":
        return fornecedoresCompletos.filter(fornecedor => {
          const matchBusca = !filtros.busca || 
            fornecedor.nome.toLowerCase().includes(filtros.busca.toLowerCase()) ||
            fornecedor.cnpj.includes(filtros.busca) ||
            fornecedor.email.toLowerCase().includes(filtros.busca.toLowerCase());
          
          const matchStatus = !filtros.statusFornecedor || fornecedor.status.toLowerCase() === filtros.statusFornecedor;
          const matchValorMin = !filtros.valorMinimo || fornecedor.valorTotal >= parseFloat(filtros.valorMinimo);
          const matchValorMax = !filtros.valorMaximo || fornecedor.valorTotal <= parseFloat(filtros.valorMaximo);

          return matchBusca && matchStatus && matchValorMin && matchValorMax;
        });
        
      default:
        return [];
    }
  };

  const handleDetalhes = (item: any) => {
    toast({
      title: "Detalhes",
      description: `Visualizando detalhes de: ${item.nome || item.produto || item.nome}`,
    });
  };

  const handleHistorico = (item: any) => {
    toast({
      title: "Histórico",
      description: `Carregando histórico de: ${item.nome || item.produto}`,
    });
  };

  const handleEditar = (item: any) => {
    toast({
      title: "Editar",
      description: `Editando: ${item.nome || item.produto}`,
    });
  };

  const resultados = getResultados();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Search className="h-8 w-8 text-primary" />
            Consultas Avançadas
          </h1>
          <p className="text-muted-foreground">
            Sistema completo de consultas e análises do estoque
          </p>
        </div>
        <Button 
          onClick={() => setMostrarFiltros(!mostrarFiltros)}
          variant="outline"
        >
          <Filter className="h-4 w-4 mr-2" />
          {mostrarFiltros ? 'Ocultar' : 'Mostrar'} Filtros
        </Button>
      </div>

      {/* Tipo de Consulta */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-2">
            <Button 
              variant={tipoConsulta === "produtos" ? "default" : "outline"}
              onClick={() => setTipoConsulta("produtos")}
              className="flex items-center gap-2"
            >
              <Package className="h-4 w-4" />
              Produtos
              <Badge variant="secondary">{produtosCompletos.length}</Badge>
            </Button>
            
            <Button 
              variant={tipoConsulta === "movimentacoes" ? "default" : "outline"}
              onClick={() => setTipoConsulta("movimentacoes")}
              className="flex items-center gap-2"
            >
              <Calendar className="h-4 w-4" />
              Movimentações
              <Badge variant="secondary">{movimentacoesCompletas.length}</Badge>
            </Button>
            
            <Button 
              variant={tipoConsulta === "fornecedores" ? "default" : "outline"}
              onClick={() => setTipoConsulta("fornecedores")}
              className="flex items-center gap-2"
            >
              <Building2 className="h-4 w-4" />
              Fornecedores
              <Badge variant="secondary">{fornecedoresCompletos.length}</Badge>
            </Button>
            
            <Button 
              variant={tipoConsulta === "relatorios" ? "default" : "outline"}
              onClick={() => setTipoConsulta("relatorios")}
              className="flex items-center gap-2"
            >
              <BarChart3 className="h-4 w-4" />
              Relatórios
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Filtros Avançados */}
      {mostrarFiltros && (
        <FiltrosAvancados
          filtros={filtros}
          setFiltros={setFiltros}
          tipoConsulta={tipoConsulta}
          onBuscar={aplicarFiltros}
          onLimpar={limparFiltros}
        />
      )}

      {/* Resultados */}
      {tipoConsulta === "produtos" && (
        <ResultadoProdutos
          produtos={resultados as any}
          onDetalhes={handleDetalhes}
          onHistorico={handleHistorico}
          onEditar={handleEditar}
        />
      )}

      {tipoConsulta === "movimentacoes" && (
        <ResultadoMovimentacoes
          movimentacoes={resultados as any}
          onDetalhes={handleDetalhes}
        />
      )}

      {tipoConsulta === "fornecedores" && (
        <Card>
          <CardHeader>
            <CardTitle>Fornecedores Encontrados ({resultados.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {resultados.map((fornecedor: any) => (
                <div key={fornecedor.id} className="border rounded-lg p-4 hover:shadow-medium transition-smooth">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-lg">{fornecedor.nome}</h4>
                      <p className="text-muted-foreground font-mono">{fornecedor.cnpj}</p>
                    </div>
                    <Badge className={fornecedor.status === "Ativo" ? "bg-success text-success-foreground" : "bg-muted"}>
                      {fornecedor.status}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Telefone:</span>
                      <p className="font-medium">{fornecedor.telefone}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">E-mail:</span>
                      <p className="font-medium">{fornecedor.email}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Pedidos:</span>
                      <p className="font-medium">{fornecedor.totalPedidos}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Valor Total:</span>
                      <p className="font-medium">R$ {fornecedor.valorTotal.toFixed(2)}</p>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t">
                    <div className="flex justify-between items-center">
                      <div className="text-xs text-muted-foreground">
                        Último pedido: {new Date(fornecedor.ultimoPedido).toLocaleDateString('pt-BR')}
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleDetalhes(fornecedor)}>
                          <FileText className="h-4 w-4 mr-1" />
                          Detalhes
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleHistorico(fornecedor)}>
                          <Calendar className="h-4 w-4 mr-1" />
                          Histórico
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {tipoConsulta === "relatorios" && (
        <Card>
          <CardHeader>
            <CardTitle>Gerador de Relatórios Personalizados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg hover:shadow-medium transition-smooth cursor-pointer">
                <h4 className="font-semibold mb-2">Relatório de Estoque Atual</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Situação atual de todos os produtos em estoque
                </p>
                <Button variant="outline" className="w-full">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Gerar Relatório
                </Button>
              </div>

              <div className="p-4 border rounded-lg hover:shadow-medium transition-smooth cursor-pointer">
                <h4 className="font-semibold mb-2">Análise de Movimentação</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Relatório detalhado de entradas e saídas por período
                </p>
                <Button variant="outline" className="w-full">
                  <Calendar className="h-4 w-4 mr-2" />
                  Gerar Relatório
                </Button>
              </div>

              <div className="p-4 border rounded-lg hover:shadow-medium transition-smooth cursor-pointer">
                <h4 className="font-semibold mb-2">Performance de Fornecedores</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Análise completa do desempenho dos fornecedores
                </p>
                <Button variant="outline" className="w-full">
                  <Users className="h-4 w-4 mr-2" />
                  Gerar Relatório
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Estatísticas Rápidas */}
      {resultados.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Estatísticas da Consulta</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">{resultados.length}</p>
                <p className="text-sm text-muted-foreground">Resultados Encontrados</p>
              </div>
              
              {tipoConsulta === "produtos" && (
                <>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-entry">
                      {resultados.filter((p: any) => p.estoque > p.minimo).length}
                    </p>
                    <p className="text-sm text-muted-foreground">Estoque Normal</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-warning">
                      {resultados.filter((p: any) => p.estoque <= p.minimo && p.estoque > 0).length}
                    </p>
                    <p className="text-sm text-muted-foreground">Estoque Baixo</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-exit">
                      {resultados.filter((p: any) => p.estoque === 0).length}
                    </p>
                    <p className="text-sm text-muted-foreground">Estoque Zerado</p>
                  </div>
                </>
              )}
              
              {tipoConsulta === "movimentacoes" && (
                <>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-entry">
                      {resultados.filter((m: any) => m.tipo === 'entrada').length}
                    </p>
                    <p className="text-sm text-muted-foreground">Entradas</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-exit">
                      {resultados.filter((m: any) => m.tipo === 'saida').length}
                    </p>
                    <p className="text-sm text-muted-foreground">Saídas</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-primary">
                      R$ {resultados.reduce((acc: number, m: any) => acc + m.valorTotal, 0).toFixed(2)}
                    </p>
                    <p className="text-sm text-muted-foreground">Valor Total</p>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}