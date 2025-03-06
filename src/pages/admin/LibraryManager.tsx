import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FileText,
  BookOpen,
  Trash2,
  Edit,
  Plus,
  Upload,
  Loader2,
} from "lucide-react";
import { LibraryService, LibraryMaterial } from "@/services/library.service";

export default function LibraryManager() {
  const [activeTab, setActiveTab] = useState("list");
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [materials, setMaterials] = useState<LibraryMaterial[]>([]);
  const [loadingMaterials, setLoadingMaterials] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMaterials() {
      try {
        setLoadingMaterials(true);
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
        setLoadingMaterials(false);
      }
    }

    fetchMaterials();
  }, []);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "ebook",
    category: "",
    pages: "",
    file: null as File | null,
    coverImage: null as File | null,
  });

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

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const { name } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: e.target.files![0],
      }));
    }
  };

  const handleTypeChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      type: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Upload do arquivo
      let downloadUrl = "#";
      if (formData.file) {
        const fileName = `${Date.now()}-${formData.file.name}`;
        downloadUrl = await LibraryService.uploadFile(formData.file, fileName);
      }

      // Upload da imagem de capa
      let coverImageUrl =
        "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800&q=80";
      if (formData.coverImage) {
        const fileName = `${Date.now()}-${formData.coverImage.name}`;
        coverImageUrl = await LibraryService.uploadCoverImage(
          formData.coverImage,
          fileName,
        );
      }

      // Criar um novo material
      const newMaterial = await LibraryService.addMaterial({
        title: formData.title,
        description: formData.description,
        type: formData.type,
        category: formData.category,
        file_size: formData.file
          ? `${(formData.file.size / (1024 * 1024)).toFixed(1)} MB`
          : "0 MB",
        pages: parseInt(formData.pages) || 0,
        published_at: new Date().toISOString(),
        download_url: downloadUrl,
        cover_image_url: coverImageUrl,
      });

      // Adicionar o novo material à lista
      setMaterials((prev) => [...prev, newMaterial]);

      // Limpar o formulário
      setFormData({
        title: "",
        description: "",
        type: "ebook",
        category: "",
        pages: "",
        file: null,
        coverImage: null,
      });

      setActiveTab("list");
      alert("Material adicionado com sucesso!");
    } catch (error) {
      console.error("Erro ao adicionar material:", error);
      alert("Erro ao adicionar material. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir este material?")) {
      try {
        await LibraryService.deleteMaterial(id);
        setMaterials((prev) => prev.filter((material) => material.id !== id));
        alert("Material excluído com sucesso!");
      } catch (error) {
        console.error("Erro ao excluir material:", error);
        alert("Erro ao excluir material. Tente novamente.");
      }
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Gerenciador da Biblioteca</h1>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="mb-6">
          <TabsTrigger value="list">Lista de Materiais</TabsTrigger>
          <TabsTrigger value="add">Adicionar Material</TabsTrigger>
        </TabsList>

        <TabsContent value="list">
          <Card>
            <CardHeader>
              <CardTitle>Materiais Disponíveis</CardTitle>
              <CardDescription>
                Gerencie os materiais disponíveis na biblioteca do associado
              </CardDescription>
              <div className="mt-4">
                <Input
                  placeholder="Buscar materiais..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent>
              {loadingMaterials ? (
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <span className="ml-2">Carregando materiais...</span>
                </div>
              ) : error ? (
                <div className="text-center py-6 text-destructive">
                  <p>{error}</p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => window.location.reload()}
                  >
                    Tentar novamente
                  </Button>
                </div>
              ) : (
                <>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Título</TableHead>
                          <TableHead>Tipo</TableHead>
                          <TableHead>Categoria</TableHead>
                          <TableHead>Páginas</TableHead>
                          <TableHead>Downloads</TableHead>
                          <TableHead>Publicado em</TableHead>
                          <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredMaterials.map((material) => (
                          <TableRow key={material.id}>
                            <TableCell className="font-medium">
                              <div className="flex items-center gap-2">
                                {getTypeIcon(material.type)}
                                {material.title}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">
                                {material.type === "ebook"
                                  ? "E-book"
                                  : material.type === "pdf"
                                    ? "PDF"
                                    : "Revista"}
                              </Badge>
                            </TableCell>
                            <TableCell>{material.category}</TableCell>
                            <TableCell>{material.pages}</TableCell>
                            <TableCell>{material.download_count}</TableCell>
                            <TableCell>
                              {formatDate(material.published_at)}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() =>
                                    alert("Editar: " + material.id)
                                  }
                                >
                                  <Edit size={16} />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDelete(material.id)}
                                  className="text-destructive"
                                >
                                  <Trash2 size={16} />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  {filteredMaterials.length === 0 && (
                    <div className="text-center py-6">
                      <p className="text-muted-foreground">
                        Nenhum material encontrado
                      </p>
                    </div>
                  )}
                </>
              )}
            </CardContent>
            <CardFooter>
              <Button
                onClick={() => setActiveTab("add")}
                className="flex items-center gap-2"
              >
                <Plus size={16} />
                Adicionar Novo Material
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="add">
          <Card>
            <CardHeader>
              <CardTitle>Adicionar Novo Material</CardTitle>
              <CardDescription>
                Preencha os campos abaixo para adicionar um novo material à
                biblioteca
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Título</Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="type">Tipo</Label>
                    <Select
                      value={formData.type}
                      onValueChange={handleTypeChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ebook">E-book</SelectItem>
                        <SelectItem value="pdf">PDF</SelectItem>
                        <SelectItem value="magazine">Revista</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Categoria</Label>
                    <Input
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pages">Número de Páginas</Label>
                    <Input
                      id="pages"
                      name="pages"
                      type="number"
                      value={formData.pages}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="file">Arquivo</Label>
                  <div className="flex items-center gap-4">
                    <Input
                      id="file"
                      name="file"
                      type="file"
                      accept=".pdf,.epub,.mobi"
                      onChange={handleFileChange}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="coverImage">Imagem de Capa</Label>
                  <div className="flex items-center gap-4">
                    <div className="w-24 h-24 bg-muted rounded-md flex items-center justify-center overflow-hidden">
                      {formData.coverImage ? (
                        <img
                          src={URL.createObjectURL(formData.coverImage)}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Upload className="text-muted-foreground" />
                      )}
                    </div>
                    <Input
                      id="coverImage"
                      name="coverImage"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      required
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-4 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setActiveTab("list")}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Salvando..." : "Salvar Material"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
