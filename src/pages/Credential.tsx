import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Share2 } from "lucide-react";

export default function Credential() {
  // Mock data - in a real app, this would come from your authentication context
  const user = {
    id: "123456",
    name: "João Silva",
    profession: "Engenheiro Civil",
    email: "joao.silva@example.com",
    issueDate: new Date(),
    expiryDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
    photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=joao",
    status: "Ativo",
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("pt-BR");
  };

  const handleDownload = () => {
    // In a real app, this would generate a PDF or image of the credential
    alert("Função de download será implementada com a API");
  };

  const handleShare = () => {
    // In a real app, this would open a share dialog
    if (navigator.share) {
      navigator.share({
        title: "Minha Credencial Digital",
        text: "Confira minha credencial digital da AssociaçãoPro",
        url: window.location.href,
      });
    } else {
      alert("Compartilhamento não suportado neste navegador");
    }
  };

  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">
        Credencial Digital
      </h1>

      <div className="max-w-md mx-auto">
        <Card className="overflow-hidden border-2 border-primary/20">
          <div className="bg-primary text-primary-foreground p-4 text-center">
            <h2 className="text-xl font-bold">AssociaçãoPro</h2>
            <p className="text-sm opacity-80">Credencial de Associado</p>
          </div>

          <CardContent className="p-6">
            <div className="flex flex-col items-center mb-6">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-primary/20 mb-4">
                <img
                  src={user.photo}
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <h3 className="text-xl font-bold text-center">{user.name}</h3>
              <p className="text-muted-foreground">{user.profession}</p>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-sm font-medium">ID:</span>
                <span className="text-sm">{user.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Emissão:</span>
                <span className="text-sm">{formatDate(user.issueDate)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Validade:</span>
                <span className="text-sm">{formatDate(user.expiryDate)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Status:</span>
                <span className="text-sm text-green-600 font-medium">
                  {user.status}
                </span>
              </div>
            </div>

            <div className="flex justify-center mb-4">
              <div className="bg-gray-100 p-2 rounded-md">
                {/* This would be a real QR code in production */}
                <div className="w-32 h-32 bg-gray-800 flex items-center justify-center text-white text-xs text-center p-2">
                  QR Code para validação
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleDownload}
                className="flex-1 flex items-center gap-2"
              >
                <Download size={16} />
                Baixar
              </Button>
              <Button
                onClick={handleShare}
                variant="outline"
                className="flex-1 flex items-center gap-2"
              >
                <Share2 size={16} />
                Compartilhar
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
