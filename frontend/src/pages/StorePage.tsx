import { useState, useEffect } from 'react';
import SectionTitle from '../components/ui/SectionTitle';
import ProductCard from '../components/store/ProductCard';
import { SearchIcon, FilterIcon, LoaderIcon } from 'lucide-react';
import { StoreService, Product } from '../services';

const StorePage = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState({
    min: 0,
    max: 200
  });
  const [showFilters, setShowFilters] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, [activeCategory]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching products with category:', activeCategory);
      const response = await StoreService.getProducts({
        page: 1,
        size: 50,
        ...(activeCategory !== 'all' && { category: activeCategory })
      });
      console.log('Products response:', response);
      setProducts(response.items);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products. Please check if the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  // Extract all unique categories from products
  const categories = ['all', ...new Set(products.map(product => product.category))];
  
  // Filter products based on active filters
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPrice = product.price >= priceRange.min && product.price <= priceRange.max;
    return matchesSearch && matchesPrice;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-dark flex justify-center items-center">
        <div className="flex items-center">
          <LoaderIcon className="animate-spin text-primary mr-3" size={40} />
          <span className="text-white/70">Loading products...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-dark py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16 bg-dark-lighter rounded-lg">
            <div className="text-red-400 mb-4">⚠️ {error}</div>
            <button 
              onClick={fetchProducts}
              className="px-6 py-2 bg-primary text-white rounded-full hover:shadow-neon transition-all duration-300"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle title="iZonehub Store" subtitle="Browse our products and order via WhatsApp. We offer components, kits, and merchandise to support your projects." />
        
        {/* WhatsApp Store Notice */}
        <div className="bg-green-600/20 border border-green-600/30 rounded-lg p-4 mb-8 text-center">
          <p className="text-white">
            To purchase any item, click the "Order via WhatsApp" button on the
            product. Our team will assist you with payment and delivery options.
          </p>
        </div>
        
        {/* Search and filters */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
            <div className="relative w-full md:w-64">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-dark-lighter border border-neutral/30 rounded-full py-2 pl-10 pr-4 focus:outline-none focus:border-primary"
              />
              <SearchIcon size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden flex items-center px-4 py-2 bg-dark-lighter rounded-full"
            >
              <FilterIcon size={18} className="mr-2" />
              Filters
            </button>
            <div className="hidden md:flex flex-wrap gap-2">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm capitalize transition-all duration-300 ${
                    activeCategory === category
                      ? 'bg-primary text-white'
                      : 'bg-dark-lighter text-white/70 hover:bg-dark-light'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
          
          {/* Mobile filters */}
          {showFilters && (
            <div className="md:hidden bg-dark-lighter p-4 rounded-lg mb-4">
              <h3 className="font-bold mb-3">Categories</h3>
              <div className="flex flex-wrap gap-2 mb-4">
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`px-3 py-1 rounded-full text-xs capitalize transition-all duration-300 ${
                      activeCategory === category
                        ? 'bg-primary text-white'
                        : 'bg-dark text-white/70 hover:bg-dark-light'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
              <h3 className="font-bold mb-3">Price Range</h3>
              <div className="mb-2 flex justify-between text-sm">
                <span>${priceRange.min}</span>
                <span>${priceRange.max}</span>
              </div>
              <input
                type="range"
                min="0"
                max="200"
                value={priceRange.max}
                onChange={(e) => setPriceRange({
                  ...priceRange,
                  max: parseInt(e.target.value)
                })}
                className="w-full h-2 bg-dark rounded-lg appearance-none cursor-pointer"
              />
            </div>
          )}
        </div>

        {/* Desktop sidebar and product grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Desktop sidebar filters */}
          <div className="hidden md:block">
            <div className="bg-dark-lighter rounded-lg p-6 border border-neutral/20 sticky top-24">
              <h3 className="text-xl font-bold mb-6">Filters</h3>
              <div className="mb-6">
                <h4 className="font-medium mb-3">Price Range</h4>
                <div className="mb-2 flex justify-between text-sm">
                  <span>${priceRange.min}</span>
                  <span>${priceRange.max}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="200"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange({
                    ...priceRange,
                    max: parseInt(e.target.value)
                  })}
                  className="w-full h-2 bg-dark rounded-lg appearance-none cursor-pointer"
                />
              </div>
              <button
                onClick={() => {
                  setActiveCategory('all');
                  setSearchQuery('');
                  setPriceRange({ min: 0, max: 200 });
                }}
                className="w-full px-4 py-2 bg-dark text-white/80 hover:bg-dark-light rounded-full text-sm"
              >
                Reset Filters
              </button>
            </div>
          </div>
          
          {/* Products grid */}
          <div className="md:col-span-3">
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map(product => (
                  <ProductCard 
                    key={product.id} 
                    id={product.id.toString()} 
                    name={product.name} 
                    price={product.price} 
                    image={product.image_url || 'https://images.unsplash.com/photo-1553406830-ef2513450d76?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'} 
                    category={product.category} 
                    inStock={product.is_available && product.stock_quantity > 0} 
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-dark-lighter rounded-lg">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-dark rounded-full mb-4">
                  <SearchIcon size={24} className="text-white/50" />
                </div>
                <h3 className="text-xl font-bold mb-2">No products found</h3>
                <p className="text-white/70 mb-6">
                  {searchQuery 
                    ? "We couldn't find any products matching your search criteria." 
                    : "No products available for the selected filter."}
                </p>
                <button
                  onClick={() => {
                    setActiveCategory('all');
                    setSearchQuery('');
                    setPriceRange({ min: 0, max: 200 });
                  }}
                  className="px-6 py-2 bg-primary text-white rounded-full hover:shadow-neon transition-all duration-300"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StorePage;