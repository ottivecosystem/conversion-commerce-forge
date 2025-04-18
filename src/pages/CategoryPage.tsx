
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Filter, 
  ChevronDown, 
  ChevronUp, 
  X, 
  Check,
  SlidersHorizontal,
  ChevronRight,
  GridIcon,
  LayoutList
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import Layout from '@/components/layout/Layout';
import ProductGrid from '@/components/product/ProductGrid';
import { getCollections, getCollectionById, getProducts } from '@/lib/medusa';

const sortOptions = [
  { value: 'price-asc', label: 'Preço: Menor para Maior' },
  { value: 'price-desc', label: 'Preço: Maior para Menor' },
  { value: 'name-asc', label: 'Nome: A-Z' },
  { value: 'name-desc', label: 'Nome: Z-A' },
  { value: 'newest', label: 'Mais Recentes' },
  { value: 'popularity', label: 'Mais Populares' }
];

const CategoryPage = () => {
  const { handle } = useParams<{ handle: string }>();
  const [collection, setCollection] = useState<any>(null);
  const [products, setProducts] = useState([]);
  const [collections, setCollections] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filter and sort state
  const [sortBy, setSortBy] = useState('newest');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [expandedFilters, setExpandedFilters] = useState({
    categories: true,
    brands: true,
    price: true
  });
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  
  // Brands list (would normally come from API)
  const brands = [
    { id: 'brand1', name: 'Brand 1', count: 12 },
    { id: 'brand2', name: 'Brand 2', count: 8 },
    { id: 'brand3', name: 'Brand 3', count: 5 },
    { id: 'brand4', name: 'Brand 4', count: 3 },
  ];
  
  useEffect(() => {
    const fetchCollectionData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch all collections for the sidebar
        const collectionsResponse = await getCollections();
        setCollections(collectionsResponse.collections || []);
        
        // If we have a specific collection handle, fetch that collection
        if (handle) {
          const collectionResponse = await getCollectionById(handle);
          setCollection(collectionResponse.collection);
          
          // Fetch products for this collection
          const productsResponse = await getProducts({
            collection_id: collectionResponse.collection.id,
            limit: itemsPerPage,
            offset: (currentPage - 1) * itemsPerPage
          });
          
          setProducts(productsResponse.products || []);
          
          // Calculate total pages
          const count = productsResponse.count || 0;
          setTotalPages(Math.ceil(count / itemsPerPage));
        } else {
          // If no handle, fetch all products
          const productsResponse = await getProducts({
            limit: itemsPerPage,
            offset: (currentPage - 1) * itemsPerPage
          });
          
          setProducts(productsResponse.products || []);
          
          // Calculate total pages
          const count = productsResponse.count || 0;
          setTotalPages(Math.ceil(count / itemsPerPage));
        }
      } catch (err) {
        console.error('Error fetching collection data:', err);
        setError('Não foi possível carregar os produtos.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCollectionData();
  }, [handle, currentPage, itemsPerPage]);
  
  const toggleFilter = (filter: string) => {
    setExpandedFilters((prev) => ({
      ...prev,
      [filter]: !prev[filter]
    }));
  };
  
  const toggleBrand = (brandId: string) => {
    setSelectedBrands((prev) => {
      if (prev.includes(brandId)) {
        return prev.filter(id => id !== brandId);
      } else {
        return [...prev, brandId];
      }
    });
  };
  
  const clearFilters = () => {
    setPriceRange([0, 1000]);
    setSelectedBrands([]);
  };
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top when changing page
    window.scrollTo(0, 0);
  };
  
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
                <Link to="/collections" className="text-gray-500 hover:text-gray-700">Coleções</Link>
              </li>
              {collection && (
                <li className="flex items-center">
                  <ChevronRight className="h-4 w-4 text-gray-400 mx-1" />
                  <span className="text-gray-900 font-medium">{collection.title}</span>
                </li>
              )}
            </ol>
          </nav>
        </div>
      </div>
      
      {/* Category header */}
      <section className="bg-gray-50 py-8 border-b border-gray-200">
        <div className="container-custom">
          <h1 className="text-3xl font-bold text-gray-900">
            {collection ? collection.title : 'Todos os Produtos'}
          </h1>
          {collection && collection.description && (
            <p className="text-gray-600 mt-2 max-w-3xl">
              {collection.description}
            </p>
          )}
        </div>
      </section>
      
      {/* Products section with filters */}
      <section className="py-12">
        <div className="container-custom">
          <div className="lg:grid lg:grid-cols-4 gap-8">
            {/* Mobile filter button */}
            <div className="lg:hidden mb-6">
              <Button 
                variant="outline" 
                className="w-full flex items-center justify-center"
                onClick={() => setShowMobileFilters(true)}
              >
                <Filter className="h-4 w-4 mr-2" />
                Filtros
              </Button>
            </div>
            
            {/* Filters sidebar - Desktop */}
            <div className="hidden lg:block">
              <div className="sticky top-24 space-y-8">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-900">Filtros</h2>
                    {(selectedBrands.length > 0 || priceRange[0] > 0 || priceRange[1] < 1000) && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-sm text-gray-500"
                        onClick={clearFilters}
                      >
                        Limpar
                      </Button>
                    )}
                  </div>
                  
                  {/* Categories filter */}
                  <div className="border-b border-gray-200 pb-6">
                    <button
                      className="flex w-full items-center justify-between py-2 text-gray-900 font-medium"
                      onClick={() => toggleFilter('categories')}
                    >
                      Categorias
                      {expandedFilters.categories ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </button>
                    
                    {expandedFilters.categories && (
                      <div className="mt-2 space-y-2">
                        {collections.map((col) => (
                          <div key={col.id} className="flex items-center">
                            <Link 
                              to={`/collections/${col.handle}`}
                              className={`text-sm ${col.id === collection?.id ? 'text-brand-accent font-medium' : 'text-gray-600'}`}
                            >
                              {col.title} ({col.products_count || 0})
                            </Link>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {/* Brands filter */}
                  <div className="border-b border-gray-200 pb-6">
                    <button
                      className="flex w-full items-center justify-between py-2 text-gray-900 font-medium"
                      onClick={() => toggleFilter('brands')}
                    >
                      Marcas
                      {expandedFilters.brands ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </button>
                    
                    {expandedFilters.brands && (
                      <div className="mt-2 space-y-2">
                        {brands.map((brand) => (
                          <div key={brand.id} className="flex items-center">
                            <Checkbox 
                              id={`brand-${brand.id}`}
                              checked={selectedBrands.includes(brand.id)}
                              onCheckedChange={() => toggleBrand(brand.id)}
                            />
                            <label 
                              htmlFor={`brand-${brand.id}`}
                              className="ml-2 text-sm text-gray-600"
                            >
                              {brand.name} ({brand.count})
                            </label>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {/* Price filter */}
                  <div className="border-b border-gray-200 pb-6">
                    <button
                      className="flex w-full items-center justify-between py-2 text-gray-900 font-medium"
                      onClick={() => toggleFilter('price')}
                    >
                      Preço
                      {expandedFilters.price ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </button>
                    
                    {expandedFilters.price && (
                      <div className="mt-4">
                        <Slider
                          defaultValue={[0, 1000]}
                          max={1000}
                          step={10}
                          value={priceRange}
                          onValueChange={setPriceRange}
                          className="my-4"
                        />
                        
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">
                            R$ {priceRange[0]}
                          </span>
                          <span className="text-sm text-gray-600">
                            R$ {priceRange[1]}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Mobile filters sidebar */}
            {showMobileFilters && (
              <div className="fixed inset-0 z-50 lg:hidden">
                <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowMobileFilters(false)} />
                
                <div className="absolute top-0 right-0 h-full w-4/5 max-w-sm bg-white shadow-xl p-6 overflow-y-auto">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-gray-900">Filtros</h2>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => setShowMobileFilters(false)}
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                  
                  <div className="space-y-8">
                    {/* Categories filter */}
                    <div className="border-b border-gray-200 pb-6">
                      <button
                        className="flex w-full items-center justify-between py-2 text-gray-900 font-medium"
                        onClick={() => toggleFilter('categories')}
                      >
                        Categorias
                        {expandedFilters.categories ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </button>
                      
                      {expandedFilters.categories && (
                        <div className="mt-2 space-y-2">
                          {collections.map((col) => (
                            <div key={col.id} className="flex items-center">
                              <Link 
                                to={`/collections/${col.handle}`}
                                className={`text-sm ${col.id === collection?.id ? 'text-brand-accent font-medium' : 'text-gray-600'}`}
                                onClick={() => setShowMobileFilters(false)}
                              >
                                {col.title} ({col.products_count || 0})
                              </Link>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    {/* Brands filter */}
                    <div className="border-b border-gray-200 pb-6">
                      <button
                        className="flex w-full items-center justify-between py-2 text-gray-900 font-medium"
                        onClick={() => toggleFilter('brands')}
                      >
                        Marcas
                        {expandedFilters.brands ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </button>
                      
                      {expandedFilters.brands && (
                        <div className="mt-2 space-y-2">
                          {brands.map((brand) => (
                            <div key={brand.id} className="flex items-center">
                              <Checkbox 
                                id={`mobile-brand-${brand.id}`}
                                checked={selectedBrands.includes(brand.id)}
                                onCheckedChange={() => toggleBrand(brand.id)}
                              />
                              <label 
                                htmlFor={`mobile-brand-${brand.id}`}
                                className="ml-2 text-sm text-gray-600"
                              >
                                {brand.name} ({brand.count})
                              </label>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    {/* Price filter */}
                    <div className="border-b border-gray-200 pb-6">
                      <button
                        className="flex w-full items-center justify-between py-2 text-gray-900 font-medium"
                        onClick={() => toggleFilter('price')}
                      >
                        Preço
                        {expandedFilters.price ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </button>
                      
                      {expandedFilters.price && (
                        <div className="mt-4">
                          <Slider
                            defaultValue={[0, 1000]}
                            max={1000}
                            step={10}
                            value={priceRange}
                            onValueChange={setPriceRange}
                            className="my-4"
                          />
                          
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">
                              R$ {priceRange[0]}
                            </span>
                            <span className="text-sm text-gray-600">
                              R$ {priceRange[1]}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-8 flex gap-4">
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={clearFilters}
                    >
                      Limpar
                    </Button>
                    <Button 
                      className="flex-1 bg-brand-accent hover:bg-blue-600"
                      onClick={() => setShowMobileFilters(false)}
                    >
                      Ver resultados
                    </Button>
                  </div>
                </div>
              </div>
            )}
            
            {/* Products area */}
            <div className="lg:col-span-3">
              {/* Sorting and view options */}
              <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
                <div className="flex items-center">
                  <SlidersHorizontal className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-700 mr-3">Ordenar por:</span>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-52">
                      <SelectValue placeholder="Ordenar por" />
                    </SelectTrigger>
                    <SelectContent>
                      {sortOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-700">Exibição:</span>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className={viewMode === 'grid' ? 'bg-gray-100' : ''}
                    onClick={() => setViewMode('grid')}
                  >
                    <GridIcon className="h-5 w-5" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className={viewMode === 'list' ? 'bg-gray-100' : ''}
                    onClick={() => setViewMode('list')}
                  >
                    <LayoutList className="h-5 w-5" />
                  </Button>
                  
                  <span className="text-sm text-gray-700 ml-4">
                    Exibindo <span className="font-medium">{products.length}</span> de{' '}
                    <span className="font-medium">{totalPages * itemsPerPage}</span> produtos
                  </span>
                </div>
              </div>
              
              {/* Active filters */}
              {(selectedBrands.length > 0 || priceRange[0] > 0 || priceRange[1] < 1000) && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {selectedBrands.map((brandId) => {
                    const brand = brands.find(b => b.id === brandId);
                    return (
                      <div 
                        key={brandId}
                        className="flex items-center bg-gray-100 rounded-full pl-3 pr-2 py-1"
                      >
                        <span className="text-xs text-gray-800">{brand?.name}</span>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-5 w-5 ml-1"
                          onClick={() => toggleBrand(brandId)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    );
                  })}
                  
                  {(priceRange[0] > 0 || priceRange[1] < 1000) && (
                    <div className="flex items-center bg-gray-100 rounded-full pl-3 pr-2 py-1">
                      <span className="text-xs text-gray-800">
                        R$ {priceRange[0]} - R$ {priceRange[1]}
                      </span>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-5 w-5 ml-1"
                        onClick={() => setPriceRange([0, 1000])}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                  
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-xs text-brand-accent hover:text-blue-600"
                    onClick={clearFilters}
                  >
                    Limpar todos
                  </Button>
                </div>
              )}
              
              {/* Loading state */}
              {isLoading && (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-accent"></div>
                </div>
              )}
              
              {/* Error state */}
              {error && (
                <div className="text-center py-12">
                  <p className="text-red-500">{error}</p>
                  <Button 
                    variant="link" 
                    className="text-brand-accent mt-2"
                    onClick={() => window.location.reload()}
                  >
                    Tentar novamente
                  </Button>
                </div>
              )}
              
              {/* Empty state */}
              {!isLoading && !error && products.length === 0 && (
                <div className="text-center py-12">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum produto encontrado</h3>
                  <p className="text-gray-600 mb-6">
                    Tente ajustar seus filtros ou buscar por outro termo.
                  </p>
                  <Button 
                    variant="outline"
                    onClick={clearFilters}
                  >
                    Limpar filtros
                  </Button>
                </div>
              )}
              
              {/* Product grid */}
              {!isLoading && !error && products.length > 0 && (
                <ProductGrid 
                  products={products}
                  productSize={viewMode === 'grid' ? 'normal' : 'large'}
                />
              )}
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-12">
                  <nav className="flex items-center space-x-2">
                    <Button 
                      variant="outline" 
                      size="icon"
                      disabled={currentPage === 1}
                      onClick={() => handlePageChange(currentPage - 1)}
                    >
                      <ChevronRight className="h-4 w-4 rotate-180" />
                    </Button>
                    
                    {[...Array(totalPages)].map((_, i) => (
                      <Button 
                        key={i}
                        variant={i + 1 === currentPage ? 'default' : 'outline'}
                        size="icon"
                        onClick={() => handlePageChange(i + 1)}
                      >
                        {i + 1}
                      </Button>
                    ))}
                    
                    <Button 
                      variant="outline" 
                      size="icon"
                      disabled={currentPage === totalPages}
                      onClick={() => handlePageChange(currentPage + 1)}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </nav>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default CategoryPage;
