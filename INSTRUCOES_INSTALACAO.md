# 📦 INSTRUÇÕES DE INSTALAÇÃO - EstoqueMax

## ⚠️ PROBLEMA: 'npm' não é reconhecido

Este erro significa que o **Node.js** não está instalado no seu computador.

## 🔧 SOLUÇÃO PASSO A PASSO

### 1. Instalar Node.js
1. Acesse: https://nodejs.org
2. Baixe a versão **LTS** (recomendada)
3. Execute o instalador
4. **IMPORTANTE**: Marque a opção "Add to PATH" durante a instalação
5. Reinicie o computador

### 2. Verificar Instalação
Abra o **Prompt de Comando** e digite:
```
node --version
npm --version
```
Se aparecer números de versão, está funcionando!

### 3. Instalar EstoqueMax
1. Execute: `instalar.bat`
2. Aguarde a instalação das dependências
3. Execute: `executar.bat`
4. Abra o navegador em: http://localhost:4173

## 📋 REQUISITOS DO SISTEMA

- **Windows** 7 ou superior
- **Node.js** versão 16 ou superior
- **4GB RAM** mínimo
- **Conexão com internet** (apenas para instalação)

## 🚀 EXECUÇÃO OFFLINE

Após instalado, o EstoqueMax funciona **100% offline**:
- Todos os dados ficam no navegador
- Não precisa de internet para usar
- Execute `executar.bat` sempre que quiser usar

## ❓ PROBLEMAS COMUNS

### Erro "EACCES" ou "permission denied"
- Execute como **Administrador**
- Clique direito no `.bat` → "Executar como administrador"

### Erro "Cannot find module"
- Delete a pasta `node_modules`
- Execute `instalar.bat` novamente

### Porta 4173 em uso
- Feche outros programas que usam esta porta
- Ou reinicie o computador

## 📞 PRECISA DE AJUDA?

1. Verifique se seguiu todos os passos
2. Reinicie o computador
3. Execute como administrador
4. Consulte a documentação oficial do Node.js

---
**EstoqueMax** - Sistema de Controle de Estoque Offline