import * as XLSX from 'xlsx';

// ─── Tipos ───────────────────────────────────────────────────────────────────

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
  codigo?: string;
  quantidade: number;
  responsavel: string;
  projeto?: string;
  empresa?: string;
  fornecedor?: string;
  notaFiscal?: string;
  destino?: string;
  observacoes?: string;
  valorUnitario?: number;
  valorTotal?: number;
}

export interface DashboardExcel {
  totalProdutos: number;
  valorTotalEstoque: number;
  produtos: ProdutoExcel[];
  movimentacoes: MovimentacaoExcel[];
  estatisticas: { categoria: string; quantidade: number; valor: number }[];
}

// ─── Leitura de dados reais do localStorage ───────────────────────────────────

export function lerProdutosDoStorage(): ProdutoExcel[] {
  try {
    const raw = localStorage.getItem('estoquemax-produtos');
    if (!raw) return [];
    const produtos = JSON.parse(raw);
    return produtos.map((p: any) => ({
      codigo: p.codigo ?? '',
      nome: p.nome ?? '',
      categoria: p.categoria ?? '',
      fornecedor: p.fornecedor ?? '',
      localizacao: p.localizacao ?? '',
      estoque: Number(p.estoque ?? 0),
      estoqueMinimo: Number(p.minimo ?? 0),
      valorUnitario: Number(p.preco ?? 0),
      valorTotal: Number(p.estoque ?? 0) * Number(p.preco ?? 0),
      status: Number(p.estoque) <= Number(p.minimo) ? 'CRÍTICO' : 'OK',
      ultimaAtualizacao: new Date().toLocaleDateString('pt-BR'),
    }));
  } catch {
    return [];
  }
}

export function lerEntradasDoStorage(): MovimentacaoExcel[] {
  try {
    const raw = localStorage.getItem('estoquemax-entradas');
    if (!raw) return [];
    const entradas = JSON.parse(raw);
    return entradas.map((e: any) => ({
      data: e.data ?? '',
      tipo: 'Entrada',
      produto: e.produto ?? '',
      codigo: e.codigo ?? '',
      quantidade: Number(e.quantidade ?? 0),
      responsavel: e.responsavel ?? '',
      fornecedor: e.fornecedor ?? '',
      notaFiscal: e.notaFiscal ?? '',
      destino: e.destino ?? '',
      observacoes: e.observacoes ?? '',
      valorUnitario: 0,
      valorTotal: 0,
    }));
  } catch {
    return [];
  }
}

export function lerSaidasDoStorage(): MovimentacaoExcel[] {
  try {
    const raw = localStorage.getItem('estoquemax-saidas');
    if (!raw) return [];
    const saidas = JSON.parse(raw);
    return saidas.map((s: any) => ({
      data: `${s.data ?? ''} ${s.hora ?? ''}`.trim(),
      tipo: 'Saída',
      produto: s.produto ?? '',
      codigo: s.codigo ?? '',
      quantidade: Number(s.quantidade ?? 0),
      responsavel: s.responsavel ?? '',
      projeto: s.projeto ?? '',
      empresa: s.empresa ?? '',
      destino: s.destino ?? '',
      observacoes: s.observacoes ?? '',
      valorUnitario: 0,
      valorTotal: 0,
    }));
  } catch {
    return [];
  }
}

export function montarDashboardExcel(): DashboardExcel {
  const produtos = lerProdutosDoStorage();
  const entradas = lerEntradasDoStorage();
  const saidas = lerSaidasDoStorage();
  const movimentacoes = [...entradas, ...saidas].sort((a, b) =>
    b.data.localeCompare(a.data)
  );

  const valorTotal = produtos.reduce((acc, p) => acc + p.valorTotal, 0);

  // Agrupar por categoria
  const porCategoria = produtos.reduce((acc, p) => {
    if (!acc[p.categoria]) acc[p.categoria] = { quantidade: 0, valor: 0 };
    acc[p.categoria].quantidade += p.estoque;
    acc[p.categoria].valor += p.valorTotal;
    return acc;
  }, {} as Record<string, { quantidade: number; valor: number }>);

  const estatisticas = Object.entries(porCategoria).map(([categoria, dados]) => ({
    categoria,
    quantidade: dados.quantidade,
    valor: dados.valor,
  }));

  return {
    totalProdutos: produtos.length,
    valorTotalEstoque: valorTotal,
    produtos,
    movimentacoes,
    estatisticas,
  };
}

