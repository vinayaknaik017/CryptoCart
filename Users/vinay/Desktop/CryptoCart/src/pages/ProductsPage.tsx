import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, Search } from 'lucide-react';
import { products, categories, getProductsByCategory, searchProducts } from '../data/products';
import ProductGrid from '../components/product/ProductGrid';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const ProductsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000]);
  const [showFilters, setShowFilters] = useState(false);
  
  // Get query parameters
  const queryCategory = searchParams.get('category') || 'All';
  const querySearch = searchParams.get('q') || '';
  
  useEffect(() => {
    // Set initial state from URL params
    if (queryCategory) {
      setSelectedCategory(queryCategory);
    }
    
    if (querySearch) {
      setSearchQuery(querySearch);
    }
    
    // Apply filters
    let result = products;
    
    // Filter by category
    if (selectedCategory !== 'All') {
      result = getProductsByCategory(selectedCategory);
    }
    
    // Filter by search query
    if (searchQuery) {
      result = searchProducts(searchQuery);
    }
    
    // Filter by price range
    result = result.filter(
      product => product.price >= priceRange[0] && product.price <= priceRange[1]
    );
    
    setFilteredProducts(result);
  }, [selectedCategory, searchQuery, priceRange, queryCategory, querySearch]);
  
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setSearchParams({ category });
  };
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams({ q: searchQuery });
  };
  
  const handlePriceChange = (index: number, value: number) => {
    const newRange = [...priceRange] as [number, number];
    newRange[index] = value;
    setPriceRange(newRange);
  };
  
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">All Products</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters - Desktop */}
        <div className="hidden lg:block w-64 flex-shrink-0">
          <div className="sticky top-24">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-lg font-semibold mb-4">Categories</h2>
              <div className="space-y-2">
                {categories.map((category, index) => (
                  <button
                    key={index}
                    onClick={() => handleCategoryChange(category)}
                    className={`block w-full text-left px-2 py-1.5 rounded ${
                      selectedCategory === category
                        ? 'bg-blue-100 text-blue-700 font-medium'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">Price Range</h2>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Min: ${priceRange[0]}</span>
                  <span className="text-sm text-gray-500">Max: ${priceRange[1]}</span>
                </div>
                
                <input
                  type="range"
                  min="0"
                  max="2000"
                  step="10"
                  value={priceRange[0]}
                  onChange={(e) => handlePriceChange(0, parseInt(e.target.value))}
                  className="w-full"
                />
                
                <input
                  type="range"
                  min="0"
                  max="2000"
                  step="10"
                  value={priceRange[1]}
                  onChange={(e) => handlePriceChange(1, parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="flex-grow">
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
              <form onSubmit={handleSearch} className="flex-grow max-w-md">
                <Input
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  rightIcon={
                    <button type="submit">
                      <Search className="h-5 w-5 text-gray-400" />
                    </button>
                  }
                />
              </form>
              
              <Button
                variant="outline"
                leftIcon={<Filter className="h-5 w-5" />}
                onClick={toggleFilters}
                className="lg:hidden"
              >
                Filters
              </Button>
            </div>
            
            {/* Mobile Filters */}
            {showFilters && (
              <div className="mt-4 p-4 bg-white rounded-lg shadow-sm lg:hidden">
                <h2 className="text-lg font-semibold mb-4">Categories</h2>
                <div className="flex flex-wrap gap-2 mb-6">
                  {categories.map((category, index) => (
                    <button
                      key={index}
                      onClick={() => handleCategoryChange(category)}
                      className={`px-3 py-1.5 rounded-full text-sm ${
                        selectedCategory === category
                          ? 'bg-blue-100 text-blue-700 font-medium'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
                
                <h2 className="text-lg font-semibold mb-4">Price Range</h2>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Min: ${priceRange[0]}</span>
                    <span className="text-sm text-gray-500">Max: ${priceRange[1]}</span>
                  </div>
                  
                  <input
                    type="range"
                    min="0"
                    max="2000"
                    step="10"
                    value={priceRange[0]}
                    onChange={(e) => handlePriceChange(0, parseInt(e.target.value))}
                    className="w-full"
                  />
                  
                  <input
                    type="range"
                    min="0"
                    max="2000"
                    step="10"
                    value={priceRange[1]}
                    onChange={(e) => handlePriceChange(1, parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>
            )}
          </div>
          
          <div className="mb-4">
            <p className="text-gray-500">
              Showing {filteredProducts.length} products
              {selectedCategory !== 'All' && ` in ${selectedCategory}`}
              {searchQuery && ` matching "${searchQuery}"`}
            </p>
          </div>
          
          {filteredProducts.length > 0 ? (
            <ProductGrid products={filteredProducts} columns={3} />
          ) : (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-500">
                Try adjusting your search or filter criteria
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;