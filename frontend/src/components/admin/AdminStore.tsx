import { useState, useEffect } from 'react';
import { StoreService, Product, ProductCreateData } from '../../services';
import Button from '../ui/Button';
import { PlusIcon, EditIcon, TrashIcon, DollarSignIcon, PackageIcon } from 'lucide-react';

const AdminStore = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<ProductCreateData>({
    name: '',
    description: '',
    price: 0,
    image_url: '',
    category: '',
    stock_quantity: 0
  });

  // Store routing number from Zimbabwe
  const STORE_ROUTING_NUMBER = '+263 712491104';

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await StoreService.getProducts({ page: 1, size: 50 });
      setProducts(response.items);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await StoreService.updateProduct(editingProduct.id, formData);
      } else {
        await StoreService.createProduct(formData);
      }
      setShowForm(false);
      setEditingProduct(null);
      resetForm();
      fetchProducts();
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      image_url: product.image_url || '',
      category: product.category,
      stock_quantity: product.stock_quantity
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        await StoreService.deleteProduct(id);
        fetchProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: 0,
      image_url: '',
      category: '',
      stock_quantity: 0
    });
  };

  if (loading) {
    return <div className="text-center py-8">Loading products...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Manage Store</h2>
          <p className="text-white/70 text-sm mt-1">
            Store Contact: <span className="text-primary font-mono">{STORE_ROUTING_NUMBER}</span>
          </p>
        </div>
        <Button 
          onClick={() => setShowForm(true)} 
          variant="primary"
          className="flex items-center"
        >
          <PlusIcon size={20} className="mr-2" />
          Add Product
        </Button>
      </div>

      {showForm && (
        <div className="bg-dark border border-neutral/30 rounded-lg p-6 mb-6">
          <h3 className="text-xl font-bold mb-4">
            {editingProduct ? 'Edit Product' : 'Add New Product'}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Product Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-dark-lighter border border-neutral/30 rounded-lg px-3 py-2 focus:outline-none focus:border-primary"
                  required
                  placeholder="Arduino Uno R3"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full bg-dark-lighter border border-neutral/30 rounded-lg px-3 py-2 focus:outline-none focus:border-primary"
                  required
                >
                  <option value="">Select Category</option>
                  <option value="electronics">Electronics</option>
                  <option value="3d-printing">3D Printing</option>
                  <option value="tools">Tools</option>
                  <option value="components">Components</option>
                  <option value="merchandise">Merchandise</option>
                  <option value="books">Books & Learning</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full bg-dark-lighter border border-neutral/30 rounded-lg px-3 py-2 focus:outline-none focus:border-primary"
                rows={3}
                required
                placeholder="High-quality product description..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Price (USD)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-dark-lighter border border-neutral/30 rounded-lg px-3 py-2 focus:outline-none focus:border-primary"
                  required
                  min="0"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Stock Quantity</label>
                <input
                  type="number"
                  value={formData.stock_quantity}
                  onChange={(e) => setFormData({ ...formData, stock_quantity: parseInt(e.target.value) || 0 })}
                  className="w-full bg-dark-lighter border border-neutral/30 rounded-lg px-3 py-2 focus:outline-none focus:border-primary"
                  required
                  min="0"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Product Image URL</label>
              <input
                type="url"
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                className="w-full bg-dark-lighter border border-neutral/30 rounded-lg px-3 py-2 focus:outline-none focus:border-primary"
                placeholder="https://example.com/product-image.jpg"
              />
            </div>

            <div className="flex space-x-4">
              <button 
                type="submit" 
                className="px-6 py-2 bg-primary text-white rounded-lg hover:shadow-neon transition-all duration-300"
              >
                {editingProduct ? 'Update Product' : 'Add Product'}
              </button>
              <button 
                type="button" 
                onClick={() => {
                  setShowForm(false);
                  setEditingProduct(null);
                  resetForm();
                }}
                className="px-6 py-2 border border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-all duration-300"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => (
          <div key={product.id} className="bg-dark border border-neutral/30 rounded-lg p-4">
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-lg font-bold line-clamp-1">{product.name}</h3>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(product)}
                  className="p-1 text-primary hover:bg-primary/20 rounded"
                >
                  <EditIcon size={16} />
                </button>
                <button
                  onClick={() => handleDelete(product.id)}
                  className="p-1 text-red-400 hover:bg-red-400/20 rounded"
                >
                  <TrashIcon size={16} />
                </button>
              </div>
            </div>
            
            <p className="text-white/70 text-sm mb-3 line-clamp-2">{product.description}</p>
            
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center text-primary font-bold">
                <DollarSignIcon size={16} className="mr-1" />
                ${product.price.toFixed(2)}
              </div>
              <div className="flex items-center text-white/60 text-sm">
                <PackageIcon size={14} className="mr-1" />
                {product.stock_quantity} in stock
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-xs bg-secondary/20 text-secondary px-2 py-1 rounded capitalize">
                {product.category}
              </span>
              <div className={`text-xs px-2 py-1 rounded ${
                product.is_available && product.stock_quantity > 0
                  ? 'bg-green-500/20 text-green-300'
                  : 'bg-red-500/20 text-red-300'
              }`}>
                {product.is_available && product.stock_quantity > 0 ? 'Available' : 'Out of Stock'}
              </div>
            </div>
          </div>
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center py-8 text-white/70">
          No products found. Add your first product!
        </div>
      )}
    </div>
  );
};

export default AdminStore;