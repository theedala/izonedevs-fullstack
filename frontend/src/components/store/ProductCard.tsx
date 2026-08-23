import Button from '../ui/Button';
import { ArrowUpRightIcon, CheckCircle2Icon, ShoppingCartIcon } from '../ui/icons';
import { useCart } from '../../context/CartContext';
import { Product } from '../../services/api';
import { getMediaUrl } from '../../utils/media';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  inStock: boolean;
  className?: string;
}

const fallbackImages: Record<string, string> = {
  electronics: 'https://images.unsplash.com/photo-1553406830-ef2513450d76?auto=format&fit=crop&w=900&q=85',
  '3d-printing': 'https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?auto=format&fit=crop&w=900&q=85',
  components: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=900&q=85',
  merchandise: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=85',
};

const ProductCard = ({ id, name, price, image, category, inStock, className = '' }: ProductCardProps) => {
  const fallbackImage = fallbackImages[category] || fallbackImages.electronics;
  const resolvedImage = getMediaUrl(image) || fallbackImage;
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    const product: Product = {
      id: parseInt(id, 10),
      name,
      price,
      description: '',
      image_url: image,
      category,
      stock_quantity: 1,
      is_available: inStock,
      featured: false,
      created_at: new Date().toISOString(),
    };
    addToCart(product);
  };

  return (
    <article className={`group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-card-hover ${className}`}>
      <div className="relative h-52 overflow-hidden bg-slate-100">
        <img src={resolvedImage} alt={name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" onError={event => { event.currentTarget.src = fallbackImage; }} />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/45 via-transparent to-transparent" />
        <span className="absolute left-4 top-4 rounded-full border border-white/60 bg-white/90 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-600 backdrop-blur">{category}</span>
        {!inStock && <div className="absolute inset-0 flex items-center justify-center bg-slate-950/65 backdrop-blur-sm"><span className="rounded-full bg-white px-4 py-2 text-xs font-bold text-slate-700">Out of stock</span></div>}
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between gap-3"><h2 className="font-grotesk text-lg font-bold leading-snug text-slate-900">{name}</h2><ArrowUpRightIcon size={18} className="mt-1 shrink-0 text-slate-300 transition group-hover:text-primary" /></div>
        <div className="mt-4 flex items-center justify-between"><span className="font-grotesk text-2xl font-black text-primary">${price.toFixed(2)}</span>{inStock && <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600"><CheckCircle2Icon size={14} /> In stock</span>}</div>
        <div className="mt-5 flex flex-col gap-2"><button onClick={handleAddToCart} disabled={!inStock} className="flex w-full items-center justify-center gap-2 rounded-full bg-primary px-4 py-3 text-xs font-bold text-white shadow-card-blue transition hover:-translate-y-0.5 hover:shadow-card-orange disabled:cursor-not-allowed disabled:opacity-50"><ShoppingCartIcon size={16} /> Add to cart</button><Button href={`/store/${id}`} variant="outline" size="sm" className="w-full">View details</Button></div>
      </div>
    </article>
  );
};

export default ProductCard;
