import { z } from "zod";

// Schema para validação do formulário de login
export const loginSchema = z.object({
  email: z.string().email({ message: "Email inválido" }),
  password: z
    .string()
    .min(6, { message: "A senha deve ter pelo menos 6 caracteres" }),
});

// Schema para validação do formulário de registro
export const registerSchema = z
  .object({
    name: z
      .string()
      .min(3, { message: "O nome deve ter pelo menos 3 caracteres" }),
    email: z.string().email({ message: "Email inválido" }),
    password: z
      .string()
      .min(6, { message: "A senha deve ter pelo menos 6 caracteres" }),
    confirmPassword: z.string(),
    profession: z.string().min(2, { message: "Profissão é obrigatória" }),
    address: z.string().min(5, { message: "Endereço é obrigatório" }),
    phone: z.string().min(10, { message: "Telefone inválido" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

// Schema para validação do formulário de upload de material para biblioteca
export const libraryMaterialSchema = z.object({
  title: z
    .string()
    .min(3, { message: "O título deve ter pelo menos 3 caracteres" }),
  description: z
    .string()
    .min(10, { message: "A descrição deve ter pelo menos 10 caracteres" }),
  type: z.enum(["ebook", "pdf", "magazine"], {
    required_error: "Selecione um tipo de material",
  }),
  category: z.string().min(2, { message: "Categoria é obrigatória" }),
  pages: z.coerce
    .number()
    .positive({ message: "Número de páginas deve ser positivo" }),
  file: z.instanceof(File, { message: "Arquivo é obrigatório" }),
  coverImage: z.instanceof(File, { message: "Imagem de capa é obrigatória" }),
});

// Schema para validação do formulário de pagamento
export const paymentSchema = z.object({
  cardNumber: z
    .string()
    .regex(/^[0-9]{16}$/, { message: "Número de cartão inválido" }),
  cardExpiry: z.string().regex(/^(0[1-9]|1[0-2])\/([0-9]{2})$/, {
    message: "Data de validade inválida",
  }),
  cardCvv: z.string().regex(/^[0-9]{3,4}$/, { message: "CVV inválido" }),
  cardHolder: z.string().min(3, { message: "Nome no cartão é obrigatório" }),
  installments: z.string().optional(),
});
