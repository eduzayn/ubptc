import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../lib/schema";
import type { z } from "zod";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../components/ui/use-toast";
import { Loader2 } from "lucide-react";

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { signIn, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  // Verificar se há um redirecionamento após o login
  const from = location.state?.from?.pathname || "/credencial";

  // Redirecionar se já estiver autenticado
  if (isAuthenticated) {
    navigate(from, { replace: true });
  }

  const onSubmit = async (data: z.infer<typeof loginSchema>) => {
    setIsLoading(true);
    setError(null);

    try {
      // Para fins de demonstração, permitir login direto com credenciais fixas
      if (
        data.email === "demo@associacaopro.com.br" &&
        data.password === "demo123"
      ) {
        // Simular login bem-sucedido
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem(
          "userData",
          JSON.stringify({
            id: "user_demo",
            name: "João Silva",
            email: "demo@associacaopro.com.br",
            profession: "Engenheiro Civil",
            photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=joao",
          }),
        );

        toast({
          title: "Login realizado com sucesso",
          description: "Bem-vindo à área do associado!",
        });

        navigate(from, { replace: true });
        return;
      }

      // Login real com Supabase
      const { error: signInError } = await signIn(data.email, data.password);

      if (signInError) {
        setError(signInError.message || "Erro ao fazer login");
        return;
      }

      toast({
        title: "Login realizado com sucesso",
        description: "Bem-vindo à área do associado!",
      });

      // Redirecionar para a página original ou para a credencial
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.message || "Ocorreu um erro ao fazer login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-16 px-4">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              Área do Associado
            </CardTitle>
            <CardDescription className="text-center">
              Entre com seu email e senha para acessar sua conta
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="bg-destructive/15 text-destructive p-3 rounded-md mb-4 text-sm">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="demo@associacaopro.com.br"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Senha</Label>
                  <Link
                    to="/recuperar-senha"
                    className="text-sm text-primary hover:underline"
                  >
                    Esqueceu a senha?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="demo123"
                  {...register("password")}
                />
                {errors.password && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Entrando...
                  </>
                ) : (
                  "Entrar"
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-center text-sm">
              Ainda não é associado?{" "}
              <Link to="/associar" className="text-primary hover:underline">
                Associe-se agora
              </Link>
            </div>
            <p className="text-xs text-center text-muted-foreground">
              Para demonstração, use: <br />
              Email:{" "}
              <span className="font-medium">
                demo@associacaopro.com.br
              </span>{" "}
              <br />
              Senha: <span className="font-medium">demo123</span>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
