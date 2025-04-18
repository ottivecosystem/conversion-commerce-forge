
import React, { useEffect } from 'react';
import { X, Trash2, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/lib/store';

const CartSidebar = () => {
  const { cart, isCartOpen, closeCart, isLoading, removeItem, updateItem, initCart } = useCartStore();

  useEffect(() => {
    initCart();
  }, [initCart]);

  if (!isCartOpen) return null;

  const handleQuantityChange = (lineId: string, quantity: number) => {
    if (quantity < 1) return;
    updateItem(lineId, quantity);
  };

  const cartTotal = cart?.subtotal || 0;
  const formattedTotal = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(cartTotal / 100);

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity" 
        onClick={closeCart} 
      />
      
      {/* Cart sidebar */}
      <div className="fixed right-0 top-0 h-full w-full sm:w-96 bg-white z-50 shadow-xl transform transition-transform animate-slide-in overflow-auto">
        <div className="p-6 h-full flex flex-col">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold flex items-center">
              <ShoppingBag className="mr-2 h-5 w-5" /> Seu Carrinho
            </h2>
            <Button variant="ghost" size="icon" onClick={closeCart}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          {/* Cart items */}
          <div className="flex-grow overflow-auto">
            {isLoading ? (
              <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-accent"></div>
              </div>
            ) : (
              <>
                {cart?.items?.length > 0 ? (
                  <div className="space-y-6">
                    {cart.items.map((item: any) => (
                      <div key={item.id} className="flex border-b border-gray-200 pb-4">
                        {/* Product image */}
                        <div className="w-24 h-24 bg-gray-100 rounded-md overflow-hidden">
                          <img 
                            src={item.thumbnail || "https://via.placeholder.com/96"} 
                            alt={item.title} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        
                        {/* Product info */}
                        <div className="ml-4 flex-grow">
                          <div className="flex justify-between">
                            <h3 className="font-medium">{item.title}</h3>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-6 w-6" 
                              onClick={() => removeItem(item.id)}
                            >
                              <Trash2 className="h-4 w-4 text-gray-500" />
                            </Button>
                          </div>
                          
                          {item.variant?.title && item.variant.title !== "Default" && (
                            <p className="text-sm text-gray-500 mb-2">{item.variant.title}</p>
                          )}
                          
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center border rounded-md">
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8" 
                                onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                              >
                                <span className="text-lg font-medium">-</span>
                              </Button>
                              <span className="w-8 text-center">{item.quantity}</span>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8" 
                                onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                              >
                                <span className="text-lg font-medium">+</span>
                              </Button>
                            </div>
                            
                            <div className="font-medium">
                              {new Intl.NumberFormat('pt-BR', {
                                style: 'currency',
                                currency: 'BRL'
                              }).format((item.unit_price * item.quantity) / 100)}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-40">
                    <ShoppingBag className="h-10 w-10 text-gray-300 mb-2" />
                    <p className="text-gray-500">Seu carrinho está vazio</p>
                    <Button 
                      variant="link" 
                      onClick={closeCart} 
                      className="text-brand-accent mt-2"
                    >
                      Continuar comprando
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
          
          {/* Footer with subtotal and checkout button */}
          {cart?.items?.length > 0 && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex justify-between mb-4">
                <span className="font-medium">Subtotal</span>
                <span className="font-bold">{formattedTotal}</span>
              </div>
              
              <p className="text-sm text-gray-500 mb-4">
                Frete e impostos calculados no checkout
              </p>
              
              <Button 
                className="w-full btn-primary"
                onClick={() => window.location.href = "/checkout"}
              >
                Finalizar Compra
              </Button>
              
              <Button 
                variant="ghost" 
                className="w-full mt-2"
                onClick={closeCart}
              >
                Continuar Comprando
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CartSidebar;