// ─── Exportação Excel BI completo ─────────────────────────────────────────────

export const exportToExcelBI = (data: DashboardExcel, nomeArquivo: string = 'EstoqueMax_BI') => {
  const wb = XLSX.utils.book_new();
  const hoje = new Date().toLocaleDateString('pt-BR');
  const hojeISO = new Date().toISOString().split('T')[0];

  // 1. DASHBOARD
  const dashboardData = [
    ['ESTOQUEMAX — SISTEMA DE CONTROLE DE ESTOQUE', '', '', '', '', ''],
    ['Relatório gerado em: ' + hoje, '', '', '', '', ''],
    ['', '', '', '', '', ''],
    ['RESUMO EXECUTIVO', '', '', '', '', ''],
    ['Total de Produtos Cadastrados', data.totalProdutos, '', '', '', ''],
    ['Valor Total do Estoque', `R$ ${data.valorTotalEstoque.toFixed(2)}`, '', '', '', ''],
    ['Total de Movimentações', data.movimentacoes.length, '', '', '', ''],
    ['Produtos em Situação Crítica', data.produtos.filter(p => p.status === 'CRÍTICO').length, '', '', '', ''],
    ['', '', '', '', '', ''],
    ['DISTRIBUIÇÃO POR CATEGORIA', '', '', '', '', ''],
    ['Categoria', 'Qtd em Estoque', 'Valor Total (R$)', '% do Estoque Total', '', ''],
    ...data.estatisticas.map(s => [
      s.categoria,
      s.quantidade,
      s.valor.toFixed(2),
      data.valorTotalEstoque > 0
        ? `${((s.valor / data.valorTotalEstoque) * 100).toFixed(1)}%`
        : '0%',
      '',
      '',
    ]),
  ];
  const wsDash = XLSX.utils.aoa_to_sheet(dashboardData);
  wsDash['!cols'] = [{ width: 35 }, { width: 20 }, { width: 20 }, { width: 20 }, { width: 15 }, { width: 15 }];
  wsDash['!merges'] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: 5 } },
    { s: { r: 3, c: 0 }, e: { r: 3, c: 5 } },
    { s: { r: 9, c: 0 }, e: { r: 9, c: 5 } },
  ];
  XLSX.utils.book_append_sheet(wb, wsDash, 'Dashboard');

  // 2. PRODUTOS
  const produtosHeader = [
    'Código', 'Nome do Produto', 'Categoria', 'Fornecedor', 'Localização',
    'Estoque Atual', 'Estoque Mínimo', 'Status', 'Valor Unitário (R$)', 'Valor Total (R$)', 'Observação',
  ];
  const produtosRows = data.produtos.map(p => [
    p.codigo, p.nome, p.categoria, p.fornecedor, p.localizacao,
    p.estoque, p.estoqueMinimo, p.status,
    p.valorUnitario.toFixed(2), p.valorTotal.toFixed(2),
    p.estoque <= p.estoqueMinimo ? 'REPOSIÇÃO NECESSÁRIA' : '',
  ]);
  const wsProdutos = XLSX.utils.aoa_to_sheet([produtosHeader, ...produtosRows]);
  wsProdutos['!cols'] = Array(11).fill({ width: 18 });
  wsProdutos['!autofilter'] = { ref: `A1:K${produtosRows.length + 1}` };
  XLSX.utils.book_append_sheet(wb, wsProdutos, 'Produtos');

  // 3. ENTRADAS
  const entradasData = lerEntradasDoStorage();
  const entradasHeader = ['Data', 'Produto', 'Código', 'Quantidade', 'Fornecedor', 'Nota Fiscal', 'Responsável', 'Destino', 'Observações'];
  const entradasRows = entradasData.map(e => [
    e.data, e.produto, e.codigo ?? '', e.quantidade,
    e.fornecedor ?? '', e.notaFiscal ?? '', e.responsavel, e.destino ?? '', e.observacoes ?? '',
  ]);
  const wsEntradas = XLSX.utils.aoa_to_sheet([entradasHeader, ...entradasRows]);
  wsEntradas['!cols'] = Array(9).fill({ width: 18 });
  wsEntradas['!autofilter'] = { ref: `A1:I${entradasRows.length + 1}` };
  XLSX.utils.book_append_sheet(wb, wsEntradas, 'Entradas');

  // 4. SAÍDAS
  const saidasData = lerSaidasDoStorage();
  const saidasHeader = ['Data/Hora', 'Produto', 'Código', 'Quantidade', 'Responsável', 'Projeto', 'Empresa', 'Destino', 'Observações'];
  const saidasRows = saidasData.map(s => [
    s.data, s.produto, s.codigo ?? '', s.quantidade,
    s.responsavel, s.projeto ?? '', s.empresa ?? '', s.destino ?? '', s.observacoes ?? '',
  ]);
  const wsSaidas = XLSX.utils.aoa_to_sheet([saidasHeader, ...saidasRows]);
  wsSaidas['!cols'] = Array(9).fill({ width: 18 });
  wsSaidas['!autofilter'] = { ref: `A1:I${saidasRows.length + 1}` };
  XLSX.utils.book_append_sheet(wb, wsSaidas, 'Saídas');

  // 5. ANÁLISES
  const criticos = data.produtos.filter(p => p.estoque <= p.estoqueMinimo);
  const topValor = [...data.produtos].sort((a, b) => b.valorTotal - a.valorTotal).slice(0, 10);
  const analiseData = [
    ['ANÁLISES ESTOQUEMAX', '', '', '', ''],
    [''],
    ['TOP PRODUTOS POR VALOR EM ESTOQUE', '', '', '', ''],
    ['#', 'Produto', 'Categoria', 'Valor Total (R$)', 'Participação %'],
    ...topValor.map((p, i) => [
      `${i + 1}º`, p.nome, p.categoria, p.valorTotal.toFixed(2),
      data.valorTotalEstoque > 0 ? `${((p.valorTotal / data.valorTotalEstoque) * 100).toFixed(2)}%` : '0%',
    ]),
    [''],
    ['PRODUTOS COM REPOSIÇÃO NECESSÁRIA', '', '', '', ''],
    ['Produto', 'Estoque Atual', 'Estoque Mínimo', 'Faltam', 'Ação'],
    ...criticos.map(p => [p.nome, p.estoque, p.estoqueMinimo, p.estoqueMinimo - p.estoque, 'COMPRAR URGENTE']),
    criticos.length === 0 ? ['Nenhum produto crítico', '', '', '', ''] : [],
  ].filter(r => r.length > 0);
  const wsAnalise = XLSX.utils.aoa_to_sheet(analiseData);
  wsAnalise['!cols'] = Array(5).fill({ width: 25 });
  XLSX.utils.book_append_sheet(wb, wsAnalise, 'Analises');

  const fileName = `${nomeArquivo}_${hojeISO}.xlsx`;
  XLSX.writeFile(wb, fileName);
  return fileName;
};

