import { useMemo, useState } from 'react';
import { XIcon, Maximize2Icon, ImageIcon } from '../ui/icons';

interface GalleryItem {
  id: string;
  title: string;
  image: string;
  category: string;
  date: string;
}

interface GalleryGridProps {
  items: GalleryItem[];
  className?: string;
}

const fallbackImage = 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=900&q=85';

const GalleryGrid = ({ items, className = '' }: GalleryGridProps) => {
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [filter, setFilter] = useState('all');
  const categories = useMemo(() => ['all', ...new Set(items.map(item => item.category))], [items]);
  const filteredItems = filter === 'all' ? items : items.filter(item => item.category === filter);

  const getImageUrl = (imageUrl: string) => {
    if (!imageUrl) return fallbackImage;
    if (imageUrl.startsWith('data:') || imageUrl.startsWith('http')) return imageUrl;
    return `${window.location.origin}${imageUrl}`;
  };

  return (
    <div className={className}>
      <div className="flex flex-wrap justify-center gap-2">
        {categories.map(category => (
          <button key={category} onClick={() => setFilter(category)} className={`rounded-full border px-4 py-2.5 text-sm font-semibold capitalize transition-all duration-200 ${filter === category ? 'border-primary bg-primary text-white shadow-card-blue' : 'border-slate-200 bg-white text-slate-500 hover:border-primary/30 hover:text-primary'}`}>
            {category}
          </button>
        ))}
      </div>

      {filteredItems.length > 0 ? (
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredItems.map((item, index) => (
            <button key={item.id} type="button" onClick={() => setSelectedItem(item)} className={`group relative overflow-hidden rounded-3xl border border-slate-200 bg-slate-100 text-left shadow-card transition duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-card-hover ${index === 0 ? 'sm:row-span-2 sm:min-h-[520px]' : 'min-h-[250px]'}`}>
              <img src={getImageUrl(item.image)} alt={item.title} className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105" onError={event => { event.currentTarget.src = fallbackImage; }} />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5 text-white"><div className="flex items-center justify-between gap-3 text-[10px] font-bold uppercase tracking-wider text-white/70"><span>{item.category}</span><Maximize2Icon size={15} className="opacity-0 transition group-hover:opacity-100" /></div><h3 className="mt-2 font-grotesk text-xl font-bold leading-tight">{item.title}</h3><p className="mt-1 text-xs text-white/65">{item.date}</p></div>
            </button>
          ))}
        </div>
      ) : (
        <div className="mt-10 rounded-3xl border border-dashed border-slate-200 bg-slate-50 px-6 py-20 text-center"><ImageIcon className="mx-auto text-slate-400" size={28} /><h3 className="mt-4 font-grotesk text-xl font-bold text-slate-900">No images in this collection</h3><p className="mt-2 text-sm text-slate-500">Try another gallery category.</p></div>
      )}

      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label={selectedItem.title} onClick={() => setSelectedItem(null)}>
          <div className="relative max-h-[90vh] w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-2xl" onClick={event => event.stopPropagation()}>
            <button type="button" onClick={() => setSelectedItem(null)} aria-label="Close image" className="absolute right-4 top-4 z-10 rounded-full bg-white/90 p-2 text-slate-700 shadow-card transition hover:bg-white hover:text-primary"><XIcon size={20} /></button>
            <img src={getImageUrl(selectedItem.image)} alt={selectedItem.title} className="max-h-[72vh] w-full object-contain bg-slate-100" onError={event => { event.currentTarget.src = fallbackImage; }} />
            <div className="flex items-center justify-between gap-4 p-5"><div><h3 className="font-grotesk text-xl font-bold text-slate-900">{selectedItem.title}</h3><p className="mt-1 text-sm text-slate-500">{selectedItem.date} · {selectedItem.category}</p></div><ImageIcon className="text-secondary" size={22} /></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryGrid;
