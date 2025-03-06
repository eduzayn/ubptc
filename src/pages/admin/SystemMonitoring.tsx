import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
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
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { MonitoringService } from "@/services/monitoring.service";

export default function SystemMonitoring() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [health, setHealth] = useState<any>(null);
  const [paymentStats, setPaymentStats] = useState<any>(null);
  const [paymentLogs, setPaymentLogs] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const isAdminLoggedIn = localStorage.getItem("isAdminLoggedIn");
    if (isAdminLoggedIn !== "true") {
      navigate("/admin/login");
    }

    loadData();
  }, [navigate]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      // Carregar estatísticas do sistema
      const statsData = await MonitoringService.getSystemStats();
      setStats(statsData);

      // Verificar integridade do sistema
      const healthData = await MonitoringService.checkSystemHealth();
      setHealth(healthData);

      // Carregar estatísticas de pagamentos
      const paymentStatsByStatus =
        await MonitoringService.getPaymentStatsByStatus();
      const paymentStatsByEvent =
        await MonitoringService.getPaymentStatsByEvent();
      setPaymentStats({
        byStatus: paymentStatsByStatus,
        byEvent: paymentStatsByEvent,
      });

      // Carregar logs de pagamentos
      const logs = await MonitoringService.getPaymentLogs();
      setPaymentLogs(logs);
    } catch (error) {
      console.error("Erro ao carregar dados de monitoramento:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Monitoramento do Sistema</h1>
        <Button
          onClick={handleRefresh}
          variant="outline"
          disabled={refreshing}
          className="flex items-center gap-2"
        >
          {refreshing ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
          Atualizar
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
          <span>Carregando dados de monitoramento...</span>
        </div>
      ) : (
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList>
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="health">Integridade</TabsTrigger>
            <TabsTrigger value="payments">Pagamentos</TabsTrigger>
            <TabsTrigger value="logs">Logs</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {stats ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total de Usuários
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.totalUsers}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {stats.activeUsers} usuários ativos nos últimos 30 dias
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total de Pagamentos
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {stats.totalPayments}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total de Downloads
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {stats.totalDownloads}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">
                      Última Atualização
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm">{formatDate(stats.timestamp)}</div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Erro</AlertTitle>
                <AlertDescription>
                  Não foi possível carregar as estatísticas do sistema.
                </AlertDescription>
              </Alert>
            )}
          </TabsContent>

          <TabsContent value="health" className="space-y-6">
            {health ? (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {health.status === "healthy" ? (
                        <>
                          <CheckCircle className="h-5 w-5 text-green-500" />
                          Sistema Saudável
                        </>
                      ) : (
                        <>
                          <XCircle className="h-5 w-5 text-red-500" />
                          Sistema com Problemas
                        </>
                      )}
                    </CardTitle>
                    <CardDescription>
                      Última verificação: {formatDate(health.timestamp)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 border rounded-md">
                        <div className="font-medium">Banco de Dados</div>
                        {health.database ? (
                          <Badge
                            variant="outline"
                            className="bg-green-50 text-green-700 border-green-200"
                          >
                            Operacional
                          </Badge>
                        ) : (
                          <Badge
                            variant="outline"
                            className="bg-red-50 text-red-700 border-red-200"
                          >
                            Falha
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center justify-between p-3 border rounded-md">
                        <div className="font-medium">Armazenamento</div>
                        {health.storage ? (
                          <Badge
                            variant="outline"
                            className="bg-green-50 text-green-700 border-green-200"
                          >
                            Operacional
                          </Badge>
                        ) : (
                          <Badge
                            variant="outline"
                            className="bg-red-50 text-red-700 border-red-200"
                          >
                            Falha
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center justify-between p-3 border rounded-md">
                        <div className="font-medium">Autenticação</div>
                        {health.auth ? (
                          <Badge
                            variant="outline"
                            className="bg-green-50 text-green-700 border-green-200"
                          >
                            Operacional
                          </Badge>
                        ) : (
                          <Badge
                            variant="outline"
                            className="bg-red-50 text-red-700 border-red-200"
                          >
                            Falha
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Erro</AlertTitle>
                <AlertDescription>
                  Não foi possível verificar a integridade do sistema.
                </AlertDescription>
              </Alert>
            )}
          </TabsContent>

          <TabsContent value="payments" className="space-y-6">
            {paymentStats ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Pagamentos por Status</CardTitle>
                    <CardDescription>
                      Distribuição de pagamentos por status
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {paymentStats.byStatus.map((stat: any) => (
                        <div
                          key={stat.status}
                          className="flex items-center justify-between"
                        >
                          <div className="font-medium capitalize">
                            {stat.status}
                          </div>
                          <Badge>{stat.count}</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Pagamentos por Evento</CardTitle>
                    <CardDescription>
                      Distribuição de pagamentos por tipo de evento
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {paymentStats.byEvent.map((stat: any) => (
                        <div
                          key={stat.event}
                          className="flex items-center justify-between"
                        >
                          <div className="font-medium">{stat.event}</div>
                          <Badge>{stat.count}</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Erro</AlertTitle>
                <AlertDescription>
                  Não foi possível carregar as estatísticas de pagamentos.
                </AlertDescription>
              </Alert>
            )}
          </TabsContent>

          <TabsContent value="logs" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Logs de Pagamentos</CardTitle>
                <CardDescription>
                  Últimos eventos de pagamento registrados
                </CardDescription>
              </CardHeader>
              <CardContent>
                {paymentLogs.length > 0 ? (
                  <div className="rounded-md border overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-border">
                        <thead>
                          <tr className="bg-muted/50">
                            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                              Data
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                              Evento
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                              Status
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                              ID Asaas
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                              Ambiente
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-card divide-y divide-border">
                          {paymentLogs.map((log) => (
                            <tr key={log.id}>
                              <td className="px-4 py-3 whitespace-nowrap text-sm">
                                {formatDate(log.created_at)}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm">
                                {log.event}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm">
                                <Badge
                                  variant="outline"
                                  className={
                                    log.status === "completed"
                                      ? "bg-green-50 text-green-700 border-green-200"
                                      : log.status === "pending"
                                        ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                                        : log.status === "overdue"
                                          ? "bg-red-50 text-red-700 border-red-200"
                                          : "bg-gray-50 text-gray-700 border-gray-200"
                                  }
                                >
                                  {log.status}
                                </Badge>
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm">
                                {log.asaas_id}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm">
                                {log.environment}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-muted-foreground">
                      Nenhum log de pagamento encontrado
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
