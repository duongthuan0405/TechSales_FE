import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Modal } from '../../components/ui/modal';
import { Trash2, Plus, Minus, Loader2 } from 'lucide-react';
import { products } from '../../../data/mockData';
import { useCreateOrder } from '../../../dataHook/orderDataHook';
import { useGetCart, useUpdateCartQuantity, useRemoveFromCart, useClearCart } from '../../../dataHook/cartDataHook';
import { toast } from 'sonner';

export function ShoppingCartPage() {
  const navigate = useNavigate();
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  
  const { data: cartItems = [], isLoading, isError } = useGetCart();
  const { mutate: updateQuantity, isPending: isUpdating } = useUpdateCartQuantity();
  const { mutate: removeItem, isPending: isRemoving } = useRemoveFromCart();
  const { mutate: clearCart } = useClearCart();
  const { mutate: createOrder, isPending: isCreatingOrder } = useCreateOrder();

  useEffect(() => {
    if (isError) {
      toast.error('Failed to load cart');
    }
  }, [isError]);

  const cartWithDetails = cartItems.map(item => {
    const product = products.find(p => p.id === item.productId);
    return { ...item, product };
  }).filter(item => item.product);

  const subtotal = cartWithDetails.reduce((sum, item) => sum + (item.product!.price * item.quantity), 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  const handleCheckout = () => {
    setShowCheckoutModal(true);
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    updateQuantity({ productId, quantity }, {
      onError: () => toast.error('Failed to update quantity')
    });
  };

  const handleRemoveItem = (productId: string) => {
    removeItem(productId, {
      onSuccess: () => toast.success('Item removed'),
      onError: () => toast.error('Failed to remove item')
    });
  };

  const handleConfirmCheckout = () => {
    createOrder({
      items: cartItems,
      total,
      subtotal,
      tax
    }, {
      onSuccess: () => {
        clearCart(undefined, {
          onSuccess: () => {
            setShowCheckoutModal(false);
            toast.success('Order placed successfully!');
            navigate('/customer/orders');
          }
        });
      },
      onError: () => {
        toast.error('Failed to place order');
      }
    });
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Shopping Cart</h1>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-lg text-muted-foreground">Your cart is empty</p>
            <p className="text-sm text-muted-foreground">Add some products to get started</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Shopping Cart</h1>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          {cartWithDetails.map(item => (
            <Card key={item.productId}>
              <CardContent className="flex gap-4 p-6">
                <img
                  src={item.product!.image}
                  alt={item.product!.name}
                  className="h-24 w-24 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold">{item.product!.name}</h3>
                      <p className="text-sm text-muted-foreground">{item.product!.brand}</p>
                      <Badge variant="secondary" className="mt-2">{item.product!.category}</Badge>
                    </div>
                    <button
                      onClick={() => handleRemoveItem(item.productId)}
                      disabled={isRemoving}
                      className="rounded-lg p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive disabled:opacity-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleUpdateQuantity(item.productId, item.quantity - 1)}
                        disabled={item.quantity <= 1 || isUpdating}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-border hover:bg-accent disabled:opacity-50"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-12 text-center">{item.quantity}</span>
                      <button
                        onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1)}
                        disabled={isUpdating}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-border hover:bg-accent disabled:opacity-50"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="text-xl font-bold">
                      ${(item.product!.price * item.quantity).toLocaleString()}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax (8%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="border-t border-border pt-4">
                <div className="flex justify-between">
                  <span className="font-semibold">Total</span>
                  <span className="text-xl font-bold">${total.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleCheckout} className="w-full">
                Proceed to Checkout
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>

      <Modal
        open={showCheckoutModal}
        onOpenChange={setShowCheckoutModal}
        title="Checkout"
        description="Complete your order"
        size="md"
        footer={
          <>
            <Button 
              variant="outline" 
              onClick={() => setShowCheckoutModal(false)}
              disabled={isCreatingOrder}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleConfirmCheckout}
              disabled={isCreatingOrder}
            >
              {isCreatingOrder && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isCreatingOrder ? 'Processing...' : 'Confirm Order'}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <p>Your order will be placed once you confirm.</p>
          <p className="text-sm text-muted-foreground">
            You will receive a confirmation email shortly after confirmation.
          </p>
        </div>
      </Modal>
    </div>
  );
}
