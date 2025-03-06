import { useState } from "react";
import { Link } from "react-router-dom";
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
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";

export default function CoursesList() {
  const [searchQuery, setSearchQuery] = useState("");

  // Mock data - in a real app, this would come from your API
  const courses = [
    {
      id: "1",
      title: "Fundamentos da Engenharia Civil",
      description:
        "Aprenda os conceitos básicos e fundamentais da engenharia civil moderna.",
      price: 199.9,
      isFree: false,
      category: "Engenharia",
      image:
        "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&q=80",
    },
    {
      id: "2",
      title: "Gestão de Projetos para Engenheiros",
      description:
        "Metodologias e ferramentas para gerenciar projetos de engenharia com eficiência.",
      price: 249.9,
      isFree: false,
      category: "Gestão",
      image:
        "https://images.unsplash.com/photo-1507537297725-24a1c029d3ca?w=800&q=80",
    },
    {
      id: "3",
      title: "Introdução à Associação",
      description: "Conheça os benefícios e funcionamento da nossa associação.",
      price: 0,
      isFree: true,
      category: "Institucional",
      image:
        "https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?w=800&q=80",
    },
    {
      id: "4",
      title: "Normas Técnicas Atualizadas",
      description:
        "Estudo completo sobre as normas técnicas mais recentes na área de engenharia.",
      price: 179.9,
      isFree: false,
      category: "Normas",
      image:
        "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80",
    },
  ];

  const filteredCourses = courses.filter(
    (course) =>
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.category.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8">Cursos Disponíveis</h1>

      <div className="relative mb-8">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar cursos..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <Card
            key={course.id}
            className="overflow-hidden flex flex-col h-full"
          >
            <div className="h-48 overflow-hidden">
              <img
                src={course.image}
                alt={course.title}
                className="w-full h-full object-cover transition-transform hover:scale-105"
              />
            </div>
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-xl">{course.title}</CardTitle>
                <Badge variant={course.isFree ? "secondary" : "default"}>
                  {course.isFree ? "Gratuito" : `R$ ${course.price.toFixed(2)}`}
                </Badge>
              </div>
              <CardDescription>{course.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Badge variant="outline">{course.category}</Badge>
            </CardContent>
            <CardFooter className="mt-auto">
              <Link to={`/cursos/${course.id}`} className="w-full">
                <Button className="w-full">
                  {course.isFree ? "Acessar Curso" : "Comprar Curso"}
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>

      {filteredCourses.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            Nenhum curso encontrado para "{searchQuery}"
          </p>
        </div>
      )}
    </div>
  );
}
