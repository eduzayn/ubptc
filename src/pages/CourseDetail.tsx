import { useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, BookOpen, FileText, Video } from "lucide-react";
import CheckoutForm from "@/components/payment/CheckoutForm";

export default function CourseDetail() {
  const { id } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(false);

  // Mock data - in a real app, this would come from your API based on the ID
  const course = {
    id: id || "1",
    title: "Fundamentos da Engenharia Civil",
    description:
      "Aprenda os conceitos básicos e fundamentais da engenharia civil moderna. Este curso abrange desde princípios estruturais até técnicas de construção sustentável, preparando você para os desafios da engenharia contemporânea.",
    price: 199.9,
    isFree: false,
    category: "Engenharia",
    image:
      "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&q=80",
    instructor: "Dr. Carlos Mendes",
    duration: "12 horas",
    modules: [
      {
        title: "Introdução à Engenharia Civil",
        lessons: [
          {
            title: "História da Engenharia Civil",
            type: "video",
            duration: "45 min",
          },
          { title: "Áreas de Atuação", type: "video", duration: "30 min" },
          { title: "Leitura Complementar", type: "pdf", duration: "15 min" },
        ],
      },
      {
        title: "Princípios Estruturais",
        lessons: [
          { title: "Forças e Cargas", type: "video", duration: "60 min" },
          {
            title: "Materiais de Construção",
            type: "video",
            duration: "45 min",
          },
          { title: "Exercícios Práticos", type: "pdf", duration: "30 min" },
        ],
      },
      {
        title: "Projetos Sustentáveis",
        lessons: [
          { title: "Construção Verde", type: "video", duration: "50 min" },
          { title: "Eficiência Energética", type: "video", duration: "40 min" },
          { title: "Estudo de Caso", type: "pdf", duration: "25 min" },
        ],
      },
    ],
  };

  const [showCheckout, setShowCheckout] = useState(false);

  const handlePurchase = () => {
    setShowCheckout(true);
  };

  const handleCheckoutSuccess = () => {
    setShowCheckout(false);
    alert("Pagamento processado com sucesso! Você já pode acessar o curso.");
    // Aqui redirecionaria para a página do curso
  };

  const handleCheckoutCancel = () => {
    setShowCheckout(false);
  };

  return (
    <div className="container mx-auto py-12 px-4">
      {showCheckout ? (
        <CheckoutForm
          courseTitle={course.title}
          price={course.price}
          onSuccess={handleCheckoutSuccess}
          onCancel={handleCheckoutCancel}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="rounded-lg overflow-hidden mb-6">
              <img
                src={course.image}
                alt={course.title}
                className="w-full h-64 object-cover"
              />
            </div>

            <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="outline">{course.category}</Badge>
              <Badge variant="outline">{course.duration}</Badge>
              <Badge variant={course.isFree ? "secondary" : "default"}>
                {course.isFree ? "Gratuito" : `R$ ${course.price.toFixed(2)}`}
              </Badge>
            </div>

            <p className="text-muted-foreground mb-8">{course.description}</p>

            <Tabs defaultValue="content">
              <TabsList className="mb-6">
                <TabsTrigger value="content">Conteúdo do Curso</TabsTrigger>
                <TabsTrigger value="instructor">Instrutor</TabsTrigger>
                <TabsTrigger value="certificate">Certificação</TabsTrigger>
              </TabsList>

              <TabsContent value="content" className="space-y-6">
                {course.modules.map((module, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <h3 className="text-lg font-semibold mb-4">
                        {module.title}
                      </h3>
                      <ul className="space-y-3">
                        {module.lessons.map((lesson, lessonIndex) => (
                          <li
                            key={lessonIndex}
                            className="flex items-center gap-3 p-2 rounded hover:bg-muted"
                          >
                            {lesson.type === "video" ? (
                              <Video size={18} className="text-primary" />
                            ) : lesson.type === "pdf" ? (
                              <FileText size={18} className="text-primary" />
                            ) : (
                              <BookOpen size={18} className="text-primary" />
                            )}
                            <div>
                              <p className="font-medium">{lesson.title}</p>
                              <p className="text-xs text-muted-foreground">
                                {lesson.duration}
                              </p>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="instructor">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-16 h-16 rounded-full overflow-hidden bg-muted">
                        <img
                          src="https://api.dicebear.com/7.x/avataaars/svg?seed=instructor"
                          alt={course.instructor}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold">
                          {course.instructor}
                        </h3>
                        <p className="text-muted-foreground">
                          Professor de Engenharia Civil
                        </p>
                      </div>
                    </div>
                    <p>
                      Doutor em Engenharia Civil com mais de 15 anos de
                      experiência acadêmica e profissional. Especialista em
                      estruturas e construção sustentável, com diversos artigos
                      publicados em revistas científicas internacionais.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="certificate">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <AlertCircle className="text-primary mt-1" />
                      <div>
                        <h3 className="text-lg font-semibold mb-2">
                          Certificado de Conclusão
                        </h3>
                        <p className="mb-4">
                          Ao concluir este curso, você receberá um certificado
                          digital que poderá ser baixado diretamente da
                          plataforma. O certificado é válido e reconhecido pela
                          AssociaçãoPro.
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Para obter o certificado, é necessário completar todas
                          as aulas e obter pelo menos 70% de aproveitamento nas
                          avaliações.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div>
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-2">
                  {course.isFree
                    ? "Curso Gratuito"
                    : `R$ ${course.price.toFixed(2)}`}
                </h2>
                <p className="text-muted-foreground mb-6">
                  {course.isFree
                    ? "Acesse agora mesmo este curso gratuito"
                    : "Pagamento único, acesso vitalício"}
                </p>

                <Button
                  className="w-full mb-4"
                  size="lg"
                  onClick={handlePurchase}
                  disabled={isLoading}
                >
                  {isLoading
                    ? "Processando..."
                    : course.isFree
                      ? "Acessar Curso"
                      : "Comprar Curso"}
                </Button>

                <ul className="space-y-3">
                  <li className="flex items-center gap-2 text-sm">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-primary"
                    >
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                      <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                    Acesso vitalício ao conteúdo
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-primary"
                    >
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                      <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                    Certificado digital
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-primary"
                    >
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                      <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                    Materiais complementares
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-primary"
                    >
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                      <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                    Suporte por email
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
