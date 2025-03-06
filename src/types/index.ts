export interface User {
  id: string;
  name: string;
  email: string;
  profession: string;
  address: string;
  documents: {
    photo: string;
    addressProof: string;
    courseCertificate: string;
  };
  isApproved: boolean;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  content: {
    videos?: string[];
    ebooks?: string[];
    pdfs?: string[];
  };
  isFree: boolean;
}

export interface Certificate {
  id: string;
  userId: string;
  courseId: string;
  issueDate: Date;
  downloadUrl: string;
}

export interface Credential {
  id: string;
  userId: string;
  qrCode: string;
  issueDate: Date;
  expiryDate: Date;
}

export interface Payment {
  id: string;
  userId: string;
  courseId: string;
  amount: number;
  status: "pending" | "completed" | "failed";
  paymentDate: Date;
  asaasId: string;
}
