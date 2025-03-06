import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle } from "lucide-react";

export default function CredentialValidation() {
  const [isLoading, setIsLoading] = useState(true);
  const [isValid, setIsValid] = useState(false);
  const [credentialData, setCredentialData] = useState(null);

  // Simulando a validação de uma credencial após leitura do QR code
  useEffect(() => {
    // Em um cenário real, aqui você faria uma chamada à API para validar o QR code
    // usando o ID ou token que viria como parâmetro na URL
    const validateCredential = async () => {
      try {
        // Simulando um delay de rede
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // Simulando uma resposta positiva
        setIsValid(true);
        setCredentialData({
          id: "123456",
          name: "João Silva",
          profession: "Engenheiro Civil",
          issueDate: new Date(),
          expiryDate: new Date(
            new Date().setFullYear(new Date().getFullYear() + 1),
          ),
          status: "Ativo",
          photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=joao",
        });
      } catch (error) {
        setIsValid(false);
      } finally {
        setIsLoading(false);
      }
    };

    validateCredential();
  }, []);

  const formatDate = (date) => {
    return date.toLocaleDateString("pt-BR");
  };

  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">
        Validação de Credencial
      </h1>

      <div className="max-w-md mx-auto">
        {isLoading ? (
          <Card>
            <CardContent className="p-8 flex flex-col items-center">
              <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-center">Verificando credencial...</p>
            </CardContent>
          </Card>
        ) : isValid ? (
          <Card className="border-2 border-green-500">
            <div className="bg-green-500 text-white p-4 flex items-center justify-center gap-2">
              <CheckCircle size={24} />
              <h2 className="text-xl font-bold">Credencial Válida</h2>
            </div>
            <CardContent className="p-6">
              <div className="flex flex-col items-center mb-6">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-green-200 mb-4">
                  <img
                    src={credentialData.photo}
                    alt={credentialData.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <h3 className="text-xl font-bold text-center">
                  {credentialData.name}
                </h3>
                <p className="text-muted-foreground">
                  {credentialData.profession}
                </p>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">ID:</span>
                  <span className="text-sm">{credentialData.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Emissão:</span>
                  <span className="text-sm">
                    {formatDate(credentialData.issueDate)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Validade:</span>
                  <span className="text-sm">
                    {formatDate(credentialData.expiryDate)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Status:</span>
                  <span className="text-sm text-green-600 font-medium">
                    {credentialData.status}
                  </span>
                </div>
              </div>

              <div className="bg-green-50 p-4 rounded-md mb-4 text-center">
                <p className="text-green-700 font-medium">
                  Esta credencial está ativa e é autêntica.
                </p>
                <p className="text-sm text-green-600">
                  Verificado em {new Date().toLocaleString()}
                </p>
              </div>

              <div className="flex justify-center">
                <Button className="w-full">Verificar Outra Credencial</Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-2 border-red-500">
            <div className="bg-red-500 text-white p-4 flex items-center justify-center gap-2">
              <XCircle size={24} />
              <h2 className="text-xl font-bold">Credencial Inválida</h2>
            </div>
            <CardContent className="p-6">
              <div className="bg-red-50 p-4 rounded-md mb-6 text-center">
                <p className="text-red-700 font-medium">
                  Esta credencial não é válida ou expirou.
                </p>
                <p className="text-sm text-red-600">
                  Verificado em {new Date().toLocaleString()}
                </p>
              </div>

              <div className="space-y-4">
                <p className="text-center text-muted-foreground">
                  Possíveis motivos para a invalidação:
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <XCircle
                      size={16}
                      className="text-red-500 mt-0.5 flex-shrink-0"
                    />
                    <span>A credencial pode ter expirado</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle
                      size={16}
                      className="text-red-500 mt-0.5 flex-shrink-0"
                    />
                    <span>O associado pode estar com a anuidade pendente</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle
                      size={16}
                      className="text-red-500 mt-0.5 flex-shrink-0"
                    />
                    <span>O QR code pode ter sido adulterado</span>
                  </li>
                </ul>
              </div>

              <div className="flex justify-center mt-6">
                <Button className="w-full">Verificar Outra Credencial</Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