// ─── Exportação individual por tipo ──────────────────────────────────────────

export const exportarProdutosExcel = (nomeArquivo = 'Produtos_EstoqueMax') => {
  const produtos = lerProdutosDoStorage();
  const header = ['Código', 'Nome', 'Categoria', 'Fornecedor', 'Localização', 'Estoque', 'Estoque Mínimo', 'Status', 'Valor Unitário (R$)', 'Valor Total (R$)'];
  const rows = produtos.map(p => [p.codigo, p.nome, p.categoria, p.fornecedor, p.localizacao, p.estoque, p.estoqueMinimo, p.status, p.valorUnitario.toFixed(2), p.valorTotal.toFixed(2)]);
  const ws = XLSX.utils.aoa_to_sheet([header, ...rows]);
  ws['!cols'] = Array(10).fill({ width: 18 });
  ws['!autofilter'] = { ref: `A1:J${rows.length + 1}` };
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Produtos');
  const fileName = `${nomeArquivo}_${new Date().toISOString().split('T')[0]}.xlsx`;
  XLSX.writeFile(wb, fileName);
  return fileName;
};

export const exportarEntradasExcel = (nomeArquivo = 'Entradas_EstoqueMax') => {
  const entradas = lerEntradasDoStorage();
  const header = ['Data', 'Produto', 'Código', 'Quantidade', 'Fornecedor', 'NF', 'Responsável', 'Destino', 'Obs'];
  const rows = entradas.map(e => [e.data, e.produto, e.codigo ?? '', e.quantidade, e.fornecedor ?? '', e.notaFiscal ?? '', e.responsavel, e.destino ?? '', e.observacoes ?? '']);
  const ws = XLSX.utils.aoa_to_sheet([header, ...rows]);
  ws['!cols'] = Array(9).fill({ width: 18 });
  ws['!autofilter'] = { ref: `A1:I${rows.length + 1}` };
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Entradas');
  const fileName = `${nomeArquivo}_${new Date().toISOString().split('T')[0]}.xlsx`;
  XLSX.writeFile(wb, fileName);
  return fileName;
};

