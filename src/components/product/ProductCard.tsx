
import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCartStore, useWishlistStore } from '@/lib/store';
import { toast } from '@/hooks/use-toast';

interface ProductCardProps {
  product: any;
  size?: 'small' | 'normal' | 'large';
}

const ProductCard: React.FC<ProductCardProps> = ({ product, size = 'normal' }) => {
  const { addItem } = useCartStore();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlistStore();
  
  const inWishlist = isInWishlist(product.id);
  
  // Get the lowest price variant
  const variant = product.variants && product.variants.length > 0 
    ? product.variants.reduce((lowest: any, current: any) => 
        current.prices[0].amount < lowest.prices[0].amount ? current : lowest, product.variants[0]) 
    : null;
  
  // Format price
  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount / 100);
  };
  
  const price = variant ? formatPrice(variant.prices[0].amount) : formatPrice(0);
  const compareAtPrice = variant && variant.original_price
    ? formatPrice(variant.original_price)
    : null;
    
  // Handle add to cart
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!variant) {
      toast({
        title: "Erro",
        description: "Este produto não está disponível para compra.",
        variant: "destructive"
      });
      return;
    }
    
    addItem(variant.id, 1);
    
    toast({
      title: "Produto adicionado",
      description: `${product.title} foi adicionado ao seu carrinho.`,
    });
  };
  
  // Handle toggle wishlist
  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (inWishlist) {
      removeFromWishlist(product.id);
      
      toast({
        title: "Removido dos favoritos",
        description: `${product.title} foi removido dos seus favoritos.`
      });
    } else {
      addToWishlist(product);
      
      toast({
        title: "Adicionado aos favoritos",
        description: `${product.title} foi adicionado aos seus favoritos.`
      });
    }
  };
  
  // Calculate grid class based on size
  const getSizeClass = () => {
    switch (size) {
      case 'small':
        return 'aspect-square';
      case 'large':
        return 'aspect-[3/4]';
      case 'normal':
      default:
        return 'aspect-[3/4]';
    }
  };
  
  return (
    <div className="group card-hover bg-white rounded-lg overflow-hidden">
      <Link to={`/products/${product.handle}`} className="block h-full">
        {/* Product Image */}
        <div className={`relative ${getSizeClass()}`}>
          <img 
            src={product.thumbnail || "https://via.placeholder.com/300"} 
            alt={product.title} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          
          {/* Quick action buttons */}
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button 
              variant="secondary" 
              size="icon" 
              className="rounded-full bg-white shadow-md mb-2"
              onClick={handleToggleWishlist}
            >
              <Heart 
                className={`h-4 w-4 ${inWishlist ? 'fill-red-500 text-red-500' : ''}`} 
              />
            </Button>
            
            <Button 
              variant="secondary" 
              size="icon" 
              className="rounded-full bg-white shadow-md"
              onClick={handleAddToCart}
            >
              <ShoppingBag className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {product.is_new && (
              <span className="badge badge-new">Novo</span>
            )}
            
            {compareAtPrice && (
              <span className="badge badge-sale">Oferta</span>
            )}
            
            {product.is_out_of_stock && (
              <span className="badge badge-out-of-stock">Esgotado</span>
            )}
          </div>
        </div>
        
        {/* Product Info */}
        <div className="p-4">
          {/* Product Categories */}
          {product.collection && (
            <span className="text-xs text-gray-500 mb-1 block">
              {product.collection.title}
            </span>
          )}
          
          {/* Product Title */}
          <h3 className="text-sm font-medium mb-1 group-hover:text-brand-accent transition-colors duration-200">
            {product.title}
          </h3>
          
          {/* Rating */}
          {product.rating && (
            <div className="flex items-center mb-2">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`h-3 w-3 ${i < product.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                />
              ))}
              <span className="text-xs text-gray-500 ml-1">
                ({product.rating_count || 0})
              </span>
            </div>
          )}
          
          {/* Price */}
          <div className="flex items-center">
            <span className="price">{price}</span>
            {compareAtPrice && (
              <span className="price-discount ml-2">{compareAtPrice}</span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
