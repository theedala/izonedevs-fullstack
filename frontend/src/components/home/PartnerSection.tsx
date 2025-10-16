import { useState, useEffect } from 'react';
import SectionTitle from '../ui/SectionTitle';
import { PartnersService, Partner } from '../../services';

const PartnerSection = () => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPartners();
  }, []);

  const fetchPartners = async () => {
    try {
      const response = await PartnersService.getPartners({ 
        page: 1, 
        size: 10, 
        is_active: true,
        featured: true 
      });
      setPartners(response.items);
    } catch (error) {
      console.error('Error fetching partners:', error);
      // Fallback to static data if API fails
      setPartners([
        {
          id: 1,
          name: 'Zimbabwe Innovation Hub',
          logo_url: '/images/partners/zimbabwe-innovation-hub.png',
          is_active: true,
          featured: true,
          created_at: new Date().toISOString()
        },
        {
          id: 2,
          name: 'University of Zimbabwe',
          logo_url: '/images/partners/university-of-zimbabwe.png',
          is_active: true,
          featured: true,
          created_at: new Date().toISOString()
        },
        {
          id: 3,
          name: 'Tech Zimbabwe',
          logo_url: '/images/partners/tech-zimbabwe.png',
          is_active: true,
          featured: true,
          created_at: new Date().toISOString()
        },
        {
          id: 4,
          name: 'Digital Future Initiative',
          logo_url: '/images/partners/digital-future-initiative.png',
          is_active: true,
          featured: true,
          created_at: new Date().toISOString()
        },
        {
          id: 5,
          name: 'Harare Tech Association',
          logo_url: '/images/partners/harare-tech-association.png',
          is_active: true,
          featured: true,
          created_at: new Date().toISOString()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-16 bg-dark-lighter">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle title="Our Partners" subtitle="We collaborate with leading organizations to strengthen Zimbabwe's tech ecosystem." />
        
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-white/60 mt-2">Loading partners...</p>
          </div>
        ) : (
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
            {partners.map((partner) => (
              <div key={partner.id} className="bg-dark p-4 rounded-lg border border-neutral/20 hover:border-primary/40 transition-all duration-300">
                <img 
                  src={partner.logo_url || `https://via.placeholder.com/150x80?text=${partner.name.split(' ').map(w => w[0]).join('')}`} 
                  alt={`${partner.name} logo`} 
                  className="h-12 md:h-16 w-auto object-contain filter brightness-90 hover:brightness-100 transition-all duration-300"
                  onError={(e) => {
                    // Fallback to placeholder if image fails to load
                    const target = e.target as HTMLImageElement;
                    target.src = `https://via.placeholder.com/150x80?text=${partner.name.split(' ').map(w => w[0]).join('')}`;
                  }}
                />
              </div>
            ))}
          </div>
        )}
        
        {!loading && partners.length === 0 && (
          <div className="text-center py-8 text-white/60">
            No partners to display at the moment.
          </div>
        )}
      </div>
    </section>
  );
};
export default PartnerSection;