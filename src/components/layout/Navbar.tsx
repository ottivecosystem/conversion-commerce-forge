
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  ShoppingBag, 
  User, 
  Heart, 
  Menu, 
  X, 
  ChevronDown 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { useCartStore, useUserStore, useWishlistStore } from '@/lib/store';
import { getCollections } from '@/lib/medusa';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [collections, setCollections] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  const { itemCount, openCart } = useCartStore();
  const { isAuthenticated, user } = useUserStore();
  const { items: wishlistItems } = useWishlistStore();
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const response = await getCollections();
        setCollections(response.collections || []);
      } catch (error) {
        console.error('Error fetching collections:', error);
      }
    };
    
    fetchCollections();
  }, []);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  return (
    <header 
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-sm' : 'bg-white'
      }`}
    >
      {/* Top announcement bar */}
      <div className="bg-brand-primary text-white px-4 py-2 text-center text-sm">
        <p>Frete grátis em compras acima de R$ 200 | Entrega em 24h para São Paulo</p>
      </div>
      
      <div className="container-custom py-4">
        <div className="flex items-center justify-between">
          {/* Mobile menu button */}
          <div className="lg:hidden">
            <Button variant="ghost" size="icon" onClick={toggleMenu}>
              <Menu className="h-6 w-6" />
            </Button>
          </div>
          
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <span className="text-xl font-bold text-brand-primary">Commerce Forge</span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <Link to="/" className="nav-link font-medium">Home</Link>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="nav-link font-medium flex items-center">
                  Categorias <ChevronDown className="ml-1 h-4 w-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center" className="w-56">
                {collections.map((collection) => (
                  <DropdownMenuItem key={collection.id} asChild>
                    <Link to={`/collections/${collection.handle}`} className="w-full">
                      {collection.title}
                    </Link>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuItem asChild>
                  <Link to="/collections" className="w-full font-medium">
                    Ver todas
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Link to="/products" className="nav-link font-medium">Produtos</Link>
            <Link to="/about" className="nav-link font-medium">Sobre</Link>
            <Link to="/contact" className="nav-link font-medium">Contato</Link>
          </nav>
          
          {/* Search and Actions */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <form onSubmit={handleSearch} className="hidden md:flex relative">
              <Input
                type="text"
                placeholder="Pesquisar produtos..."
                className="w-64 pr-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button 
                type="submit" 
                variant="ghost" 
                size="icon" 
                className="absolute right-0 top-0"
              >
                <Search className="h-4 w-4" />
              </Button>
            </form>
            
            {/* User */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {isAuthenticated ? (
                  <>
                    <DropdownMenuItem className="font-medium">
                      Olá, {user?.first_name || 'Cliente'}
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/account" className="w-full">Minha Conta</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/account/orders" className="w-full">Meus Pedidos</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/logout" className="w-full">Sair</Link>
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem asChild>
                      <Link to="/login" className="w-full">Entrar</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/register" className="w-full">Criar Conta</Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
            
            {/* Wishlist */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative"
              onClick={() => window.location.href = "/wishlist"}
            >
              <Heart className="h-5 w-5" />
              {wishlistItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand-accent text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {wishlistItems.length}
                </span>
              )}
            </Button>
            
            {/* Cart */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative"
              onClick={openCart}
            >
              <ShoppingBag className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand-accent text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden">
          <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-xl transform transition-transform animate-slide-in">
            <div className="p-4">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-lg font-bold">Menu</h2>
                <Button variant="ghost" size="icon" onClick={toggleMenu}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
              
              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="mb-6">
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Pesquisar produtos..."
                    className="w-full pr-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Button 
                    type="submit" 
                    variant="ghost" 
                    size="icon" 
                    className="absolute right-0 top-0"
                  >
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
              </form>
              
              {/* Mobile Navigation */}
              <nav className="flex flex-col space-y-4">
                <Link to="/" className="py-2 font-medium" onClick={toggleMenu}>
                  Home
                </Link>
                <div className="space-y-2">
                  <h3 className="font-medium py-2">Categorias</h3>
                  <div className="pl-4 space-y-2">
                    {collections.slice(0, 5).map((collection) => (
                      <Link 
                        key={collection.id} 
                        to={`/collections/${collection.handle}`}
                        className="block py-1"
                        onClick={toggleMenu}
                      >
                        {collection.title}
                      </Link>
                    ))}
                    <Link 
                      to="/collections" 
                      className="block py-1 font-medium"
                      onClick={toggleMenu}
                    >
                      Ver todas
                    </Link>
                  </div>
                </div>
                <Link to="/products" className="py-2 font-medium" onClick={toggleMenu}>
                  Produtos
                </Link>
                <Link to="/about" className="py-2 font-medium" onClick={toggleMenu}>
                  Sobre
                </Link>
                <Link to="/contact" className="py-2 font-medium" onClick={toggleMenu}>
                  Contato
                </Link>
                
                <div className="border-t border-gray-200 pt-4 mt-4">
                  {isAuthenticated ? (
                    <>
                      <Link to="/account" className="block py-2" onClick={toggleMenu}>
                        Minha Conta
                      </Link>
                      <Link to="/account/orders" className="block py-2" onClick={toggleMenu}>
                        Meus Pedidos
                      </Link>
                      <Link to="/logout" className="block py-2" onClick={toggleMenu}>
                        Sair
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link to="/login" className="block py-2" onClick={toggleMenu}>
                        Entrar
                      </Link>
                      <Link to="/register" className="block py-2" onClick={toggleMenu}>
                        Criar Conta
                      </Link>
                    </>
                  )}
                </div>
              </nav>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
