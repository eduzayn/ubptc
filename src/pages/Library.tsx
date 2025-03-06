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
import {
  Search,
  FileText,
  BookOpen,
  Download,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { LibraryService, LibraryMaterial } from "@/services/library.service";
import { AuthService } from "@/services/auth.service";
import { useNavigate } from "react-router-dom";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function Library() {
  const [searchQuery, setSearchQuery] = useState("");
  const [materials, setMaterials] = useState<LibraryMaterial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("all");
  const [downloadLoading, setDownloadLoading] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchMaterials() {
      try {
        setLoading(true);
        let data;

        // Buscar materiais de acordo com a aba ativa
        if (activeTab === "all") {
          data = await LibraryService.getAllMaterials();
        } else if (activeTab === "ebooks") {
          data = await LibraryService.getMaterialsByType("ebook");
        } else if (activeTab === "pdfs") {
          data = await LibraryService.getMaterialsByType("pdf");
        } else if (activeTab === "magazines") {
          data = await LibraryService.getMaterialsByType("magazine");
        }

        setMaterials(data || []);
        setError(null);
      } catch (err) {
        console.error("Erro ao buscar materiais:", err);
        setError(
          "Não foi possível carregar os materiais. Tente novamente mais tarde.",
        );
        setMaterials([]);
      } finally {
        setLoading(false);
      }
    }

    fetchMaterials();
  }, [activeTab]);

  // Efeito para buscar materiais quando o usuário pesquisa
  useEffect(() => {
    const searchTimer = setTimeout(async () => {
      if (searchQuery.trim().length > 2) {
        try {
          setLoading(true);
          const data = await LibraryService.searchMaterials(searchQuery);
          setMaterials(data || []);
        } catch (err) {
          console.error("Erro ao buscar materiais:", err);
        } finally {
          setLoading(false);
        }
      } else if (searchQuery.trim().length === 0 && materials.length === 0) {
        // Se a busca for limpa, recarregar todos os materiais
        try {
          setLoading(true);
          const data = await LibraryService.getAllMaterials();
          setMaterials(data || []);
        } catch (err) {
          console.error("Erro ao buscar materiais:", err);
        } finally {
          setLoading(false);
        }
      }
    }, 500); // Debounce de 500ms

    return () => clearTimeout(searchTimer);
  }, [searchQuery]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setSearchQuery(""); // Limpar a busca ao trocar de aba
  };

  const handleDownload = async (id: string) => {
    try {
      setDownloadLoading(id);

      // Verificar se o usuário está autenticado
      const { user } = await AuthService.getCurrentUser();
      if (!user) {
        alert("Você precisa estar logado para baixar materiais.");
        navigate("/login");
        return;
      }

      // Buscar o material para obter a URL de download
      const material = await LibraryService.getMaterialById(id);

      // Registrar o download
      await LibraryService.registerDownload(user.id, id);

      // Atualizar o contador de downloads na interface
      setMaterials((prevMaterials) =>
        prevMaterials.map((m) =>
          m.id === id ? { ...m, download_count: m.download_count + 1 } : m,
        ),
      );

      // Iniciar o download
      if (material.download_url) {
        window.open(material.download_url, "_blank");
      } else {
        throw new Error("URL de download não disponível");
      }
    } catch (err) {
      console.error("Erro ao fazer download:", err);
      alert("Não foi possível fazer o download. Tente novamente mais tarde.");
    } finally {
      setDownloadLoading(null);
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

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erro</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={handleTabChange} className="mb-8">
        <TabsList>
          <TabsTrigger value="all">Todos</TabsTrigger>
          <TabsTrigger value="ebooks">E-books</TabsTrigger>
          <TabsTrigger value="pdfs">PDFs</TabsTrigger>
          <TabsTrigger value="magazines">Revistas</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
              <span>Carregando materiais...</span>
            </div>
          ) : materials.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {materials.map((material) => (
                <MaterialCard
                  key={material.id}
                  material={material}
                  onDownload={handleDownload}
                  isLoading={downloadLoading === material.id}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                {searchQuery
                  ? `Nenhum material encontrado para "${searchQuery}"`
                  : "Nenhum material disponível"}
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="ebooks" className="mt-6">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
              <span>Carregando e-books...</span>
            </div>
          ) : materials.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {materials.map((material) => (
                <MaterialCard
                  key={material.id}
                  material={material}
                  onDownload={handleDownload}
                  isLoading={downloadLoading === material.id}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                {searchQuery
                  ? `Nenhum e-book encontrado para "${searchQuery}"`
                  : "Nenhum e-book disponível"}
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="pdfs" className="mt-6">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
              <span>Carregando PDFs...</span>
            </div>
          ) : materials.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {materials.map((material) => (
                <MaterialCard
                  key={material.id}
                  material={material}
                  onDownload={handleDownload}
                  isLoading={downloadLoading === material.id}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                {searchQuery
                  ? `Nenhum PDF encontrado para "${searchQuery}"`
                  : "Nenhum PDF disponível"}
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="magazines" className="mt-6">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
              <span>Carregando revistas...</span>
            </div>
          ) : materials.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {materials.map((material) => (
                <MaterialCard
                  key={material.id}
                  material={material}
                  onDownload={handleDownload}
                  isLoading={downloadLoading === material.id}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                {searchQuery
                  ? `Nenhuma revista encontrada para "${searchQuery}"`
                  : "Nenhuma revista disponível"}
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface MaterialCardProps {
  material: LibraryMaterial;
  onDownload: (id: string) => void;
  isLoading?: boolean;
}

function MaterialCard({
  material,
  onDownload,
  isLoading = false,
}: MaterialCardProps) {
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
    <div className="overflow-hidden flex flex-col h-full bg-white hover:shadow-md transition-shadow rounded-lg border">
      <div className="h-48 overflow-hidden">
        <img
          src={
            material.cover_image_url ||
            "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800&q=80"
          }
          alt={material.title}
          className="w-full h-full object-cover transition-transform hover:scale-105"
          loading="lazy"
        />
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-semibold">{material.title}</h3>
          <Badge variant="outline">{getTypeLabel(material.type)}</Badge>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          {material.description}
        </p>
      </div>
      <div className="px-4 space-y-3">
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
      </div>
      <div className="p-4 mt-auto">
        <Button
          className="w-full flex items-center gap-2"
          onClick={() => onDownload(material.id)}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Baixando...
            </>
          ) : (
            <>
              <Download size={16} />
              Baixar Material
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
