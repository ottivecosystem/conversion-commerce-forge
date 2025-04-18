
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ShoppingBag, 
  Heart, 
  Share2, 
  Check, 
  Star, 
  Truck, 
  ShieldCheck, 
  RefreshCcw,
  Minus,
  Plus,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import Layout from '@/components/layout/Layout';
import ProductGrid from '@/components/product/ProductGrid';
import { getProductById, getProducts } from '@/lib/medusa';
import { useCartStore, useWishlistStore } from '@/lib/store';
import { useToast } from '@/hooks/use-toast';

const ProductPage = () => {
  const { handle } = useParams<{ handle: string }>();
  const [product, setProduct] = useState<any>(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  
  const { addItem } = useCartStore();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlistStore();
  const { toast } = useToast();
  
  const inWishlist = product ? isInWishlist(product.id) : false;
  
  useEffect(() => {
    const fetchProduct = async () => {
      if (!handle) return;
      
      try {
        setIsLoading(true);
        const response = await getProductById(handle);
        setProduct(response.product);
        
        // Initialize selected variant with default variant
        if (response.product.variants && response.product.variants.length > 0) {
          setSelectedVariant(response.product.variants[0]);
          
          // Initialize selected options from first variant
          const initialOptions: Record<string, string> = {};
          if (response.product.options && response.product.options.length > 0) {
            response.product.options.forEach((option: any) => {
              if (option.values && option.values.length > 0) {
                initialOptions[option.id] = option.values[0].value;
              }
            });
          }
          setSelectedOptions(initialOptions);
        }
        
        // Fetch related products
        const relatedResponse = await getProducts({
          limit: 4,
          collection_id: response.product.collection_id
        });
        
        // Filter out the current product from related products
        const filtered = relatedResponse.products.filter((p: any) => p.id !== response.product.id);
        setRelatedProducts(filtered);
      } catch (error) {
        console.error('Error fetching product:', error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar o produto.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProduct();
  }, [handle, toast]);
  
  // Update selected variant when options change
  useEffect(() => {
    if (!product || !product.variants) return;
    
    const findMatchingVariant = () => {
      return product.variants.find((variant: any) => {
        // Check if all options match
        if (!variant.options) return false;
        
        return variant.options.every((option: any) => {
          return selectedOptions[option.option_id] === option.value;
        });
      });
    };
    
    const matchingVariant = findMatchingVariant();
    if (matchingVariant) {
      setSelectedVariant(matchingVariant);
    }
  }, [selectedOptions, product]);
  
  const handleOptionChange = (optionId: string, value: string) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [optionId]: value
    }));
  };
  
  const handleAddToCart = async () => {
    if (!selectedVariant) {
      toast({
        title: "Erro",
        description: "Por favor, selecione uma variante do produto.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsAddingToCart(true);
      await addItem(selectedVariant.id, quantity);
      
      toast({
        title: "Produto adicionado",
        description: `${product.title} foi adicionado ao seu carrinho.`
      });
    } catch (error) {
      console.error('Error adding item to cart:', error);
      toast({
        title: "Erro",
        description: "Não foi possível adicionar o produto ao carrinho.",
        variant: "destructive"
      });
    } finally {
      setIsAddingToCart(false);
    }
  };
  
  const handleToggleWishlist = () => {
    if (!product) return;
    
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
  
  const handleQuantityChange = (value: number) => {
    if (value < 1) return;
    setQuantity(value);
  };
  
  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount / 100);
  };
  
  if (isLoading) {
    return (
      <Layout>
        <div className="container-custom py-16 flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-accent"></div>
        </div>
      </Layout>
    );
  }
  
  if (!product) {
    return (
      <Layout>
        <div className="container-custom py-16 text-center">
          <h2 className="text-2xl font-bold text-gray-900">Produto não encontrado</h2>
          <p className="text-gray-600 mt-2">O produto que você está procurando não está disponível.</p>
          <Button 
            className="mt-4"
            asChild
          >
            <Link to="/products">Ver outros produtos</Link>
          </Button>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      {/* Breadcrumb */}
      <div className="bg-gray-50 py-4">
        <div className="container-custom">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2 text-sm">
              <li>
                <Link to="/" className="text-gray-500 hover:text-gray-700">Home</Link>
              </li>
              <li className="flex items-center">
                <ChevronRight className="h-4 w-4 text-gray-400 mx-1" />
                <Link to="/products" className="text-gray-500 hover:text-gray-700">Produtos</Link>
              </li>
              {product.collection && (
                <li className="flex items-center">
                  <ChevronRight className="h-4 w-4 text-gray-400 mx-1" />
                  <Link 
                    to={`/collections/${product.collection.handle}`} 
                    className="text-gray-500 hover:text-gray-700"
                  >
                    {product.collection.title}
                  </Link>
                </li>
              )}
              <li className="flex items-center">
                <ChevronRight className="h-4 w-4 text-gray-400 mx-1" />
                <span className="text-gray-900 font-medium">{product.title}</span>
              </li>
            </ol>
          </nav>
        </div>
      </div>
      
      {/* Product section */}
      <section className="py-12">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product images */}
            <div className="space-y-4">
              {/* Main image */}
              <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                <img 
                  src={product.images && product.images.length > 0 
                    ? product.images[activeImageIndex].url 
                    : "https://via.placeholder.com/600"}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Thumbnail images */}
              {product.images && product.images.length > 1 && (
                <div className="grid grid-cols-5 gap-2">
                  {product.images.map((image: any, index: number) => (
                    <button
                      key={image.id}
                      className={`aspect-square rounded-md overflow-hidden border-2 ${
                        index === activeImageIndex ? 'border-brand-accent' : 'border-transparent'
                      }`}
                      onClick={() => setActiveImageIndex(index)}
                    >
                      <img 
                        src={image.url} 
                        alt={`${product.title} - imagem ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            {/* Product info */}
            <div>
              {/* Title and rating */}
              <h1 className="text-3xl font-bold text-gray-900">{product.title}</h1>
              
              {product.rating && (
                <div className="flex items-center mt-2">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`h-4 w-4 ${i < product.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                    />
                  ))}
                  <span className="text-sm text-gray-500 ml-2">
                    {product.rating} ({product.rating_count || 0} avaliações)
                  </span>
                </div>
              )}
              
              {/* Price */}
              <div className="mt-4 flex items-center">
                <span className="text-3xl font-bold text-gray-900">
                  {selectedVariant?.prices && selectedVariant.prices.length > 0
                    ? formatPrice(selectedVariant.prices[0].amount)
                    : 'Indisponível'}
                </span>
                
                {selectedVariant?.original_price && (
                  <span className="ml-3 text-lg line-through text-gray-500">
                    {formatPrice(selectedVariant.original_price)}
                  </span>
                )}
                
                {/* Discount percentage */}
                {selectedVariant?.prices && selectedVariant.original_price && (
                  <span className="ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {Math.round((1 - selectedVariant.prices[0].amount / selectedVariant.original_price) * 100)}% OFF
                  </span>
                )}
              </div>
              
              {/* Availability */}
              <div className="mt-4 flex items-center">
                {selectedVariant?.inventory_quantity > 0 ? (
                  <div className="inline-flex items-center text-sm text-green-600">
                    <Check className="h-4 w-4 mr-1" />
                    Em estoque
                    {selectedVariant.inventory_quantity < 10 && (
                      <span className="ml-1">
                        (Apenas {selectedVariant.inventory_quantity} restantes)
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="inline-flex items-center text-sm text-red-600">
                    <span className="h-4 w-4 mr-1">×</span>
                    Fora de estoque
                  </div>
                )}
              </div>
              
              {/* Description */}
              <div className="mt-4 text-gray-700">
                <p>{product.description}</p>
              </div>
              
              {/* Variant options */}
              {product.options && product.options.length > 0 && (
                <div className="mt-6 space-y-4">
                  {product.options.map((option: any) => (
                    <div key={option.id}>
                      <h3 className="text-sm font-medium text-gray-900">{option.title}</h3>
                      
                      <div className="mt-2 flex flex-wrap gap-2">
                        {option.values?.map((value: any) => (
                          <button
                            key={value.id}
                            className={`px-3 py-2 border rounded-md text-sm ${
                              selectedOptions[option.id] === value.value
                                ? 'border-brand-accent bg-brand-accent/5 text-brand-accent'
                                : 'border-gray-300 text-gray-700 hover:border-brand-accent/30'
                            }`}
                            onClick={() => handleOptionChange(option.id, value.value)}
                          >
                            {value.value}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Quantity */}
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-900">Quantidade</h3>
                
                <div className="mt-2 flex items-center border border-gray-300 rounded-md w-32">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-9 w-9" 
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="flex-grow text-center">{quantity}</span>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-9 w-9" 
                    onClick={() => handleQuantityChange(quantity + 1)}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              
              {/* Add to cart and wishlist */}
              <div className="mt-6 flex flex-col sm:flex-row gap-4">
                <Button 
                  className="flex-grow btn-primary"
                  onClick={handleAddToCart}
                  disabled={isAddingToCart || !selectedVariant || selectedVariant.inventory_quantity <= 0}
                >
                  {isAddingToCart ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Adicionando...
                    </span>
                  ) : (
                    <>
                      <ShoppingBag className="mr-2 h-4 w-4" />
                      Adicionar ao Carrinho
                    </>
                  )}
                </Button>
                
                <Button 
                  variant="outline" 
                  className="btn-secondary"
                  onClick={handleToggleWishlist}
                >
                  <Heart className={`mr-2 h-4 w-4 ${inWishlist ? 'fill-red-500 text-red-500' : ''}`} />
                  {inWishlist ? 'Remover dos Favoritos' : 'Adicionar aos Favoritos'}
                </Button>
              </div>
              
              {/* Share */}
              <div className="mt-6">
                <Button 
                  variant="ghost" 
                  className="text-gray-600 hover:text-brand-accent"
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: product.title,
                        url: window.location.href
                      });
                    } else {
                      navigator.clipboard.writeText(window.location.href);
                      toast({
                        title: "Link copiado",
                        description: "O link do produto foi copiado para a área de transferência."
                      });
                    }
                  }}
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Compartilhar
                </Button>
              </div>
              
              {/* Trust badges */}
              <div className="mt-8 border-t border-gray-200 pt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center">
                    <Truck className="h-8 w-8 text-gray-400 mr-3" />
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Entrega rápida</h3>
                      <p className="text-xs text-gray-500">2-5 dias úteis</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <ShieldCheck className="h-8 w-8 text-gray-400 mr-3" />
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Garantia de qualidade</h3>
                      <p className="text-xs text-gray-500">12 meses de garantia</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <RefreshCcw className="h-8 w-8 text-gray-400 mr-3" />
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Devolução fácil</h3>
                      <p className="text-xs text-gray-500">30 dias para troca</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Product details tabs */}
      <section className="bg-gray-50 py-12">
        <div className="container-custom">
          <Tabs defaultValue="description">
            <TabsList className="w-full justify-start border-b border-gray-200 mb-6">
              <TabsTrigger value="description" className="text-lg">Descrição</TabsTrigger>
              <TabsTrigger value="specifications" className="text-lg">Especificações</TabsTrigger>
              <TabsTrigger value="reviews" className="text-lg">Avaliações</TabsTrigger>
            </TabsList>
            
            <TabsContent value="description" className="bg-white p-6 rounded-lg">
              <div className="prose max-w-none">
                <p>{product.description}</p>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla at ipsum ac magna finibus placerat. Maecenas id sem quis nulla tincidunt lacinia. Nullam eget justo et arcu finibus lobortis.</p>
                <ul>
                  <li>Alta qualidade</li>
                  <li>Design moderno</li>
                  <li>Fácil de usar</li>
                  <li>Durável</li>
                </ul>
                <p>Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Curabitur tincidunt magna vel leo vehicula, vel ullamcorper nibh porta.</p>
              </div>
            </TabsContent>
            
            <TabsContent value="specifications" className="bg-white p-6 rounded-lg">
              <div className="border-t border-gray-200">
                <dl>
                  <div className="grid grid-cols-1 md:grid-cols-3 py-4 border-b border-gray-200">
                    <dt className="font-medium text-gray-900">Material</dt>
                    <dd className="md:col-span-2 text-gray-700">Premium</dd>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 py-4 border-b border-gray-200">
                    <dt className="font-medium text-gray-900">Dimensões</dt>
                    <dd className="md:col-span-2 text-gray-700">30 x 20 x 10 cm</dd>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 py-4 border-b border-gray-200">
                    <dt className="font-medium text-gray-900">Peso</dt>
                    <dd className="md:col-span-2 text-gray-700">0.5 kg</dd>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 py-4 border-b border-gray-200">
                    <dt className="font-medium text-gray-900">Origem</dt>
                    <dd className="md:col-span-2 text-gray-700">Brasil</dd>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 py-4">
                    <dt className="font-medium text-gray-900">Garantia</dt>
                    <dd className="md:col-span-2 text-gray-700">12 meses</dd>
                  </div>
                </dl>
              </div>
            </TabsContent>
            
            <TabsContent value="reviews" className="bg-white p-6 rounded-lg">
              {/* Reviews summary */}
              <div className="flex flex-col md:flex-row gap-8">
                <div className="md:w-1/3">
                  <div className="flex flex-col items-center p-6 border border-gray-200 rounded-lg">
                    <h3 className="text-5xl font-bold text-gray-900">{product.rating || 4.8}</h3>
                    <div className="flex mt-2">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`h-5 w-5 ${i < (product.rating || 5) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                        />
                      ))}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      Baseado em {product.rating_count || 128} avaliações
                    </p>
                    
                    <Button className="w-full mt-4">
                      Escrever uma avaliação
                    </Button>
                  </div>
                </div>
                
                <div className="md:w-2/3">
                  {/* Sample reviews */}
                  <div className="space-y-6">
                    <div className="border-b border-gray-200 pb-6">
                      <div className="flex justify-between mb-2">
                        <div className="flex items-center">
                          <h4 className="font-medium text-gray-900">João Silva</h4>
                          <span className="text-gray-400 mx-2">•</span>
                          <span className="text-sm text-gray-500">12 de abril, 2023</span>
                        </div>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`h-4 w-4 ${i < 5 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-700">
                        Excelente produto! Atendeu minhas expectativas em todos os sentidos. 
                        Entrega rápida e o produto é exatamente como descrito.
                      </p>
                    </div>
                    
                    <div className="border-b border-gray-200 pb-6">
                      <div className="flex justify-between mb-2">
                        <div className="flex items-center">
                          <h4 className="font-medium text-gray-900">Maria Oliveira</h4>
                          <span className="text-gray-400 mx-2">•</span>
                          <span className="text-sm text-gray-500">28 de março, 2023</span>
                        </div>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`h-4 w-4 ${i < 4 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-700">
                        Estou satisfeita com a compra. O produto é de boa qualidade e o atendimento foi ótimo.
                        Chegou antes do prazo estimado!
                      </p>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-2">
                        <div className="flex items-center">
                          <h4 className="font-medium text-gray-900">Carlos Ferreira</h4>
                          <span className="text-gray-400 mx-2">•</span>
                          <span className="text-sm text-gray-500">15 de fevereiro, 2023</span>
                        </div>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`h-4 w-4 ${i < 5 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-700">
                        Superou minhas expectativas! A qualidade é impressionante e o preço muito justo.
                        Recomendo a todos que estão em dúvida sobre a compra.
                      </p>
                    </div>
                    
                    {/* See all reviews button */}
                    <div className="text-center mt-8">
                      <Button variant="outline">
                        Ver todas as avaliações
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
      
      {/* Related products */}
      {relatedProducts.length > 0 && (
        <section className="py-16">
          <div className="container-custom">
            <h2 className="section-title">Produtos relacionados</h2>
            <ProductGrid products={relatedProducts} />
          </div>
        </section>
      )}
    </Layout>
  );
};

export default ProductPage;
