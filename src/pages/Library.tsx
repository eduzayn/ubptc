import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Search, FileText, BookOpen, Download } from "lucide-react";
import { LibraryService, LibraryMaterial } from "@/services/library.service";

export default function Library() {
  const [searchQuery, setSearchQuery] = useState("");
  const [materials, setMaterials] = useState<LibraryMaterial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMaterials() {
      try {
        setLoading(true);
        const data = await LibraryService.getAllMaterials();
        setMaterials(data);
        setError(null);
      } catch (err) {
        console.error("Erro ao buscar materiais:", err);
        setError(
          "Não foi possível carregar os materiais. Tente novamente mais tarde.",
        );
        // Fallback para dados mockados em caso de erro
        setMaterials([
          {
            id: "1",
            created_at: new Date().toISOString(),
            title: "Manual de Boas Práticas em Engenharia Civil",
            description: "Guia completo com as melhores práticas do setor.",
            type: "ebook",
            category: "Engenharia",
            file_size: "8.5 MB",
            pages: 124,
            published_at: new Date(2023, 5, 15).toISOString(),
            download_url: "#",
            cover_image_url:
              "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800&q=80",
            download_count: 124,
          },
          {
            id: "2",
            created_at: new Date().toISOString(),
            title: "Normas Técnicas Atualizadas - 2023",
            description:
              "Compilado das principais normas técnicas atualizadas.",
            type: "pdf",
            category: "Normas",
            file_size: "12.3 MB",
            pages: 210,
            published_at: new Date(2023, 8, 10).toISOString(),
            download_url: "#",
            cover_image_url:
              "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&q=80",
            download_count: 98,
          },
          {
            id: "3",
            created_at: new Date().toISOString(),
            title: "Gestão de Projetos para Engenheiros",
            description:
              "Metodologias e ferramentas para gerenciar projetos com eficiência.",
            type: "ebook",
            category: "Gestão",
            file_size: "6.7 MB",
            pages: 98,
            published_at: new Date(2023, 3, 22).toISOString(),
            download_url: "#",
            cover_image_url:
              "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80",
            download_count: 76,
          },
          {
            id: "4",
            created_at: new Date().toISOString(),
            title: "Estudo de Caso: Construção Sustentável",
            description:
              "Análise detalhada de um projeto de construção sustentável.",
            type: "pdf",
            category: "Sustentabilidade",
            file_size: "5.2 MB",
            pages: 45,
            published_at: new Date(2023, 7, 5).toISOString(),
            download_url: "#",
            cover_image_url:
              "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800&q=80",
            download_count: 45,
          },
          {
            id: "5",
            created_at: new Date().toISOString(),
            title: "Revista Técnica - Edição Especial",
            description: "Artigos técnicos e novidades do setor.",
            type: "magazine",
            category: "Publicações",
            file_size: "15.8 MB",
            pages: 64,
            published_at: new Date(2023, 9, 1).toISOString(),
            download_url: "#",
            cover_image_url:
              "https://images.unsplash.com/photo-1603796846097-bee99e4a601f?w=800&q=80",
            download_count: 64,
          },
        ]);
      } finally {
        setLoading(false);
      }
    }

    fetchMaterials();
  }, []);

  const filteredMaterials = materials.filter(
    (material) =>
      material.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      material.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      material.category.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("pt-BR");
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "ebook":
        return <BookOpen size={18} className="text-primary" />;
      case "pdf":
      case "magazine":
      default:
        return <FileText size={18} className="text-primary" />;
    }
  };

  const handleDownload = async (id: string) => {
    try {
      // Obter o usuário atual do localStorage (em um app real, viria do contexto de autenticação)
      const userDataStr = localStorage.getItem("userData");
      if (!userDataStr) {
        alert("Você precisa estar logado para baixar materiais.");
        return;
      }

      const userData = JSON.parse(userDataStr);
      const userId = userData.id;

      // Buscar o material para obter a URL de download
      const material = await LibraryService.getMaterialById(id);

      // Registrar o download
      await LibraryService.registerDownload(userId, id);

      // Iniciar o download (em um app real, isso abriria a URL em uma nova aba ou iniciaria o download)
      window.open(material.download_url, "_blank");
    } catch (err) {
      console.error("Erro ao fazer download:", err);
      alert("Não foi possível fazer o download. Tente novamente mais tarde.");
    }
  };

  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8">Biblioteca do Associado</h1>

      <div className="relative mb-8">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar materiais..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <Tabs defaultValue="all" className="mb-8">
        <TabsList>
          <TabsTrigger value="all">Todos</TabsTrigger>
          <TabsTrigger value="ebooks">E-books</TabsTrigger>
          <TabsTrigger value="pdfs">PDFs</TabsTrigger>
          <TabsTrigger value="magazines">Revistas</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMaterials.map((material) => (
              <MaterialCard
                key={material.id}
                material={material}
                onDownload={handleDownload}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="ebooks" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMaterials
              .filter((material) => material.type === "ebook")
              .map((material) => (
                <MaterialCard
                  key={material.id}
                  material={material}
                  onDownload={handleDownload}
                />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="pdfs" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMaterials
              .filter((material) => material.type === "pdf")
              .map((material) => (
                <MaterialCard
                  key={material.id}
                  material={material}
                  onDownload={handleDownload}
                />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="magazines" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMaterials
              .filter((material) => material.type === "magazine")
              .map((material) => (
                <MaterialCard
                  key={material.id}
                  material={material}
                  onDownload={handleDownload}
                />
              ))}
          </div>
        </TabsContent>
      </Tabs>

      {filteredMaterials.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            Nenhum material encontrado para "{searchQuery}"
          </p>
        </div>
      )}
    </div>
  );
}

interface MaterialCardProps {
  material: LibraryMaterial;
  onDownload: (id: string) => void;
}

function MaterialCard({ material, onDownload }: MaterialCardProps) {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("pt-BR");
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "ebook":
        return <BookOpen size={18} className="text-primary" />;
      case "pdf":
      case "magazine":
      default:
        return <FileText size={18} className="text-primary" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "ebook":
        return "E-book";
      case "pdf":
        return "PDF";
      case "magazine":
        return "Revista";
      default:
        return type;
    }
  };

  return (
    <Card className="overflow-hidden flex flex-col h-full">
      <div className="h-48 overflow-hidden">
        <img
          src={
            material.cover_image_url ||
            "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800&q=80"
          }
          alt={material.title}
          className="w-full h-full object-cover transition-transform hover:scale-105"
        />
      </div>
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">{material.title}</CardTitle>
          <Badge variant="outline">{getTypeLabel(material.type)}</Badge>
        </div>
        <CardDescription>{material.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2">
          {getTypeIcon(material.type)}
          <span className="text-sm text-muted-foreground">
            {material.pages} páginas • {material.file_size}
          </span>
        </div>
        <Badge variant="secondary">{material.category}</Badge>
        <div className="flex justify-between items-center">
          <p className="text-xs text-muted-foreground">
            Publicado em: {formatDate(material.published_at)}
          </p>
          <p className="text-xs text-muted-foreground">
            {material.download_count} downloads
          </p>
        </div>
      </CardContent>
      <CardFooter className="mt-auto">
        <Button
          className="w-full flex items-center gap-2"
          onClick={() => onDownload(material.id)}
        >
          <Download size={16} />
          Baixar Material
        </Button>
      </CardFooter>
    </Card>
  );
}
