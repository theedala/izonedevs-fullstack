import { useEffect, useState } from 'react';
import { CameraIcon, ImageIcon, LoaderIcon } from '../components/ui/icons';
import GalleryGrid from '../components/gallery/GalleryGrid';
import { GalleryService, GalleryItem } from '../services';

const GalleryPage = () => {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGalleryItems = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await GalleryService.getGalleryItems({ page: 1, size: 50 });
      setGalleryItems(response.items);
    } catch (err) {
      console.error('Error fetching gallery items:', err);
      setError('We could not load the gallery right now.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGalleryItems();
  }, []);

  const transformedItems = galleryItems.map(item => ({
    id: item.id.toString(),
    title: item.title,
    image: item.image_url,
    category: item.category || 'general',
    date: new Date(item.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
  }));

  if (loading) {
    return <div className="min-h-[70vh] bg-white flex items-center justify-center"><div className="flex items-center gap-3 text-slate-500"><LoaderIcon className="animate-spin text-secondary" size={22} /><span className="text-sm font-medium">Loading the gallery…</span></div></div>;
  }

  if (error) {
    return <main className="min-h-[70vh] bg-slate-50 px-4 py-24"><div className="mx-auto max-w-xl rounded-3xl border border-red-100 bg-white p-10 text-center shadow-card"><div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-500">!</div><h1 className="font-grotesk text-2xl font-bold text-slate-900">Gallery unavailable</h1><p className="mt-3 text-sm leading-6 text-slate-500">{error}</p><button onClick={fetchGalleryItems} className="btn btn-primary mt-7 bg-primary text-white">Try again</button></div></main>;
  }

  return (
    <main className="min-h-screen bg-white">
      <section className="relative overflow-hidden border-b border-slate-100 bg-slate-50 px-4 pb-14 pt-20 sm:px-6 lg:px-8"><div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-orange-100/60 blur-3xl" /><div className="pointer-events-none absolute -bottom-40 left-1/4 h-72 w-72 rounded-full bg-blue-100/60 blur-3xl" /><div className="relative mx-auto max-w-6xl text-center"><span className="font-grotesk text-[11px] font-bold uppercase tracking-[0.2em] text-secondary">Community snapshots</span><h1 className="mx-auto mt-4 max-w-3xl font-grotesk text-4xl font-black leading-tight tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">A room full of <span className="text-secondary">possibility.</span></h1><p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-500">A visual record of the people, prototypes, workshops, and everyday moments that make iZonehub what it is.</p></div></section>
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8"><div className="mb-10 flex items-center justify-between gap-4"><div><p className="text-sm font-semibold text-slate-500">Browse the archive</p><p className="mt-1 text-xs text-slate-400">Click any image to view it larger.</p></div><CameraIcon className="text-secondary" size={25} /></div>{transformedItems.length > 0 ? <GalleryGrid items={transformedItems} /> : <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 px-6 py-20 text-center"><ImageIcon className="mx-auto text-slate-400" size={28} /><h2 className="mt-4 font-grotesk text-2xl font-bold text-slate-900">The archive is getting ready</h2><p className="mt-2 text-sm text-slate-500">No gallery items have been added yet.</p></div>}</section>
    </main>
  );
};

export default GalleryPage;
