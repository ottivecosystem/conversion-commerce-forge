
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Facebook, 
  Instagram, 
  Twitter, 
  Youtube, 
  Mail, 
  Phone, 
  MapPin,
  CreditCard,
  Truck,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const Footer = () => {
  return (
    <footer className="bg-brand-primary text-white">
      {/* Trust badges section */}
      <div className="border-b border-gray-700">
        <div className="container-custom py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex items-center">
              <div className="mr-4">
                <Truck className="h-10 w-10 text-brand-accent" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Entrega Rápida</h3>
                <p className="text-gray-300">Em todo Brasil</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="mr-4">
                <CreditCard className="h-10 w-10 text-brand-accent" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Pagamento Seguro</h3>
                <p className="text-gray-300">Métodos confiáveis</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="mr-4">
                <ShieldCheck className="h-10 w-10 text-brand-accent" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Garantia de Qualidade</h3>
                <p className="text-gray-300">Produtos certificados</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="mr-4">
                <Phone className="h-10 w-10 text-brand-accent" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Suporte 24/7</h3>
                <p className="text-gray-300">Atendimento dedicado</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main footer section */}
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Column 1: About */}
          <div>
            <h2 className="text-xl font-bold mb-4">Commerce Forge</h2>
            <p className="text-gray-300 mb-4">
              Sua loja online completa com os melhores produtos e uma experiência de compra incomparável.
            </p>
            <div className="flex space-x-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-brand-accent">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-brand-accent">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-brand-accent">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="hover:text-brand-accent">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          {/* Column 2: Links */}
          <div>
            <h2 className="text-xl font-bold mb-4">Links Úteis</h2>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-gray-300 hover:text-white flex items-center">
                  <ArrowRight className="h-4 w-4 mr-2" /> Sobre Nós
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-300 hover:text-white flex items-center">
                  <ArrowRight className="h-4 w-4 mr-2" /> Perguntas Frequentes
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-300 hover:text-white flex items-center">
                  <ArrowRight className="h-4 w-4 mr-2" /> Termos e Condições
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-300 hover:text-white flex items-center">
                  <ArrowRight className="h-4 w-4 mr-2" /> Política de Privacidade
                </Link>
              </li>
              <li>
                <Link to="/shipping" className="text-gray-300 hover:text-white flex items-center">
                  <ArrowRight className="h-4 w-4 mr-2" /> Política de Envio
                </Link>
              </li>
              <li>
                <Link to="/refund" className="text-gray-300 hover:text-white flex items-center">
                  <ArrowRight className="h-4 w-4 mr-2" /> Política de Devolução
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Column 3: Contact */}
          <div>
            <h2 className="text-xl font-bold mb-4">Entre em Contato</h2>
            <ul className="space-y-4">
              <li className="flex">
                <MapPin className="h-5 w-5 mr-3 flex-shrink-0" />
                <span className="text-gray-300">Av. Paulista, 1000, São Paulo - SP</span>
              </li>
              <li className="flex">
                <Phone className="h-5 w-5 mr-3 flex-shrink-0" />
                <span className="text-gray-300">(11) 9999-9999</span>
              </li>
              <li className="flex">
                <Mail className="h-5 w-5 mr-3 flex-shrink-0" />
                <span className="text-gray-300">contato@commerceforge.com</span>
              </li>
            </ul>
          </div>
          
          {/* Column 4: Newsletter */}
          <div>
            <h2 className="text-xl font-bold mb-4">Newsletter</h2>
            <p className="text-gray-300 mb-4">
              Inscreva-se para receber ofertas exclusivas e novidades.
            </p>
            <form className="flex flex-col space-y-2">
              <Input 
                type="email" 
                placeholder="Seu e-mail" 
                className="bg-brand-secondary border-brand-secondary focus:border-brand-accent"
              />
              <Button className="bg-brand-accent hover:bg-blue-600 text-white">
                Inscrever-se
              </Button>
            </form>
          </div>
        </div>
      </div>
      
      {/* Bottom footer */}
      <div className="bg-brand-secondary py-4">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <p className="text-gray-300 text-sm">
              &copy; {new Date().getFullYear()} Commerce Forge. Todos os direitos reservados.
            </p>
            <div className="flex items-center space-x-2 mt-4 md:mt-0">
              <img src="https://via.placeholder.com/40x25" alt="Visa" className="h-6" />
              <img src="https://via.placeholder.com/40x25" alt="MasterCard" className="h-6" />
              <img src="https://via.placeholder.com/40x25" alt="PayPal" className="h-6" />
              <img src="https://via.placeholder.com/40x25" alt="Apple Pay" className="h-6" />
              <img src="https://via.placeholder.com/40x25" alt="Google Pay" className="h-6" />
              <img src="https://via.placeholder.com/40x25" alt="Pix" className="h-6" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
