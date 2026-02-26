/**
 * storageUtils.ts
 * Funções centrais de leitura/escrita do localStorage.
 * Garante que Entradas e Saidas SEMPRE atualizem o estoque atual dos produtos.
 */

export const KEYS = {
    produtos: "estoquemax-produtos",
    entradas: "estoquemax-entradas",
    saidas: "estoquemax-saidas",
    config: "estoquemax-config",
};

// ─── Leitura ──────────────────────────────────────────────────────────────────

export function lerProdutos(): any[] {
    try { return JSON.parse(localStorage.getItem(KEYS.produtos) ?? "[]"); } catch { return []; }
}

export function lerEntradas(): any[] {
    try { return JSON.parse(localStorage.getItem(KEYS.entradas) ?? "[]"); } catch { return []; }
}

export function lerSaidas(): any[] {
    try { return JSON.parse(localStorage.getItem(KEYS.saidas) ?? "[]"); } catch { return []; }
}

export function lerConfig(): any {
    try { return JSON.parse(localStorage.getItem(KEYS.config) ?? "{}"); } catch { return {}; }
}

// ─── Escrita ─────────────────────────────────────────────────────────────────

export function salvarProdutos(lista: any[]) {
    localStorage.setItem(KEYS.produtos, JSON.stringify(lista));
}

export function salvarEntradas(lista: any[]) {
    localStorage.setItem(KEYS.entradas, JSON.stringify(lista));
}

export function salvarSaidas(lista: any[]) {
    localStorage.setItem(KEYS.saidas, JSON.stringify(lista));
}

// ─── OPERAÇÕES COM IMPACTO NO ESTOQUE ────────────────────────────────────────

/**
 * Registra uma entrada e soma a quantidade ao estoque do produto.
 */
export function registrarEntrada(entrada: any): { ok: boolean; msg: string } {
    const produtos = lerProdutos();
    const idx = produtos.findIndex(
        (p: any) => p.codigo === entrada.codigo || p.nome === entrada.produto
    );

    if (idx === -1 && entrada.codigo) {
        return { ok: false, msg: `Produto "${entrada.produto}" não encontrado no cadastro.` };
    }

    // Atualiza estoque
    if (idx !== -1) {
        produtos[idx].estoque = Number(produtos[idx].estoque ?? 0) + Number(entrada.quantidade);
        salvarProdutos(produtos);
    }

    // Salva registro de entrada
    const entradas = lerEntradas();
    entradas.unshift({ ...entrada, id: Date.now() });
    salvarEntradas(entradas);

    return { ok: true, msg: `✅ ${entrada.quantidade} unidades de "${entrada.produto}" adicionadas ao estoque.` };
}

/**
 * Registra uma saída e subtrai a quantidade do estoque do produto.
 * Bloqueia se não houver estoque suficiente.
 */
export function registrarSaida(saida: any): { ok: boolean; msg: string } {
    const produtos = lerProdutos();
    const idx = produtos.findIndex(
        (p: any) => p.codigo === saida.codigo || p.nome === saida.produto
    );

    if (idx === -1) {
        return { ok: false, msg: `Produto "${saida.produto}" não encontrado no cadastro.` };
    }

    const estoqueAtual = Number(produtos[idx].estoque ?? 0);
    if (saida.quantidade > estoqueAtual) {
        return {
            ok: false,
            msg: `Estoque insuficiente! Disponível: ${estoqueAtual} — Solicitado: ${saida.quantidade}`,
        };
    }

    // Subtrai estoque
    produtos[idx].estoque = estoqueAtual - Number(saida.quantidade);
    salvarProdutos(produtos);

    // Salva registro de saída
    const saidas = lerSaidas();
    saidas.unshift({ ...saida, id: Date.now() });
    salvarSaidas(saidas);

    return {
        ok: true,
        msg: `✅ ${saida.quantidade} unidades de "${saida.produto}" retiradas. Novo estoque: ${produtos[idx].estoque}`,
    };
}

/**
 * Desfaz uma entrada: subtrai a quantidade do estoque do produto.
 */
export function desfazerEntrada(entradaId: number): void {
    const entradas = lerEntradas();
    const entrada = entradas.find((e: any) => e.id === entradaId);
    if (entrada) {
        const produtos = lerProdutos();
        const idx = produtos.findIndex((p: any) => p.codigo === entrada.codigo || p.nome === entrada.produto);
        if (idx !== -1) {
            produtos[idx].estoque = Math.max(0, Number(produtos[idx].estoque ?? 0) - Number(entrada.quantidade));
            salvarProdutos(produtos);
        }
    }
    salvarEntradas(entradas.filter((e: any) => e.id !== entradaId));
}

/**
 * Desfaz uma saída: devolve a quantidade ao estoque do produto.
 */
export function desfazerSaida(saidaId: number): void {
    const saidas = lerSaidas();
    const saida = saidas.find((s: any) => s.id === saidaId);
    if (saida) {
        const produtos = lerProdutos();
        const idx = produtos.findIndex((p: any) => p.codigo === saida.codigo || p.nome === saida.produto);
        if (idx !== -1) {
            produtos[idx].estoque = Number(produtos[idx].estoque ?? 0) + Number(saida.quantidade);
            salvarProdutos(produtos);
        }
    }
    salvarSaidas(saidas.filter((s: any) => s.id !== saidaId));
}
