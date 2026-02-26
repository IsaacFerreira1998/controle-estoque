import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Settings, Save, Building, Database, Palette, Download, Trash2, Upload, RefreshCw, Moon, Sun } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const CONFIG_KEY = "estoquemax-config";

const defaultConfig = {
  nomeEmpresa: "",
  cnpj: "",
  endereco: "",
  telefone: "",
  email: "",
  alertaEstoqueMinimo: true,
  alertaVencimento: false,
  backupAutomatico: false,
  tema: "light",
  moedaPadrao: "BRL",
  localizacaoPadrao: "",
  fornecedorPadrao: "",
  categoriaPadrao: "",
};

function aplicarTema(tema: string) {
  const root = document.documentElement;
  if (tema === "dark") {
    root.classList.add("dark");
  } else if (tema === "light") {
    root.classList.remove("dark");
  } else {
    // auto
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (prefersDark) root.classList.add("dark");
    else root.classList.remove("dark");
  }
}

export default function Configuracoes() {
  const { toast } = useToast();

  const [config, setConfig] = useState(() => {
    try {
      const salvo = localStorage.getItem(CONFIG_KEY);
      return salvo ? { ...defaultConfig, ...JSON.parse(salvo) } : defaultConfig;
    } catch {
      return defaultConfig;
    }
  });

  // Aplicar tema salvo ao carregar
  useEffect(() => {
    aplicarTema(config.tema);
  }, []);

  const set = (key: string, value: unknown) =>
    setConfig((prev: typeof defaultConfig) => ({ ...prev, [key]: value }));

  const salvar = () => {
    localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
    aplicarTema(config.tema);
    toast({ title: "✅ Salvo!", description: "Configurações salvas com sucesso." });
  };

  const restaurarPadroes = () => {
    setConfig(defaultConfig);
    localStorage.removeItem(CONFIG_KEY);
    aplicarTema("light");
    toast({ title: "🔄 Padrões restaurados", description: "Configurações resetadas para os valores padrão." });
  };

  const exportarConfig = () => {
    const dados = { config, exportadoEm: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(dados, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `EstoqueMax_Config_${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "📥 Configurações exportadas!" });
  };

  const fazerBackup = () => {
    const dados = {
      exportadoEm: new Date().toISOString(),
      versao: "1.0",
      config: JSON.parse(localStorage.getItem(CONFIG_KEY) ?? "{}"),
      produtos: JSON.parse(localStorage.getItem("estoquemax-produtos") ?? "[]"),
      entradas: JSON.parse(localStorage.getItem("estoquemax-entradas") ?? "[]"),
      saidas: JSON.parse(localStorage.getItem("estoquemax-saidas") ?? "[]"),
    };
    const blob = new Blob([JSON.stringify(dados, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `EstoqueMax_Backup_${new Date().toISOString().replace(/[:.]/g, "-").slice(0, 16)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "💾 Backup gerado!", description: "Salve o arquivo em local seguro." });
  };

  const restaurarBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const dados = JSON.parse(ev.target?.result as string);
        if (dados.produtos) localStorage.setItem("estoquemax-produtos", JSON.stringify(dados.produtos));
        if (dados.entradas) localStorage.setItem("estoquemax-entradas", JSON.stringify(dados.entradas));
        if (dados.saidas) localStorage.setItem("estoquemax-saidas", JSON.stringify(dados.saidas));
        if (dados.config) {
          localStorage.setItem(CONFIG_KEY, JSON.stringify(dados.config));
          setConfig({ ...defaultConfig, ...dados.config });
        }
        toast({ title: "✅ Backup restaurado!", description: "Recarregue a página para ver os dados." });
      } catch {
        toast({ title: "❌ Arquivo inválido", variant: "destructive", description: "Use um backup gerado pelo EstoqueMax." });
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const gerarBat = () => {
    const bat = `@echo off
title EstoqueMax — Sistema de Controle de Estoque
color 0B
echo.
echo  =============================================
echo    EstoqueMax — Controle de Estoque
echo  =============================================
echo.
echo  Iniciando servidor...
cd /d "%~dp0"
start "" "http://localhost:8080"
npm run dev
pause`;
    const blob = new Blob([bat], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "iniciar-estoquemax.bat";
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "✅ Arquivo BAT gerado!", description: "Salve na pasta do projeto e execute para abrir o sistema." });
  };

  const isDark = config.tema === "dark";

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Settings className="h-6 w-6 text-primary" />
          Configurações
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Personalize o sistema de acordo com sua empresa</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Dados da Empresa */}
        <Card className="shadow-soft">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Building className="h-4 w-4 text-primary" />
              Dados da Empresa
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Label className="text-xs">Nome da Empresa</Label>
              <Input value={config.nomeEmpresa} onChange={e => set("nomeEmpresa", e.target.value)} placeholder="Ex: Distribuidora ABC LTDA" />
            </div>
            <div>
              <Label className="text-xs">CNPJ</Label>
              <Input value={config.cnpj} onChange={e => set("cnpj", e.target.value)} placeholder="00.000.000/0001-00" />
            </div>
            <div>
              <Label className="text-xs">Endereço</Label>
              <Textarea value={config.endereco} onChange={e => set("endereco", e.target.value)} rows={2} placeholder="Rua, número, cidade — Estado" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs">Telefone</Label>
                <Input value={config.telefone} onChange={e => set("telefone", e.target.value)} placeholder="(00) 99999-9999" />
              </div>
              <div>
                <Label className="text-xs">E-mail</Label>
                <Input type="email" value={config.email} onChange={e => set("email", e.target.value)} placeholder="contato@empresa.com" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Aparência e Sistema */}
        <Card className="shadow-soft">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Palette className="h-4 w-4 text-primary" />
              Aparência e Sistema
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Tema */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border">
              <div className="flex items-center gap-2">
                {isDark ? <Moon className="h-4 w-4 text-primary" /> : <Sun className="h-4 w-4 text-warning" />}
                <div>
                  <p className="text-sm font-medium">Tema {isDark ? "Escuro" : "Claro"}</p>
                  <p className="text-xs text-muted-foreground">Clique para alternar</p>
                </div>
              </div>
              <Switch
                checked={isDark}
                onCheckedChange={(checked) => {
                  const novoTema = checked ? "dark" : "light";
                  set("tema", novoTema);
                  aplicarTema(novoTema);
                }}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label className="text-sm">Alerta de Estoque Mínimo</Label>
              <Switch checked={config.alertaEstoqueMinimo} onCheckedChange={v => set("alertaEstoqueMinimo", v)} />
            </div>

            <div className="flex items-center justify-between">
              <Label className="text-sm">Alerta de Vencimento</Label>
              <Switch checked={config.alertaVencimento} onCheckedChange={v => set("alertaVencimento", v)} />
            </div>

            <div>
              <Label className="text-xs">Moeda Padrão</Label>
              <Select value={config.moedaPadrao} onValueChange={v => set("moedaPadrao", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="BRL">Real (R$)</SelectItem>
                  <SelectItem value="USD">Dólar ($)</SelectItem>
                  <SelectItem value="EUR">Euro (€)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Banco de Dados / Backup */}
        <Card className="shadow-soft">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Database className="h-4 w-4 text-primary" />
              Backup e Dados
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-xs text-muted-foreground">
              Todos os dados são armazenados no localStorage do navegador. Faça backups regularmente para não perder dados.
            </p>

            <Button className="w-full gradient-primary" onClick={fazerBackup}>
              <Download className="h-4 w-4 mr-2" />
              Exportar Backup Completo (.json)
            </Button>

            <div className="relative">
              <Button variant="outline" className="w-full" onClick={() => document.getElementById("restaurar-input")?.click()}>
                <Upload className="h-4 w-4 mr-2" />
                Restaurar Backup
              </Button>
              <input type="file" id="restaurar-input" accept=".json" className="hidden" onChange={restaurarBackup} />
            </div>

            <div className="pt-1 border-t">
              <p className="text-xs text-muted-foreground mb-2">Estatísticas do armazenamento:</p>
              <div className="grid grid-cols-3 gap-2 text-center">
                {[
                  ["Produtos", JSON.parse(localStorage.getItem("estoquemax-produtos") ?? "[]").length],
                  ["Entradas", JSON.parse(localStorage.getItem("estoquemax-entradas") ?? "[]").length],
                  ["Saídas", JSON.parse(localStorage.getItem("estoquemax-saidas") ?? "[]").length],
                ].map(([label, count]) => (
                  <div key={label as string} className="p-2 bg-muted/50 rounded-md">
                    <p className="text-base font-bold text-primary">{count}</p>
                    <p className="text-xs text-muted-foreground">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Execução e Atalhos */}
        <Card className="shadow-soft">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Download className="h-4 w-4 text-primary" />
              Atalhos e Execução
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-xs text-muted-foreground">
              Gere um arquivo <code className="bg-muted px-1 rounded">.bat</code> para abrir o sistema com 2 cliques no Windows, sem abrir o terminal manualmente.
            </p>
            <Button variant="outline" className="w-full" onClick={gerarBat}>
              <Download className="h-4 w-4 mr-2" />
              Gerar arquivo iniciar-estoquemax.bat
            </Button>
            <p className="text-xs text-muted-foreground">
              Salve o arquivo <strong>dentro da pasta do projeto</strong> e clique 2x para executar.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Ações globais */}
      <div className="flex flex-wrap gap-2 pt-2">
        <Button className="gradient-primary" onClick={salvar}>
          <Save className="h-4 w-4 mr-2" />
          Salvar Configurações
        </Button>
        <Button variant="outline" onClick={exportarConfig}>
          <Upload className="h-4 w-4 mr-2" />
          Exportar Config (.json)
        </Button>
        <Button variant="outline" className="text-destructive border-destructive/30 hover:bg-destructive/5" onClick={restaurarPadroes}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Restaurar Padrões
        </Button>
      </div>
    </div>
  );
}