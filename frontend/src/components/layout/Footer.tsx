import { Link } from 'react-router-dom';
import { MapPinIcon, PhoneIcon, MailIcon, FacebookIcon, LinkedinIcon, TwitterIcon, MessageCircleIcon, PlayCircleIcon } from '../ui/icons';

const Footer = () => {
  return (
    <footer className="bg-slate-50 border-t border-slate-200 pt-14 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center mb-4">
              <img
                src="/logo.png"
                alt="iZonehub Makerspace"
                className="h-9 w-auto"
                onError={e => {
                  const img = e.target as HTMLImageElement;
                  img.style.display = 'none';
                  (img.nextElementSibling as HTMLElement)?.classList.remove('hidden');
                }}
              />
              <span className="hidden font-grotesk font-black text-xl text-primary">iZonehub</span>
            </Link>
            <p className="text-slate-500 text-sm leading-relaxed">
              Zimbabwe's innovation hub for technology enthusiasts, makers, and developers.
            </p>
            <div className="mt-6 flex items-center gap-2">
              {[
                {
                  label: 'X',
                  href: 'https://x.com/izonehub?lang=en',
                  icon: <TwitterIcon size={16} />,
                },
                {
                  label: 'Facebook',
                  href: 'https://www.facebook.com/izonehub/',
                  icon: <FacebookIcon size={16} />,
                },
                {
                  label: 'TikTok',
                  href: 'https://www.tiktok.com/@izonehub8',
                  icon: <PlayCircleIcon size={16} />,
                },
                {
                  label: 'LinkedIn',
                  href: 'https://zw.linkedin.com/company/izonehub',
                  icon: <LinkedinIcon size={16} />,
                },
                {
                  label: 'WhatsApp',
                  href: 'https://wa.me/263712491104',
icon: <MessageCircleIcon size={16} />,
                },
              ].map(({ label, href, icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-white border border-slate-200 text-slate-500 hover:text-primary hover:border-primary/30 transition-all duration-200"
                >
                  {icon}
                  <span className="sr-only">{label}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-grotesk font-bold text-xs uppercase tracking-widest text-slate-400 mb-4">Quick Links</h3>
            <ul className="space-y-2.5">
              {[
                ['Communities', '/communities'],
                ['Projects', '/projects'],
                ['Events', '/events'],
                ['Blog', '/blog'],
                ['Gallery', '/gallery'],
                ['Store', '/store'],
              ].map(([label, href]) => (
                <li key={label}>
                  <Link to={href} className="text-slate-500 hover:text-primary text-sm transition-colors duration-200">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Communities */}
          <div>
            <h3 className="font-grotesk font-bold text-xs uppercase tracking-widest text-slate-400 mb-4">Communities</h3>
            <ul className="space-y-2.5">
              {[
                ['Software Development', '/communities/sdc'],
                ['Hardware Development', '/communities/hdc'],
                ['Join a Community', '/communities#join'],
              ].map(([label, href]) => (
                <li key={label}>
                  <Link to={href} className="text-slate-500 hover:text-primary text-sm transition-colors duration-200">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-grotesk font-bold text-xs uppercase tracking-widest text-slate-400 mb-4">Contact Us</h3>
            <ul className="space-y-3">
              {[
                { Icon: MapPinIcon, content: '4th Floor, Three Anchor House\n54 Jason Moyo Avenue, Harare' },
                { Icon: PhoneIcon, content: 'Calls: +263 778 440 344\nWhatsApp: +263 71 249 1104' },
                { Icon: MailIcon, content: 'info@izonedevs.co.zw' },
              ].map(({ Icon, content }) => (
                <li key={content} className="flex items-start gap-3">
                  <Icon size={15} className="text-secondary mt-0.5 flex-shrink-0" />
                  <span className="text-slate-500 text-sm leading-relaxed whitespace-pre-line">{content}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-2">
          <p className="text-slate-400 text-sm">
            © {new Date().getFullYear()} iZonehub Makerspace. All rights reserved.
          </p>
          <p className="text-slate-300 text-xs">Built in Zimbabwe 🇿🇼</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
