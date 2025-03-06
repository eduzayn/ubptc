import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "../lib/schema";
import type { z } from "zod";
import { supabase } from "../lib/supabase";
import { uploadImage } from "../lib/upload";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";

export default function Register() {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // Form state com react-hook-form e zod
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      profession: "",
      address: "",
      phone: "",
    },
  });

  // Estado para os documentos (não incluídos no schema principal)
  const [documents, setDocuments] = useState({
    photo: null as File | null,
    addressProof: null as File | null,
    courseCertificate: null as File | null,
  });

  // Função para lidar com upload de documentos
  const handleDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files.length > 0) {
      setDocuments((prev) => ({
        ...prev,
        [name]: files[0],
      }));
    }
  };

  // Importar função para criar bucket
  const createBucketIfNotExists = async (
    bucket: string,
    isPublic: boolean = true,
  ) => {
    try {
      // Verificar se o bucket já existe
      const { data: buckets } = await supabase.storage.listBuckets();
      const bucketExists = buckets?.some((b) => b.name === bucket);

      if (!bucketExists) {
        // Criar o bucket
        const { error } = await supabase.storage.createBucket(bucket, {
          public: isPublic,
        });

        if (error) throw error;
      }

      return true;
    } catch (error) {
      console.error(`Erro ao criar bucket ${bucket}:`, error);
      throw error;
    }
  };

  // Função para submeter o formulário
  const onSubmit = async (data: z.infer<typeof registerSchema>) => {
    setIsLoading(true);

    try {
      // Criar usuário no Supabase Auth
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            name: data.name,
          },
        },
      });

      if (error) throw error;

      // Upload da foto do usuário se fornecida
      let photoUrl = "";
      if (documents.photo) {
        // Garantir que o bucket existe
        await createBucketIfNotExists("avatars", true);
        photoUrl = await uploadImage(
          documents.photo,
          "avatars",
          authData.user?.id,
        );
      }

      // Criar perfil do usuário na tabela users
      if (authData.user) {
        const { error: profileError } = await supabase.from("users").insert([
          {
            id: authData.user.id,
            email: data.email,
            name: data.name,
            profession: data.profession,
            address: data.address,
            phone: data.phone,
            photo_url: photoUrl || null,
            is_approved: false, // Usuários precisam ser aprovados
          },
        ]);

        if (profileError) throw profileError;
      }

      // Redirecionar para a página de checkout
      window.location.href = "/checkout";
    } catch (error: any) {
      alert(error.message || "Erro ao criar conta");
      console.error("Erro ao registrar:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              Associe-se
            </CardTitle>
            <CardDescription className="text-center">
              Preencha o formulário abaixo para se tornar um associado
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="personal" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-8">
                <TabsTrigger value="personal">Dados Pessoais</TabsTrigger>
                <TabsTrigger value="address">Endereço</TabsTrigger>
                <TabsTrigger value="documents">Documentos</TabsTrigger>
              </TabsList>

              <form onSubmit={handleSubmit(onSubmit)}>
                <TabsContent value="personal" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nome Completo</Label>
                      <Input id="name" {...register("name")} />
                      {errors.name && (
                        <p className="text-sm text-red-500 mt-1">
                          {errors.name.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="profession">Profissão</Label>
                      <Input id="profession" {...register("profession")} />
                      {errors.profession && (
                        <p className="text-sm text-red-500 mt-1">
                          {errors.profession.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" {...register("email")} />
                      {errors.email && (
                        <p className="text-sm text-red-500 mt-1">
                          {errors.email.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Telefone</Label>
                      <Input id="phone" {...register("phone")} />
                      {errors.phone && (
                        <p className="text-sm text-red-500 mt-1">
                          {errors.phone.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="password">Senha</Label>
                      <Input
                        id="password"
                        type="password"
                        {...register("password")}
                      />
                      {errors.password && (
                        <p className="text-sm text-red-500 mt-1">
                          {errors.password.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        {...register("confirmPassword")}
                      />
                      {errors.confirmPassword && (
                        <p className="text-sm text-red-500 mt-1">
                          {errors.confirmPassword.message}
                        </p>
                      )}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="address" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="address">Endereço Completo</Label>
                    <Textarea
                      id="address"
                      {...register("address")}
                      className="min-h-[100px]"
                    />
                    {errors.address && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.address.message}
                      </p>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="documents" className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="photo">Foto para Credencial</Label>
                    <Input
                      id="photo"
                      name="photo"
                      type="file"
                      accept="image/*"
                      onChange={handleDocumentChange}
                      required
                    />
                    <p className="text-sm text-muted-foreground">
                      Envie uma foto de rosto em fundo branco
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="addressProof">
                      Comprovante de Endereço
                    </Label>
                    <Input
                      id="addressProof"
                      name="addressProof"
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleDocumentChange}
                      required
                    />
                    <p className="text-sm text-muted-foreground">
                      Envie um documento recente (últimos 3 meses)
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="courseCertificate">
                      Certificado de Curso
                    </Label>
                    <Input
                      id="courseCertificate"
                      name="courseCertificate"
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleDocumentChange}
                      required
                    />
                    <p className="text-sm text-muted-foreground">
                      Envie o certificado do curso principal
                    </p>
                  </div>

                  <Button
                    type="submit"
                    className="w-full mt-6"
                    disabled={isLoading}
                  >
                    {isLoading ? "Enviando..." : "Enviar Solicitação"}
                  </Button>
                </TabsContent>
              </form>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-muted-foreground">
              Já é associado?{" "}
              <Link to="/login" className="text-primary hover:underline">
                Faça login
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
