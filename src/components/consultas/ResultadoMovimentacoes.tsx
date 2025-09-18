import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, TrendingUp, TrendingDown, Calendar, User, Building2, FileText } from "lucide-react";

interface Movimentacao {
  id: number;
  data: string;
  hora: string;
  tipo: 'entrada' | 'saida';
  produto: string;
  codigo: string;
  quantidade: number;
  responsavel: string;
  documento: string;
  projeto?: string;
  empresa?: string;
  fornecedor?: string;
  destino?: string;
  valorUnitario: number;
  valorTotal: number;
  observacoes?: string;
}

interface ResultadoMovimentacoesProps {
  movimentacoes: Movimentacao[];
  onDetalhes: (movimentacao: Movimentacao) => void;
}

export function ResultadoMovimentacoes({ movimentacoes, onDetalhes }: ResultadoMovimentacoesProps) {
  const calcularResumo = () => {
    const totalEntradas = movimentacoes.filter(m => m.tipo === 'entrada').length;
    const totalSaidas = movimentacoes.filter(m => m.tipo === 'saida').length;
    const valorEntradas = movimentacoes
      .filter(m => m.tipo === 'entrada')
      .reduce((acc, m) => acc + m.valorTotal, 0);
    const valorSaidas = movimentacoes
      .filter(m => m.tipo === 'saida')
      .reduce((acc, m) => acc + m.valorTotal, 0);

    return { totalEntradas, totalSaidas, valorEntradas, valorSaidas };
  };

  const resumo = calcularResumo();

  return (
    <div className="space-y-6">
      {/* Resumo das Movimentações */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-entry/20 bg-gradient-to-br from-entry/5 to-entry/10">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-8 w-8 text-entry" />
              <div>
                <p className="text-2xl font-bold">{resumo.totalEntradas}</p>
                <p className="text-sm text-muted-foreground">Total de Entradas</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-exit/20 bg-gradient-to-br from-exit/5 to-exit/10">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <TrendingDown className="h-8 w-8 text-exit" />
              <div>
                <p className="text-2xl font-bold">{resumo.totalSaidas}</p>
                <p className="text-sm text-muted-foreground">Total de Saídas</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-8 w-8 text-primary" />
              <div>
                <p className="text-lg font-bold">R$ {resumo.valorEntradas.toFixed(2)}</p>
                <p className="text-sm text-muted-foreground">Valor Entradas</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-muted bg-gradient-to-br from-muted/5 to-muted/10">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <TrendingDown className="h-8 w-8 text-muted-foreground" />
              <div>
                <p className="text-lg font-bold">R$ {resumo.valorSaidas.toFixed(2)}</p>
                <p className="text-sm text-muted-foreground">Valor Saídas</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Movimentações */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>
              Movimentações Encontradas ({movimentacoes.length})
            </CardTitle>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-1" />
              Exportar Excel
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {movimentacoes.map((mov) => (
              <div 
                key={mov.id} 
                className={`border rounded-lg p-4 transition-smooth hover:shadow-medium cursor-pointer ${
                  mov.tipo === "entrada" 
                    ? "border-entry/20 bg-gradient-to-r from-entry/5 to-transparent hover:from-entry/10" 
                    : "border-exit/20 bg-gradient-to-r from-exit/5 to-transparent hover:from-exit/10"
                }`}
                onClick={() => onDetalhes(mov)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${
                      mov.tipo === "entrada" ? "bg-entry" : "bg-exit"
                    }`}></div>
                    <div>
                      <h4 className="font-semibold">{mov.produto}</h4>
                      <p className="text-sm text-muted-foreground font-mono">
                        {mov.codigo}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          {new Date(mov.data).toLocaleDateString('pt-BR')} às {mov.hora}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className={
                      mov.tipo === "entrada" 
                        ? "bg-entry text-entry-foreground" 
                        : "bg-exit text-exit-foreground"
                    }>
                      {mov.tipo === "entrada" ? "+" : "-"}{mov.quantidade} unidades
                    </Badge>
                    <p className="text-sm font-medium mt-1">
                      R$ {mov.valorTotal.toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Responsável:</span>
                    <p className="font-medium flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {mov.responsavel}
                    </p>
                  </div>
                  
                  <div>
                    <span className="text-muted-foreground">Documento:</span>
                    <p className="font-medium flex items-center gap-1">
                      <FileText className="h-3 w-3" />
                      {mov.documento}
                    </p>
                  </div>

                  {mov.projeto && (
                    <div>
                      <span className="text-muted-foreground">Projeto:</span>
                      <p className="font-medium flex items-center gap-1">
                        <Building2 className="h-3 w-3" />
                        {mov.projeto}
                      </p>
                    </div>
                  )}

                  {mov.fornecedor && (
                    <div>
                      <span className="text-muted-foreground">Fornecedor:</span>
                      <p className="font-medium">{mov.fornecedor}</p>
                    </div>
                  )}

                  {mov.empresa && (
                    <div>
                      <span className="text-muted-foreground">Empresa:</span>
                      <p className="font-medium">{mov.empresa}</p>
                    </div>
                  )}

                  {mov.destino && (
                    <div>
                      <span className="text-muted-foreground">Destino:</span>
                      <p className="font-medium">{mov.destino}</p>
                    </div>
                  )}

                  <div>
                    <span className="text-muted-foreground">Valor Unitário:</span>
                    <p className="font-medium">R$ {mov.valorUnitario.toFixed(2)}</p>
                  </div>
                </div>

                {mov.observacoes && (
                  <div className="mt-3 pt-3 border-t border-opacity-20">
                    <span className="text-muted-foreground text-sm">Observações:</span>
                    <p className="text-sm mt-1">{mov.observacoes}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}