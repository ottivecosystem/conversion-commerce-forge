
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ChevronLeft, 
  CreditCard, 
  ShieldCheck, 
  Truck,
  Check,
  Info
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import Layout from '@/components/layout/Layout';
import { useCartStore } from '@/lib/store';
import { useToast } from '@/hooks/use-toast';

// Payment methods
const paymentMethods = [
  { id: 'credit-card', name: 'Cartão de Crédito', icon: CreditCard },
  { id: 'bank-slip', name: 'Boleto Bancário', icon: 'bank-slip' },
  { id: 'pix', name: 'PIX', icon: 'pix' }
];

// Shipping methods
const shippingMethods = [
  { 
    id: 'standard',
    name: 'Entrega Padrão',
    price: 1990,
    eta: '4-7 dias úteis'
  },
  { 
    id: 'express',
    name: 'Entrega Expressa',
    price: 2990,
    eta: '2-3 dias úteis'
  },
  { 
    id: 'same-day',
    name: 'Entrega no Mesmo Dia',
    price: 3990,
    eta: 'Hoje, se pedido até às 12h'
  }
];

const CheckoutPage = () => {
  const { cart, refreshCart } = useCartStore();
  const { toast } = useToast();
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  // Form states
  const [email, setEmail] = useState('');
  const [shippingAddress, setShippingAddress] = useState({
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'BR',
    phone: ''
  });
  const [billingAddress, setBillingAddress] = useState({
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'BR',
    phone: ''
  });
  const [useSameAddress, setUseSameAddress] = useState(true);
  const [selectedShippingMethod, setSelectedShippingMethod] = useState('standard');
  const [paymentMethod, setPaymentMethod] = useState('credit-card');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    name: '',
    expiry: '',
    cvc: ''
  });
  const [savePaymentInfo, setSavePaymentInfo] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  
  useEffect(() => {
    // Refresh cart data when component mounts
    refreshCart();
  }, [refreshCart]);
  
  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate shipping form
    if (!email || !shippingAddress.firstName || !shippingAddress.lastName || 
        !shippingAddress.address || !shippingAddress.city || !shippingAddress.state || 
        !shippingAddress.postalCode || !shippingAddress.phone) {
      toast({
        title: "Erro de validação",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }
    
    // If using same address, copy shipping to billing
    if (useSameAddress) {
      setBillingAddress(shippingAddress);
    }
    
    // Move to next step
    setStep(2);
    window.scrollTo(0, 0);
  };
  
  const handleShippingMethodSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(3);
    window.scrollTo(0, 0);
  };
  
  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate payment form
    if (paymentMethod === 'credit-card') {
      if (!cardDetails.number || !cardDetails.name || !cardDetails.expiry || !cardDetails.cvc) {
        toast({
          title: "Erro de validação",
          description: "Por favor, preencha todos os campos do cartão de crédito.",
          variant: "destructive"
        });
        return;
      }
    }
    
    if (!acceptTerms) {
      toast({
        title: "Termos e condições",
        description: "Por favor, aceite os termos e condições para continuar.",
        variant: "destructive"
      });
      return;
    }
    
    // Process order
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      // Success
      setStep(4);
      window.scrollTo(0, 0);
    }, 1500);
  };
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price / 100);
  };
  
  const calculateTotal = () => {
    if (!cart) return 0;
    
    const subtotal = cart.subtotal || 0;
    const shippingCost = shippingMethods.find(m => m.id === selectedShippingMethod)?.price || 0;
    
    return subtotal + shippingCost;
  };
  
  // Render order summary
  const OrderSummary = () => {
    if (!cart || !cart.items) {
      return (
        <div className="text-center py-8">
          <p>Carregando informações do carrinho...</p>
        </div>
      );
    }
    
    const subtotal = cart.subtotal || 0;
    const shippingMethod = shippingMethods.find(m => m.id === selectedShippingMethod);
    const shippingCost = shippingMethod?.price || 0;
    const total = calculateTotal();
    
    return (
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Resumo do Pedido</h3>
        
        {/* Items */}
        <div className="space-y-4 mb-6">
          {cart.items.map((item: any) => (
            <div key={item.id} className="flex justify-between">
              <div className="flex gap-3">
                <div className="h-16 w-16 bg-gray-200 rounded overflow-hidden">
                  <img
                    src={item.thumbnail || "https://via.placeholder.com/64"}
                    alt={item.title}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <p className="font-medium">{item.title}</p>
                  <p className="text-sm text-gray-600">Qtd: {item.quantity}</p>
                </div>
              </div>
              <p className="font-medium">
                {formatPrice(item.unit_price * item.quantity)}
              </p>
            </div>
          ))}
        </div>
        
        {/* Totals */}
        <div className="border-t border-gray-200 pt-4 space-y-2">
          <div className="flex justify-between">
            <p className="text-gray-600">Subtotal</p>
            <p className="font-medium">{formatPrice(subtotal)}</p>
          </div>
          
          <div className="flex justify-between">
            <p className="text-gray-600">Frete</p>
            <p className="font-medium">
              {shippingCost > 0 ? formatPrice(shippingCost) : 'Grátis'}
            </p>
          </div>
          
          {/* Optional: discounts/coupons would go here */}
          
          <div className="flex justify-between border-t border-gray-200 pt-2 mt-2">
            <p className="font-semibold">Total</p>
            <p className="font-semibold text-lg">{formatPrice(total)}</p>
          </div>
        </div>
        
        {/* Trust badges */}
        <div className="mt-6 space-y-3 pt-4 border-t border-gray-200">
          <div className="flex items-center text-sm">
            <ShieldCheck className="h-4 w-4 text-green-500 mr-2" />
            <span>Pagamento seguro e criptografado</span>
          </div>
          <div className="flex items-center text-sm">
            <Truck className="h-4 w-4 text-green-500 mr-2" />
            <span>Entrega rápida e rastreável</span>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <Layout>
      <div className="bg-gray-50 py-4 border-b border-gray-200">
        <div className="container-custom">
          <Link to="/cart" className="flex items-center text-brand-accent font-medium">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Voltar ao carrinho
          </Link>
        </div>
      </div>
      
      <div className="container-custom py-8 md:py-12">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">Finalizar Compra</h1>
        
        {/* Checkout progress */}
        <div className="mb-8 overflow-x-auto">
          <div className="flex min-w-max">
            {['Informações de Entrega', 'Método de Entrega', 'Pagamento', 'Confirmação'].map((label, i) => (
              <div key={i} className="flex-1 relative">
                <div className="flex items-center">
                  <div 
                    className={`h-8 w-8 rounded-full flex items-center justify-center ${
                      i + 1 < step ? 'bg-green-500 text-white' : i + 1 === step ? 'bg-brand-accent text-white' : 'bg-gray-200'
                    }`}
                  >
                    {i + 1 < step ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <span>{i + 1}</span>
                    )}
                  </div>
                  <div 
                    className={`h-1 flex-1 ${
                      i + 1 < step ? 'bg-green-500' : 'bg-gray-200'
                    } ${i === 3 ? 'hidden' : ''}`}
                  ></div>
                </div>
                <span className={`absolute left-0 right-0 mt-2 text-center text-sm ${
                  i + 1 === step ? 'text-brand-accent font-medium' : 'text-gray-500'
                }`}>
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main checkout form */}
          <div className="md:col-span-2">
            {/* Step 1: Shipping Information */}
            {step === 1 && (
              <form onSubmit={handleShippingSubmit} className="space-y-6">
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold mb-4">Informações de Contato</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        placeholder="seu@email.com" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold mb-4">Endereço de Entrega</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="shipping-first-name">Nome</Label>
                      <Input 
                        id="shipping-first-name" 
                        value={shippingAddress.firstName} 
                        onChange={(e) => setShippingAddress({...shippingAddress, firstName: e.target.value})}
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="shipping-last-name">Sobrenome</Label>
                      <Input 
                        id="shipping-last-name" 
                        value={shippingAddress.lastName} 
                        onChange={(e) => setShippingAddress({...shippingAddress, lastName: e.target.value})}
                        required
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <Label htmlFor="shipping-address">Endereço</Label>
                      <Input 
                        id="shipping-address" 
                        value={shippingAddress.address} 
                        onChange={(e) => setShippingAddress({...shippingAddress, address: e.target.value})}
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="shipping-city">Cidade</Label>
                      <Input 
                        id="shipping-city" 
                        value={shippingAddress.city} 
                        onChange={(e) => setShippingAddress({...shippingAddress, city: e.target.value})}
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="shipping-state">Estado</Label>
                      <Select 
                        value={shippingAddress.state} 
                        onValueChange={(value) => setShippingAddress({...shippingAddress, state: value})}
                        required
                      >
                        <SelectTrigger id="shipping-state">
                          <SelectValue placeholder="Selecione o estado" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="AC">Acre</SelectItem>
                          <SelectItem value="AL">Alagoas</SelectItem>
                          <SelectItem value="AP">Amapá</SelectItem>
                          <SelectItem value="AM">Amazonas</SelectItem>
                          <SelectItem value="BA">Bahia</SelectItem>
                          <SelectItem value="CE">Ceará</SelectItem>
                          <SelectItem value="DF">Distrito Federal</SelectItem>
                          <SelectItem value="ES">Espírito Santo</SelectItem>
                          <SelectItem value="GO">Goiás</SelectItem>
                          <SelectItem value="MA">Maranhão</SelectItem>
                          <SelectItem value="MT">Mato Grosso</SelectItem>
                          <SelectItem value="MS">Mato Grosso do Sul</SelectItem>
                          <SelectItem value="MG">Minas Gerais</SelectItem>
                          <SelectItem value="PA">Pará</SelectItem>
                          <SelectItem value="PB">Paraíba</SelectItem>
                          <SelectItem value="PR">Paraná</SelectItem>
                          <SelectItem value="PE">Pernambuco</SelectItem>
                          <SelectItem value="PI">Piauí</SelectItem>
                          <SelectItem value="RJ">Rio de Janeiro</SelectItem>
                          <SelectItem value="RN">Rio Grande do Norte</SelectItem>
                          <SelectItem value="RS">Rio Grande do Sul</SelectItem>
                          <SelectItem value="RO">Rondônia</SelectItem>
                          <SelectItem value="RR">Roraima</SelectItem>
                          <SelectItem value="SC">Santa Catarina</SelectItem>
                          <SelectItem value="SP">São Paulo</SelectItem>
                          <SelectItem value="SE">Sergipe</SelectItem>
                          <SelectItem value="TO">Tocantins</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="shipping-postal-code">CEP</Label>
                      <Input 
                        id="shipping-postal-code" 
                        value={shippingAddress.postalCode} 
                        onChange={(e) => setShippingAddress({...shippingAddress, postalCode: e.target.value})}
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="shipping-phone">Telefone</Label>
                      <Input 
                        id="shipping-phone" 
                        value={shippingAddress.phone} 
                        onChange={(e) => setShippingAddress({...shippingAddress, phone: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <div className="flex items-center">
                      <Checkbox 
                        id="same-address" 
                        checked={useSameAddress} 
                        onCheckedChange={(checked) => setUseSameAddress(!!checked)}
                      />
                      <Label htmlFor="same-address" className="ml-2">
                        O endereço de cobrança é o mesmo que o endereço de entrega
                      </Label>
                    </div>
                  </div>
                </div>
                
                {!useSameAddress && (
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h2 className="text-xl font-semibold mb-4">Endereço de Cobrança</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="billing-first-name">Nome</Label>
                        <Input 
                          id="billing-first-name" 
                          value={billingAddress.firstName} 
                          onChange={(e) => setBillingAddress({...billingAddress, firstName: e.target.value})}
                          required
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="billing-last-name">Sobrenome</Label>
                        <Input 
                          id="billing-last-name" 
                          value={billingAddress.lastName} 
                          onChange={(e) => setBillingAddress({...billingAddress, lastName: e.target.value})}
                          required
                        />
                      </div>
                      
                      <div className="md:col-span-2">
                        <Label htmlFor="billing-address">Endereço</Label>
                        <Input 
                          id="billing-address" 
                          value={billingAddress.address} 
                          onChange={(e) => setBillingAddress({...billingAddress, address: e.target.value})}
                          required
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="billing-city">Cidade</Label>
                        <Input 
                          id="billing-city" 
                          value={billingAddress.city} 
                          onChange={(e) => setBillingAddress({...billingAddress, city: e.target.value})}
                          required
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="billing-state">Estado</Label>
                        <Select 
                          value={billingAddress.state} 
                          onValueChange={(value) => setBillingAddress({...billingAddress, state: value})}
                          required
                        >
                          <SelectTrigger id="billing-state">
                            <SelectValue placeholder="Selecione o estado" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="AC">Acre</SelectItem>
                            <SelectItem value="AL">Alagoas</SelectItem>
                            <SelectItem value="AP">Amapá</SelectItem>
                            <SelectItem value="AM">Amazonas</SelectItem>
                            <SelectItem value="BA">Bahia</SelectItem>
                            <SelectItem value="CE">Ceará</SelectItem>
                            <SelectItem value="DF">Distrito Federal</SelectItem>
                            <SelectItem value="ES">Espírito Santo</SelectItem>
                            <SelectItem value="GO">Goiás</SelectItem>
                            <SelectItem value="MA">Maranhão</SelectItem>
                            <SelectItem value="MT">Mato Grosso</SelectItem>
                            <SelectItem value="MS">Mato Grosso do Sul</SelectItem>
                            <SelectItem value="MG">Minas Gerais</SelectItem>
                            <SelectItem value="PA">Pará</SelectItem>
                            <SelectItem value="PB">Paraíba</SelectItem>
                            <SelectItem value="PR">Paraná</SelectItem>
                            <SelectItem value="PE">Pernambuco</SelectItem>
                            <SelectItem value="PI">Piauí</SelectItem>
                            <SelectItem value="RJ">Rio de Janeiro</SelectItem>
                            <SelectItem value="RN">Rio Grande do Norte</SelectItem>
                            <SelectItem value="RS">Rio Grande do Sul</SelectItem>
                            <SelectItem value="RO">Rondônia</SelectItem>
                            <SelectItem value="RR">Roraima</SelectItem>
                            <SelectItem value="SC">Santa Catarina</SelectItem>
                            <SelectItem value="SP">São Paulo</SelectItem>
                            <SelectItem value="SE">Sergipe</SelectItem>
                            <SelectItem value="TO">Tocantins</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label htmlFor="billing-postal-code">CEP</Label>
                        <Input 
                          id="billing-postal-code" 
                          value={billingAddress.postalCode} 
                          onChange={(e) => setBillingAddress({...billingAddress, postalCode: e.target.value})}
                          required
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="billing-phone">Telefone</Label>
                        <Input 
                          id="billing-phone" 
                          value={billingAddress.phone} 
                          onChange={(e) => setBillingAddress({...billingAddress, phone: e.target.value})}
                          required
                        />
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="flex justify-end">
                  <Button type="submit" className="btn-primary">
                    Continuar para Entrega
                  </Button>
                </div>
              </form>
            )}
            
            {/* Step 2: Shipping Method */}
            {step === 2 && (
              <form onSubmit={handleShippingMethodSubmit} className="space-y-6">
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold mb-4">Método de Entrega</h2>
                  
                  <RadioGroup 
                    value={selectedShippingMethod} 
                    onValueChange={setSelectedShippingMethod}
                    className="space-y-4"
                  >
                    {shippingMethods.map((method) => (
                      <div 
                        key={method.id}
                        className={`border rounded-lg p-4 transition-all ${
                          selectedShippingMethod === method.id 
                            ? 'border-brand-accent bg-brand-accent/5'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <RadioGroupItem value={method.id} id={method.id} />
                          <Label htmlFor={method.id} className="flex-grow cursor-pointer">
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="font-medium">{method.name}</p>
                                <p className="text-sm text-gray-600">{method.eta}</p>
                              </div>
                              <p className="font-semibold">
                                {method.price > 0 ? formatPrice(method.price) : 'Grátis'}
                              </p>
                            </div>
                          </Label>
                        </div>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
                
                <div className="flex justify-between">
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => setStep(1)}
                  >
                    Voltar
                  </Button>
                  <Button type="submit" className="btn-primary">
                    Continuar para Pagamento
                  </Button>
                </div>
              </form>
            )}
            
            {/* Step 3: Payment */}
            {step === 3 && (
              <form onSubmit={handlePaymentSubmit} className="space-y-6">
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold mb-4">Método de Pagamento</h2>
                  
                  <RadioGroup 
                    value={paymentMethod} 
                    onValueChange={setPaymentMethod}
                    className="space-y-4"
                  >
                    {/* Credit Card */}
                    <div 
                      className={`border rounded-lg p-4 transition-all ${
                        paymentMethod === 'credit-card' 
                          ? 'border-brand-accent bg-brand-accent/5'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <RadioGroupItem value="credit-card" id="credit-card" />
                        <Label htmlFor="credit-card" className="flex items-center cursor-pointer">
                          <CreditCard className="h-5 w-5 mr-2" />
                          <span>Cartão de Crédito</span>
                        </Label>
                      </div>
                      
                      {paymentMethod === 'credit-card' && (
                        <div className="mt-4 space-y-4">
                          <div>
                            <Label htmlFor="card-number">Número do Cartão</Label>
                            <Input 
                              id="card-number" 
                              placeholder="0000 0000 0000 0000" 
                              value={cardDetails.number} 
                              onChange={(e) => setCardDetails({...cardDetails, number: e.target.value})}
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="card-name">Nome no Cartão</Label>
                            <Input 
                              id="card-name" 
                              placeholder="NOME COMPLETO" 
                              value={cardDetails.name} 
                              onChange={(e) => setCardDetails({...cardDetails, name: e.target.value})}
                            />
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="card-expiry">Data de Expiração</Label>
                              <Input 
                                id="card-expiry" 
                                placeholder="MM/AA" 
                                value={cardDetails.expiry} 
                                onChange={(e) => setCardDetails({...cardDetails, expiry: e.target.value})}
                              />
                            </div>
                            <div>
                              <Label htmlFor="card-cvc">CVC</Label>
                              <Input 
                                id="card-cvc" 
                                placeholder="123" 
                                value={cardDetails.cvc} 
                                onChange={(e) => setCardDetails({...cardDetails, cvc: e.target.value})}
                              />
                            </div>
                          </div>
                          
                          <div className="flex items-center">
                            <Checkbox 
                              id="save-card" 
                              checked={savePaymentInfo} 
                              onCheckedChange={(checked) => setSavePaymentInfo(!!checked)}
                            />
                            <Label htmlFor="save-card" className="ml-2">
                              Salvar informações do cartão para próximas compras
                            </Label>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Boleto */}
                    <div 
                      className={`border rounded-lg p-4 transition-all ${
                        paymentMethod === 'bank-slip' 
                          ? 'border-brand-accent bg-brand-accent/5'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <RadioGroupItem value="bank-slip" id="bank-slip" />
                        <Label htmlFor="bank-slip" className="flex items-center cursor-pointer">
                          <span className="h-5 w-5 mr-2">🧾</span>
                          <span>Boleto Bancário</span>
                        </Label>
                      </div>
                      
                      {paymentMethod === 'bank-slip' && (
                        <div className="mt-4">
                          <p className="text-sm text-gray-600">
                            O boleto será gerado após a conclusão do pedido. Após o pagamento, 
                            aguarde 1-2 dias úteis para a confirmação e processamento do seu pedido.
                          </p>
                        </div>
                      )}
                    </div>
                    
                    {/* PIX */}
                    <div 
                      className={`border rounded-lg p-4 transition-all ${
                        paymentMethod === 'pix' 
                          ? 'border-brand-accent bg-brand-accent/5'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <RadioGroupItem value="pix" id="pix" />
                        <Label htmlFor="pix" className="flex items-center cursor-pointer">
                          <span className="h-5 w-5 mr-2">💸</span>
                          <span>PIX</span>
                        </Label>
                      </div>
                      
                      {paymentMethod === 'pix' && (
                        <div className="mt-4">
                          <p className="text-sm text-gray-600">
                            Após finalizar seu pedido, você receberá um QR Code para pagamento. 
                            O pagamento via PIX é processado instantaneamente.
                          </p>
                        </div>
                      )}
                    </div>
                  </RadioGroup>
                </div>
                
                {/* Terms and conditions */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-start">
                    <Checkbox 
                      id="accept-terms" 
                      checked={acceptTerms} 
                      onCheckedChange={(checked) => setAcceptTerms(!!checked)}
                    />
                    <Label htmlFor="accept-terms" className="ml-2">
                      <span>Eu li e aceito os </span>
                      <Link to="/terms" className="text-brand-accent hover:underline">
                        termos e condições
                      </Link>
                      <span> e a </span>
                      <Link to="/privacy" className="text-brand-accent hover:underline">
                        política de privacidade
                      </Link>
                    </Label>
                  </div>
                </div>
                
                <div className="flex justify-between">
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => setStep(2)}
                  >
                    Voltar
                  </Button>
                  <Button 
                    type="submit" 
                    className="btn-primary"
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processando...
                      </span>
                    ) : (
                      'Finalizar Pedido'
                    )}
                  </Button>
                </div>
              </form>
            )}
            
            {/* Step 4: Confirmation */}
            {step === 4 && (
              <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <Check className="h-8 w-8 text-green-600" />
                </div>
                
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Pedido Confirmado!</h2>
                <p className="text-gray-600 mb-6">
                  Seu pedido foi recebido e está sendo processado. Um e-mail de confirmação foi enviado para {email}.
                </p>
                
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-gray-600">Número do Pedido:</span>
                    <span className="text-sm font-medium">#123456</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Data do Pedido:</span>
                    <span className="text-sm font-medium">{new Date().toLocaleDateString('pt-BR')}</span>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    asChild
                    variant="outline"
                  >
                    <Link to="/account/orders">
                      Ver meus pedidos
                    </Link>
                  </Button>
                  
                  <Button 
                    asChild
                    className="btn-primary"
                  >
                    <Link to="/">
                      Continuar comprando
                    </Link>
                  </Button>
                </div>
              </div>
            )}
          </div>
          
          {/* Order summary */}
          <div className="md:col-span-1">
            <OrderSummary />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CheckoutPage;
