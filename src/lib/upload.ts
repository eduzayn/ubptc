import { supabase } from "./supabase";

/**
 * Faz upload de um arquivo para o bucket de armazenamento do Supabase
 * @param file Arquivo a ser enviado
 * @param bucket Nome do bucket no Supabase
 * @param path Caminho dentro do bucket (pasta)
 * @returns URL pública do arquivo
 */
export async function uploadFile(file, bucket, path) {
  if (path === undefined) path = "";

  try {
    // Gerar um nome de arquivo único baseado no timestamp e nome original
    const timestamp = new Date().getTime();
    const fileExt = file.name.split(".").pop();
    const fileName = `${timestamp}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    const filePath = path ? `${path}/${fileName}` : fileName;

    // Fazer upload do arquivo
    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      throw uploadError;
    }

    // Obter a URL pública do arquivo
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return urlData.publicUrl;
  } catch (error) {
    console.error("Erro ao fazer upload do arquivo:", error);
    throw error;
  }
}

/**
 * Faz upload de uma imagem com redimensionamento opcional
 * @param file Arquivo de imagem
 * @param bucket Nome do bucket no Supabase
 * @param path Caminho dentro do bucket (pasta)
 * @returns URL pública da imagem
 */
export async function uploadImage(file, bucket, path) {
  if (path === undefined) path = "";

  // Verificar se o arquivo é uma imagem
  if (!file.type.startsWith("image/")) {
    throw new Error("O arquivo enviado não é uma imagem válida");
  }

  return uploadFile(file, bucket, path);
}

/**
 * Exclui um arquivo do bucket de armazenamento
 * @param url URL pública do arquivo
 * @param bucket Nome do bucket no Supabase
 * @returns boolean indicando sucesso
 */
export async function deleteFile(url, bucket) {
  try {
    // Extrair o caminho do arquivo da URL
    const urlObj = new URL(url);
    const pathSegments = urlObj.pathname.split("/");
    const filePath = pathSegments
      .slice(pathSegments.indexOf(bucket) + 1)
      .join("/");

    // Excluir o arquivo
    const { error } = await supabase.storage.from(bucket).remove([filePath]);

    if (error) {
      throw error;
    }

    return true;
  } catch (error) {
    console.error("Erro ao excluir arquivo:", error);
    throw error;
  }
}

/**
 * Cria um bucket de armazenamento se ele não existir
 * @param bucket Nome do bucket a ser criado
 * @param isPublic Define se o bucket será público
 * @returns boolean indicando sucesso
 */
export async function createBucketIfNotExists(bucket, isPublic) {
  if (isPublic === undefined) isPublic = true;

  try {
    // Verificar se o bucket já existe
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some((b) => b.name === bucket);

    if (!bucketExists) {
      // Criar o bucket
      const { error } = await supabase.storage.createBucket(bucket, {
        public: isPublic,
      });

      if (error) {
        throw error;
      }
    }

    return true;
  } catch (error) {
    console.error(`Erro ao criar bucket ${bucket}:`, error);
    throw error;
  }
}
