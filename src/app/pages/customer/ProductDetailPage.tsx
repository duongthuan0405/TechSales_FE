import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { 
  Star, 
  ShoppingCart, 
  ChevronLeft, 
  ShieldCheck, 
  Truck, 
  ArrowLeftRight, 
  Plus, 
  Minus,
  Loader2,
  CheckCircle2,
  Package
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Card, CardContent } from '../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { useGetProduct, useGetProducts } from '../../../dataHook/productDataHook';
import { useAddToCart } from '../../../dataHook/cartDataHook';
import { toast } from 'sonner';

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const { data: product, isLoading, isError } = useGetProduct(id || '');
  const { mutate: addToCart, isPending: isAdding } = useAddToCart();

  useEffect(() => {
    if (isError) {
      toast.error('Product not found');
      navigate('/customer/products');
    }
  }, [isError, navigate]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product.id, {
      onSuccess: () => toast.success('Added to cart'),
      onError: () => toast.error('Failed to add to cart')
    });
  };

  if (isLoading || !product) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Breadcrumbs / Back button */}
      <Button 
        variant="ghost" 
        className="mb-4 pl-0 hover:bg-transparent" 
        onClick={() => navigate(-1)}
      >
        <ChevronLeft className="mr-1 h-4 w-4" />
        Back to Results
      </Button>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-square overflow-hidden rounded-3xl border border-border bg-white p-8">
            <img 
              src={product.image} 
              alt={product.name} 
              className="h-full w-full object-contain transition-transform hover:scale-105"
            />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-square cursor-pointer overflow-hidden rounded-xl border border-border bg-white p-2 hover:border-blue-500">
                <img src={product.image} alt={product.name} className="h-full w-full object-contain opacity-50 hover:opacity-100" />
              </div>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div className="space-y-2">
            <Badge variant="secondary" className="bg-blue-50 text-blue-600 dark:bg-blue-900/20">{product.category}</Badge>
            <h1 className="text-4xl font-bold tracking-tight">{product.name}</h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star 
                    key={i} 
                    className={`h-4 w-4 ${i <= Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300'}`} 
                  />
                ))}
                <span className="ml-2 text-sm font-medium">{product.rating}</span>
              </div>
              <span className="text-sm text-muted-foreground">|</span>
              <span className="text-sm text-muted-foreground">{product.reviews} Customer Reviews</span>
            </div>
          </div>

          <div className="space-y-1">
             <div className="text-3xl font-bold text-slate-900 dark:text-white">
                ${product.price.toLocaleString()}
             </div>
             <p className="text-sm text-muted-foreground">Tax included. Shipping calculated at checkout.</p>
          </div>

          <p className="text-lg leading-relaxed text-slate-600 dark:text-slate-300">
            {product.description}
          </p>

          <div className="space-y-4 border-y border-border py-6">
            <div className="flex items-center gap-4">
              <span className="w-24 font-medium">Quantity</span>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-border hover:bg-accent"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-8 text-center font-bold">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-border hover:bg-accent"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <span className="ml-4 text-sm text-muted-foreground">
                {product.stock} units available
              </span>
            </div>

            <div className="flex gap-4">
              <Button 
                size="lg" 
                className="h-14 flex-1 rounded-2xl text-lg font-bold"
                onClick={handleAddToCart}
                disabled={isAdding || product.stock === 0}
              >
                {isAdding ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <ShoppingCart className="mr-2 h-5 w-5" />}
                {isAdding ? 'Adding...' : 'Add to Cart'}
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="h-14 flex-1 rounded-2xl text-lg font-bold border-blue-600 text-blue-600 hover:bg-blue-50"
              >
                Buy Now
              </Button>
            </div>
          </div>

          {/* Delivery & Security Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4 dark:bg-slate-900/50">
              <Truck className="mt-1 h-5 w-5 text-blue-600" />
              <div>
                <h4 className="text-sm font-bold">Fast Delivery</h4>
                <p className="text-xs text-muted-foreground">Ships in 24-48 hours</p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4 dark:bg-slate-900/50">
              <ShieldCheck className="mt-1 h-5 w-5 text-emerald-600" />
              <div>
                <h4 className="text-sm font-bold">Genuine Product</h4>
                <p className="text-xs text-muted-foreground">Official brand warranty</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <Tabs defaultValue="description" className="w-full">
        <TabsList className="h-14 w-full justify-start gap-8 border-b border-border bg-transparent p-0 rounded-none">
          <TabsTrigger 
            value="description" 
            className="h-14 rounded-none border-b-2 border-transparent px-2 font-bold data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:text-blue-600"
          >
            Description
          </TabsTrigger>
          <TabsTrigger 
            value="specs" 
            className="h-14 rounded-none border-b-2 border-transparent px-2 font-bold data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:text-blue-600"
          >
            Specifications
          </TabsTrigger>
          <TabsTrigger 
            value="reviews" 
            className="h-14 rounded-none border-b-2 border-transparent px-2 font-bold data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:text-blue-600"
          >
            Reviews ({product.reviews})
          </TabsTrigger>
        </TabsList>
        <TabsContent value="description" className="py-8">
          <div className="max-w-3xl space-y-4">
            <h3 className="text-xl font-bold">Experience the next generation of {product.category}</h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              {product.description}. This premium product from {product.brand} combines state-of-the-art technology 
              with elegant design. Whether you're a professional looking for performance or a casual user 
              seeking reliability, this device delivers on every front.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
               <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                  <span>High-performance components</span>
               </div>
               <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                  <span>Energy-efficient design</span>
               </div>
               <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                  <span>Premium materials & build quality</span>
               </div>
               <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                  <span>Cloud synchronization ready</span>
               </div>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="specs" className="py-8">
          <div className="max-w-2xl overflow-hidden rounded-2xl border border-border">
            <table className="w-full">
              <tbody className="divide-y divide-border">
                {[
                  { label: 'Brand', value: product.brand },
                  { label: 'Model', value: product.id },
                  { label: 'Category', value: product.category },
                  { label: 'Weight', value: '1.2 kg' },
                  { label: 'Warranty', value: '12 Months' },
                  { label: 'In the Box', value: 'Device, Charger, User Manual' }
                ].map((spec) => (
                  <tr key={spec.label}>
                    <td className="bg-slate-50 px-6 py-4 text-sm font-medium dark:bg-slate-900/30">{spec.label}</td>
                    <td className="px-6 py-4 text-sm">{spec.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>
        <TabsContent value="reviews" className="py-8">
          <div className="flex flex-col gap-8 md:flex-row">
             <div className="w-full md:w-64 space-y-4">
                <div className="text-center md:text-left">
                   <div className="text-5xl font-bold">{product.rating}</div>
                   <div className="my-2 flex justify-center md:justify-start gap-1">
                      {[1,2,3,4,5].map(i => <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />)}
                   </div>
                   <p className="text-sm text-muted-foreground">Based on {product.reviews} reviews</p>
                </div>
             </div>
             <div className="flex-1 space-y-6">
                <h3 className="text-xl font-bold">Most Recent Reviews</h3>
                {[1, 2].map(i => (
                  <div key={i} className="space-y-2 border-b border-border pb-6 last:border-0">
                    <div className="flex items-center justify-between">
                       <span className="font-bold">Happy Customer {i}</span>
                       <span className="text-xs text-muted-foreground">2 weeks ago</span>
                    </div>
                    <div className="flex gap-1">
                       {[1,2,3,4,5].map(j => <Star key={j} className="h-3 w-3 fill-yellow-400 text-yellow-400" />)}
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                       Amazing product! Totally exceeded my expectations. The quality is top-notch.
                    </p>
                  </div>
                ))}
             </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
