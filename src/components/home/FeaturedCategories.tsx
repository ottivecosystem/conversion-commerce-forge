
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const categories = [
  {
    id: '1',
    name: 'Eletrônicos',
    image: 'https://via.placeholder.com/400x500',
    handle: 'electronics'
  },
  {
    id: '2',
    name: 'Moda',
    image: 'https://via.placeholder.com/400x500',
    handle: 'fashion'
  },
  {
    id: '3',
    name: 'Casa & Decoração',
    image: 'https://via.placeholder.com/400x500',
    handle: 'home-decor'
  }
];

const FeaturedCategories = () => {
  return (
    <section className="bg-white py-16">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Categorias em destaque</h2>
            <p className="text-gray-600 mt-2">Explore nossas coleções cuidadosamente selecionadas</p>
          </div>
          
          <div className="mt-4 md:mt-0">
            <Button 
              variant="outline"
              className="flex items-center group"
              asChild
            >
              <Link to="/collections">
                Ver todas as categorias 
                <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((category) => (
            <Link 
              key={category.id} 
              to={`/collections/${category.handle}`} 
              className="group"
            >
              <div className="relative overflow-hidden rounded-lg aspect-[3/4]">
                {/* Image */}
                <img 
                  src={category.image} 
                  alt={category.name} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex flex-col justify-end p-6">
                  <h3 className="text-2xl font-semibold text-white mb-2">{category.name}</h3>
                  
                  <div className="flex items-center text-white font-medium text-sm opacity-0 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                    <span>Explorar categoria</span>
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCategories;
