import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.6";

const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

const supabase = createClient(supabaseUrl, supabaseServiceKey);

serve(async (req) => {
  // CORS headers
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers":
          "authorization, x-client-info, apikey, content-type",
      },
    });
  }

  try {
    const { action } = await req.json();

    // Obter estatísticas do sistema
    if (action === "getStats") {
      // Total de usuários
      const { count: totalUsers, error: usersError } = await supabase
        .from("users")
        .select("*", { count: "exact", head: true });

      if (usersError) throw usersError;

      // Total de pagamentos
      const { count: totalPayments, error: paymentsError } = await supabase
        .from("payments")
        .select("*", { count: "exact", head: true });

      if (paymentsError) throw paymentsError;

      // Total de downloads
      const { count: totalDownloads, error: downloadsError } = await supabase
        .from("user_downloads")
        .select("*", { count: "exact", head: true });

      if (downloadsError) throw downloadsError;

      // Usuários ativos nos últimos 30 dias
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { count: activeUsers, error: activeUsersError } = await supabase
        .from("auth.users")
        .select("*", { count: "exact", head: true })
        .gte("last_sign_in_at", thirtyDaysAgo.toISOString());

      if (activeUsersError) throw activeUsersError;

      return new Response(
        JSON.stringify({
          totalUsers,
          totalPayments,
          totalDownloads,
          activeUsers,
          timestamp: new Date().toISOString(),
        }),
        {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
          status: 200,
        },
      );
    }

    // Verificar integridade do sistema
    if (action === "healthCheck") {
      // Verificar conexão com o banco de dados
      const { data: dbCheck, error: dbError } = await supabase
        .from("users")
        .select("count(*)", { count: "exact", head: true });

      // Verificar armazenamento
      const { data: storageCheck, error: storageError } =
        await supabase.storage.listBuckets();

      // Verificar autenticação
      const { data: authCheck, error: authError } =
        await supabase.auth.getUser();

      return new Response(
        JSON.stringify({
          database: !dbError,
          storage: !storageError,
          auth: !authError,
          status: "healthy",
          timestamp: new Date().toISOString(),
        }),
        {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
          status: 200,
        },
      );
    }

    return new Response(JSON.stringify({ error: "Ação não reconhecida" }), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      status: 400,
    });
  } catch (error) {
    console.error("Erro:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      status: 500,
    });
  }
});
