import { useState, useEffect } from 'react';
import SectionTitle from '../components/ui/SectionTitle';
import GalleryGrid from '../components/gallery/GalleryGrid';
import { LoaderIcon } from 'lucide-react';
import { GalleryService, GalleryItem } from '../services';

const GalleryPage = () => {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchGalleryItems();
  }, []);

  const fetchGalleryItems = async () => {
    try {
      setLoading(true);
      const response = await GalleryService.getGalleryItems({ page: 1, size: 50 });
      setGalleryItems(response.items);
    } catch (err) {
      setError('Failed to load gallery items');
      console.error('Error fetching gallery items:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark flex justify-center items-center">
        <div className="flex items-center">
          <LoaderIcon className="animate-spin text-primary mr-3" size={40} />
          <span className="text-white/70">Loading gallery...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-dark py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle title="Gallery" subtitle="Explore photos from our workshops, events, and community projects." />
          <div className="text-center py-16 bg-dark-lighter rounded-lg">
            <div className="text-red-400 mb-4">⚠️ {error}</div>
            <button 
              onClick={fetchGalleryItems}
              className="px-6 py-2 bg-primary text-white rounded-full hover:shadow-neon transition-all duration-300"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Transform API data to match GalleryGrid component expectations
  const transformedItems = galleryItems.map(item => ({
    id: item.id.toString(),
    title: item.title,
    image: item.image_url,
    category: item.category || 'general',
    date: new Date(item.created_at).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }));

  return (
    <div className="min-h-screen bg-dark py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle title="Gallery" subtitle="Explore photos from our workshops, events, and community projects." />
        {transformedItems.length > 0 ? (
          <GalleryGrid items={transformedItems} />
        ) : (
          <div className="text-center py-16 bg-dark-lighter rounded-lg">
            <h3 className="text-xl font-bold mb-2">No gallery items found</h3>
            <p className="text-white/70 mb-6">
              No gallery items have been added yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GalleryPage;