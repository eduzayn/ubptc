import { useState } from "react";
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
import { Switch } from "@/components/ui/switch";
import { Plus, Trash2, Upload, Video, FileText, BookOpen } from "lucide-react";

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function CourseEditor() {
  const navigate = useNavigate();

  useEffect(() => {
    const isAdminLoggedIn = localStorage.getItem("isAdminLoggedIn");
    if (isAdminLoggedIn !== "true") {
      navigate("/admin/login");
    }
  }, [navigate]);
  const [isLoading, setIsLoading] = useState(false);
  const [modules, setModules] = useState([
    {
      id: "1",
      title: "Módulo 1: Introdução",
      lessons: [
        {
          id: "1-1",
          title: "Lição 1: Boas-vindas",
          type: "video",
          content: "",
        },
        { id: "1-2", title: "Lição 2: Visão Geral", type: "pdf", content: "" },
      ],
    },
  ]);

  const [courseData, setCourseData] = useState({
    title: "",
    description: "",
    price: "",
    isFree: false,
    category: "",
    image: null as File | null,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setCourseData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setCourseData((prev) => ({
      ...prev,
      isFree: checked,
      price: checked ? "0" : prev.price,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setCourseData((prev) => ({
        ...prev,
        image: e.target.files![0],
      }));
    }
  };

  const addModule = () => {
    const newId = (modules.length + 1).toString();
    setModules((prev) => [
      ...prev,
      {
        id: newId,
        title: `Módulo ${newId}: Novo Módulo`,
        lessons: [],
      },
    ]);
  };

  const addLesson = (moduleId: string) => {
    setModules((prev) =>
      prev.map((module) => {
        if (module.id === moduleId) {
          const newLessonId = `${moduleId}-${module.lessons.length + 1}`;
          return {
            ...module,
            lessons: [
              ...module.lessons,
              {
                id: newLessonId,
                title: `Lição ${module.lessons.length + 1}: Nova Lição`,
                type: "video",
                content: "",
              },
            ],
          };
        }
        return module;
      }),
    );
  };

  const removeModule = (moduleId: string) => {
    setModules((prev) => prev.filter((module) => module.id !== moduleId));
  };

  const removeLesson = (moduleId: string, lessonId: string) => {
    setModules((prev) =>
      prev.map((module) => {
        if (module.id === moduleId) {
          return {
            ...module,
            lessons: module.lessons.filter((lesson) => lesson.id !== lessonId),
          };
        }
        return module;
      }),
    );
  };

  const updateModuleTitle = (moduleId: string, title: string) => {
    setModules((prev) =>
      prev.map((module) => {
        if (module.id === moduleId) {
          return { ...module, title };
        }
        return module;
      }),
    );
  };

  const updateLessonTitle = (
    moduleId: string,
    lessonId: string,
    title: string,
  ) => {
    setModules((prev) =>
      prev.map((module) => {
        if (module.id === moduleId) {
          return {
            ...module,
            lessons: module.lessons.map((lesson) => {
              if (lesson.id === lessonId) {
                return { ...lesson, title };
              }
              return lesson;
            }),
          };
        }
        return module;
      }),
    );
  };

  const updateLessonType = (
    moduleId: string,
    lessonId: string,
    type: string,
  ) => {
    setModules((prev) =>
      prev.map((module) => {
        if (module.id === moduleId) {
          return {
            ...module,
            lessons: module.lessons.map((lesson) => {
              if (lesson.id === lessonId) {
                return { ...lesson, type };
              }
              return lesson;
            }),
          };
        }
        return module;
      }),
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Here you would implement the actual course creation logic
    // For now, we'll just simulate a delay
    setTimeout(() => {
      setIsLoading(false);
      alert("Curso salvo com sucesso!");
    }, 1500);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Editor de Cursos</h1>

      <form onSubmit={handleSubmit}>
        <Tabs defaultValue="basic" className="space-y-6">
          <TabsList className="mb-6">
            <TabsTrigger value="basic">Informações Básicas</TabsTrigger>
            <TabsTrigger value="content">Conteúdo do Curso</TabsTrigger>
            <TabsTrigger value="preview">Pré-visualização</TabsTrigger>
          </TabsList>

          <TabsContent value="basic">
            <Card>
              <CardHeader>
                <CardTitle>Informações Básicas do Curso</CardTitle>
                <CardDescription>
                  Preencha as informações básicas do curso que será
                  disponibilizado na plataforma.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Título do Curso</Label>
                  <Input
                    id="title"
                    name="title"
                    value={courseData.title}
                    onChange={handleChange}
                    placeholder="Ex: Fundamentos da Engenharia Civil"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descrição do Curso</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={courseData.description}
                    onChange={handleChange}
                    placeholder="Descreva o curso em detalhes..."
                    className="min-h-[120px]"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="category">Categoria</Label>
                    <Input
                      id="category"
                      name="category"
                      value={courseData.category}
                      onChange={handleChange}
                      placeholder="Ex: Engenharia, Gestão, etc."
                      required
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="isFree">Curso Gratuito</Label>
                      <Switch
                        id="isFree"
                        checked={courseData.isFree}
                        onCheckedChange={handleSwitchChange}
                      />
                    </div>

                    {!courseData.isFree && (
                      <div className="space-y-2">
                        <Label htmlFor="price">Preço (R$)</Label>
                        <Input
                          id="price"
                          name="price"
                          type="number"
                          step="0.01"
                          min="0"
                          value={courseData.price}
                          onChange={handleChange}
                          placeholder="Ex: 199.90"
                          required={!courseData.isFree}
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image">Imagem de Capa</Label>
                  <div className="flex items-center gap-4">
                    <div className="w-24 h-24 bg-muted rounded-md flex items-center justify-center overflow-hidden">
                      {courseData.image ? (
                        <img
                          src={URL.createObjectURL(courseData.image)}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Upload className="text-muted-foreground" />
                      )}
                    </div>
                    <Input
                      id="image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="content">
            <Card>
              <CardHeader>
                <CardTitle>Conteúdo do Curso</CardTitle>
                <CardDescription>
                  Organize o conteúdo do curso em módulos e lições.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {modules.map((module) => (
                  <div
                    key={module.id}
                    className="border rounded-md p-4 space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <Input
                        value={module.title}
                        onChange={(e) =>
                          updateModuleTitle(module.id, e.target.value)
                        }
                        className="font-semibold"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        type="button"
                        onClick={() => removeModule(module.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="space-y-3 pl-4">
                      {module.lessons.map((lesson) => (
                        <div
                          key={lesson.id}
                          className="flex items-center gap-3"
                        >
                          <div className="flex-shrink-0">
                            {lesson.type === "video" ? (
                              <Video size={18} className="text-primary" />
                            ) : lesson.type === "pdf" ? (
                              <FileText size={18} className="text-primary" />
                            ) : (
                              <BookOpen size={18} className="text-primary" />
                            )}
                          </div>
                          <Input
                            value={lesson.title}
                            onChange={(e) =>
                              updateLessonTitle(
                                module.id,
                                lesson.id,
                                e.target.value,
                              )
                            }
                            className="flex-grow"
                          />
                          <select
                            value={lesson.type}
                            onChange={(e) =>
                              updateLessonType(
                                module.id,
                                lesson.id,
                                e.target.value,
                              )
                            }
                            className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                          >
                            <option value="video">Vídeo</option>
                            <option value="pdf">PDF</option>
                            <option value="ebook">E-book</option>
                          </select>
                          <Button
                            variant="ghost"
                            size="icon"
                            type="button"
                            onClick={() => removeLesson(module.id, lesson.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        variant="outline"
                        size="sm"
                        type="button"
                        onClick={() => addLesson(module.id)}
                        className="flex items-center gap-2"
                      >
                        <Plus className="h-4 w-4" />
                        Adicionar Lição
                      </Button>
                    </div>
                  </div>
                ))}

                <Button
                  variant="outline"
                  type="button"
                  onClick={addModule}
                  className="flex items-center gap-2 w-full"
                >
                  <Plus className="h-4 w-4" />
                  Adicionar Módulo
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preview">
            <Card>
              <CardHeader>
                <CardTitle>Pré-visualização do Curso</CardTitle>
                <CardDescription>
                  Veja como o curso ficará para os associados.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {courseData.title ? (
                  <div className="space-y-4">
                    <div className="rounded-lg overflow-hidden">
                      {courseData.image ? (
                        <img
                          src={URL.createObjectURL(courseData.image)}
                          alt={courseData.title}
                          className="w-full h-64 object-cover"
                        />
                      ) : (
                        <div className="w-full h-64 bg-muted flex items-center justify-center">
                          <p className="text-muted-foreground">
                            Imagem de capa não definida
                          </p>
                        </div>
                      )}
                    </div>
                    <h2 className="text-2xl font-bold">{courseData.title}</h2>
                    <p className="text-muted-foreground">
                      {courseData.description}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 bg-primary/10 text-primary rounded-md text-sm">
                        {courseData.category || "Sem categoria"}
                      </span>
                      <span className="px-2 py-1 bg-primary/10 text-primary rounded-md text-sm">
                        {courseData.isFree
                          ? "Gratuito"
                          : `R$ ${courseData.price || "0"}`}
                      </span>
                    </div>
                    <div className="mt-4">
                      <h3 className="text-lg font-semibold mb-2">Módulos:</h3>
                      <ul className="space-y-2">
                        {modules.map((module) => (
                          <li
                            key={module.id}
                            className="border-l-2 border-primary/50 pl-3"
                          >
                            <p className="font-medium">{module.title}</p>
                            <p className="text-sm text-muted-foreground">
                              {module.lessons.length} lições
                            </p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">
                      Preencha as informações básicas para visualizar o curso
                    </p>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Salvando..." : "Salvar Curso"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </form>
    </div>
  );
}
