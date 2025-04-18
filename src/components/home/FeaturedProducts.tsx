
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProductGrid from '@/components/product/ProductGrid';
import { getProducts } from '@/lib/medusa';

const FeaturedProducts = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        // In a real scenario, you'd query specifically for featured products
        const response = await getProducts({ limit: 8 });
        setProducts(response.products);
      } catch (err) {
        console.error('Error fetching featured products:', err);
        setError('Não foi possível carregar os produtos em destaque.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (isLoading) {
    return (
      <section className="bg-gray-50 py-16">
        <div className="container-custom text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-accent mx-auto"></div>
          <p className="text-gray-500 mt-4">Carregando produtos...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="bg-gray-50 py-16">
        <div className="container-custom text-center">
          <p className="text-red-500">{error}</p>
          <Button 
            variant="link" 
            className="text-brand-accent mt-2"
            onClick={() => window.location.reload()}
          >
            Tentar novamente
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-gray-50 py-16">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Produtos em destaque</h2>
            <p className="text-gray-600 mt-2">Descubra nossos produtos mais populares</p>
          </div>
          
          <div className="mt-4 md:mt-0">
            <Button 
              variant="outline"
              className="flex items-center group"
              asChild
            >
              <Link to="/products">
                Ver todos os produtos 
                <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </div>
        
        <ProductGrid products={products} />
      </div>
    </section>
  );
};

export default FeaturedProducts;
