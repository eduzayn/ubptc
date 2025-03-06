import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Download, Eye } from "lucide-react";

export default function Certificates() {
  // Mock data - in a real app, this would come from your API
  const certificates = [
    {
      id: "1",
      courseTitle: "Fundamentos da Engenharia Civil",
      issueDate: new Date(2023, 8, 20),
      downloadUrl: "#",
      hours: 12,
    },
    {
      id: "2",
      courseTitle: "Introdução à Associação",
      issueDate: new Date(2023, 7, 25),
      downloadUrl: "#",
      hours: 4,
    },
  ];

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("pt-BR");
  };

  const handleDownload = (id: string) => {
    // In a real app, this would download the certificate
    alert(`Baixando certificado ${id}`);
  };

  const handleView = (id: string) => {
    // In a real app, this would open a preview of the certificate
    alert(`Visualizando certificado ${id}`);
  };

  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8">Meus Certificados</h1>

      <div className="space-y-4">
        {certificates.map((certificate) => (
          <Card key={certificate.id}>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h3 className="text-xl font-semibold">
                    {certificate.courseTitle}
                  </h3>
                  <div className="text-sm text-muted-foreground space-y-1 mt-2">
                    <p>Emitido em: {formatDate(certificate.issueDate)}</p>
                    <p>Carga horária: {certificate.hours} horas</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                    onClick={() => handleView(certificate.id)}
                  >
                    <Eye size={16} />
                    Visualizar
                  </Button>
                  <Button
                    size="sm"
                    className="flex items-center gap-2"
                    onClick={() => handleDownload(certificate.id)}
                  >
                    <Download size={16} />
                    Baixar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {certificates.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            Você ainda não possui certificados.
          </p>
        </div>
      )}
    </div>
  );
}
