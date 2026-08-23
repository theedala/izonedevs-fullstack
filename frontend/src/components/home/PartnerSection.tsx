import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PartnersService, Partner } from '../../services';

const fallbackPartners: Partner[] = [
  {
    id: 1,
    name: 'University of Zimbabwe',
    logo_url: 'https://www.uz.ac.zw/images/banners/UZ-LOG.png',
    is_active: true, featured: true, created_at: '',
  },
  {
    id: 2,
    name: 'Africa Makerspace Network',
    logo_url: 'https://africamakerspace.net/amnlogo.png',
    is_active: true, featured: true, created_at: '',
  },
  {
    id: 3,
    name: 'Global Innovation Gathering',
    logo_url: 'https://globalinnovationgathering.org/wp-content/uploads/2021/05/cropped-gig-logo-retina.png',
    is_active: true, featured: true, created_at: '',
  },
  {
    id: 4,
    name: 'InvestorSaint',
    logo_url: 'https://investorsaint.com/assets/square-logo-transparent-C1FBbi4t.png',
    is_active: true, featured: true, created_at: '',
  },
  {
    id: 5,
    name: 'Danborough College',
    logo_url: 'https://danboroughcollege.co.zw/images/logo.png',
    is_active: true, featured: true, created_at: '',
  },
  {
    id: 6,
    name: 'Alexander Institute of Education',
    logo_url: 'https://scontent-jnb2-1.xx.fbcdn.net/v/t39.30808-1/422936827_872226484910455_2363261651923868095_n.jpg?stp=dst-jpg_s200x200_tt6&_nc_cat=109&ccb=1-7&_nc_sid=2d3e12&_nc_ohc=6eW0TMu-z-QQ7kNvwGauuP-&_nc_oc=AdoX6Dz9IiGXcowz3oVUkyxrApRzakPVIdUfWh77Tob5Fj6KTtUMRdQZPqF0QYftGQM&_nc_zt=24&_nc_ht=scontent-jnb2-1.xx&_nc_gid=AMn7dSkMzZABwMI_-H8ugQ&_nc_ss=7a389&oh=00_Af0x09cP9bWK3VSR7FmxsRMJShD9CITG5XnaeSNEhUBcOA&oe=69EE44D4',
    is_active: true, featured: true, created_at: '',
  },
];

const PartnerSection = () => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchPartners(); }, []);

  const fetchPartners = async () => {
    try {
      const response = await PartnersService.getPartners({ page: 1, size: 10, is_active: true, featured: true });
      setPartners(response.items);
    } catch {
      setPartners(fallbackPartners);
    } finally {
      setLoading(false);
    }
  };

  const displayPartners = partners.length ? partners : fallbackPartners;

  return (
    <section className="py-24" style={{ background: '#f4f4f5' }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-block text-[11px] font-grotesk font-bold tracking-[0.18em] uppercase text-secondary mb-3">
            Partners
          </span>
          <h2 className="font-grotesk font-normal text-slate-500 text-2xl md:text-3xl leading-tight">Backed by organisations</h2>
          <h2 className="font-grotesk font-black text-slate-900 text-2xl md:text-3xl leading-tight">building Zimbabwe's future.</h2>
        </motion.div>

        {loading ? (
          <div className="flex flex-wrap justify-center gap-4">
            {[0, 1, 2, 3, 4].map(i => (
              <div key={i} className="skeleton h-14 w-44 rounded-xl" />
            ))}
          </div>
        ) : (
          <motion.div
            className="flex flex-wrap justify-center items-center gap-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5 }}
          >
            {displayPartners.map((partner, i) => (
              <motion.div
                key={partner.id}
                className="bg-white rounded-xl px-7 py-5 border border-slate-100 hover:-translate-y-1 transition-all duration-200 flex items-center justify-center min-w-[160px]"
                style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: i * 0.06 }}
              >
                {partner.logo_url ? (
                  <>
                    <img
                      src={partner.logo_url}
                      alt={`${partner.name} logo`}
                      className="h-12 w-auto max-w-[160px] object-contain"
                      onError={e => {
                        (e.target as HTMLImageElement).style.display = 'none';
                        const sibling = (e.target as HTMLImageElement).nextElementSibling as HTMLElement | null;
                        if (sibling) sibling.classList.remove('hidden');
                      }}
                    />
                    <span className="font-grotesk font-bold text-sm text-slate-700 hidden text-center leading-snug">
                      {partner.name}
                    </span>
                  </>
                ) : (
                  <span className="font-grotesk font-bold text-sm text-slate-700 text-center leading-snug">
                    {partner.name}
                  </span>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}

      </div>
    </section>
  );
};

export default PartnerSection;
