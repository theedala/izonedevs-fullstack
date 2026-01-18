import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MenuIcon, XIcon, ShoppingCartIcon } from 'lucide-react';
import { useCart } from '../../context/CartContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { cartCount } = useCart();

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Communities', href: '/communities' },
    { name: 'Projects', href: '/projects' },
    { name: 'Events', href: '/events' },
    { name: 'Blog', href: '/blog' },
    { name: 'Gallery', href: '/gallery' },
    { name: 'Store', href: '/store' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' }
  ];

  return (
    <header className="sticky top-0 z-50 bg-dark/90 backdrop-blur-md border-b border-neutral/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img 
                src="/logo.png" 
                alt="iZonehub Makerspace" 
                className="h-8 w-auto mr-3"
                onError={(e) => {
                  // Fallback if logo fails to load
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  target.nextElementSibling!.classList.remove('hidden');
                }}
              />
              <div className="hidden">
                <span className="text-xl font-bold text-primary">iZonehub</span>
                <span className="text-xl font-bold ml-1 text-white">Makerspace</span>
              </div>
            </Link>
          </div>
          <nav className="hidden md:flex items-center space-x-1">
            {navigation.map((item) => (
              <Link key={item.name} to={item.href} className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-300 ${
                location.pathname === item.href 
                  ? 'text-primary bg-primary/10' 
                  : 'text-white/80 hover:text-white hover:bg-dark-lighter'
              }`}>
                {item.name}
              </Link>
            ))}
            <Link
              to="/cart"
              className="relative p-2 text-white/80 hover:text-white transition-colors"
              title="Shopping Cart"
            >
              <ShoppingCartIcon size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-primary to-secondary text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-bold">
                  {cartCount}
                </span>
              )}
            </Link>
            <div className="ml-4">
              <Link to="/communities" className="px-6 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:shadow-neon transition-all duration-300">
                Join Us
              </Link>
            </div>
          </nav>

          {/* Mobile cart and menu */}
          <div className="md:hidden flex items-center gap-2">
            <Link
              to="/cart"
              className="relative p-2 text-white/80 hover:text-white transition-colors"
              title="Shopping Cart"
            >
              <ShoppingCartIcon size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-primary to-secondary text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-bold">
                  {cartCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg text-white/80 hover:text-white hover:bg-dark-lighter transition-colors"
            >
              {isMenuOpen ? <XIcon size={24} /> : <MenuIcon size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-dark-lighter/95 backdrop-blur-sm border-t border-neutral/10">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`block px-3 py-2 rounded-lg text-base font-medium transition-colors ${
                    location.pathname === item.href
                      ? 'text-primary bg-primary/10'
                      : 'text-white/80 hover:text-white hover:bg-dark-lighter'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="pt-2">
                <Link
                  to="/communities"
                  className="block w-full px-3 py-2 bg-primary text-white text-center font-medium rounded-lg hover:shadow-neon transition-all duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Join Us
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
