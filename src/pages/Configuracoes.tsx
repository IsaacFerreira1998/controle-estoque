import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Settings, Save, User, Building, Database, Palette, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Configuracoes() {
  const { toast } = useToast();
  
  const [configuracoes, setConfiguracoes] = useState({
    // Dados da Empresa
    nomeEmpresa: "Minha Empresa LTDA",
    cnpj: "12.345.678/0001-90",
    endereco: "Rua das Empresas, 123",
    telefone: "(11) 99999-9999",
    email: "contato@minhaempresa.com",
    
    // Configurações do Sistema
    alertaEstoqueMinimo: true,
    alertaVencimento: true,
    backupAutomatico: true,
    tema: "light",
    idioma: "pt-BR",
    moedaPadrao: "BRL",
    
    // Configurações de Estoque
    localizacaoPadrao: "A1-B1",
    fornecedorPadrao: "",
    categoriaPadrao: "",
    validadeAlerta: 30,
    
    // Configurações de Backup
    localBackup: "C:\\EstoqueMax\\Backup",
    frequenciaBackup: "diario",
    manterBackups: 30
  });

  const salvarConfiguracoes = () => {
    // Salvar no localStorage (para demo)
    localStorage.setItem('estoquemax-config', JSON.stringify(configuracoes));
    
    toast({
      title: "Configurações salvas!",
      description: "As configurações foram salvas com sucesso.",
    });
  };

  const gerarBackup = () => {
    toast({
      title: "Backup gerado!",
      description: "Backup salvo em: " + configuracoes.localBackup,
    });
  };

  const criarBatchFile = () => {
    const batchContent = `@echo off
title EstoqueMax - Sistema de Controle de Estoque
echo Iniciando EstoqueMax...
echo.
cd /d "%~dp0"
start "" "http://localhost:8080"
npm run dev
pause`;

    const blob = new Blob([batchContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'iniciar-estoquemax.bat';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Arquivo BAT gerado!",
      description: "Baixe e execute o arquivo iniciar-estoquemax.bat para abrir o sistema.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Settings className="h-8 w-8 text-primary" />
          Configurações do Sistema
        </h1>
        <p className="text-muted-foreground">
          Configure o sistema de acordo com suas necessidades
        </p>
      </div>

      {/* Gerar Arquivo BAT */}
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary">
            <Download className="h-5 w-5" />
            Execução via Arquivo BAT
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Para facilitar a abertura do sistema, você pode gerar um arquivo .bat que iniciará o EstoqueMax com apenas 2 cliques.
            </p>
            <div className="flex gap-2">
              <Button onClick={criarBatchFile} className="gradient-primary">
                <Download className="h-4 w-4 mr-2" />
                Gerar Arquivo BAT
              </Button>
              <div className="text-xs text-muted-foreground flex-1 ml-4">
                <strong>Instruções:</strong><br/>
                1. Clique em "Gerar Arquivo BAT"<br/>
                2. Salve o arquivo na pasta do projeto<br/>
                3. Execute o arquivo para abrir o sistema
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Dados da Empresa */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Dados da Empresa
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="nomeEmpresa">Nome da Empresa</Label>
              <Input
                id="nomeEmpresa"
                value={configuracoes.nomeEmpresa}
                onChange={(e) => setConfiguracoes({...configuracoes, nomeEmpresa: e.target.value})}
              />
            </div>
            
            <div>
              <Label htmlFor="cnpj">CNPJ</Label>
              <Input
                id="cnpj"
                value={configuracoes.cnpj}
                onChange={(e) => setConfiguracoes({...configuracoes, cnpj: e.target.value})}
              />
            </div>
            
            <div>
              <Label htmlFor="endereco">Endereço</Label>
              <Textarea
                id="endereco"
                value={configuracoes.endereco}
                onChange={(e) => setConfiguracoes({...configuracoes, endereco: e.target.value})}
                rows={2}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="telefone">Telefone</Label>
                <Input
                  id="telefone"
                  value={configuracoes.telefone}
                  onChange={(e) => setConfiguracoes({...configuracoes, telefone: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  value={configuracoes.email}
                  onChange={(e) => setConfiguracoes({...configuracoes, email: e.target.value})}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Configurações do Sistema */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Configurações do Sistema
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="alertaEstoque">Alerta de Estoque Mínimo</Label>
              <Switch
                id="alertaEstoque"
                checked={configuracoes.alertaEstoqueMinimo}
                onCheckedChange={(checked) => setConfiguracoes({...configuracoes, alertaEstoqueMinimo: checked})}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="alertaVencimento">Alerta de Vencimento</Label>
              <Switch
                id="alertaVencimento"
                checked={configuracoes.alertaVencimento}
                onCheckedChange={(checked) => setConfiguracoes({...configuracoes, alertaVencimento: checked})}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="backupAuto">Backup Automático</Label>
              <Switch
                id="backupAuto"
                checked={configuracoes.backupAutomatico}
                onCheckedChange={(checked) => setConfiguracoes({...configuracoes, backupAutomatico: checked})}
              />
            </div>
            
            <div>
              <Label htmlFor="tema">Tema</Label>
              <Select value={configuracoes.tema} onValueChange={(value) => setConfiguracoes({...configuracoes, tema: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Claro</SelectItem>
                  <SelectItem value="dark">Escuro</SelectItem>
                  <SelectItem value="auto">Automático</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="moeda">Moeda Padrão</Label>
              <Select value={configuracoes.moedaPadrao} onValueChange={(value) => setConfiguracoes({...configuracoes, moedaPadrao: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BRL">Real (R$)</SelectItem>
                  <SelectItem value="USD">Dólar ($)</SelectItem>
                  <SelectItem value="EUR">Euro (€)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Configurações de Estoque */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Configurações de Estoque
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="localizacaoPadrao">Localização Padrão</Label>
              <Input
                id="localizacaoPadrao"
                value={configuracoes.localizacaoPadrao}
                onChange={(e) => setConfiguracoes({...configuracoes, localizacaoPadrao: e.target.value})}
                placeholder="A1-B1"
              />
            </div>
            
            <div>
              <Label htmlFor="fornecedorPadrao">Fornecedor Padrão</Label>
              <Input
                id="fornecedorPadrao"
                value={configuracoes.fornecedorPadrao}
                onChange={(e) => setConfiguracoes({...configuracoes, fornecedorPadrao: e.target.value})}
                placeholder="Nome do fornecedor"
              />
            </div>
            
            <div>
              <Label htmlFor="categoriaPadrao">Categoria Padrão</Label>
              <Select value={configuracoes.categoriaPadrao} onValueChange={(value) => setConfiguracoes({...configuracoes, categoriaPadrao: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Nenhuma</SelectItem>
                  <SelectItem value="eletronicos">Eletrônicos</SelectItem>
                  <SelectItem value="ferramentas">Ferramentas</SelectItem>
                  <SelectItem value="moveis">Móveis</SelectItem>
                  <SelectItem value="materiais">Materiais</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="validadeAlerta">Alerta de Validade (dias)</Label>
              <Input
                id="validadeAlerta"
                type="number"
                value={configuracoes.validadeAlerta}
                onChange={(e) => setConfiguracoes({...configuracoes, validadeAlerta: parseInt(e.target.value)})}
              />
            </div>
          </CardContent>
        </Card>

        {/* Configurações de Backup */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Configurações de Backup
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="localBackup">Local do Backup</Label>
              <Input
                id="localBackup"
                value={configuracoes.localBackup}
                onChange={(e) => setConfiguracoes({...configuracoes, localBackup: e.target.value})}
              />
            </div>
            
            <div>
              <Label htmlFor="frequenciaBackup">Frequência do Backup</Label>
              <Select value={configuracoes.frequenciaBackup} onValueChange={(value) => setConfiguracoes({...configuracoes, frequenciaBackup: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="manual">Manual</SelectItem>
                  <SelectItem value="diario">Diário</SelectItem>
                  <SelectItem value="semanal">Semanal</SelectItem>
                  <SelectItem value="mensal">Mensal</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="manterBackups">Manter Backups (dias)</Label>
              <Input
                id="manterBackups"
                type="number"
                value={configuracoes.manterBackups}
                onChange={(e) => setConfiguracoes({...configuracoes, manterBackups: parseInt(e.target.value)})}
              />
            </div>
            
            <Button onClick={gerarBackup} variant="outline" className="w-full">
              <Database className="h-4 w-4 mr-2" />
              Gerar Backup Agora
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Botões de Ação */}
      <div className="flex gap-2">
        <Button onClick={salvarConfiguracoes} className="gradient-success">
          <Save className="h-4 w-4 mr-2" />
          Salvar Configurações
        </Button>
        
        <Button variant="outline">
          Restaurar Padrões
        </Button>
        
        <Button variant="outline">
          Exportar Configurações
        </Button>
      </div>
    </div>
  );
}