export const exportarSaidasExcel = (nomeArquivo = 'Saidas_EstoqueMax') => {
  const saidas = lerSaidasDoStorage();
  const header = ['Data/Hora', 'Produto', 'Código', 'Quantidade', 'Responsável', 'Projeto', 'Empresa', 'Destino', 'Obs'];
  const rows = saidas.map(s => [s.data, s.produto, s.codigo ?? '', s.quantidade, s.responsavel, s.projeto ?? '', s.empresa ?? '', s.destino ?? '', s.observacoes ?? '']);
  const ws = XLSX.utils.aoa_to_sheet([header, ...rows]);
  ws['!cols'] = Array(9).fill({ width: 18 });
  ws['!autofilter'] = { ref: `A1:I${rows.length + 1}` };
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Saídas');
  const fileName = `${nomeArquivo}_${new Date().toISOString().split('T')[0]}.xlsx`;
  XLSX.writeFile(wb, fileName);
  return fileName;
};

export const exportarMovimentacoesExcel = (nomeArquivo = 'Movimentacoes_EstoqueMax') => {
  const entradas = lerEntradasDoStorage();
  const saidas = lerSaidasDoStorage();
  const tudo = [...entradas, ...saidas].sort((a, b) => b.data.localeCompare(a.data));
  const header = ['Data', 'Tipo', 'Produto', 'Código', 'Quantidade', 'Responsável', 'Fornecedor/Projeto', 'Empresa', 'Destino', 'Observações'];
  const rows = tudo.map(m => [
    m.data, m.tipo, m.produto, m.codigo ?? '', m.quantidade, m.responsavel,
    m.fornecedor ?? m.projeto ?? '', m.empresa ?? '', m.destino ?? '', m.observacoes ?? '',
  ]);
  const ws = XLSX.utils.aoa_to_sheet([header, ...rows]);
  ws['!cols'] = Array(10).fill({ width: 18 });
  ws['!autofilter'] = { ref: `A1:J${rows.length + 1}` };
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Movimentações');
  const fileName = `${nomeArquivo}_${new Date().toISOString().split('T')[0]}.xlsx`;
  XLSX.writeFile(wb, fileName);
  return fileName;
};

// ─── Exportação Power BI (CSV) ────────────────────────────────────────────────

function gerarCSV(header: string[], rows: (string | number)[][]): string {
  const escapar = (val: string | number) => {
    const s = String(val ?? '');
    return s.includes(',') || s.includes('"') || s.includes('\n')
      ? `"${s.replace(/"/g, '""')}"`
      : s;
  };
  const linhas = [header, ...rows].map(r => r.map(escapar).join(','));
  return '\uFEFF' + linhas.join('\r\n'); // BOM UTF-8 para Excel/Power BI ler corretamente
}

