import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function About() {
  return (
    <div className="bg-background">
      {/* Hero Section */}
      <section className="py-20 px-4 bg-muted">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Sobre a AssociaçãoPro
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Unindo profissionais e promovendo o desenvolvimento técnico desde
            2010
          </p>
        </div>
      </section>

      {/* Mission and Values */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Nossa Missão</h2>
              <p className="text-lg text-muted-foreground mb-6">
                Promover o desenvolvimento técnico e profissional dos
                associados, contribuindo para a valorização da profissão e para
                o avanço tecnológico do setor através de capacitação contínua e
                certificações reconhecidas pelo mercado.
              </p>
              <h2 className="text-3xl font-bold mb-6">Nossos Valores</h2>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-primary font-bold">✓</span>
                  </div>
                  <p>
                    <span className="font-semibold">Excelência técnica</span> -
                    Compromisso com os mais altos padrões de qualidade
                  </p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-primary font-bold">✓</span>
                  </div>
                  <p>
                    <span className="font-semibold">Ética profissional</span> -
                    Conduta íntegra e transparente em todas as ações
                  </p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-primary font-bold">✓</span>
                  </div>
                  <p>
                    <span className="font-semibold">Inovação</span> - Busca
                    constante por novas tecnologias e metodologias
                  </p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-primary font-bold">✓</span>
                  </div>
                  <p>
                    <span className="font-semibold">Colaboração</span> -
                    Trabalho em equipe e compartilhamento de conhecimento
                  </p>
                </li>
              </ul>
            </div>
            <div className="rounded-lg overflow-hidden shadow-lg">
              <img
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80"
                alt="Equipe da AssociaçãoPro"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* History */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Nossa História
          </h2>
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="flex gap-4">
              <div className="w-24 flex-shrink-0 text-center">
                <span className="inline-block w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold">
                  2010
                </span>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Fundação</h3>
                <p className="text-muted-foreground">
                  A AssociaçãoPro foi fundada por um grupo de 15 profissionais
                  visionários que identificaram a necessidade de uma organização
                  focada no desenvolvimento técnico contínuo.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-24 flex-shrink-0 text-center">
                <span className="inline-block w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold">
                  2015
                </span>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">
                  Expansão Nacional
                </h3>
                <p className="text-muted-foreground">
                  Alcançamos a marca de 1.000 associados e expandimos nossa
                  atuação para todo o território nacional, com representantes em
                  todas as regiões do país.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-24 flex-shrink-0 text-center">
                <span className="inline-block w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold">
                  2018
                </span>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">
                  Plataforma Digital
                </h3>
                <p className="text-muted-foreground">
                  Lançamento da nossa plataforma digital de cursos e
                  certificações, democratizando o acesso ao conhecimento técnico
                  de qualidade.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-24 flex-shrink-0 text-center">
                <span className="inline-block w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold">
                  2023
                </span>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">
                  Reconhecimento Internacional
                </h3>
                <p className="text-muted-foreground">
                  Nossas certificações passaram a ser reconhecidas
                  internacionalmente, abrindo novas oportunidades para nossos
                  associados no mercado global.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Nossa Diretoria
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-32 h-32 rounded-full overflow-hidden mx-auto mb-4">
                <img
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=director1"
                  alt="Diretor Presidente"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold">Carlos Mendes</h3>
              <p className="text-muted-foreground">Diretor Presidente</p>
            </div>
            <div className="text-center">
              <div className="w-32 h-32 rounded-full overflow-hidden mx-auto mb-4">
                <img
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=director2"
                  alt="Diretora Técnica"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold">Ana Oliveira</h3>
              <p className="text-muted-foreground">Diretora Técnica</p>
            </div>
            <div className="text-center">
              <div className="w-32 h-32 rounded-full overflow-hidden mx-auto mb-4">
                <img
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=director3"
                  alt="Diretor Financeiro"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold">Roberto Santos</h3>
              <p className="text-muted-foreground">Diretor Financeiro</p>
            </div>
            <div className="text-center">
              <div className="w-32 h-32 rounded-full overflow-hidden mx-auto mb-4">
                <img
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=director4"
                  alt="Diretora de Comunicação"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold">Patrícia Lima</h3>
              <p className="text-muted-foreground">Diretora de Comunicação</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Faça parte da nossa associação
          </h2>
          <p className="text-xl max-w-2xl mx-auto mb-8">
            Junte-se a milhares de profissionais e tenha acesso a cursos,
            certificações e uma rede de contatos exclusiva.
          </p>
          <Link to="/associar">
            <Button size="lg" variant="secondary" className="px-8">
              Associe-se Agora
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
