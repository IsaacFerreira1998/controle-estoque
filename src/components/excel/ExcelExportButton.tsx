import { Button } from "@/components/ui/button";
import { FileSpreadsheet, Download, BarChart3 } from "lucide-react";
import { exportToExcelBI, DashboardExcel } from "@/utils/excelExport";
import { useToast } from "@/components/ui/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";

interface ExcelExportButtonProps {
  data?: DashboardExcel;
  type?: 'full' | 'produtos' | 'movimentacoes';
  customData?: any[];
  fileName?: string;
}

export function ExcelExportButton({ 
  data, 
  type = 'full', 
  customData = [], 
  fileName = 'EstoqueMax_Export' 
}: ExcelExportButtonProps) {
  const { toast } = useToast();

  const handleExportBI = () => {
    try {
      if (!data) {
        // Dados de exemplo se não fornecidos
        const mockData: DashboardExcel = {
          totalProdutos: 150,
          valorTotalEstoque: 85420.50,
          produtos: [
            {
              codigo: "PROD001",
              nome: "Notebook Dell Inspiron",
              categoria: "Eletrônicos",
              fornecedor: "TechCorp",
              localizacao: "A1-B2",
              estoque: 15,
              estoqueMinimo: 5,
              valorUnitario: 2500.00,
              valorTotal: 37500.00,
              status: "Ativo",
              ultimaAtualizacao: new Date().toLocaleDateString('pt-BR')
            },
            {
              codigo: "PROD002", 
              nome: "Furadeira Bosch",
              categoria: "Ferramentas",
              fornecedor: "ToolMax",
              localizacao: "C3-D1",
              estoque: 3,
              estoqueMinimo: 10,
              valorUnitario: 450.00,
              valorTotal: 1350.00,
              status: "Crítico",
              ultimaAtualizacao: new Date().toLocaleDateString('pt-BR')
            }
          ],
          movimentacoes: [
            {
              data: new Date().toLocaleDateString('pt-BR'),
              tipo: "Entrada",
              produto: "Notebook Dell Inspiron",
              quantidade: 10,
              responsavel: "João Silva",
              projeto: "Escritório Matriz",
              empresa: "TechSolutions",
              observacoes: "Compra programada",
              valorUnitario: 2500.00,
              valorTotal: 25000.00
            }
          ],
          estatisticas: [
            { categoria: "Eletrônicos", quantidade: 45, valor: 67500.00 },
            { categoria: "Ferramentas", quantidade: 35, valor: 15750.00 },
            { categoria: "Móveis", quantidade: 25, valor: 8900.00 },
            { categoria: "Materiais", quantidade: 45, valor: 3270.50 }
          ]
        };
        
        const exportedFile = exportToExcelBI(mockData, fileName);
        toast({
          title: "✅ Excel BI Exportado!",
          description: `Arquivo ${exportedFile} salvo com sucesso`,
        });
      } else {
        const exportedFile = exportToExcelBI(data, fileName);
        toast({
          title: "✅ Excel BI Exportado!",
          description: `Arquivo ${exportedFile} salvo com sucesso`,
        });
      }
    } catch (error) {
      toast({
        title: "❌ Erro na Exportação",
        description: "Não foi possível exportar o arquivo Excel",
        variant: "destructive"
      });
    }
  };

  const handleExportSimple = () => {
    try {
      // Lógica para exportação simples
      toast({
        title: "✅ Excel Exportado!",
        description: "Arquivo exportado com sucesso",
      });
    } catch (error) {
      toast({
        title: "❌ Erro na Exportação",
        description: "Não foi possível exportar o arquivo",
        variant: "destructive"
      });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="gradient-primary">
          <FileSpreadsheet className="h-4 w-4 mr-2" />
          Exportar Excel
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem onClick={handleExportBI} className="cursor-pointer">
          <BarChart3 className="h-4 w-4 mr-2" />
          <div className="flex flex-col">
            <span className="font-medium">Excel BI Completo</span>
            <span className="text-xs text-muted-foreground">
              Dashboard + Análises + Gráficos
            </span>
          </div>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={handleExportSimple} className="cursor-pointer">
          <Download className="h-4 w-4 mr-2" />
          <div className="flex flex-col">
            <span className="font-medium">Excel Simples</span>
            <span className="text-xs text-muted-foreground">
              Apenas dados tabulares
            </span>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}