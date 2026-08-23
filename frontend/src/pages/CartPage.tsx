import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon, CheckCircle2Icon, LoaderIcon, MessageCircleIcon, MinusIcon, PlusIcon, ShoppingCartIcon, Trash2Icon } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { StoreService } from '../services';

const fallbackImage = 'https://images.unsplash.com/photo-1553406830-ef2513450d76?auto=format&fit=crop&w=800&q=85';

const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity, clearCart, cartTotal, validateCart } = useCart();
  const [validating, setValidating] = useState(true);

  useEffect(() => {
    const validateCartItems = async () => {
      try {
        const response = await StoreService.getProducts({ page: 1, size: 100 });
        validateCart(response.items.map(product => product.id));
      } catch (error) {
        console.error('Error validating cart:', error);
      } finally {
        setValidating(false);
      }
    };
    validateCartItems();
  }, []);

  const getImageUrl = (url?: string) => {
    if (!url) return fallbackImage;
    if (url.startsWith('data:') || url.startsWith('http')) return url;
    return `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}${url}`;
  };

  const whatsappMessage = encodeURIComponent([
    "Hi, I'd like to order the following items from iZonehub Makerspace:",
    '',
    ...cartItems.map((item, index) => `${index + 1}. ${item.name} — $${item.price.toFixed(2)} × ${item.quantity} = $${(item.price * item.quantity).toFixed(2)}`),
    '',
    `Total: $${cartTotal.toFixed(2)}`,
    '',
    'Please confirm availability and payment details. Thank you!',
  ].join('\n'));

  if (validating) {
    return <div className="min-h-[70vh] bg-white flex items-center justify-center"><div className="flex items-center gap-3 text-slate-500"><LoaderIcon className="animate-spin text-secondary" size={22} /><span className="text-sm font-medium">Checking your cart…</span></div></div>;
  }

  if (cartItems.length === 0) {
    return <main className="min-h-[70vh] bg-white px-4 py-20 sm:px-6 lg:px-8"><div className="mx-auto max-w-3xl text-center"><span className="font-grotesk text-[11px] font-bold uppercase tracking-[0.2em] text-secondary">Your workspace</span><h1 className="mt-4 font-grotesk text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">Your cart is <span className="text-secondary">empty.</span></h1><p className="mx-auto mt-4 max-w-md text-sm leading-6 text-slate-500">Save the tools you need for your next build and return here when you are ready to order.</p><div className="mx-auto mt-10 max-w-xl rounded-3xl border border-dashed border-slate-200 bg-slate-50 px-6 py-16"><ShoppingCartIcon className="mx-auto text-slate-300" size={48} /><h2 className="mt-5 font-grotesk text-xl font-bold text-slate-900">Nothing here yet</h2><Link to="/store" className="btn btn-gradient mt-7 inline-flex items-center gap-2"><ArrowLeftIcon size={17} /> Continue shopping</Link></div></div></main>;
  }

  return (
    <main className="min-h-screen bg-white">
      <section className="border-b border-slate-100 bg-slate-50 px-4 pb-12 pt-20 sm:px-6 lg:px-8"><div className="mx-auto max-w-6xl"><span className="font-grotesk text-[11px] font-bold uppercase tracking-[0.2em] text-secondary">Your workspace</span><h1 className="mt-4 font-grotesk text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">Ready to <span className="text-secondary">build?</span></h1><p className="mt-4 text-sm text-slate-500">{cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} selected for your next project.</p></div></section>
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8"><div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          {cartItems.map(item => <article key={item.id} className="rounded-3xl border border-slate-200 bg-white p-4 shadow-card transition hover:border-slate-300 sm:p-5"><div className="flex gap-4 sm:gap-5"><Link to={`/store/${item.id}`} className="h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-slate-100 sm:h-32 sm:w-32"><img src={getImageUrl(item.image_url)} alt={item.name} className="h-full w-full object-cover" onError={event => { event.currentTarget.src = fallbackImage; }} /></Link><div className="min-w-0 flex-1"><div className="flex items-start justify-between gap-3"><div><Link to={`/store/${item.id}`} className="font-grotesk text-lg font-bold text-slate-900 transition hover:text-primary">{item.name}</Link><p className="mt-1 text-xs capitalize text-slate-400">{item.category}</p></div><button type="button" onClick={() => removeFromCart(item.id)} aria-label={`Remove ${item.name}`} className="rounded-full p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-500"><Trash2Icon size={17} /></button></div><div className="mt-5 flex items-end justify-between gap-3"><div className="inline-flex items-center rounded-full border border-slate-200 p-1"><button type="button" onClick={() => updateQuantity(item.id, item.quantity - 1)} className="rounded-full p-1.5 text-slate-500 transition hover:bg-slate-100 hover:text-primary"><MinusIcon size={14} /></button><span className="w-8 text-center text-sm font-bold text-slate-700">{item.quantity}</span><button type="button" onClick={() => updateQuantity(item.id, item.quantity + 1)} className="rounded-full p-1.5 text-slate-500 transition hover:bg-slate-100 hover:text-primary"><PlusIcon size={14} /></button></div><div className="text-right"><p className="text-xs text-slate-400">${item.price.toFixed(2)} each</p><p className="mt-1 font-grotesk text-xl font-black text-primary">${(item.price * item.quantity).toFixed(2)}</p></div></div></div></div></article>)}
          <button type="button" onClick={clearCart} className="rounded-full border border-red-100 px-4 py-2 text-xs font-semibold text-red-500 transition hover:bg-red-50">Clear cart</button>
        </div>
        <aside className="h-fit rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-card lg:sticky lg:top-24"><h2 className="font-grotesk text-xl font-bold text-slate-900">Order summary</h2><div className="mt-6 space-y-3">{cartItems.map(item => <div key={item.id} className="flex justify-between gap-4 text-xs text-slate-500"><span className="truncate">{item.name} × {item.quantity}</span><span className="shrink-0 font-semibold text-slate-700">${(item.price * item.quantity).toFixed(2)}</span></div>)}</div><div className="mt-6 flex items-center justify-between border-t border-slate-200 pt-5"><span className="font-semibold text-slate-700">Total</span><span className="font-grotesk text-3xl font-black text-primary">${cartTotal.toFixed(2)}</span></div><div className="mt-6 rounded-2xl border border-emerald-100 bg-emerald-50 p-4"><div className="flex items-start gap-2"><CheckCircle2Icon className="mt-0.5 shrink-0 text-emerald-600" size={16} /><p className="text-xs leading-5 text-slate-600">Our team will confirm stock, payment, and delivery details over WhatsApp.</p></div></div><a href={`https://wa.me/263712491104?text=${whatsappMessage}`} target="_blank" rel="noopener noreferrer" className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-emerald-600 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-emerald-700"><MessageCircleIcon size={18} /> Checkout via WhatsApp</a><Link to="/store" className="mt-4 flex items-center justify-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-primary"><ArrowLeftIcon size={15} /> Continue shopping</Link></aside>
      </div></section>
    </main>
  );
};

export default CartPage;
