import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Download, Edit, History, MapPin, Package } from "lucide-react";
import { useState } from "react";

interface Produto {
  id: number;
  codigo: string;
  nome: string;
  categoria: string;
  fornecedor: string;
  localizacao: string;
  estoque: number;
  minimo: number;
  preco: number;
  ultimaEntrada: string;
  ultimaSaida: string;
  valorTotal: number;
  dataUltimaMovimentacao: string;
  status: string;
}

interface ResultadoProdutosProps {
  produtos: Produto[];
  onDetalhes: (produto: Produto) => void;
  onHistorico: (produto: Produto) => void;
  onEditar: (produto: Produto) => void;
}

type TipoVisualizacao = 'cards' | 'tabela';

export function ResultadoProdutos({ produtos, onDetalhes, onHistorico, onEditar }: ResultadoProdutosProps) {
  const [visualizacao, setVisualizacao] = useState<TipoVisualizacao>('cards');

  const getStatusColor = (produto: Produto) => {
    if (produto.estoque === 0) return "bg-destructive text-destructive-foreground";
    if (produto.estoque <= produto.minimo) return "bg-warning text-warning-foreground";
    return "bg-success text-success-foreground";
  };

  const getStatusText = (produto: Produto) => {
    if (produto.estoque === 0) return "Zerado";
    if (produto.estoque <= produto.minimo) return "Baixo";
    return "Normal";
  };

  const renderTabela = () => (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>
            Produtos Encontrados ({produtos.length})
          </CardTitle>
          <div className="flex gap-2">
            <Button 
              variant={visualizacao === 'cards' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setVisualizacao('cards')}
            >
              Cards
            </Button>
            <Button 
              variant={visualizacao === 'tabela' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setVisualizacao('tabela')}
            >
              Tabela
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-1" />
              Excel
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3">Código</th>
                <th className="text-left p-3">Produto</th>
                <th className="text-left p-3">Categoria</th>
                <th className="text-left p-3">Estoque</th>
                <th className="text-left p-3">Status</th>
                <th className="text-left p-3">Localização</th>
                <th className="text-left p-3">Valor Total</th>
                <th className="text-left p-3">Última Movimentação</th>
                <th className="text-left p-3">Ações</th>
              </tr>
            </thead>
            <tbody>
              {produtos.map((produto) => (
                <tr key={produto.id} className="border-b hover:bg-muted/50 transition-smooth">
                  <td className="p-3 font-mono text-sm">{produto.codigo}</td>
                  <td className="p-3">
                    <div>
                      <p className="font-medium">{produto.nome}</p>
                      <p className="text-sm text-muted-foreground">{produto.fornecedor}</p>
                    </div>
                  </td>
                  <td className="p-3">
                    <Badge variant="outline">{produto.categoria}</Badge>
                  </td>
                  <td className="p-3">
                    <div className="text-center">
                      <p className="text-lg font-bold">{produto.estoque}</p>
                      <p className="text-xs text-muted-foreground">Min: {produto.minimo}</p>
                    </div>
                  </td>
                  <td className="p-3">
                    <Badge className={getStatusColor(produto)}>
                      {getStatusText(produto)}
                    </Badge>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {produto.localizacao}
                    </div>
                  </td>
                  <td className="p-3 font-medium">
                    R$ {produto.valorTotal.toFixed(2)}
                  </td>
                  <td className="p-3 text-sm">
                    {new Date(produto.dataUltimaMovimentacao).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="p-3">
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm" onClick={() => onDetalhes(produto)}>
                        <Eye className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => onHistorico(produto)}>
                        <History className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => onEditar(produto)}>
                        <Edit className="h-3 w-3" />
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
  );

  const renderCards = () => (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>
            Produtos Encontrados ({produtos.length})
          </CardTitle>
          <div className="flex gap-2">
            <Button 
              variant={visualizacao === 'cards' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setVisualizacao('cards')}
            >
              Cards
            </Button>
            <Button 
              variant={visualizacao === 'tabela' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setVisualizacao('tabela')}
            >
              Tabela
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-1" />
              Excel
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {produtos.map((produto) => (
            <div key={produto.id} className="border rounded-lg p-4 hover:shadow-medium transition-smooth bg-gradient-to-br from-card to-muted/20">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-primary" />
                  <div>
                    <h4 className="font-semibold">{produto.nome}</h4>
                    <p className="text-sm text-muted-foreground font-mono">{produto.codigo}</p>
                  </div>
                </div>
                <Badge className={getStatusColor(produto)}>
                  {getStatusText(produto)}
                </Badge>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Categoria:</span>
                  <Badge variant="outline">{produto.categoria}</Badge>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Estoque:</span>
                  <div className="text-right">
                    <span className="font-bold text-lg">{produto.estoque}</span>
                    <span className="text-muted-foreground ml-1">(Min: {produto.minimo})</span>
                  </div>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Localização:</span>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {produto.localizacao}
                  </div>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Valor Total:</span>
                  <span className="font-medium">R$ {produto.valorTotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Fornecedor:</span>
                  <span>{produto.fornecedor}</span>
                </div>
              </div>

              <div className="flex justify-between items-center pt-3 border-t">
                <div className="text-xs text-muted-foreground">
                  Última movimentação: {new Date(produto.dataUltimaMovimentacao).toLocaleDateString('pt-BR')}
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm" onClick={() => onDetalhes(produto)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => onHistorico(produto)}>
                    <History className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => onEditar(produto)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  return visualizacao === 'tabela' ? renderTabela() : renderCards();
}