import React from 'react';
import Button from '../ui/Button';
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
  // WhatsApp message template
  const whatsappMessage = `Hi, I'm interested in purchasing the ${name} for $${price.toFixed(2)} from iZonehub Makerspace. Please send me the store catalogue.`;
  const whatsappLink = `https://wa.me/263712491104?text=${encodeURIComponent(whatsappMessage)}`;
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
        <div className="flex justify-between">
          <Button href={`/store/${id}`} variant="outline" size="sm">
            Details
          </Button>
          <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className={`px-4 py-2 rounded-full text-sm font-medium bg-green-600 text-white hover:bg-green-700 transition-colors ${!inStock ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}`}>
            Order via WhatsApp
          </a>
        </div>
      </div>
    </div>;
};
export default ProductCard;