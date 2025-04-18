
import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Search, X, ChevronRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Layout from '@/components/layout/Layout';
import ProductGrid from '@/components/product/ProductGrid';
import { searchProducts } from '@/lib/medusa';

const SearchPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialQuery = queryParams.get('q') || '';
  
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  
  // Sample popular searches (in a real app, these would come from analytics data)
  const popularSearches = [
    'Camisetas', 'Calças', 'Vestidos', 'Acessórios', 'Eletrônicos', 'Calçados'
  ];
  
  useEffect(() => {
    // Load recent searches from localStorage
    const savedSearches = localStorage.getItem('recentSearches');
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches));
    }
    
    // Perform search when query param changes
    if (initialQuery) {
      performSearch(initialQuery);
    }
  }, [initialQuery]);
  
  useEffect(() => {
    const fetchSuggestions = async (query: string) => {
      if (!query || query.length < 2) {
        setSuggestions([]);
        return;
      }
      
      try {
        // In a real app, you would have an API endpoint for search suggestions
        // Here we're just filtering from popular searches as an example
        const filteredSuggestions = popularSearches.filter(item => 
          item.toLowerCase().includes(query.toLowerCase())
        );
        
        setSuggestions(filteredSuggestions.slice(0, 5));
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      }
    };
    
    const debounceTimer = setTimeout(() => {
      if (searchQuery && searchQuery !== initialQuery) {
        fetchSuggestions(searchQuery);
      }
    }, 300);
    
    return () => clearTimeout(debounceTimer);
  }, [searchQuery, initialQuery]);
  
  const performSearch = async (query: string) => {
    if (!query) return;
    
    setIsLoading(true);
    
    try {
      const response = await searchProducts(query);
      setProducts(response.products || []);
      
      // Save to recent searches if not already there
      if (!recentSearches.includes(query)) {
        const updatedSearches = [query, ...recentSearches.slice(0, 4)];
        setRecentSearches(updatedSearches);
        localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
      }
    } catch (error) {
      console.error('Error searching products:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery) {
      setShowSuggestions(false);
      window.history.pushState({}, '', `/search?q=${encodeURIComponent(searchQuery)}`);
      performSearch(searchQuery);
    }
  };
  
  const clearSearch = () => {
    setSearchQuery('');
    setProducts([]);
    window.history.pushState({}, '', '/search');
  };
  
  const selectSuggestion = (suggestion: string) => {
    setSearchQuery(suggestion);
    setShowSuggestions(false);
    window.history.pushState({}, '', `/search?q=${encodeURIComponent(suggestion)}`);
    performSearch(suggestion);
  };
  
  return (
    <Layout>
      <div className="bg-gray-50 py-8 border-b border-gray-200">
        <div className="container-custom">
          {/* Breadcrumb */}
          <nav className="flex mb-4" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2 text-sm">
              <li>
                <Link to="/" className="text-gray-500 hover:text-gray-700">Home</Link>
              </li>
              <li className="flex items-center">
                <ChevronRight className="h-4 w-4 text-gray-400 mx-1" />
                <span className="text-gray-900 font-medium">Busca</span>
              </li>
            </ol>
          </nav>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Buscar Produtos</h1>
          
          {/* Search form */}
          <div className="max-w-2xl mx-auto">
            <form 
              onSubmit={handleSearch} 
              className="relative"
            >
              <Input
                type="text"
                placeholder="O que você está procurando?"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                className="h-12 pl-12 pr-12 text-base"
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              {searchQuery && (
                <button
                  type="button"
                  className="absolute right-12 top-1/2 transform -translate-y-1/2"
                  onClick={clearSearch}
                >
                  <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                </button>
              )}
              <Button
                type="submit"
                className="absolute right-1 top-1 h-10"
              >
                Buscar
              </Button>
              
              {/* Search suggestions */}
              {showSuggestions && searchQuery && suggestions.length > 0 && (
                <div className="absolute z-10 top-full left-0 right-0 mt-1 bg-white shadow-lg rounded-md border border-gray-200">
                  <ul>
                    {suggestions.map((suggestion, index) => (
                      <li key={index}>
                        <button
                          type="button"
                          className="flex items-center w-full px-4 py-2 text-left hover:bg-gray-50"
                          onClick={() => selectSuggestion(suggestion)}
                        >
                          <Search className="h-4 w-4 text-gray-400 mr-2" />
                          {suggestion}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
      
      <div className="container-custom py-8">
        {/* Recent and popular searches */}
        {!initialQuery && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {/* Recent searches */}
            <div>
              <h2 className="text-lg font-semibold mb-4">Pesquisas recentes</h2>
              {recentSearches.length > 0 ? (
                <ul className="space-y-2">
                  {recentSearches.map((search, index) => (
                    <li key={index}>
                      <button
                        className="flex items-center text-brand-accent hover:underline"
                        onClick={() => selectSuggestion(search)}
                      >
                        <Search className="h-4 w-4 mr-2" />
                        {search}
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">Nenhuma pesquisa recente.</p>
              )}
            </div>
            
            {/* Popular searches */}
            <div>
              <h2 className="text-lg font-semibold mb-4">Pesquisas populares</h2>
              <div className="flex flex-wrap gap-2">
                {popularSearches.map((search, index) => (
                  <button
                    key={index}
                    className="bg-gray-100 hover:bg-gray-200 rounded-full px-4 py-2 text-sm"
                    onClick={() => selectSuggestion(search)}
                  >
                    {search}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {/* Search results */}
        {initialQuery && (
          <div>
            <h2 className="text-xl font-semibold mb-6">
              {isLoading
                ? 'Buscando...'
                : `Resultados para "${initialQuery}" (${products.length})`
              }
            </h2>
            
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-accent"></div>
              </div>
            ) : products.length > 0 ? (
              <ProductGrid products={products} />
            ) : (
              <div className="text-center py-12 border border-dashed border-gray-300 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Nenhum resultado encontrado
                </h3>
                <p className="text-gray-600 mb-6">
                  Não encontramos produtos para "{initialQuery}". Tente novamente com termos diferentes.
                </p>
                <Button onClick={clearSearch} variant="outline">
                  Limpar busca
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default SearchPage;
