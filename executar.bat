@echo off
echo ========================================
echo        INICIANDO ESTOQUEMAX
echo ========================================
echo.

REM Verificar se o projeto foi compilado
if not exist "dist" (
    echo ERRO: Projeto nao compilado!
    echo.
    echo SOLUCAO:
    echo Execute primeiro: instalar.bat
    echo.
    pause
    exit /b 1
)

echo Iniciando servidor local...
echo.
echo EstoqueMax rodando em: http://localhost:4173
echo.
echo ATENCAO:
echo - Mantenha esta janela aberta
echo - Abra seu navegador em: http://localhost:4173
echo - Para parar, pressione Ctrl+C
echo.

npm run preview

pause