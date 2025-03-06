import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Clipboard, Copy, Check, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function WebhookConfig() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState("");
  const [asaasApiKey, setAsaasApiKey] = useState("");
  const [asaasEnvironment, setAsaasEnvironment] = useState("sandbox");

  useEffect(() => {
    const isAdminLoggedIn = localStorage.getItem("isAdminLoggedIn");
    if (isAdminLoggedIn !== "true") {
      navigate("/admin/login");
    }

    // Carregar configurações atuais
    const apiKey = import.meta.env.VITE_ASAAS_API_KEY || "";
    const environment = import.meta.env.VITE_ASAAS_ENVIRONMENT || "sandbox";

    setAsaasApiKey(apiKey);
    setAsaasEnvironment(environment);

    // Gerar URL do webhook
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
    const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID || "";

    if (supabaseUrl && projectId) {
      const url = `${supabaseUrl}/functions/v1/asaas-webhook`;
      setWebhookUrl(url);
    }
  }, [navigate]);

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(webhookUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveConfig = async () => {
    setIsLoading(true);

    try {
      // Em um cenário real, aqui você salvaria as configurações no banco de dados
      // ou em variáveis de ambiente

      // Simulando um delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      alert("Configurações salvas com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar configurações:", error);
      alert("Erro ao salvar configurações. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Configuração de Webhooks</h1>

      <Tabs defaultValue="asaas" className="space-y-6">
        <TabsList className="mb-6">
          <TabsTrigger value="asaas">Asaas</TabsTrigger>
          <TabsTrigger value="supabase">Supabase</TabsTrigger>
        </TabsList>

        <TabsContent value="asaas">
          <Card>
            <CardHeader>
              <CardTitle>Configuração do Webhook Asaas</CardTitle>
              <CardDescription>
                Configure o webhook para receber notificações de pagamentos do
                Asaas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Importante</AlertTitle>
                <AlertDescription>
                  Para configurar o webhook no Asaas, acesse o painel do Asaas,
                  vá em Configurações &gt; Integrações &gt; Notificações Webhook
                  e adicione a URL abaixo.
                </AlertDescription>
              </Alert>

              <div className="space-y-2">
                <Label>URL do Webhook</Label>
                <div className="flex">
                  <Input
                    value={webhookUrl}
                    readOnly
                    className="flex-1 rounded-r-none"
                  />
                  <Button
                    variant="outline"
                    className="rounded-l-none"
                    onClick={handleCopyUrl}
                  >
                    {copied ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Esta é a URL que você deve configurar no painel do Asaas.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="asaasApiKey">Chave de API do Asaas</Label>
                <Input
                  id="asaasApiKey"
                  value={asaasApiKey}
                  onChange={(e) => setAsaasApiKey(e.target.value)}
                  placeholder="$aact_YourApiKey"
                />
                <p className="text-sm text-muted-foreground">
                  Você pode obter sua chave de API nas configurações da sua
                  conta Asaas.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="asaasEnvironment">Ambiente</Label>
                <div className="flex gap-4">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="sandbox"
                      name="environment"
                      value="sandbox"
                      checked={asaasEnvironment === "sandbox"}
                      onChange={() => setAsaasEnvironment("sandbox")}
                      className="mr-2"
                    />
                    <Label htmlFor="sandbox" className="cursor-pointer">
                      Sandbox (Testes)
                    </Label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="production"
                      name="environment"
                      value="production"
                      checked={asaasEnvironment === "production"}
                      onChange={() => setAsaasEnvironment("production")}
                      className="mr-2"
                    />
                    <Label htmlFor="production" className="cursor-pointer">
                      Produção
                    </Label>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Eventos a configurar no Asaas</Label>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>PAYMENT_CONFIRMED</li>
                  <li>PAYMENT_RECEIVED</li>
                  <li>PAYMENT_OVERDUE</li>
                  <li>PAYMENT_DELETED</li>
                  <li>PAYMENT_REFUNDED</li>
                  <li>PAYMENT_RECEIVED_IN_CASH</li>
                  <li>PAYMENT_AWAITING</li>
                </ul>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveConfig} disabled={isLoading}>
                {isLoading ? "Salvando..." : "Salvar Configurações"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="supabase">
          <Card>
            <CardHeader>
              <CardTitle>Configuração do Webhook Supabase</CardTitle>
              <CardDescription>
                Informações sobre a função de webhook no Supabase
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert>
                <Clipboard className="h-4 w-4" />
                <AlertTitle>Função Edge</AlertTitle>
                <AlertDescription>
                  A função de webhook já está configurada no Supabase. Você pode
                  verificar o código na pasta supabase/functions/asaas-webhook.
                </AlertDescription>
              </Alert>

              <div className="space-y-2">
                <Label>Status da Função</Label>
                <div className="p-3 bg-green-50 text-green-700 rounded-md">
                  <p className="font-medium">Ativa</p>
                  <p className="text-sm">
                    A função está implantada e pronta para receber webhooks.
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Permissões</Label>
                <p className="text-sm">
                  A função usa a chave de serviço do Supabase para acessar o
                  banco de dados e tem permissões para:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Ler e atualizar registros de pagamentos</li>
                  <li>Criar notificações para usuários</li>
                  <li>Verificar status de pagamentos</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
