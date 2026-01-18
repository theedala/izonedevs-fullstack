import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ShoppingCartIcon, TrashIcon, PlusIcon, MinusIcon, ArrowLeftIcon } from 'lucide-react';
import SectionTitle from '../components/ui/SectionTitle';
import { StoreService } from '../services';

const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity, clearCart, cartTotal, validateCart } = useCart();
  const [validating, setValidating] = useState(true);

  useEffect(() => {
    const validateCartItems = async () => {
      try {
        const response = await StoreService.getProducts({ page: 1, size: 100 });
        const availableProductIds = response.items.map(p => p.id);
        validateCart(availableProductIds);
      } catch (error) {
        console.error('Error validating cart:', error);
      } finally {
        setValidating(false);
      }
    };
    
    validateCartItems();
  }, []);

  if (validating) {
    return (
      <div className="min-h-screen bg-dark py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-white/70">Validating cart...</p>
          </div>
        </div>
      </div>
    );
  }

  const getImageUrl = (url?: string) => {
    if (!url) return 'https://images.unsplash.com/photo-1553406830-ef2513450d76?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
    if (url.startsWith('data:') || url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    return `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}${url}`;
  };

  // Generate WhatsApp message with all cart items
  const generateWhatsAppMessage = () => {
    if (cartItems.length === 0) return '';
    
    let message = "Hi, I'd like to order the following items from iZonehub Makerspace:\n\n";
    
    cartItems.forEach((item, index) => {
      message += `${index + 1}. ${item.name} - $${item.price.toFixed(2)} x ${item.quantity} = $${(item.price * item.quantity).toFixed(2)}\n`;
    });
    
    message += `\nTotal: $${cartTotal.toFixed(2)}\n\nPlease confirm availability and payment details. Thank you!`;
    
    return encodeURIComponent(message);
  };

  const whatsappLink = `https://wa.me/263712491104?text=${generateWhatsAppMessage()}`;

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-dark py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle title="Shopping Cart" subtitle="Your cart is currently empty" />
          
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-dark-lighter rounded-xl p-12 border border-neutral/20">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-dark rounded-full mb-6">
                <ShoppingCartIcon size={48} className="text-white/30" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Your cart is empty</h3>
              <p className="text-white/70 mb-8">
                Looks like you haven't added any items to your cart yet.
              </p>
              <Link
                to="/store"
                className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-lg hover:shadow-neon transition-all duration-300 font-medium"
              >
                <ArrowLeftIcon size={20} className="mr-2" />
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle 
          title="Shopping Cart" 
          subtitle={`You have ${cartItems.length} ${cartItems.length === 1 ? 'item' : 'items'} in your cart`} 
        />

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-dark-lighter rounded-xl p-4 border border-neutral/20 hover:border-primary/30 transition-all duration-300"
                >
                  <div className="flex gap-4">
                    {/* Product Image */}
                    <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={getImageUrl(item.image_url)}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-grow">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <Link
                            to={`/store/${item.id}`}
                            className="text-lg font-bold hover:text-primary transition-colors"
                          >
                            {item.name}
                          </Link>
                          <p className="text-sm text-white/60 capitalize">{item.category}</p>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="p-2 text-danger hover:bg-danger/10 rounded-lg transition-colors"
                          title="Remove from cart"
                        >
                          <TrashIcon size={18} />
                        </button>
                      </div>

                      <div className="flex justify-between items-end">
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-8 h-8 flex items-center justify-center bg-dark hover:bg-dark-light border border-neutral/30 rounded-lg transition-colors"
                          >
                            <MinusIcon size={16} />
                          </button>
                          <span className="w-12 text-center font-medium">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center bg-dark hover:bg-dark-light border border-neutral/30 rounded-lg transition-colors"
                          >
                            <PlusIcon size={16} />
                          </button>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          <p className="text-sm text-white/60">${item.price.toFixed(2)} each</p>
                          <p className="text-xl font-bold text-primary">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Clear Cart Button */}
              <button
                onClick={clearCart}
                className="w-full px-4 py-2 text-danger hover:bg-danger/10 border border-danger/30 rounded-lg transition-colors font-medium"
              >
                Clear Cart
              </button>
            </div>

            {/* Cart Summary */}
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-br from-dark-lighter to-dark-light rounded-xl p-6 border border-primary/20 sticky top-24">
                <h3 className="text-xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Order Summary
                </h3>

                <div className="space-y-3 mb-6">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-white/70">
                        {item.name} x{item.quantity}
                      </span>
                      <span className="text-white">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-neutral/20 pt-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold">Total</span>
                    <span className="text-2xl font-bold text-primary">
                      ${cartTotal.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="bg-green-600/20 border border-green-600/30 rounded-lg p-4 mb-4">
                  <p className="text-white text-sm">
                    Click below to send your order via WhatsApp. Our team will confirm availability and payment details.
                  </p>
                </div>

                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-full px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="mr-2"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  Checkout via WhatsApp
                </a>

                <Link
                  to="/store"
                  className="block text-center mt-4 text-white/70 hover:text-white transition-colors"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
