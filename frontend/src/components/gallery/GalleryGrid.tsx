import React, { useState } from 'react';
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
const GalleryGrid: React.FC<GalleryGridProps> = ({
  items,
  className = ''
}) => {
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [filter, setFilter] = useState('all');
  const categories = ['all', ...new Set(items.map(item => item.category))];
  const filteredItems = filter === 'all' ? items : items.filter(item => item.category === filter);
  return <div className={className}>
      <div className="flex flex-wrap justify-center mb-8 gap-2">
        {categories.map(category => <button key={category} onClick={() => setFilter(category)} className={`px-4 py-2 rounded-full text-sm transition-all duration-300 ${filter === category ? 'bg-primary text-white' : 'bg-dark-lighter text-white/70 hover:bg-dark-light'}`}>
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>)}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredItems.map(item => <div key={item.id} className="overflow-hidden rounded-lg cursor-pointer group relative" onClick={() => setSelectedItem(item)}>
            <img src={item.image} alt={item.title} className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-dark/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
              <h3 className="text-lg font-bold">{item.title}</h3>
              <p className="text-white/70 text-sm">{item.date}</p>
            </div>
          </div>)}
      </div>
      {/* Lightbox */}
      {selectedItem && <div className="fixed inset-0 bg-dark/90 z-50 flex items-center justify-center p-4" onClick={() => setSelectedItem(null)}>
          <div className="max-w-4xl max-h-[90vh] relative" onClick={e => e.stopPropagation()}>
            <button className="absolute -top-10 right-0 text-white/70 hover:text-white" onClick={() => setSelectedItem(null)}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <img src={selectedItem.image} alt={selectedItem.title} className="max-w-full max-h-[80vh] object-contain" />
            <div className="mt-4">
              <h3 className="text-xl font-bold">{selectedItem.title}</h3>
              <p className="text-white/70">
                {selectedItem.date} • {selectedItem.category}
              </p>
            </div>
          </div>
        </div>}
    </div>;
};
export default GalleryGrid;