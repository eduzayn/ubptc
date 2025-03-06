import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.6";

const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

const supabase = createClient(supabaseUrl, supabaseServiceKey);

serve(async (req) => {
  // This is needed if you're planning to invoke your function from a browser.
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
    const payload = await req.json();
    console.log("Webhook recebido:", payload);

    // Verificar se é um evento de pagamento
    if (payload.event && payload.payment) {
      const { event, payment } = payload;

      // Buscar o registro de pagamento no banco de dados
      const { data: paymentRecord, error: findError } = await supabase
        .from("payments")
        .select("*")
        .eq("asaas_id", payment.id)
        .single();

      if (findError) {
        console.error("Erro ao buscar pagamento:", findError);
        return new Response(
          JSON.stringify({ error: "Pagamento não encontrado" }),
          {
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
            },
            status: 404,
          },
        );
      }

      // Atualizar o status do pagamento de acordo com o evento
      let newStatus = paymentRecord.status;
      let notificationTitle = "";
      let notificationMessage = "";

      switch (event) {
        case "PAYMENT_CONFIRMED":
        case "PAYMENT_RECEIVED":
        case "PAYMENT_RECEIVED_IN_CASH":
          newStatus = "completed";
          notificationTitle = "Pagamento confirmado";
          notificationMessage = `Seu pagamento de R$ ${payment.value.toFixed(2)} foi confirmado.`;
          break;
        case "PAYMENT_OVERDUE":
          newStatus = "overdue";
          notificationTitle = "Pagamento atrasado";
          notificationMessage = `Seu pagamento de R$ ${payment.value.toFixed(2)} está atrasado.`;
          break;
        case "PAYMENT_DELETED":
        case "PAYMENT_REFUNDED":
        case "PAYMENT_REFUND_IN_CASH":
          newStatus = "cancelled";
          notificationTitle = "Pagamento cancelado/reembolsado";
          notificationMessage = `Seu pagamento de R$ ${payment.value.toFixed(2)} foi cancelado ou reembolsado.`;
          break;
        case "PAYMENT_AWAITING":
        case "PAYMENT_ANTICIPATED":
        default:
          newStatus = "pending";
          notificationTitle = "Pagamento pendente";
          notificationMessage = `Seu pagamento de R$ ${payment.value.toFixed(2)} está pendente.`;
      }

      // Atualizar o registro no banco de dados
      const { data: updatedPayment, error: updateError } = await supabase
        .from("payments")
        .update({ status: newStatus })
        .eq("id", paymentRecord.id)
        .select()
        .single();

      if (updateError) {
        console.error("Erro ao atualizar pagamento:", updateError);
        return new Response(
          JSON.stringify({ error: "Erro ao atualizar pagamento" }),
          {
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
            },
            status: 500,
          },
        );
      }

      // Criar notificação para o usuário
      if (notificationTitle) {
        const { error: notificationError } = await supabase
          .from("notifications")
          .insert([
            {
              user_id: paymentRecord.user_id,
              title: notificationTitle,
              message: notificationMessage,
              type: "payment",
              read: false,
            },
          ]);

        if (notificationError) {
          console.error("Erro ao criar notificação:", notificationError);
        }
      }

      // Se o pagamento foi confirmado e é para uma associação, gerar credencial
      if (newStatus === "completed" && !paymentRecord.course_id) {
        // Aqui você poderia chamar outro serviço para gerar a credencial
        // Ou implementar a lógica diretamente aqui
        console.log(
          "Pagamento confirmado, gerando credencial para o usuário:",
          paymentRecord.user_id,
        );
      }

      return new Response(
        JSON.stringify({ success: true, status: newStatus }),
        {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
          status: 200,
        },
      );
    }

    return new Response(JSON.stringify({ message: "Webhook processado" }), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      status: 200,
    });
  } catch (error) {
    console.error("Erro ao processar webhook:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      status: 400,
    });
  }
});
