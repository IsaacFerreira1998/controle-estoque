import * as XLSX from 'xlsx';

// Tipos para os dados
export interface ProdutoExcel {
  codigo: string;
  nome: string;
  categoria: string;
  fornecedor: string;
  localizacao: string;
  estoque: number;
  estoqueMinimo: number;
  valorUnitario: number;
  valorTotal: number;
  status: string;
  ultimaAtualizacao: string;
}

export interface MovimentacaoExcel {
  data: string;
  tipo: string;
  produto: string;
  quantidade: number;
  responsavel: string;
  projeto: string;
  empresa: string;
  observacoes: string;
  valorUnitario: number;
  valorTotal: number;
}

export interface DashboardExcel {
  totalProdutos: number;
  valorTotalEstoque: number;
  produtos: ProdutoExcel[];
  movimentacoes: MovimentacaoExcel[];
  estatisticas: {
    categoria: string;
    quantidade: number;
    valor: number;
  }[];
}

// Função para criar planilha com visual BI
export const exportToExcelBI = (data: DashboardExcel, nomeArquivo: string = 'EstoqueMax_BI') => {
  const wb = XLSX.utils.book_new();

  // 1. ABA DASHBOARD - Visual BI
  const dashboardData = [
    ['ESTOQUEMAX - BUSINESS INTELLIGENCE', '', '', '', '', '', ''],
    ['', '', '', '', '', '', ''],
    ['RESUMO EXECUTIVO', '', '', '', '', '', ''],
    ['Total de Produtos:', data.totalProdutos, '', '', 'Valor Total do Estoque:', `R$ ${data.valorTotalEstoque.toFixed(2)}`, ''],
    ['Data do Relatório:', new Date().toLocaleDateString('pt-BR'), '', '', 'Última Atualização:', new Date().toLocaleString('pt-BR'), ''],
    ['', '', '', '', '', '', ''],
    ['ANÁLISE POR CATEGORIA', '', '', '', '', '', ''],
    ['Categoria', 'Qtd Produtos', 'Valor Total', '% do Estoque', 'Status', 'Observações', ''],
    ...data.estatisticas.map(stat => [
      stat.categoria,
      stat.quantidade,
      `R$ ${stat.valor.toFixed(2)}`,
      `${((stat.valor / data.valorTotalEstoque) * 100).toFixed(1)}%`,
      stat.quantidade > 0 ? 'ATIVO' : 'INATIVO',
      stat.quantidade < 5 ? 'ATENÇÃO: Poucos itens' : 'Normal'
    ])
  ];

  const wsDashboard = XLSX.utils.aoa_to_sheet(dashboardData);
  
  // Styling para dashboard
  wsDashboard['!merges'] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: 6 } }, // Título principal
    { s: { r: 2, c: 0 }, e: { r: 2, c: 6 } }, // Resumo executivo
    { s: { r: 6, c: 0 }, e: { r: 6, c: 6 } }  // Análise por categoria
  ];

  wsDashboard['!cols'] = [
    { width: 20 }, { width: 15 }, { width: 15 }, { width: 12 }, { width: 12 }, { width: 20 }, { width: 15 }
  ];

  XLSX.utils.book_append_sheet(wb, wsDashboard, '📊 Dashboard');

  // 2. ABA PRODUTOS DETALHADA
  const produtosHeader = [
    'Código', 'Nome do Produto', 'Categoria', 'Fornecedor', 'Localização',
    'Estoque Atual', 'Estoque Mínimo', 'Status Estoque', 'Valor Unitário',
    'Valor Total', 'Última Atualização', 'Observações'
  ];

  const produtosData = [
    produtosHeader,
    ...data.produtos.map(produto => [
      produto.codigo,
      produto.nome,
      produto.categoria,
      produto.fornecedor,
      produto.localizacao,
      produto.estoque,
      produto.estoqueMinimo,
      produto.estoque <= produto.estoqueMinimo ? 'CRÍTICO' : produto.estoque <= produto.estoqueMinimo * 1.5 ? 'BAIXO' : 'OK',
      `R$ ${produto.valorUnitario.toFixed(2)}`,
      `R$ ${produto.valorTotal.toFixed(2)}`,
      produto.ultimaAtualizacao,
      produto.estoque <= produto.estoqueMinimo ? 'REPOSIÇÃO NECESSÁRIA' : ''
    ])
  ];

  const wsProdutos = XLSX.utils.aoa_to_sheet(produtosData);
  wsProdutos['!cols'] = Array(12).fill({ width: 15 });
  
  // Aplicar filtros automáticos
  wsProdutos['!autofilter'] = { ref: `A1:L${produtosData.length}` };
  
  XLSX.utils.book_append_sheet(wb, wsProdutos, '📦 Produtos');

  // 3. ABA MOVIMENTAÇÕES
  const movimentacoesHeader = [
    'Data', 'Tipo', 'Produto', 'Quantidade', 'Responsável',
    'Projeto', 'Empresa', 'Valor Unitário', 'Valor Total', 'Observações'
  ];

  const movimentacoesData = [
    movimentacoesHeader,
    ...data.movimentacoes.map(mov => [
      mov.data,
      mov.tipo,
      mov.produto,
      mov.quantidade,
      mov.responsavel,
      mov.projeto,
      mov.empresa,
      `R$ ${mov.valorUnitario.toFixed(2)}`,
      `R$ ${mov.valorTotal.toFixed(2)}`,
      mov.observacoes
    ])
  ];

  const wsMovimentacoes = XLSX.utils.aoa_to_sheet(movimentacoesData);
  wsMovimentacoes['!cols'] = Array(10).fill({ width: 15 });
  wsMovimentacoes['!autofilter'] = { ref: `A1:J${movimentacoesData.length}` };
  
  XLSX.utils.book_append_sheet(wb, wsMovimentacoes, '🔄 Movimentações');

  // 4. ABA ANÁLISES AVANÇADAS
  const analiseData = [
    ['ANÁLISES AVANÇADAS - ESTOQUEMAX', '', '', '', ''],
    ['', '', '', '', ''],
    ['TOP 10 PRODUTOS POR VALOR', '', '', '', ''],
    ['Posição', 'Produto', 'Categoria', 'Valor Total', 'Participação %'],
    ...data.produtos
      .sort((a, b) => b.valorTotal - a.valorTotal)
      .slice(0, 10)
      .map((produto, index) => [
        `${index + 1}º`,
        produto.nome,
        produto.categoria,
        `R$ ${produto.valorTotal.toFixed(2)}`,
        `${((produto.valorTotal / data.valorTotalEstoque) * 100).toFixed(2)}%`
      ]),
    ['', '', '', '', ''],
    ['PRODUTOS EM SITUAÇÃO CRÍTICA', '', '', '', ''],
    ['Produto', 'Estoque Atual', 'Estoque Mínimo', 'Diferença', 'Ação Necessária'],
    ...data.produtos
      .filter(produto => produto.estoque <= produto.estoqueMinimo)
      .map(produto => [
        produto.nome,
        produto.estoque,
        produto.estoqueMinimo,
        produto.estoque - produto.estoqueMinimo,
        'REPOSIÇÃO URGENTE'
      ])
  ];

  const wsAnalise = XLSX.utils.aoa_to_sheet(analiseData);
  wsAnalise['!cols'] = Array(5).fill({ width: 20 });
  wsAnalise['!merges'] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: 4 } },
    { s: { r: 2, c: 0 }, e: { r: 2, c: 4 } }
  ];
  
  XLSX.utils.book_append_sheet(wb, wsAnalise, '📈 Análises');

  // 5. ABA GRÁFICOS (dados para gráficos)
  const graficosData = [
    ['DADOS PARA GRÁFICOS', '', '', ''],
    ['', '', '', ''],
    ['ESTOQUE POR CATEGORIA', '', '', ''],
    ['Categoria', 'Quantidade', 'Valor', 'Percentual'],
    ...data.estatisticas.map(stat => [
      stat.categoria,
      stat.quantidade,
      stat.valor,
      `${((stat.valor / data.valorTotalEstoque) * 100).toFixed(1)}%`
    ]),
    ['', '', '', ''],
    ['MOVIMENTAÇÕES POR MÊS', '', '', ''],
    ['Mês', 'Entradas', 'Saídas', 'Saldo'],
    // Aqui você pode adicionar dados de movimentações por mês
  ];

  const wsGraficos = XLSX.utils.aoa_to_sheet(graficosData);
  wsGraficos['!cols'] = Array(4).fill({ width: 15 });
  
  XLSX.utils.book_append_sheet(wb, wsGraficos, '📊 Dados Gráficos');

  // Salvar arquivo
  const fileName = `${nomeArquivo}_${new Date().toISOString().split('T')[0]}.xlsx`;
  XLSX.writeFile(wb, fileName);
  
  return fileName;
};

// Função para exportar produtos simples
export const exportProdutosToExcel = (produtos: ProdutoExcel[]) => {
  const ws = XLSX.utils.json_to_sheet(produtos);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Produtos');
  
  const fileName = `Produtos_${new Date().toISOString().split('T')[0]}.xlsx`;
  XLSX.writeFile(wb, fileName);
  return fileName;
};

// Função para exportar movimentações simples
export const exportMovimentacoesToExcel = (movimentacoes: MovimentacaoExcel[]) => {
  const ws = XLSX.utils.json_to_sheet(movimentacoes);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Movimentações');
  
  const fileName = `Movimentacoes_${new Date().toISOString().split('T')[0]}.xlsx`;
  XLSX.writeFile(wb, fileName);
  return fileName;
};