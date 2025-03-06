import { Button } from "../components/ui/button";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="container mx-auto py-16 px-4 text-center">
      <h1 className="text-4xl font-bold mb-4">404 - Página não encontrada</h1>
      <p className="text-xl text-muted-foreground mb-8">
        A página que você está procurando não existe ou foi movida.
      </p>
      <Link to="/">
        <Button size="lg">Voltar para a página inicial</Button>
      </Link>
    </div>
  );
}
