import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { libraryMaterialSchema } from "@/lib/schema";
import type { z } from "zod";
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
  AlertCircle,
  BarChart,
} from "lucide-react";
import { LibraryService, LibraryMaterial } from "@/services/library.service";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function LibraryManager() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("list");
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [materials, setMaterials] = useState<LibraryMaterial[]>([]);
  const [loadingMaterials, setLoadingMaterials] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<{
    file: number;
    cover: number;
  }>({ file: 0, cover: 0 });
  const [stats, setStats] = useState<{
    totalMaterials: number;
    totalDownloads: number;
    materialsByType: Record<string, number>;
  } | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const isAdminLoggedIn = localStorage.getItem("isAdminLoggedIn");
    if (isAdminLoggedIn !== "true") {
      navigate("/admin/login");
    }
  }, [navigate]);

  // Buscar materiais ao carregar a página
  useEffect(() => {
    fetchMaterials();
    fetchStats();
  }, []);

  // Buscar materiais quando o usuário pesquisa
  useEffect(() => {
    const searchTimer = setTimeout(async () => {
      if (searchQuery.trim().length > 2) {
        try {
          setLoadingMaterials(true);
          const data = await LibraryService.searchMaterials(searchQuery);
          setMaterials(data || []);
        } catch (err) {
          console.error("Erro ao buscar materiais:", err);
          setError("Erro ao buscar materiais. Tente novamente.");
        } finally {
          setLoadingMaterials(false);
        }
      } else if (searchQuery.trim().length === 0) {
        fetchMaterials();
      }
    }, 500); // Debounce de 500ms

    return () => clearTimeout(searchTimer);
  }, [searchQuery]);

  async function fetchMaterials() {
    try {
      setLoadingMaterials(true);
      const data = await LibraryService.getAllMaterials();
      setMaterials(data || []);
      setError(null);
    } catch (err) {
      console.error("Erro ao buscar materiais:", err);
      setError(
        "Não foi possível carregar os materiais. Tente novamente mais tarde.",
      );
      setMaterials([]);
    } finally {
      setLoadingMaterials(false);
    }
  }

  async function fetchStats() {
    try {
      const statsData = await LibraryService.getLibraryStats();
      setStats(statsData);
    } catch (err) {
      console.error("Erro ao buscar estatísticas:", err);
    }
  }

  // Usar react-hook-form com validação zod
  const {
    register,
    handleSubmit: hookFormSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<z.infer<typeof libraryMaterialSchema>>({
    resolver: zodResolver(libraryMaterialSchema),
    defaultValues: {
      title: "",
      description: "",
      type: "ebook",
      category: "",
      pages: 0,
    },
  });

  // Observar os campos de arquivo para preview
  const coverImageFile = watch("coverImage") as unknown as File;
  const fileField = watch("file") as unknown as File;

  // Função para lidar com a mudança do tipo de material
  const handleTypeChange = (value: string) => {
    setValue("type", value as "ebook" | "pdf" | "magazine");
  };

  const onSubmit = async (data: z.infer<typeof libraryMaterialSchema>) => {
    setIsLoading(true);
    setUploadProgress({ file: 0, cover: 0 });

    try {
      // Upload do arquivo
      let downloadUrl = "";
      if (data.file) {
        const fileName = `${Date.now()}-${data.file.name}`;
        setUploadProgress((prev) => ({ ...prev, file: 10 }));
        downloadUrl = await LibraryService.uploadFile(data.file, fileName);
        setUploadProgress((prev) => ({ ...prev, file: 100 }));
      }

      // Upload da imagem de capa
      let coverImageUrl = "";
      if (data.coverImage) {
        const fileName = `${Date.now()}-${data.coverImage.name}`;
        setUploadProgress((prev) => ({ ...prev, cover: 10 }));
        coverImageUrl = await LibraryService.uploadCoverImage(
          data.coverImage,
          fileName,
        );
        setUploadProgress((prev) => ({ ...prev, cover: 100 }));
      }

      // Criar um novo material
      const newMaterial = await LibraryService.addMaterial({
        title: data.title,
        description: data.description,
        type: data.type,
        category: data.category,
        file_size: data.file
          ? `${(data.file.size / (1024 * 1024)).toFixed(1)} MB`
          : "0 MB",
        pages: data.pages,
        published_at: new Date().toISOString(),
        download_url: downloadUrl,
        cover_image_url: coverImageUrl,
      });

      // Adicionar o novo material à lista
      setMaterials((prev) => [newMaterial, ...prev]);

      // Limpar o formulário
      reset();

      // Atualizar estatísticas
      fetchStats();

      setActiveTab("list");
      toast({
        title: "Material adicionado",
        description: "O material foi adicionado com sucesso à biblioteca.",
        variant: "default",
      });
    } catch (error) {
      console.error("Erro ao adicionar material:", error);
      toast({
        title: "Erro",
        description: "Erro ao adicionar material. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setUploadProgress({ file: 0, cover: 0 });
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir este material?")) {
      try {
        await LibraryService.deleteMaterial(id);
        setMaterials((prev) => prev.filter((material) => material.id !== id));
        fetchStats();
        toast({
          title: "Material excluído",
          description: "O material foi excluído com sucesso.",
          variant: "default",
        });
      } catch (error) {
        console.error("Erro ao excluir material:", error);
        toast({
          title: "Erro",
          description: "Erro ao excluir material. Tente novamente.",
          variant: "destructive",
        });
      }
    }
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

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("pt-BR");
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
          <TabsTrigger value="stats">Estatísticas</TabsTrigger>
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
              {error && (
                <Alert variant="destructive" className="mb-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Erro</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {loadingMaterials ? (
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
                  <span>Carregando materiais...</span>
                </div>
              ) : materials.length > 0 ? (
                <div className="rounded-md border overflow-x-auto">
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
                      {materials.map((material) => (
                        <TableRow key={material.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              {getTypeIcon(material.type)}
                              <span
                                className="truncate max-w-[200px]"
                                title={material.title}
                              >
                                {material.title}
                              </span>
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
                                  window.open(
                                    material.download_url || "#",
                                    "_blank",
                                  )
                                }
                                title="Visualizar material"
                              >
                                <FileText size={16} />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDelete(material.id)}
                                className="text-destructive"
                                title="Excluir material"
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
              ) : (
                <div className="text-center py-6">
                  <p className="text-muted-foreground">
                    {searchQuery
                      ? `Nenhum material encontrado para "${searchQuery}"`
                      : "Nenhum material disponível"}
                  </p>
                </div>
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
              <form onSubmit={hookFormSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Título</Label>
                  <Input id="title" {...register("title")} />
                  {errors.title && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.title.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea id="description" {...register("description")} />
                  {errors.description && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.description.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="type">Tipo</Label>
                    <Select
                      defaultValue="ebook"
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
                    <Input id="category" {...register("category")} />
                    {errors.category && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.category.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pages">Número de Páginas</Label>
                    <Input
                      id="pages"
                      type="number"
                      {...register("pages", { valueAsNumber: true })}
                    />
                    {errors.pages && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.pages.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="file">Arquivo</Label>
                  <div className="flex flex-col gap-2">
                    <Input
                      id="file"
                      type="file"
                      accept=".pdf,.epub,.mobi"
                      {...register("file")}
                    />
                    {errors.file && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.file.message}
                      </p>
                    )}
                    {uploadProgress.file > 0 && (
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-primary h-2.5 rounded-full"
                          style={{ width: `${uploadProgress.file}%` }}
                        ></div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="coverImage">Imagem de Capa</Label>
                  <div className="flex items-center gap-4">
                    <div className="w-24 h-24 bg-muted rounded-md flex items-center justify-center overflow-hidden">
                      {coverImageFile ? (
                        <img
                          src={URL.createObjectURL(coverImageFile)}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Upload className="text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1 flex flex-col gap-2">
                      <Input
                        id="coverImage"
                        type="file"
                        accept="image/*"
                        {...register("coverImage")}
                      />
                      {errors.coverImage && (
                        <p className="text-sm text-red-500 mt-1">
                          {errors.coverImage.message}
                        </p>
                      )}
                      {uploadProgress.cover > 0 && (
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div
                            className="bg-primary h-2.5 rounded-full"
                            style={{ width: `${uploadProgress.cover}%` }}
                          ></div>
                        </div>
                      )}
                    </div>
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
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Salvando...
                      </>
                    ) : (
                      "Salvar Material"
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stats">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart className="h-5 w-5" />
                Estatísticas da Biblioteca
              </CardTitle>
              <CardDescription>
                Visão geral dos materiais e downloads da biblioteca
              </CardDescription>
            </CardHeader>
            <CardContent>
              {stats ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">
                          Total de Materiais
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          {stats.totalMaterials}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">
                          Total de Downloads
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          {stats.totalDownloads}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">
                          Média de Downloads
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          {stats.totalMaterials > 0
                            ? (
                                stats.totalDownloads / stats.totalMaterials
                              ).toFixed(1)
                            : "0"}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-4">
                      Materiais por Tipo
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 border rounded-md">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <BookOpen className="text-primary" />
                            <span>E-books</span>
                          </div>
                          <Badge variant="secondary">
                            {stats.materialsByType?.ebook || 0}
                          </Badge>
                        </div>
                      </div>

                      <div className="p-4 border rounded-md">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <FileText className="text-primary" />
                            <span>PDFs</span>
                          </div>
                          <Badge variant="secondary">
                            {stats.materialsByType?.pdf || 0}
                          </Badge>
                        </div>
                      </div>

                      <div className="p-4 border rounded-md">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <FileText className="text-primary" />
                            <span>Revistas</span>
                          </div>
                          <Badge variant="secondary">
                            {stats.materialsByType?.magazine || 0}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
                  <span>Carregando estatísticas...</span>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
