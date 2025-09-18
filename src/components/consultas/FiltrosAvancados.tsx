import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Filter, RotateCcw } from "lucide-react";

interface FiltrosAvancadosProps {
  filtros: any;
  setFiltros: (filtros: any) => void;
  tipoConsulta: string;
  onBuscar: () => void;
  onLimpar: () => void;
}

const categorias = ["Eletrônicos", "Ferramentas", "Móveis", "Materiais", "Outros"];
const fornecedores = ["TechCorp", "ToolMax", "MobiliaCorp", "Outros"];
const status = ["Ativo", "Inativo", "Descontinuado"];
const projetos = ["Escritório Matriz", "Obra Centro", "Filial Norte", "Manutenção Predial"];
const empresas = ["TechSolutions", "ManuCorp", "Construtora ABC", "Outros"];

export function FiltrosAvancados({ filtros, setFiltros, tipoConsulta, onBuscar, onLimpar }: FiltrosAvancadosProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Filtros Avançados
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filtros Gerais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="busca">Busca Geral</Label>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="busca"
                placeholder="Nome, código, descrição..."
                value={filtros.busca}
                onChange={(e) => setFiltros({...filtros, busca: e.target.value})}
                className="pl-10"
              />
            </div>
          </div>

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
        </div>

        {/* Filtros Específicos por Tipo */}
        {tipoConsulta === "produtos" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Categoria</Label>
              <Select value={filtros.categoria} onValueChange={(value) => setFiltros({...filtros, categoria: value})}>
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
              <Select value={filtros.fornecedor} onValueChange={(value) => setFiltros({...filtros, fornecedor: value})}>
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
              <Select value={filtros.statusEstoque} onValueChange={(value) => setFiltros({...filtros, statusEstoque: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos os status</SelectItem>
                  <SelectItem value="ok">Estoque OK</SelectItem>
                  <SelectItem value="baixo">Estoque Baixo</SelectItem>
                  <SelectItem value="zerado">Estoque Zerado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Localização</Label>
              <Input
                placeholder="Ex: A1-B2"
                value={filtros.localizacao}
                onChange={(e) => setFiltros({...filtros, localizacao: e.target.value})}
              />
            </div>
          </div>
        )}

        {tipoConsulta === "movimentacoes" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Tipo de Movimentação</Label>
              <Select value={filtros.tipoMovimentacao} onValueChange={(value) => setFiltros({...filtros, tipoMovimentacao: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os tipos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos os tipos</SelectItem>
                  <SelectItem value="entrada">Entradas</SelectItem>
                  <SelectItem value="saida">Saídas</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Responsável</Label>
              <Input
                placeholder="Nome do responsável"
                value={filtros.responsavel}
                onChange={(e) => setFiltros({...filtros, responsavel: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label>Projeto</Label>
              <Select value={filtros.projeto} onValueChange={(value) => setFiltros({...filtros, projeto: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os projetos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos os projetos</SelectItem>
                  {projetos.map(projeto => (
                    <SelectItem key={projeto} value={projeto}>
                      {projeto}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {tipoConsulta === "fornecedores" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={filtros.statusFornecedor} onValueChange={(value) => setFiltros({...filtros, statusFornecedor: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos os status</SelectItem>
                  <SelectItem value="ativo">Ativo</SelectItem>
                  <SelectItem value="inativo">Inativo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Valor Mínimo</Label>
              <Input
                type="number"
                placeholder="0.00"
                value={filtros.valorMinimo}
                onChange={(e) => setFiltros({...filtros, valorMinimo: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label>Valor Máximo</Label>
              <Input
                type="number"
                placeholder="999999.99"
                value={filtros.valorMaximo}
                onChange={(e) => setFiltros({...filtros, valorMaximo: e.target.value})}
              />
            </div>
          </div>
        )}

        {tipoConsulta === "relatorios" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Período</Label>
              <Select value={filtros.periodo} onValueChange={(value) => setFiltros({...filtros, periodo: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hoje">Hoje</SelectItem>
                  <SelectItem value="semana">Esta Semana</SelectItem>
                  <SelectItem value="mes">Este Mês</SelectItem>
                  <SelectItem value="trimestre">Este Trimestre</SelectItem>
                  <SelectItem value="ano">Este Ano</SelectItem>
                  <SelectItem value="personalizado">Personalizado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Tipo de Relatório</Label>
              <Select value={filtros.tipoRelatorio} onValueChange={(value) => setFiltros({...filtros, tipoRelatorio: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Tipo de relatório" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="estoque">Relatório de Estoque</SelectItem>
                  <SelectItem value="movimentacao">Relatório de Movimentação</SelectItem>
                  <SelectItem value="financeiro">Relatório Financeiro</SelectItem>
                  <SelectItem value="consumo">Relatório de Consumo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Formato</Label>
              <Select value={filtros.formato} onValueChange={(value) => setFiltros({...filtros, formato: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Formato de saída" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="excel">Excel (.xlsx)</SelectItem>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="csv">CSV</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Agrupamento</Label>
              <Select value={filtros.agrupamento} onValueChange={(value) => setFiltros({...filtros, agrupamento: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Agrupar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="categoria">Por Categoria</SelectItem>
                  <SelectItem value="fornecedor">Por Fornecedor</SelectItem>
                  <SelectItem value="projeto">Por Projeto</SelectItem>
                  <SelectItem value="data">Por Data</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {/* Botões de Ação */}
        <div className="flex gap-2 pt-4 border-t">
          <Button onClick={onBuscar} className="gradient-primary">
            <Search className="h-4 w-4 mr-2" />
            Aplicar Filtros
          </Button>
          <Button onClick={onLimpar} variant="outline">
            <RotateCcw className="h-4 w-4 mr-2" />
            Limpar Filtros
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}