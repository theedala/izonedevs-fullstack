import React from 'react';
import Button from '../ui/Button';
import { ShoppingCartIcon } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { Product } from '../../services/api';
interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  inStock: boolean;
  className?: string;
}
const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  price,
  image,
  category,
  inStock,
  className = ''
}) => {
  const { addToCart } = useCart();
  
  const handleAddToCart = () => {
    const product: Product = {
      id: parseInt(id),
      name,
      price,
      description: '',
      image_url: image,
      category,
      stock_quantity: 1,
      is_available: inStock,
      featured: false,
      created_at: new Date().toISOString()
    };
    addToCart(product);
  };
  return <div className={`card overflow-hidden hover:shadow-neon-sm transition-all duration-300 ${className}`}>
      <div className="relative h-48 overflow-hidden">
        <img src={image} alt={name} className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" />
        <div className="absolute top-4 left-4 bg-dark-lighter/80 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full">
          {category}
        </div>
        {!inStock && <div className="absolute inset-0 flex items-center justify-center bg-dark/70 backdrop-blur-sm">
            <span className="bg-danger text-white px-4 py-2 rounded-full font-bold">
              Out of Stock
            </span>
          </div>}
      </div>
      <div className="p-6">
        <h3 className="text-lg font-bold mb-2">{name}</h3>
        <div className="flex justify-between items-center mb-4">
          <span className="text-primary text-xl font-bold">
            ${price.toFixed(2)}
          </span>
          {inStock && <span className="text-success text-sm flex items-center">
              <span className="w-2 h-2 bg-success rounded-full mr-1"></span>
              In Stock
            </span>}
        </div>
        <div className="flex flex-col gap-2">
          <button
            onClick={handleAddToCart}
            disabled={!inStock}
            className={`w-full px-4 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-primary to-secondary text-white hover:shadow-neon transition-all duration-300 flex items-center justify-center gap-2 ${!inStock ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <ShoppingCartIcon size={16} />
            Add to Cart
          </button>
          <Button href={`/store/${id}`} variant="outline" size="sm" className="w-full">
            View Details
          </Button>
        </div>
      </div>
    </div>;
};
export default ProductCard;