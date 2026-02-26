<h1 align="center">
  📦 EstoqueMax
</h1>

<p align="center">
  Sistema de controle de estoque completo, rápido e 100% offline — desenvolvido com React + TypeScript.
</p>

<p align="center">
  <img alt="React" src="https://img.shields.io/badge/React-18-61dafb?logo=react&logoColor=white&style=flat-square"/>
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript&logoColor=white&style=flat-square"/>
  <img alt="Vite" src="https://img.shields.io/badge/Vite-5-646cff?logo=vite&logoColor=white&style=flat-square"/>
  <img alt="Tailwind CSS" src="https://img.shields.io/badge/Tailwind-3-38bdf8?logo=tailwindcss&logoColor=white&style=flat-square"/>
  <img alt="License" src="https://img.shields.io/badge/Licença-MIT-22c55e?style=flat-square"/>
</p>

---

## 📋 Sobre o Projeto

O **EstoqueMax** é um sistema de gestão de estoque desenvolvido para rodar diretamente no navegador, sem necessidade de servidor, banco de dados ou internet. Todos os dados são armazenados localmente via **localStorage**, tornando-o ideal para uso offline em qualquer máquina Windows.

### O que ele resolve

- Controle de entrada e saída de produtos com histórico completo
- Alertas automáticos quando o estoque atinge o nível mínimo
- Exportação real de dados para **Excel (.xlsx)** e **Power BI (.csv)**
- Dashboard com gráficos e análises em tempo real

---

## ✨ Funcionalidades

| Módulo | Descrição |
|---|---|
| 📊 **Dashboard** | Visão geral com KPIs, gráficos de movimentação e alertas de estoque crítico |
| 📦 **Produtos** | Cadastro com código, categoria, fornecedor, localização, preço e estoque mínimo |
| ⬆️ **Entradas** | Registro com nota fiscal, responsável, destino — dados persistidos automaticamente |
| ⬇️ **Saídas** | Controle por projeto/empresa com validação de estoque disponível |
| 🔍 **Consultas** | Pesquisa avançada por produto, período, categoria, fornecedor e responsável |
| 📈 **Relatórios** | Gráficos reais + exportação para Excel BI (5 abas) e CSV para Power BI |
| ⚙️ **Configurações** | Dados da empresa, alertas de estoque, backup e preferências |

---

## 🛠️ Tecnologias

- **[React 18](https://react.dev/)** + **[TypeScript](https://www.typescriptlang.org/)** — base da aplicação
- **[Vite 5](https://vitejs.dev/)** — build e servidor de desenvolvimento
- **[Tailwind CSS](https://tailwindcss.com/)** — estilização
- **[shadcn/ui](https://ui.shadcn.com/)** + **[Radix UI](https://www.radix-ui.com/)** — componentes acessíveis
- **[Recharts](https://recharts.org/)** — gráficos e visualizações
- **[xlsx](https://sheetjs.com/)** — exportação para Excel
- **[React Router DOM](https://reactrouter.com/)** — roteamento
- **localStorage** — persistência de dados sem banco de dados

---

## 🚀 Como Executar

### Pré-requisito

Ter o **[Node.js](https://nodejs.org/)** instalado (versão 18 ou superior).

### Instalação

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/controle-total-estoque.git

# Entre na pasta do projeto
cd controle-total-estoque

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

Acesse: **http://localhost:8080**

### Windows — Executar via arquivo BAT

Se preferir um atalho simples, dentro da pasta do projeto execute:

```
executar.bat
```

Ou acesse **Configurações** dentro do sistema e clique em **"Gerar Arquivo BAT"**.

---

## 📁 Estrutura do Projeto

```
controle-total-estoque/
├── public/
└── src/
    ├── components/
    │   ├── dashboard/       # StatsCard e gráficos avançados
    │   ├── excel/           # Botão de exportação com menu
    │   ├── consultas/       # Filtros e resultados de consulta
    │   ├── layout/          # Sidebar, Header e Layout principal
    │   └── ui/              # Componentes base (shadcn/ui)
    ├── hooks/               # Hooks customizados
    ├── lib/                 # Utilitários (cn, etc)
    ├── pages/
    │   ├── Dashboard.tsx    # Visão geral e gráficos
    │   ├── Produtos.tsx     # CRUD completo de produtos
    │   ├── Entradas.tsx     # Registro de entradas
    │   ├── Saidas.tsx       # Registro de saídas
    │   ├── Consultas.tsx    # Consultas avançadas
    │   ├── Relatorios.tsx   # Relatórios e exportação
    │   └── Configuracoes.tsx
    └── utils/
        └── excelExport.ts   # Lógica de exportação Excel/CSV
```

---

## 💾 Persistência de Dados

Os dados são armazenados automaticamente no **localStorage** do navegador com as seguintes chaves:

| Chave | Conteúdo |
|---|---|
| `estoquemax-produtos` | Cadastro de produtos |
| `estoquemax-entradas` | Histórico de entradas |
| `estoquemax-saidas` | Histórico de saídas |

> Para resetar todos os dados: **Configurações → Restaurar Padrões**, ou apague as chaves no DevTools (`F12 → Application → Local Storage`).

---

## 📤 Exportação

### Excel (.xlsx)
- **Excel BI Completo** — 5 abas: Dashboard, Produtos, Entradas, Saídas e Análises
- Exportação individual por tipo de dado
- Filtros automáticos e largura de colunas otimizada

### Power BI (.csv)
- Arquivo CSV com **BOM UTF-8** para compatibilidade total com o Power BI Desktop
- Headers sem acentos e sem espaços (padrão para DAX)
- Produtos e Movimentações em arquivos separados

---

## 🔧 Build para Produção

```bash
npm run build
```

Os arquivos otimizados serão gerados na pasta `dist/`.

---

## 📄 Licença

Este projeto está sob a licença **MIT**. Sinta-se livre para usar, modificar e distribuir.

---

<p align="center">
  Desenvolvido por <strong>Isaac</strong> · 2025
</p>
