
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const PromoSection = () => {
  return (
    <section className="bg-gray-50 py-16">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* First Promo Card */}
          <div className="relative rounded-xl overflow-hidden group">
            <img 
              src="https://via.placeholder.com/600x400" 
              alt="Oferta especial" 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              style={{ height: '400px' }}
            />
            
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent flex items-center">
              <div className="p-8 max-w-md">
                <span className="inline-block bg-brand-accent text-white text-sm font-semibold px-3 py-1 rounded-full mb-4">
                  Oferta Especial
                </span>
                
                <h3 className="text-3xl font-bold text-white mb-4">
                  Até 40% OFF em produtos selecionados
                </h3>
                
                <p className="text-white/80 mb-6">
                  Aproveite nossas ofertas incríveis por tempo limitado. Não perca essa oportunidade!
                </p>
                
                <Button
                  className="bg-white text-brand-primary hover:bg-gray-100 flex items-center group"
                  asChild
                >
                  <Link to="/collections/sale">
                    Ver Ofertas
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
          
          {/* Second Promo Card */}
          <div className="relative rounded-xl overflow-hidden group">
            <img 
              src="https://via.placeholder.com/600x400" 
              alt="Nova coleção" 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              style={{ height: '400px' }}
            />
            
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent flex items-center">
              <div className="p-8 max-w-md">
                <span className="inline-block bg-brand-accent text-white text-sm font-semibold px-3 py-1 rounded-full mb-4">
                  Lançamento
                </span>
                
                <h3 className="text-3xl font-bold text-white mb-4">
                  Nova Coleção Acaba de Chegar
                </h3>
                
                <p className="text-white/80 mb-6">
                  Conheça os mais recentes lançamentos exclusivos para nossos clientes.
                </p>
                
                <Button
                  className="bg-white text-brand-primary hover:bg-gray-100 flex items-center group"
                  asChild
                >
                  <Link to="/collections/new">
                    Explorar Coleção
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PromoSection;
