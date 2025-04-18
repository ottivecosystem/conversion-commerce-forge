
import React from 'react';
import ProductCard from './ProductCard';

interface ProductGridProps {
  products: any[];
  title?: string;
  className?: string;
  productSize?: 'small' | 'normal' | 'large';
}

const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  title,
  className = '',
  productSize = 'normal'
}) => {
  if (!products || products.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-500">Nenhum produto encontrado</h3>
      </div>
    );
  }

  return (
    <div className={className}>
      {title && (
        <h2 className="section-title">{title}</h2>
      )}
      <div className="product-grid">
        {products.map((product) => (
          <ProductCard 
            key={product.id} 
            product={product}
            size={productSize}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductGrid;
