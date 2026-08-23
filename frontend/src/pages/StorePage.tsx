import { useEffect, useMemo, useState } from 'react';
import { FilterIcon, LoaderIcon, SearchIcon, ShoppingBagIcon, ShoppingCartIcon, SlidersHorizontalIcon } from '../components/ui/icons';
import { Link } from 'react-router-dom';
import ProductCard from '../components/store/ProductCard';
import Button from '../components/ui/Button';
import { StoreService, Product } from '../services';
import { useCart } from '../context/CartContext';

const StorePage = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 200 });
  const [showFilters, setShowFilters] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { cartCount, cartTotal, validateCart } = useCart();

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await StoreService.getProducts({ page: 1, size: 50, ...(activeCategory !== 'all' && { category: activeCategory }) });
      setProducts(response.items);
      validateCart(response.items.map(product => product.id));
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('We could not load the catalogue right now.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [activeCategory]);

  const categories = useMemo(() => ['all', ...new Set(products.map(product => product.category))], [products]);
  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return products.filter(product => {
      const matchesSearch = !query || product.name.toLowerCase().includes(query) || product.description.toLowerCase().includes(query);
      return matchesSearch && product.price >= priceRange.min && product.price <= priceRange.max;
    });
  }, [priceRange, products, searchQuery]);

  const resetFilters = () => {
    setActiveCategory('all');
    setSearchQuery('');
    setPriceRange({ min: 0, max: 200 });
  };

  if (loading) {
    return <div className="min-h-[70vh] bg-white flex items-center justify-center"><div className="flex items-center gap-3 text-slate-500"><LoaderIcon className="animate-spin text-secondary" size={22} /><span className="text-sm font-medium">Loading the catalogue…</span></div></div>;
  }

  if (error) {
    return <main className="min-h-[70vh] bg-slate-50 px-4 py-24"><div className="mx-auto max-w-xl rounded-3xl border border-red-100 bg-white p-10 text-center shadow-card"><div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-500">!</div><h1 className="font-grotesk text-2xl font-bold text-slate-900">Catalogue unavailable</h1><p className="mt-3 text-sm leading-6 text-slate-500">{error}</p><button onClick={fetchProducts} className="btn btn-primary mt-7 bg-primary text-white">Try again</button></div></main>;
  }

  return (
    <main className="min-h-screen bg-white">
      <section className="relative overflow-hidden border-b border-slate-100 bg-slate-50 px-4 pb-14 pt-20 sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full bg-orange-100/60 blur-3xl" /><div className="pointer-events-none absolute -bottom-40 right-1/4 h-72 w-72 rounded-full bg-blue-100/60 blur-3xl" />
        <div className="relative mx-auto max-w-6xl text-center"><span className="font-grotesk text-[11px] font-bold uppercase tracking-[0.2em] text-secondary">iZonehub supply room</span><h1 className="mx-auto mt-4 max-w-3xl font-grotesk text-4xl font-black leading-tight tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">Tools for <span className="text-secondary">building.</span></h1><p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-500">Components, kits, and maker essentials to help turn your next idea into something real.</p></div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 rounded-3xl border border-emerald-100 bg-emerald-50/70 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6"><div className="flex items-start gap-3"><div className="mt-0.5 rounded-2xl bg-white p-2.5 text-emerald-600 shadow-sm"><ShoppingBagIcon size={19} /></div><div><h2 className="text-sm font-bold text-slate-900">Simple ordering, human support.</h2><p className="mt-1 text-xs leading-5 text-slate-600">Add several items to your cart and our team will help with payment and delivery over WhatsApp.</p></div></div><Button href="/cart" variant="outline" size="sm" className="shrink-0 border-emerald-200 text-emerald-700 hover:bg-white">View cart</Button></div>

        <div className="mt-10 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between"><div className="flex flex-wrap gap-2"><button onClick={() => setShowFilters(!showFilters)} className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 hover:border-primary/30 hover:text-primary lg:hidden"><FilterIcon size={15} /> Filters</button>{categories.map(category => <button key={category} onClick={() => setActiveCategory(category)} className={`rounded-full border px-4 py-2.5 text-sm font-semibold capitalize transition-all duration-200 ${activeCategory === category ? 'border-primary bg-primary text-white shadow-card-blue' : 'border-slate-200 bg-white text-slate-500 hover:border-primary/30 hover:text-primary'}`}>{category.replace('-', ' ')}</button>)}</div><label className="relative block w-full lg:max-w-xs"><span className="sr-only">Search products</span><SearchIcon size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" /><input type="search" placeholder="Search products…" value={searchQuery} onChange={event => setSearchQuery(event.target.value)} className="w-full rounded-full border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10" /></label></div>

        <div className={`${showFilters ? 'block' : 'hidden'} mt-5 rounded-3xl border border-slate-200 bg-slate-50 p-5 lg:block`}><div className="flex items-center gap-2 text-sm font-bold text-slate-700"><SlidersHorizontalIcon size={16} className="text-primary" /> Price range</div><div className="mt-4 flex items-center gap-4"><span className="rounded-xl bg-white px-3 py-2 text-xs font-semibold text-slate-600 shadow-sm">${priceRange.min}</span><input type="range" min="0" max="200" value={priceRange.max} onChange={event => setPriceRange({ ...priceRange, max: parseInt(event.target.value, 10) })} className="h-1.5 w-full cursor-pointer accent-secondary" /><span className="rounded-xl bg-white px-3 py-2 text-xs font-semibold text-slate-600 shadow-sm">${priceRange.max}</span></div></div>

        {filteredProducts.length > 0 ? <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">{filteredProducts.map(product => <ProductCard key={product.id} id={product.id.toString()} name={product.name} price={product.price} image={product.image_url || 'https://images.unsplash.com/photo-1553406830-ef2513450d76?auto=format&fit=crop&w=900&q=85'} category={product.category} inStock={product.is_available && product.stock_quantity > 0} />)}</div> : <div className="mt-10 rounded-3xl border border-dashed border-slate-200 bg-slate-50 px-6 py-20 text-center"><SearchIcon className="mx-auto text-slate-400" size={28} /><h2 className="mt-4 font-grotesk text-2xl font-bold text-slate-900">No products found</h2><p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">Try another search or reset the catalogue filters.</p><button onClick={resetFilters} className="btn btn-outline mt-6">Reset filters</button></div>}
      </section>

      {cartCount > 0 && <Link to="/cart" className="fixed bottom-6 right-6 z-40 inline-flex items-center gap-3 rounded-full bg-primary px-5 py-3.5 text-white shadow-2xl transition hover:-translate-y-1 sm:bottom-8 sm:right-8"><span className="relative"><ShoppingCartIcon size={20} /><span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-white text-[10px] font-black text-primary">{cartCount}</span></span><span><span className="block text-xs font-bold">Your cart</span><span className="block text-[11px] text-white/75">${cartTotal.toFixed(2)}</span></span></Link>}
    </main>
  );
};

export default StorePage;