function baixarCSV(conteudo: string, nomeArquivo: string) {
  const blob = new Blob([conteudo], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = nomeArquivo;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export const exportarPowerBIProdutos = () => {
  const produtos = lerProdutosDoStorage();
  const header = ['Codigo', 'Nome', 'Categoria', 'Fornecedor', 'Localizacao', 'Estoque', 'EstoqueMinimo', 'Status', 'ValorUnitario', 'ValorTotal', 'DataExportacao'];
  const hoje = new Date().toLocaleDateString('pt-BR');
  const rows = produtos.map(p => [p.codigo, p.nome, p.categoria, p.fornecedor, p.localizacao, p.estoque, p.estoqueMinimo, p.status, p.valorUnitario, p.valorTotal, hoje]);
  const csv = gerarCSV(header, rows);
  baixarCSV(csv, `PowerBI_Produtos_${new Date().toISOString().split('T')[0]}.csv`);
  return rows.length;
};

export const exportarPowerBIEntradas = () => {
  const entradas = lerEntradasDoStorage();
  const header = ['Data', 'Produto', 'Codigo', 'Quantidade', 'Fornecedor', 'NotaFiscal', 'Responsavel', 'Destino', 'Observacoes', 'Tipo'];
  const rows = entradas.map(e => [e.data, e.produto, e.codigo ?? '', e.quantidade, e.fornecedor ?? '', e.notaFiscal ?? '', e.responsavel, e.destino ?? '', e.observacoes ?? '', 'Entrada']);
  const csv = gerarCSV(header, rows);
  baixarCSV(csv, `PowerBI_Entradas_${new Date().toISOString().split('T')[0]}.csv`);
  return rows.length;
};

export const exportarPowerBISaidas = () => {
  const saidas = lerSaidasDoStorage();
  const header = ['DataHora', 'Produto', 'Codigo', 'Quantidade', 'Responsavel', 'Projeto', 'Empresa', 'Destino', 'Observacoes', 'Tipo'];
  const rows = saidas.map(s => [s.data, s.produto, s.codigo ?? '', s.quantidade, s.responsavel, s.projeto ?? '', s.empresa ?? '', s.destino ?? '', s.observacoes ?? '', 'Saida']);
  const csv = gerarCSV(header, rows);
  baixarCSV(csv, `PowerBI_Saidas_${new Date().toISOString().split('T')[0]}.csv`);
  return rows.length;
};

export const exportarPowerBICompleto = () => {
  const entradas = lerEntradasDoStorage();
  const saidas = lerSaidasDoStorage();
  const movs = [
    ...entradas.map(e => ({ ...e, tipo: 'Entrada', projeto: '', empresa: '' })),
    ...saidas.map(s => ({ ...s, tipo: 'Saida', fornecedor: '', notaFiscal: '' })),
  ].sort((a, b) => b.data.localeCompare(a.data));

  const header = ['DataHora', 'Tipo', 'Produto', 'Codigo', 'Quantidade', 'Responsavel', 'Fornecedor', 'NotaFiscal', 'Projeto', 'Empresa', 'Destino', 'Observacoes'];
  const rows = movs.map(m => [
    m.data, m.tipo, m.produto, m.codigo ?? '', m.quantidade, m.responsavel,
    m.fornecedor ?? '', m.notaFiscal ?? '', m.projeto ?? '', m.empresa ?? '', m.destino ?? '', m.observacoes ?? '',
  ]);
  const csv = gerarCSV(header, rows);
  baixarCSV(csv, `PowerBI_Movimentacoes_${new Date().toISOString().split('T')[0]}.csv`);
  return rows.length;
};

// legacy compat
export const exportProdutosToExcel = exportarProdutosExcel;
export const exportMovimentacoesToExcel = exportarMovimentacoesExcel;