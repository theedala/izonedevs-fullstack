import { Link } from 'react-router-dom';
import { MapPinIcon, PhoneIcon, MailIcon, FacebookIcon, LinkedinIcon } from 'lucide-react';
const Footer = () => {
  return <footer className="bg-dark-lighter border-t border-neutral/10 pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <Link to="/" className="flex items-center">
              <img 
                src="http://izonedevs.co.zw/static/image/main-logo.png" 
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
                <span className="text-xl font-bold ml-1 text-white">
                  Makerspace
                </span>
              </div>
            </Link>
            <p className="mt-4 text-sm text-white/70">
              Zimbabwe's innovation hub for technology enthusiasts, makers, and
              developers.
            </p>
            <div className="mt-6 flex space-x-4">
              <a href="https://x.com/izonehub?lang=en" className="text-white/70 hover:text-primary transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
                <span className="sr-only">X (Twitter)</span>
              </a>
              <a href="https://www.facebook.com/izonehub/" className="text-white/70 hover:text-primary transition-colors">
                <FacebookIcon size={20} />
                <span className="sr-only">Facebook</span>
              </a>
              <a href="https://www.tiktok.com/@izonehub8" className="text-white/70 hover:text-primary transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path d="M19.321 5.562a5.124 5.124 0 01-.443-.258 6.228 6.228 0 01-1.137-.966c-.849-.849-1.254-1.892-1.254-2.892V1h-3.313v14.66c0 1.395-1.132 2.527-2.527 2.527S8.12 17.055 8.12 15.66c0-1.395 1.132-2.527 2.527-2.527.284 0 .556.047.812.133V9.952c-.265-.04-.537-.061-.812-.061-3.037 0-5.495 2.458-5.495 5.495S7.61 21.38 10.647 21.38s5.495-2.458 5.495-5.495V9.481a8.963 8.963 0 004.179.988V7.156a5.124 5.124 0 01-1-.594z"/>
                </svg>
                <span className="sr-only">TikTok</span>
              </a>
              <a href="https://zw.linkedin.com/company/izonehub" className="text-white/70 hover:text-primary transition-colors">
                <LinkedinIcon size={20} />
                <span className="sr-only">LinkedIn</span>
              </a>
              <a href="https://wa.me/263712491104" className="text-white/70 hover:text-primary transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.893 3.488"/>
                </svg>
                <span className="sr-only">WhatsApp</span>
              </a>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/communities" className="text-white/70 hover:text-primary transition-colors">
                  Communities
                </Link>
              </li>
              <li>
                <Link to="/projects" className="text-white/70 hover:text-primary transition-colors">
                  Projects
                </Link>
              </li>
              <li>
                <Link to="/events" className="text-white/70 hover:text-primary transition-colors">
                  Events
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-white/70 hover:text-primary transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="text-white/70 hover:text-primary transition-colors">
                  Gallery
                </Link>
              </li>
              <li>
                <Link to="/store" className="text-white/70 hover:text-primary transition-colors">
                  Store
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Communities</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/communities/sdc" className="text-white/70 hover:text-primary transition-colors">
                  Software Development
                </Link>
              </li>
              <li>
                <Link to="/communities/hdc" className="text-white/70 hover:text-primary transition-colors">
                  Hardware Development
                </Link>
              </li>
              <li>
                <Link to="/communities#join" className="text-white/70 hover:text-primary transition-colors">
                  Join a Community
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Contact Us</h3>
            <ul className="mt-4 space-y-3">
              <li className="flex">
                <MapPinIcon size={20} className="flex-shrink-0 text-primary mr-2" />
                <span className="text-white/70">
                  4th Floor, Three Anchor House<br />
                  54 Jason Moyo Avenue, Harare, Zimbabwe
                </span>
              </li>
              <li className="flex">
                <PhoneIcon size={20} className="flex-shrink-0 text-primary mr-2" />
             <span className="text-white/70">Calls: +263 778 440 344<br />WhatsApp: +263 71 249 1104</span>
              </li>
              <li className="flex">
                <MailIcon size={20} className="flex-shrink-0 text-primary mr-2" />
                <span className="text-white/70">info@izonedevs.co.zw</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-6 border-t border-neutral/10">
          <p className="text-center text-sm text-white/50">
            © {new Date().getFullYear()} iZonehub Makerspace. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>;
};
export default Footer;
