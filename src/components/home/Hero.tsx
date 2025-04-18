
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Hero = () => {
  return (
    <section className="relative bg-gray-50">
      <div className="container-custom py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="max-w-lg">
            <div className="animate-fade-in">
              <span className="inline-block bg-brand-accent/10 text-brand-accent px-3 py-1 rounded-full text-sm font-medium mb-4">
                Novidades
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                Descubra produtos feitos para você
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                Uma experiência de compra única com os melhores produtos e preços do mercado. Entrega rápida e segurança garantida.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button 
                  size="lg"
                  className="btn-primary"
                  asChild
                >
                  <Link to="/products">
                    Ver Produtos <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="btn-secondary"
                  asChild
                >
                  <Link to="/collections">
                    Nossas Coleções
                  </Link>
                </Button>
              </div>
              
              {/* Trust badges */}
              <div className="mt-12 flex flex-wrap items-center gap-4">
                <div className="flex items-center">
                  <div className="bg-white p-2 rounded-full shadow-sm">
                    <svg className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span className="ml-2 text-sm text-gray-500">Entrega em 24h</span>
                </div>
                
                <div className="flex items-center">
                  <div className="bg-white p-2 rounded-full shadow-sm">
                    <svg className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span className="ml-2 text-sm text-gray-500">Garantia de Qualidade</span>
                </div>
                
                <div className="flex items-center">
                  <div className="bg-white p-2 rounded-full shadow-sm">
                    <svg className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  </div>
                  <span className="ml-2 text-sm text-gray-500">Pagamento Seguro</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Image */}
          <div className="relative">
            <div className="aspect-[4/3] rounded-lg overflow-hidden animate-fade-in">
              <img 
                src="https://via.placeholder.com/800x600" 
                alt="Produtos em destaque" 
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Floating elements */}
            <div className="absolute -bottom-8 -left-8 bg-white p-4 rounded-lg shadow-lg animate-fade-in hidden md:block">
              <div className="flex items-center">
                <div className="flex -space-x-2 mr-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-10 w-10 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center">
                      <span className="text-xs font-medium text-gray-600">{i}</span>
                    </div>
                  ))}
                </div>
                <div>
                  <p className="text-sm font-semibold">Mais de 2000+</p>
                  <p className="text-xs text-gray-500">Clientes satisfeitos</p>
                </div>
              </div>
            </div>
            
            <div className="absolute top-8 -right-8 bg-white p-4 rounded-lg shadow-lg animate-fade-in hidden md:block">
              <div className="flex items-center">
                <div className="bg-green-100 p-2 rounded-full mr-3">
                  <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold">30% OFF</p>
                  <p className="text-xs text-gray-500">Na primeira compra</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Background decoration */}
      <div className="absolute top-0 right-0 h-64 w-64 bg-brand-accent/5 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 h-96 w-96 bg-brand-accent/5 rounded-full translate-y-1/2 -translate-x-1/3 blur-3xl"></div>
    </section>
  );
};

export default Hero;
