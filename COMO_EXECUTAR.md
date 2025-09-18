# EstoqueMax - Como Executar via BAT

## Sistema de Controle de Estoque Offline

Este sistema foi desenvolvido para funcionar offline, sem necessidade de hospedagem na internet. Você pode executá-lo localmente no seu computador com apenas 2 cliques!

### 📋 Pré-requisitos

1. **Node.js** instalado no computador
   - Baixe em: https://nodejs.org/
   - Versão recomendada: 18 ou superior

### 🚀 Como Executar

#### Método 1: Usando o Arquivo BAT (Recomendado)

1. **Primeira vez apenas:**
   - Abra o sistema pela primeira vez
   - Vá em **Configurações**
   - Clique em **"Gerar Arquivo BAT"**
   - Salve o arquivo `iniciar-estoquemax.bat` na pasta do projeto

2. **Para usar diariamente:**
   - Clique duplo no arquivo `iniciar-estoquemax.bat`
   - O sistema abrirá automaticamente no seu navegador
   - Pronto! ✅

#### Método 2: Manual (se necessário)

1. Abra o Prompt de Comando (CMD)
2. Navegue até a pasta do projeto
3. Execute os comandos:
   ```bash
   npm install
   npm run dev
   ```
4. Acesse: http://localhost:8080

### 🔧 Solução de Problemas

**Erro: "npm não é reconhecido"**
- Instale o Node.js: https://nodejs.org/

**Erro: "Porta já em uso"**
- Feche outras instâncias do sistema
- Ou mude a porta no arquivo `vite.config.ts`

**Sistema não abre no navegador**
- Abra manualmente: http://localhost:8080

### 📁 Estrutura de Pastas Recomendada

```
C:\EstoqueMax\
├── iniciar-estoquemax.bat  ← Arquivo gerado pelo sistema
├── src/                    ← Código do sistema
├── package.json           ← Configurações
└── Backup/                ← Pasta de backups
```

### 💾 Backup dos Dados

O sistema salva os dados automaticamente no navegador (localStorage). Para backup completo:

1. Use a função **"Gerar Backup"** nas Configurações
2. Os arquivos serão salvos na pasta configurada
3. Configure backup automático para segurança

### 🎯 Funcionalidades Principais

✅ **Cadastro de Produtos** - Código, nome, categoria, fornecedor  
✅ **Controle de Entradas** - Data, nota fiscal, quantidade  
✅ **Controle de Saídas** - Responsável, projeto, empresa  
✅ **Consultas Avançadas** - Filtros por categoria, fornecedor, data  
✅ **Relatórios Completos** - Gráficos e exportação para Excel  
✅ **Alertas de Estoque** - Notificações de estoque baixo  
✅ **Sistema Offline** - Funciona sem internet  

### 📞 Suporte

Para dúvidas ou problemas:
- Verifique se o Node.js está instalado
- Certifique-se de que a porta 8080 está livre
- Execute como administrador se necessário

---

## 🎉 Seu Sistema Está Pronto!

Agora você tem um sistema completo de controle de estoque que:
- Funciona offline
- Abre com 2 cliques
- Não precisa de hospedagem
- É totalmente profissional

**Dica:** Crie um atalho do arquivo .bat na área de trabalho para acesso ainda mais rápido!