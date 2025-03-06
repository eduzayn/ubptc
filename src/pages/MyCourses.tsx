import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

export default function MyCourses() {
  // Mock data - in a real app, this would come from your API
  const courses = [
    {
      id: "1",
      title: "Fundamentos da Engenharia Civil",
      description:
        "Aprenda os conceitos básicos e fundamentais da engenharia civil moderna.",
      progress: 75,
      lastAccessed: new Date(2023, 8, 15),
      image:
        "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&q=80",
    },
    {
      id: "3",
      title: "Introdução à Associação",
      description: "Conheça os benefícios e funcionamento da nossa associação.",
      progress: 100,
      lastAccessed: new Date(2023, 7, 20),
      image:
        "https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?w=800&q=80",
      completed: true,
    },
    {
      id: "4",
      title: "Normas Técnicas Atualizadas",
      description:
        "Estudo completo sobre as normas técnicas mais recentes na área de engenharia.",
      progress: 30,
      lastAccessed: new Date(2023, 9, 5),
      image:
        "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80",
    },
  ];

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("pt-BR");
  };

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Meus Cursos</h1>
        <Link to="/cursos">
          <Button variant="outline">Ver Todos os Cursos</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <Card
            key={course.id}
            className="overflow-hidden flex flex-col h-full"
          >
            <div className="h-48 overflow-hidden relative">
              <img
                src={course.image}
                alt={course.title}
                className="w-full h-full object-cover"
              />
              {course.completed && (
                <div className="absolute top-2 right-2">
                  <Badge className="bg-green-500 hover:bg-green-600">
                    Concluído
                  </Badge>
                </div>
              )}
            </div>
            <CardHeader>
              <CardTitle className="text-xl">{course.title}</CardTitle>
              <CardDescription>{course.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Progresso</span>
                  <span>{course.progress}%</span>
                </div>
                <Progress value={course.progress} className="h-2" />
              </div>
              <p className="text-sm text-muted-foreground">
                Último acesso: {formatDate(course.lastAccessed)}
              </p>
            </CardContent>
            <CardFooter className="mt-auto">
              <Link to={`/cursos/${course.id}/assistir`} className="w-full">
                <Button className="w-full">
                  {course.completed ? "Revisar Curso" : "Continuar Curso"}
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>

      {courses.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">
            Você ainda não possui cursos.
          </p>
          <Link to="/cursos">
            <Button>Explorar Cursos</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
