import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeftIcon, ArrowUpRightIcon, CheckCircle2Icon, LoaderIcon, MessageCircleIcon, PackageCheckIcon, ShoppingCartIcon, TagIcon } from 'lucide-react';
import { StoreService } from '../services/storeService';
import { Product } from '../services/api';
import { useCart } from '../context/CartContext';

const fallbackImage = 'https://images.unsplash.com/photo-1553406830-ef2513450d76?auto=format&fit=crop&w=1200&q=85';

const ProductPage = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addToCart } = useCart();

  useEffect(() => {
    if (!id) return;
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        setProduct(await StoreService.getProduct(parseInt(id, 10)));
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Product not found');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const getImageUrl = (url?: string) => {
    if (!url) return fallbackImage;
    if (url.startsWith('data:') || url.startsWith('http')) return url;
    return `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}${url}`;
  };

  if (loading) return <div className="min-h-[70vh] bg-white flex items-center justify-center"><div className="flex items-center gap-3 text-slate-500"><LoaderIcon className="animate-spin text-secondary" size={22} /><span className="text-sm font-medium">Loading product…</span></div></div>;
  if (error || !product) return <main className="min-h-[70vh] bg-slate-50 px-4 py-24"><div className="mx-auto max-w-xl rounded-3xl border border-red-100 bg-white p-10 text-center shadow-card"><div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-500">!</div><h1 className="font-grotesk text-2xl font-bold text-slate-900">Product not found</h1><p className="mt-3 text-sm leading-6 text-slate-500">The item you are looking for does not exist or is no longer available.</p><Link to="/store" className="btn btn-primary mt-7 inline-flex items-center gap-2 bg-primary text-white"><ArrowLeftIcon size={16} /> Back to store</Link></div></main>;

  const inStock = product.is_available && product.stock_quantity > 0;
  const whatsappMessage = `Hi, I'm interested in purchasing the ${product.name} for $${product.price.toFixed(2)} from iZonehub Makerspace.`;

  return (
    <main className="min-h-screen bg-white"><section className="border-b border-slate-100 bg-slate-50 px-4 pb-12 pt-10 sm:px-6 lg:px-8"><div className="mx-auto max-w-6xl"><Link to="/store" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-primary"><ArrowLeftIcon size={16} /> Back to store</Link><div className="mt-10"><span className="font-grotesk text-[11px] font-bold uppercase tracking-[0.2em] text-secondary">iZonehub supply room</span><h1 className="mt-4 max-w-3xl font-grotesk text-4xl font-black leading-tight tracking-tight text-slate-900 sm:text-5xl">{product.name}</h1><p className="mt-4 text-sm capitalize text-slate-500">{product.category}</p></div></div></section><section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8"><div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr]"><div className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-100 shadow-card"><img src={getImageUrl(product.image_url)} alt={product.name} className="aspect-square w-full object-cover" onError={event => { event.currentTarget.src = fallbackImage; }} /></div><div className="flex flex-col justify-center"><div className="flex flex-wrap items-center gap-3"><span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold capitalize text-slate-600"><TagIcon size={14} className="text-primary" /> {product.category}</span>{inStock ? <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700"><CheckCircle2Icon size={14} /> In stock · {product.stock_quantity} available</span> : <span className="rounded-full bg-red-50 px-3 py-1.5 text-xs font-bold text-red-600">Out of stock</span>}</div><div className="mt-6 font-grotesk text-4xl font-black text-primary">${product.price.toFixed(2)}</div><div className="mt-8 border-t border-slate-100 pt-7"><h2 className="font-grotesk text-xl font-bold text-slate-900">About this item</h2><p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-500">{product.description}</p></div><div className="mt-8 rounded-3xl border border-emerald-100 bg-emerald-50 p-5"><div className="flex items-start gap-3"><PackageCheckIcon className="mt-0.5 shrink-0 text-emerald-600" size={20} /><div><h3 className="text-sm font-bold text-slate-900">Order with confidence</h3><p className="mt-1 text-xs leading-5 text-slate-600">Add it to your cart for a multi-item order or message the team directly on WhatsApp.</p></div></div></div><div className="mt-6 flex flex-col gap-3 sm:flex-row"><button onClick={() => addToCart(product)} disabled={!inStock} className="flex flex-1 items-center justify-center gap-2 rounded-full bg-primary px-5 py-3.5 text-sm font-bold text-white shadow-card-blue transition hover:-translate-y-0.5 hover:shadow-card-orange disabled:cursor-not-allowed disabled:opacity-50"><ShoppingCartIcon size={18} /> Add to cart</button><a href={`https://wa.me/263712491104?text=${encodeURIComponent(whatsappMessage)}`} target="_blank" rel="noopener noreferrer" className={`flex flex-1 items-center justify-center gap-2 rounded-full border border-emerald-200 px-5 py-3.5 text-sm font-bold text-emerald-700 transition hover:bg-emerald-50 ${!inStock ? 'pointer-events-none opacity-50' : ''}`}><MessageCircleIcon size={18} /> Order on WhatsApp</a></div><Link to="/cart" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-primary">View your cart <ArrowUpRightIcon size={15} /></Link></div></div></section></main>
  );
};

export default ProductPage;
