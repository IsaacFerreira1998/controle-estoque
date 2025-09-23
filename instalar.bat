@echo off
title EstoqueMax - Instalacao
color 0A
echo.
echo ========================================
echo    ESTOQUEMAX - SISTEMA DE ESTOQUE
echo ========================================
echo.

REM Verificar se Node.js esta instalado
echo [1/4] Verificando Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo.
    echo ❌ ERRO: Node.js NAO ENCONTRADO!
    echo.
    echo ⚠️  VOCE PRECISA INSTALAR O NODE.JS PRIMEIRO:
    echo.
    echo 📥 1. Acesse: https://nodejs.org
    echo 📥 2. Baixe a versao LTS (recomendada)
    echo 📥 3. Execute o instalador
    echo 📥 4. IMPORTANTE: Marque "Add to PATH"
    echo 📥 5. Reinicie o computador
    echo 📥 6. Execute este instalador novamente
    echo.
    echo 📋 Consulte: INSTRUCOES_INSTALACAO.md para mais detalhes
    echo.
    pause
    exit /b 1
)

REM Verificar se npm esta disponivel
echo [2/4] Verificando npm...
npm --version >nul 2>&1
if errorlevel 1 (
    echo.
    echo ❌ ERRO: npm NAO ENCONTRADO!
    echo.
    echo 🛠️  SOLUCAO:
    echo O npm vem junto com Node.js
    echo Reinstale Node.js de: https://nodejs.org
    echo.
    pause
    exit /b 1
)

echo ✅ Node.js e npm encontrados!
echo.

echo [3/4] Instalando dependencias...
echo ⏳ Por favor, aguarde... (pode demorar alguns minutos)
echo.

REM Instala as dependencias
npm install

if errorlevel 1 (
    echo.
    echo ❌ ERRO na instalacao dos pacotes!
    echo.
    echo 🛠️  POSSIVEIS SOLUCOES:
    echo 📶 1. Verifique sua conexao com a internet
    echo 🔑 2. Execute como Administrador
    echo 🔄 3. Tente novamente em alguns minutos
    echo.
    pause
    exit /b 1
)

echo [4/4] Compilando projeto...
npm run build
if errorlevel 1 (
    echo.
    echo ❌ ERRO na compilacao do projeto!
    echo.
    pause
    exit /b 1
)

echo.
echo ========================================
echo   ✅ INSTALACAO CONCLUIDA COM SUCESSO!
echo ========================================
echo.
echo 🚀 Para usar o sistema:
echo    Execute: iniciar-estoquemax.bat
echo.
echo Criando arquivo de inicializacao...

REM Cria o arquivo de inicializacao
echo @echo off > iniciar-estoquemax.bat
echo title EstoqueMax - Sistema de Controle de Estoque >> iniciar-estoquemax.bat
echo color 0B >> iniciar-estoquemax.bat
echo echo ======================================== >> iniciar-estoquemax.bat
echo echo        INICIANDO ESTOQUEMAX >> iniciar-estoquemax.bat
echo echo ======================================== >> iniciar-estoquemax.bat
echo echo. >> iniciar-estoquemax.bat
echo echo 🚀 Iniciando servidor local... >> iniciar-estoquemax.bat
echo echo. >> iniciar-estoquemax.bat
echo echo 🌐 Acesse: http://localhost:4173 >> iniciar-estoquemax.bat
echo echo. >> iniciar-estoquemax.bat
echo echo ⚠️  IMPORTANTE: >> iniciar-estoquemax.bat
echo echo    - Mantenha esta janela aberta >> iniciar-estoquemax.bat
echo echo    - Para parar: pressione Ctrl+C >> iniciar-estoquemax.bat
echo echo. >> iniciar-estoquemax.bat
echo cd /d "%%~dp0" >> iniciar-estoquemax.bat
echo start "" "http://localhost:4173" >> iniciar-estoquemax.bat
echo npm run preview >> iniciar-estoquemax.bat
echo pause >> iniciar-estoquemax.bat

echo.
echo ✅ Arquivo 'iniciar-estoquemax.bat' criado!
echo.
echo 🚀 Deseja iniciar o sistema agora? (S/N)
set /p resposta=

if /i "%resposta%"=="S" (
    echo.
    echo 🚀 Iniciando EstoqueMax...
    call iniciar-estoquemax.bat
) else (
    echo.
    echo 📋 Para iniciar o sistema: iniciar-estoquemax.bat
    echo 📋 Consulte: INSTRUCOES_INSTALACAO.md para ajuda
    echo.
    pause
)