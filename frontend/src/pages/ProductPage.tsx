import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeftIcon } from 'lucide-react';
import { StoreService } from '../services/storeService';
import { Product } from '../services/api';

const ProductPage = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const data = await StoreService.getProduct(parseInt(id));
        setProduct(data);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const getImageUrl = (url?: string) => {
    if (!url) return 'https://images.unsplash.com/photo-1553406830-ef2513450d76?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
    if (url.startsWith('data:') || url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    return `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}${url}`;
  };

  // WhatsApp message template
  const whatsappMessage = product 
    ? `Hi, I'm interested in purchasing the ${product.name} for $${product.price.toFixed(2)} from iZonehub Makerspace.` 
    : `Hi, I'm interested in a product from iZonehub Makerspace.`;
  const whatsappLink = `https://wa.me/+263123456789?text=${encodeURIComponent(whatsappMessage)}`;

  if (loading) {
    return (
      <div className="min-h-screen bg-dark py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-white/70">Loading product...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return <div className="min-h-screen bg-dark py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Product Not Found</h1>
            <p className="text-white/70 mb-8">
              The product you're looking for doesn't exist.
            </p>
            <Link to="/store" className="inline-flex items-center px-6 py-2 bg-primary text-white rounded-full hover:shadow-neon transition-all duration-300">
              <ArrowLeftIcon size={18} className="mr-2" />
              Back to Store
            </Link>
          </div>
        </div>
      </div>;
  }
  return <div className="min-h-screen bg-dark py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/store" className="inline-flex items-center text-white/70 hover:text-white mb-8">
          <ArrowLeftIcon size={18} className="mr-2" />
          Back to Store
        </Link>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product image */}
          <div className="bg-dark-lighter rounded-lg overflow-hidden border border-neutral/20">
            <img 
              src={getImageUrl(product.image_url)} 
              alt={product.name} 
              className="w-full h-auto object-cover" 
            />
          </div>
          {/* Product details */}
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <div className="flex items-center mb-4">
              <span className="text-primary text-2xl font-bold">
                ${product.price.toFixed(2)}
              </span>
              {product.is_available ? (
                <span className="ml-4 bg-success/20 text-success px-3 py-1 rounded-full text-sm">
                  In Stock ({product.stock_quantity} available)
                </span>
              ) : (
                <span className="ml-4 bg-danger/20 text-danger px-3 py-1 rounded-full text-sm">
                  Out of Stock
                </span>
              )}
            </div>
            <div className="mb-6">
              <span className="inline-block bg-primary/20 text-primary px-3 py-1 rounded-full text-sm mb-4">
                {product.category}
              </span>
              <h2 className="text-xl font-bold mb-2">Description</h2>
              <p className="text-white/70 whitespace-pre-wrap">{product.description}</p>
            </div>
            <div className="bg-green-600/20 border border-green-600/30 rounded-lg p-4 mb-6">
              <p className="text-white mb-2">
                To purchase this item, contact us via WhatsApp. Our team will
                assist you with payment and delivery options.
              </p>
            </div>
            <a 
              href={whatsappLink} 
              target="_blank" 
              rel="noopener noreferrer" 
              className={`inline-flex items-center justify-center w-full px-6 py-3 rounded-lg text-white bg-green-600 hover:bg-green-700 transition-colors font-medium ${!product.is_available ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="mr-2">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Order via WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>;
};
export default ProductPage;