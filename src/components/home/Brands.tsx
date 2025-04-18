
import React from 'react';

const brands = [
  { id: '1', name: 'Brand 1', logo: 'https://via.placeholder.com/150x50?text=Brand+1' },
  { id: '2', name: 'Brand 2', logo: 'https://via.placeholder.com/150x50?text=Brand+2' },
  { id: '3', name: 'Brand 3', logo: 'https://via.placeholder.com/150x50?text=Brand+3' },
  { id: '4', name: 'Brand 4', logo: 'https://via.placeholder.com/150x50?text=Brand+4' },
  { id: '5', name: 'Brand 5', logo: 'https://via.placeholder.com/150x50?text=Brand+5' },
  { id: '6', name: 'Brand 6', logo: 'https://via.placeholder.com/150x50?text=Brand+6' }
];

const Brands = () => {
  return (
    <section className="py-12 border-t border-gray-200">
      <div className="container-custom">
        <h2 className="text-center text-lg font-medium text-gray-600 mb-8">
          Marcas que confiam em nós
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center">
          {brands.map((brand) => (
            <div key={brand.id} className="flex justify-center">
              <img 
                src={brand.logo} 
                alt={brand.name} 
                className="h-8 md:h-10 object-contain opacity-70 hover:opacity-100 transition-opacity duration-300"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Brands;
