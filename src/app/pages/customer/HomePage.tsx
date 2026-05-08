import { useEffect } from 'react';
import { ArrowRight, ShoppingCart, Star, Zap, TrendingUp, ShieldCheck, Truck, Headphones, Loader2 } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { useGetProducts } from '../../../dataHook/productDataHook';
import { useGetCategories } from '../../../dataHook/categoryDataHook';
import { useAddToCart } from '../../../dataHook/cartDataHook';
import { DynamicIcon } from '../../components/ui/DynamicIcon';
import { toast } from 'sonner';
import { useNavigate } from 'react-router';

export function HomePage() {
  const navigate = useNavigate();
  const { data: products = [], isLoading: productsLoading, isError: productsError } = useGetProducts();
  const { data: categories = [], isLoading: categoriesLoading, isError: categoriesError } = useGetCategories();
  const { mutate: addToCart } = useAddToCart();

  useEffect(() => {
    if (productsError) toast.error('Failed to load products');
    if (categoriesError) toast.error('Failed to load categories');
  }, [productsError, categoriesError]);

  const featuredProducts = products.slice(0, 4);
  const flashSaleProducts = products.slice(4, 8);

  const handleAddToCart = (productId: string) => {
    addToCart(productId, {
      onSuccess: () => toast.success('Added to cart'),
      onError: () => toast.error('Failed to add to cart')
    });
  };

  return (
    <div className="space-y-12 pb-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-slate-900 text-white">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20" />
        <div className="relative flex flex-col items-center justify-center px-6 py-20 text-center md:py-32">
          <Badge className="mb-4 bg-blue-500 hover:bg-blue-600">New Season 2026</Badge>
          <h1 className="mb-6 text-4xl font-extrabold tracking-tight md:text-6xl">
            Future of Tech <br /> 
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">In Your Hands</span>
          </h1>
          <p className="mb-10 max-w-2xl text-lg text-slate-300">
            Explore the latest innovations in computing, mobile, and gaming. 
            Exclusive deals for our premium members.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" className="h-12 px-8" onClick={() => navigate('/customer/products')}>
              Shop Now <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="h-12 border-slate-700 px-8 text-white hover:bg-slate-800">
              View Deals
            </Button>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section>
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Browse Categories</h2>
          <Button variant="ghost" className="text-blue-600" onClick={() => navigate('/customer/products')}>View All</Button>
        </div>
        
        {categoriesLoading ? (
          <div className="flex h-32 items-center justify-center">
             <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
            {categories.map((cat) => (
              <Card key={cat.id} className="group cursor-pointer transition-all hover:border-blue-500 hover:shadow-md">
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <DynamicIcon name={cat.icon} className="mb-3 h-10 w-10 text-blue-600 group-hover:scale-110 transition-transform" />
                  <span className="font-semibold">{cat.name}</span>
                  <span className="text-xs text-muted-foreground">{cat.productCount} products</span>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Flash Sale */}
      <section className="rounded-3xl bg-red-50 p-8 dark:bg-red-950/20">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500 text-white shadow-lg shadow-red-500/30">
              <Zap className="h-6 w-6 fill-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Flash Sale</h2>
              <p className="text-sm text-red-600 dark:text-red-400 font-medium">Ending in 02:45:12</p>
            </div>
          </div>
          <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-50 dark:border-red-900 dark:text-red-400">View All Deals</Button>
        </div>
        
        {productsLoading ? (
           <div className="flex h-48 items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
           </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {flashSaleProducts.map((product) => (
              <Card key={product.id} className="overflow-hidden border-none shadow-sm group cursor-pointer" onClick={() => navigate(`/customer/products/${product.id}`)}>
                <div className="relative">
                  <img src={product.image} alt={product.name} className="h-48 w-full object-cover transition-transform group-hover:scale-105" />
                  <Badge className="absolute left-3 top-3 bg-red-500">-{Math.floor(Math.random() * 20) + 10}%</Badge>
                </div>
                <CardContent className="p-4">
                  <h3 className="mb-1 font-semibold truncate">{product.name}</h3>
                  <div className="mb-3 flex items-center gap-2">
                    <span className="text-lg font-bold text-red-600">${product.price - 100}</span>
                    <span className="text-sm text-muted-foreground line-through">${product.price}</span>
                  </div>
                  <Button variant="secondary" size="sm" className="w-full" onClick={(e) => { e.stopPropagation(); handleAddToCart(product.id); }}>
                    Add to Cart
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Promotional Banners */}
      <section className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="group relative overflow-hidden rounded-3xl bg-indigo-600 p-8 text-white">
          <div className="relative z-10 max-w-[60%]">
            <h3 className="mb-2 text-2xl font-bold">Gaming Zone</h3>
            <p className="mb-6 text-indigo-100">Level up your setup with our latest gaming gear collection.</p>
            <Button variant="secondary">Explore Now</Button>
          </div>
          <div className="absolute -bottom-10 -right-10 h-64 w-64 rounded-full bg-indigo-500/30 blur-3xl group-hover:bg-indigo-400/40 transition-colors" />
          <TrendingUp className="absolute bottom-8 right-8 h-32 w-32 text-indigo-500/20" />
        </div>
        <div className="group relative overflow-hidden rounded-3xl bg-emerald-600 p-8 text-white">
          <div className="relative z-10 max-w-[60%]">
            <h3 className="mb-2 text-2xl font-bold">Eco Friendly</h3>
            <p className="mb-6 text-emerald-100">Discover our sustainable technology and energy-efficient devices.</p>
            <Button variant="secondary">Shop Green</Button>
          </div>
          <div className="absolute -bottom-10 -right-10 h-64 w-64 rounded-full bg-emerald-500/30 blur-3xl group-hover:bg-emerald-400/40 transition-colors" />
          <ShieldCheck className="absolute bottom-8 right-8 h-32 w-32 text-emerald-500/20" />
        </div>
      </section>

      {/* Featured Products */}
      <section>
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Featured Products</h2>
          <Button variant="outline" onClick={() => navigate('/customer/products')}>Browse All</Button>
        </div>
        
        {productsLoading ? (
           <div className="flex h-48 items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
           </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featuredProducts.map((product) => (
              <Card key={product.id} className="group overflow-hidden transition-all hover:shadow-lg cursor-pointer" onClick={() => navigate(`/customer/products/${product.id}`)}>
                <div className="relative overflow-hidden">
                  <img src={product.image} alt={product.name} className="h-56 w-full object-cover transition-transform group-hover:scale-105" />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button size="icon" variant="secondary" className="rounded-full shadow-lg" onClick={(e) => { e.stopPropagation(); handleAddToCart(product.id); }}>
                        <ShoppingCart className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs font-medium text-blue-600">{product.brand}</span>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs font-medium">{product.rating}</span>
                    </div>
                  </div>
                  <h3 className="mb-2 font-semibold">{product.name}</h3>
                  <p className="mb-4 text-sm font-bold text-slate-900 dark:text-white">${product.price.toLocaleString()}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Services/Why Us */}
      <section className="grid grid-cols-1 gap-6 border-y border-border py-12 md:grid-cols-4">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30">
            <Truck className="h-6 w-6" />
          </div>
          <div>
            <h4 className="font-bold">Free Shipping</h4>
            <p className="text-xs text-muted-foreground">On all orders over $999</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 text-purple-600 dark:bg-purple-900/30">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <h4 className="font-bold">Secure Payment</h4>
            <p className="text-xs text-muted-foreground">100% secure transactions</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 text-orange-600 dark:bg-orange-900/30">
            <Headphones className="h-6 w-6" />
          </div>
          <div>
            <h4 className="font-bold">24/7 Support</h4>
            <p className="text-xs text-muted-foreground">Dedicated tech experts</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30">
            <Zap className="h-6 w-6" />
          </div>
          <div>
            <h4 className="font-bold">Warranty</h4>
            <p className="text-xs text-muted-foreground">Genuine global warranty</p>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="rounded-3xl bg-slate-100 p-12 text-center dark:bg-slate-900">
        <h2 className="mb-4 text-3xl font-bold">Join Our Newsletter</h2>
        <p className="mb-8 text-muted-foreground">Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.</p>
        <div className="mx-auto flex max-w-md gap-2">
          <input 
            type="email" 
            placeholder="Enter your email" 
            className="flex-1 rounded-xl border border-border bg-background px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Button>Subscribe</Button>
        </div>
      </section>

      {/* Footer simple */}
      <footer className="pt-6 text-center text-sm text-muted-foreground">
        <p>&copy; 2026 TechSales. All rights reserved.</p>
      </footer>
    </div>
  );
}
