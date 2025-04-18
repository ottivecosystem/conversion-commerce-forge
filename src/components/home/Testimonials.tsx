
import React from 'react';
import { Star } from 'lucide-react';

const testimonials = [
  {
    id: '1',
    name: 'Ana Silva',
    role: 'Cliente Premium',
    image: 'https://via.placeholder.com/60',
    rating: 5,
    content: 'A qualidade dos produtos e a rapidez na entrega superaram todas as minhas expectativas. Com certeza vou continuar comprando aqui!'
  },
  {
    id: '2',
    name: 'Carlos Ferreira',
    role: 'Cliente Fiel',
    image: 'https://via.placeholder.com/60',
    rating: 5,
    content: 'Atendimento impecável! Precisei trocar um produto e o processo foi extremamente fácil e rápido. Recomendo a todos.'
  },
  {
    id: '3',
    name: 'Mariana Costa',
    role: 'Cliente Novo',
    image: 'https://via.placeholder.com/60',
    rating: 4,
    content: 'Minha primeira compra foi uma experiência incrível. Produtos de alta qualidade, entrega rápida e embalagem segura.'
  }
];

const Testimonials = () => {
  return (
    <section className="bg-white py-16">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">O que nossos clientes dizem</h2>
          <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
            Mais de 5.000 clientes satisfeitos confiam em nós para suas compras
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div 
              key={testimonial.id} 
              className="bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              {/* Stars */}
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`h-4 w-4 ${i < testimonial.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                  />
                ))}
              </div>
              
              {/* Content */}
              <p className="text-gray-700 mb-6">"{testimonial.content}"</p>
              
              {/* Author */}
              <div className="flex items-center">
                <img 
                  src={testimonial.image} 
                  alt={testimonial.name} 
                  className="h-10 w-10 rounded-full object-cover mr-3"
                />
                <div>
                  <h4 className="font-medium text-gray-900">{testimonial.name}</h4>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Trust stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="p-6 bg-gray-50 rounded-lg">
            <h3 className="text-3xl font-bold text-brand-accent mb-2">5.000+</h3>
            <p className="text-gray-600">Clientes satisfeitos</p>
          </div>
          
          <div className="p-6 bg-gray-50 rounded-lg">
            <h3 className="text-3xl font-bold text-brand-accent mb-2">10.000+</h3>
            <p className="text-gray-600">Pedidos entregues</p>
          </div>
          
          <div className="p-6 bg-gray-50 rounded-lg">
            <h3 className="text-3xl font-bold text-brand-accent mb-2">4.9/5</h3>
            <p className="text-gray-600">Avaliação média</p>
          </div>
          
          <div className="p-6 bg-gray-50 rounded-lg">
            <h3 className="text-3xl font-bold text-brand-accent mb-2">99%</h3>
            <p className="text-gray-600">Satisfação garantida</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
