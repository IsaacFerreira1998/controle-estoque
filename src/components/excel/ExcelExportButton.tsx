import { Button } from "@/components/ui/button";
import { FileSpreadsheet, Download, BarChart3, Database } from "lucide-react";
import {
  montarDashboardExcel,
  exportToExcelBI,
  exportarProdutosExcel,
  exportarEntradasExcel,
  exportarSaidasExcel,
  exportarMovimentacoesExcel,
  exportarPowerBICompleto,
  exportarPowerBIProdutos,
} from "@/utils/excelExport";
import { useToast } from "@/components/ui/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";

interface ExcelExportButtonProps {
  fileName?: string;
  tipo?: 'completo' | 'produtos' | 'entradas' | 'saidas' | 'movimentacoes';
}

export function ExcelExportButton({
  fileName = 'EstoqueMax',
  tipo = 'completo',
}: ExcelExportButtonProps) {
  const { toast } = useToast();

  const handleBI = () => {
    try {
      const data = montarDashboardExcel();
      if (data.produtos.length === 0 && data.movimentacoes.length === 0) {
        toast({
          title: "⚠️ Sem dados",
          description: "Cadastre produtos ou movimentações antes de exportar.",
          variant: "destructive",
        });
        return;
      }
      const arquivo = exportToExcelBI(data, fileName + '_BI');
      toast({
        title: "✅ Excel BI exportado!",
        description: `${arquivo} — ${data.produtos.length} produtos e ${data.movimentacoes.length} movimentações.`,
      });
    } catch (e) {
      toast({ title: "❌ Erro ao exportar", description: "Verifique o console.", variant: "destructive" });
    }
  };

  const handleProdutos = () => {
    try {
      const arquivo = exportarProdutosExcel(fileName + '_Produtos');
      toast({ title: "✅ Excel Produtos exportado!", description: arquivo });
    } catch {
      toast({ title: "❌ Erro ao exportar", variant: "destructive", description: "" });
    }
  };

  const handleEntradas = () => {
    try {
      const arquivo = exportarEntradasExcel(fileName + '_Entradas');
      toast({ title: "✅ Excel Entradas exportado!", description: arquivo });
    } catch {
      toast({ title: "❌ Erro ao exportar", variant: "destructive", description: "" });
    }
  };

  const handleSaidas = () => {
    try {
      const arquivo = exportarSaidasExcel(fileName + '_Saidas');
      toast({ title: "✅ Excel Saídas exportado!", description: arquivo });
    } catch {
      toast({ title: "❌ Erro ao exportar", variant: "destructive", description: "" });
    }
  };

  const handleMovimentacoes = () => {
    try {
      const arquivo = exportarMovimentacoesExcel(fileName + '_Movimentacoes');
      toast({ title: "✅ Excel Movimentações exportado!", description: arquivo });
    } catch {
      toast({ title: "❌ Erro ao exportar", variant: "destructive", description: "" });
    }
  };

  const handlePowerBIProdutos = () => {
    try {
      const total = exportarPowerBIProdutos();
      toast({ title: "✅ CSV Power BI exportado!", description: `${total} produtos exportados para CSV.` });
    } catch {
      toast({ title: "❌ Erro ao exportar", variant: "destructive", description: "" });
    }
  };

  const handlePowerBICompleto = () => {
    try {
      const total = exportarPowerBICompleto();
      toast({ title: "✅ CSV Power BI exportado!", description: `${total} movimentações exportadas para CSV.` });
    } catch {
      toast({ title: "❌ Erro ao exportar", variant: "destructive", description: "" });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="gradient-primary">
          <FileSpreadsheet className="h-4 w-4 mr-2" />
          Exportar
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel className="text-xs text-muted-foreground">Excel (.xlsx)</DropdownMenuLabel>

        <DropdownMenuItem onClick={handleBI} className="cursor-pointer">
          <BarChart3 className="h-4 w-4 mr-2 text-primary" />
          <div className="flex flex-col">
            <span className="font-medium">Excel BI Completo</span>
            <span className="text-xs text-muted-foreground">Dashboard + Produtos + Movimentações</span>
          </div>
        </DropdownMenuItem>

        <DropdownMenuItem onClick={handleProdutos} className="cursor-pointer">
          <Download className="h-4 w-4 mr-2" />
          <span>Apenas Produtos</span>
        </DropdownMenuItem>

        <DropdownMenuItem onClick={handleEntradas} className="cursor-pointer">
          <Download className="h-4 w-4 mr-2" />
          <span>Apenas Entradas</span>
        </DropdownMenuItem>

        <DropdownMenuItem onClick={handleSaidas} className="cursor-pointer">
          <Download className="h-4 w-4 mr-2" />
          <span>Apenas Saídas</span>
        </DropdownMenuItem>

        <DropdownMenuItem onClick={handleMovimentacoes} className="cursor-pointer">
          <Download className="h-4 w-4 mr-2" />
          <span>Entradas + Saídas</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />
        <DropdownMenuLabel className="text-xs text-muted-foreground">Power BI (.csv)</DropdownMenuLabel>

        <DropdownMenuItem onClick={handlePowerBIProdutos} className="cursor-pointer">
          <Database className="h-4 w-4 mr-2 text-yellow-500" />
          <div className="flex flex-col">
            <span className="font-medium">CSV Produtos → Power BI</span>
            <span className="text-xs text-muted-foreground">Importar no Power BI Desktop</span>
          </div>
        </DropdownMenuItem>

        <DropdownMenuItem onClick={handlePowerBICompleto} className="cursor-pointer">
          <Database className="h-4 w-4 mr-2 text-yellow-500" />
          <div className="flex flex-col">
            <span className="font-medium">CSV Movimentações → Power BI</span>
            <span className="text-xs text-muted-foreground">Entradas + Saídas unificadas</span>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}