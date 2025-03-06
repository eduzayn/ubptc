import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreditCard, Landmark, Wallet } from "lucide-react";

interface CheckoutFormProps {
  courseTitle: string;
  price: number;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function CheckoutForm({
  courseTitle,
  price,
  onSuccess,
  onCancel,
}: CheckoutFormProps) {
  const [paymentMethod, setPaymentMethod] = useState("credit_card");
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    cpfCnpj: "",
    phone: "",
    creditCard: {
      holderName: "",
      number: "",
      expiryMonth: "",
      expiryYear: "",
      ccv: "",
    },
    billingAddress: {
      address: "",
      number: "",
      complement: "",
      neighborhood: "",
      city: "",
      state: "",
      zipCode: "",
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev],
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Em um ambiente real, aqui seria feita a integração com o Asaas
      // Simulando uma chamada de API
      setTimeout(() => {
        setIsLoading(false);
        onSuccess();
      }, 2000);
    } catch (error) {
      console.error("Erro ao processar pagamento:", error);
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Checkout</CardTitle>
        <CardDescription>
          Complete o pagamento para ter acesso ao curso: {courseTitle}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Informações Pessoais</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome Completo</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cpfCnpj">CPF/CNPJ</Label>
                  <Input
                    id="cpfCnpj"
                    name="cpfCnpj"
                    value={formData.cpfCnpj}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Forma de Pagamento</h3>
              <Tabs
                value={paymentMethod}
                onValueChange={setPaymentMethod}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger
                    value="credit_card"
                    className="flex items-center gap-2"
                  >
                    <CreditCard size={16} />
                    Cartão de Crédito
                  </TabsTrigger>
                  <TabsTrigger
                    value="bank_slip"
                    className="flex items-center gap-2"
                  >
                    <Landmark size={16} />
                    Boleto Bancário
                  </TabsTrigger>
                  <TabsTrigger value="pix" className="flex items-center gap-2">
                    <Wallet size={16} />
                    PIX
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="credit_card" className="space-y-4 mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="creditCard.holderName">
                        Nome no Cartão
                      </Label>
                      <Input
                        id="creditCard.holderName"
                        name="creditCard.holderName"
                        value={formData.creditCard.holderName}
                        onChange={handleChange}
                        required={paymentMethod === "credit_card"}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="creditCard.number">
                        Número do Cartão
                      </Label>
                      <Input
                        id="creditCard.number"
                        name="creditCard.number"
                        value={formData.creditCard.number}
                        onChange={handleChange}
                        required={paymentMethod === "credit_card"}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="creditCard.expiryMonth">Mês</Label>
                      <Input
                        id="creditCard.expiryMonth"
                        name="creditCard.expiryMonth"
                        placeholder="MM"
                        maxLength={2}
                        value={formData.creditCard.expiryMonth}
                        onChange={handleChange}
                        required={paymentMethod === "credit_card"}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="creditCard.expiryYear">Ano</Label>
                      <Input
                        id="creditCard.expiryYear"
                        name="creditCard.expiryYear"
                        placeholder="AAAA"
                        maxLength={4}
                        value={formData.creditCard.expiryYear}
                        onChange={handleChange}
                        required={paymentMethod === "credit_card"}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="creditCard.ccv">CVV</Label>
                      <Input
                        id="creditCard.ccv"
                        name="creditCard.ccv"
                        maxLength={4}
                        value={formData.creditCard.ccv}
                        onChange={handleChange}
                        required={paymentMethod === "credit_card"}
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="bank_slip" className="space-y-4 mt-4">
                  <div className="bg-muted p-4 rounded-md">
                    <p className="text-sm">
                      O boleto será gerado após a confirmação do pedido e
                      enviado para o seu email.
                    </p>
                    <p className="text-sm mt-2">
                      Prazo de compensação: até 3 dias úteis.
                    </p>
                  </div>
                </TabsContent>

                <TabsContent value="pix" className="space-y-4 mt-4">
                  <div className="bg-muted p-4 rounded-md">
                    <p className="text-sm">
                      O QR Code do PIX será gerado após a confirmação do pedido.
                    </p>
                    <p className="text-sm mt-2">
                      O pagamento é processado instantaneamente.
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Endereço de Cobrança</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="billingAddress.address">Endereço</Label>
                  <Input
                    id="billingAddress.address"
                    name="billingAddress.address"
                    value={formData.billingAddress.address}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="billingAddress.number">Número</Label>
                    <Input
                      id="billingAddress.number"
                      name="billingAddress.number"
                      value={formData.billingAddress.number}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="billingAddress.complement">
                      Complemento
                    </Label>
                    <Input
                      id="billingAddress.complement"
                      name="billingAddress.complement"
                      value={formData.billingAddress.complement}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="billingAddress.neighborhood">Bairro</Label>
                  <Input
                    id="billingAddress.neighborhood"
                    name="billingAddress.neighborhood"
                    value={formData.billingAddress.neighborhood}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="billingAddress.city">Cidade</Label>
                  <Input
                    id="billingAddress.city"
                    name="billingAddress.city"
                    value={formData.billingAddress.city}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="billingAddress.state">Estado</Label>
                  <Input
                    id="billingAddress.state"
                    name="billingAddress.state"
                    value={formData.billingAddress.state}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="billingAddress.zipCode">CEP</Label>
                  <Input
                    id="billingAddress.zipCode"
                    name="billingAddress.zipCode"
                    value={formData.billingAddress.zipCode}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="bg-muted p-4 rounded-md">
              <div className="flex justify-between items-center">
                <span className="font-medium">Total:</span>
                <span className="text-xl font-bold">R$ {price.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="flex justify-between mt-8">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Processando..." : "Finalizar Compra"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
