
import React, { useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import CartSidebar from './CartSidebar';
import { useCartStore } from '@/lib/store';
import { useToast } from '@/hooks/use-toast';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { initCart } = useCartStore();
  const { toast } = useToast();

  useEffect(() => {
    // Initialize cart when layout mounts
    initCart().catch((error) => {
      console.error('Failed to initialize cart:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar seu carrinho. Por favor, tente novamente.',
        variant: 'destructive',
      });
    });
  }, [initCart, toast]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
      <CartSidebar />
    </div>
  );
};

export default Layout;
