import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { Loader2, Lock } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Simplificando para usar apenas credenciais fixas para demonstração
      if (email === "admin@associacaopro.com.br" && password === "admin123") {
        // Login direto para demonstração com console.log para debug
        console.log("Admin login successful");
        localStorage.setItem("isAdminLoggedIn", "true");

        // Forçar um reload da página após o login
        setTimeout(() => {
          console.log("Navigating to dashboard");
          window.location.href = "/admin/dashboard";
        }, 100);
        return;
      }

      setError(
        "Credenciais inválidas. Use admin@associacaopro.com.br / admin123",
      );
    } catch (err: any) {
      console.error("Erro ao fazer login:", err);
      setError(
        err.message || "Erro ao fazer login. Verifique suas credenciais.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-12 px-4 flex items-center justify-center min-h-[80vh]">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center flex items-center justify-center gap-2">
            <Lock className="h-6 w-6" />
            Área Administrativa
          </CardTitle>
          <CardDescription className="text-center">
            Digite suas credenciais para acessar o painel administrativo
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="bg-destructive/15 text-destructive p-3 rounded-md mb-4 text-sm">
              {error}
            </div>
          )}
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@associacaopro.com.br"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="admin123"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
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
        <CardFooter className="flex flex-col space-y-2 text-center">
          <p className="text-sm text-muted-foreground">
            Esta área é restrita a administradores do sistema.
          </p>
          <p className="text-xs text-primary">
            Use email: admin@associacaopro.com.br e senha: admin123
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
