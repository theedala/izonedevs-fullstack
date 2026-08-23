import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MenuIcon, XIcon } from 'lucide-react';

const navigation = [
  { name: 'Communities', href: '/communities' },
  { name: 'Projects', href: '/projects' },
  { name: 'Events', href: '/events' },
  { name: 'Blog', href: '/blog' },
  { name: 'Gallery', href: '/gallery' },
  { name: 'Store', href: '/store' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
];

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setIsMenuOpen(false); }, [location.pathname]);

  return (
    // Outer shell — always full-width, provides the spacing context
    <header
      className="sticky top-0 z-50"
      style={{
        padding: scrolled ? '12px 16px' : '0',
        background: scrolled ? 'transparent' : '#ffffff',
        transition: scrolled
          ? 'padding 500ms ease-in-out'
          : 'padding 500ms ease-in-out, background 0ms',
      }}
    >
      {/* The pill / bar */}
      <div
        className="transition-all duration-500 ease-in-out"
        style={scrolled ? {
          maxWidth: '1100px',
          margin: '0 auto',
          borderRadius: '9999px',
          background: 'rgba(255, 255, 255, 0.35)',
          backdropFilter: 'saturate(180%) blur(24px)',
          WebkitBackdropFilter: 'saturate(180%) blur(24px)',
          border: '1px solid rgba(255,255,255,0.6)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.10), inset 0 1px 0 rgba(255,255,255,0.8)',
        } : {
          background: '#ffffff',
          borderBottom: '1px solid #f1f5f9',
        }}
      >
        {/* Inner content row */}
        <div
          className="flex justify-between items-center transition-all duration-500"
          style={{
            maxWidth: scrolled ? '100%' : '80rem',
            margin: '0 auto',
            height: scrolled ? '52px' : '64px',
            padding: scrolled ? '0 20px' : '0 24px',
          }}
        >

          {/* Logo */}
          <Link to="/" className="flex items-center flex-shrink-0">
            <img
              src="/logo.png"
              alt="iZonehub Makerspace"
              className="w-auto transition-all duration-500"
              style={{ height: scrolled ? '26px' : '34px' }}
              onError={e => {
                const img = e.target as HTMLImageElement;
                img.style.display = 'none';
                (img.nextElementSibling as HTMLElement)?.classList.remove('hidden');
              }}
            />
            <div className="hidden">
              <span className="font-grotesk font-black text-xl text-primary">iZone</span>
              <span className="font-grotesk font-black text-xl text-secondary">hub</span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center">
            {navigation.map(item => (
              <Link
                key={item.name}
                to={item.href}
                className={`relative px-2.5 py-1.5 text-[13px] font-medium transition-colors duration-200 ${
                  location.pathname === item.href
                    ? 'text-secondary font-semibold after:absolute after:bottom-0 after:left-2.5 after:right-2.5 after:h-[2px] after:rounded-full after:bg-secondary'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* CTA + mobile toggle */}
          <div className="flex items-center gap-2">
            <Link
              to="/communities"
              className="hidden sm:inline-flex items-center rounded-full bg-secondary text-white font-grotesk font-semibold hover:bg-secondary/90 transition-all duration-300"
              style={{
                padding: scrolled ? '6px 16px' : '8px 20px',
                fontSize: scrolled ? '12px' : '14px',
                boxShadow: scrolled ? '0 2px 12px rgba(245,110,0,0.25)' : 'none',
              }}
            >
              Join Us
            </Link>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-black/5 transition-colors"
            >
              {isMenuOpen ? <XIcon size={20} /> : <MenuIcon size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown — glass when scrolled, plain when at top */}
      {isMenuOpen && (
        <div
          className="md:hidden mt-2 pb-3"
          style={scrolled ? {
            maxWidth: '1100px',
            margin: '8px auto 0',
            borderRadius: '20px',
            background: 'rgba(255,255,255,0.55)',
            backdropFilter: 'saturate(180%) blur(24px)',
            WebkitBackdropFilter: 'saturate(180%) blur(24px)',
            border: '1px solid rgba(255,255,255,0.6)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.10)',
          } : {
            background: '#ffffff',
            borderBottom: '1px solid #f1f5f9',
          }}
        >
          <div className="pt-3 px-2 space-y-0.5">
            {navigation.map(item => (
              <Link
                key={item.name}
                to={item.href}
                className={`block px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  location.pathname === item.href
                    ? 'text-secondary bg-orange-50 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50/80'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="pt-2 px-2">
              <Link
                to="/communities"
                className="block w-full px-4 py-2.5 bg-secondary text-white text-center font-grotesk font-semibold rounded-full text-sm transition-all duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                Join Us
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
