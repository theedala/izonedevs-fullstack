import React, { Component } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeftIcon } from 'lucide-react';
const ProductPage = () => {
  const {
    id
  } = useParams<{
    id: string;
  }>();
  // Mock product data - in a real application, this would come from an API or database
  const products = {
    '1': {
      name: 'Arduino Uno R3',
      price: 25,
      description: 'The Arduino Uno R3 is a microcontroller board based on the ATmega328P. It has 14 digital input/output pins, 6 analog inputs, a 16 MHz ceramic resonator, a USB connection, a power jack, an ICSP header and a reset button.',
      specs: ['Microcontroller: ATmega328P', 'Operating Voltage: 5V', 'Input Voltage (recommended): 7-12V', 'Digital I/O Pins: 14 (of which 6 provide PWM output)', 'Analog Input Pins: 6', 'DC Current per I/O Pin: 20 mA', 'Flash Memory: 32 KB (ATmega328P)', 'SRAM: 2 KB (ATmega328P)', 'EEPROM: 1 KB (ATmega328P)', 'Clock Speed: 16 MHz'],
      images: ['https://images.unsplash.com/photo-1553406830-ef2513450d76?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1553406830-ef2513450d76?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
      category: 'microcontrollers',
      inStock: true
    }
    // Add other products as needed
  };
  const product = products[id as keyof typeof products];
  // WhatsApp message template
  const whatsappMessage = product ? `Hi, I'm interested in purchasing the ${product.name} for $${product.price.toFixed(2)} from iZonehub Makerspace.` : `Hi, I'm interested in a product from iZonehub Makerspace.`;
  const whatsappLink = `https://wa.me/+263123456789?text=${encodeURIComponent(whatsappMessage)}`;
  if (!product) {
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
          {/* Product images */}
          <div className="bg-dark-lighter rounded-lg overflow-hidden border border-neutral/20">
            <img src={product.images[0]} alt={product.name} className="w-full h-auto object-cover" />
          </div>
          {/* Product details */}
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <div className="flex items-center mb-4">
              <span className="text-primary text-2xl font-bold">
                ${product.price.toFixed(2)}
              </span>
              {product.inStock ? <span className="ml-4 bg-success/20 text-success px-3 py-1 rounded-full text-sm">
                  In Stock
                </span> : <span className="ml-4 bg-danger/20 text-danger px-3 py-1 rounded-full text-sm">
                  Out of Stock
                </span>}
            </div>
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-2">Description</h2>
              <p className="text-white/70">{product.description}</p>
            </div>
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-2">Specifications</h2>
              <ul className="space-y-2 text-white/70">
                {product.specs.map((spec, index) => <li key={index} className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <span>{spec}</span>
                  </li>)}
              </ul>
            </div>
            <div className="bg-green-600/20 border border-green-600/30 rounded-lg p-4 mb-6">
              <p className="text-white mb-2">
                To purchase this item, contact us via WhatsApp. Our team will
                assist you with payment and delivery options.
              </p>
            </div>
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className={`inline-flex items-center justify-center w-full px-6 py-3 rounded-lg text-white bg-green-600 hover:bg-green-700 transition-colors font-medium ${!product.inStock ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}`}>
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