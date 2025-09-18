@echo off
title EstoqueMax - Instalacao
color 0A
echo.
echo ====================================
echo  EstoqueMax - Sistema de Estoque
echo ====================================
echo.
echo Instalando dependencias...
echo Por favor, aguarde...
echo.

REM Verifica se o Node.js esta instalado
node --version >nul 2>&1
if errorlevel 1 (
    echo ERRO: Node.js nao encontrado!
    echo.
    echo Por favor, instale o Node.js em: https://nodejs.org/
    echo Apos a instalacao, execute este arquivo novamente.
    echo.
    pause
    exit /b 1
)

echo Node.js encontrado! Instalando pacotes...
echo.

REM Instala as dependencias
npm install

if errorlevel 1 (
    echo.
    echo ERRO na instalacao dos pacotes!
    echo Verifique sua conexao com a internet.
    echo.
    pause
    exit /b 1
)

echo.
echo ====================================
echo  INSTALACAO CONCLUIDA COM SUCESSO!
echo ====================================
echo.
echo Para usar o sistema:
echo 1. Execute o arquivo: iniciar-estoquemax.bat
echo 2. Ou gere um novo arquivo BAT nas Configuracoes
echo.
echo Criando arquivo de inicializacao...

REM Cria o arquivo de inicializacao
echo @echo off > iniciar-estoquemax.bat
echo title EstoqueMax - Sistema de Controle de Estoque >> iniciar-estoquemax.bat
echo echo Iniciando EstoqueMax... >> iniciar-estoquemax.bat
echo echo. >> iniciar-estoquemax.bat
echo cd /d "%%~dp0" >> iniciar-estoquemax.bat
echo start "" "http://localhost:8080" >> iniciar-estoquemax.bat
echo npm run dev >> iniciar-estoquemax.bat
echo pause >> iniciar-estoquemax.bat

echo.
echo Arquivo 'iniciar-estoquemax.bat' criado!
echo.
echo Deseja iniciar o sistema agora? (S/N)
set /p resposta=

if /i "%resposta%"=="S" (
    echo.
    echo Iniciando EstoqueMax...
    call iniciar-estoquemax.bat
) else (
    echo.
    echo Para iniciar o sistema, execute: iniciar-estoquemax.bat
    echo.
    pause
)