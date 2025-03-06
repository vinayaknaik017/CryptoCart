import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, ArrowRight } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import CartItem from '../components/cart/CartItem';
import Button from '../components/ui/Button';
import { formatPrice } from '../lib/utils';

const CartPage: React.FC = () => {
  const { items, getTotalItems, getTotalPrice, clearCart } = useCartStore();
  
  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-md mx-auto">
          <ShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Your Cart is Empty</h1>
          <p className="text-gray-600 mb-8">
            Looks like you haven't added any products to your cart yet.
          </p>
          <Link to="/products">
            <Button size="lg">
              Start Shopping
            </Button>
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Shopping Cart</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Cart Items ({getTotalItems()})
              </h2>
              <button
                onClick={clearCart}
                className="text-red-600 hover:text-red-800 text-sm font-medium"
              >
                Clear Cart
              </button>
            </div>
            
            <div className="divide-y divide-gray-200">
              {items.map((item) => (
                <CartItem key={item.product.id} item={item} />
              ))}
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="text-gray-900 font-medium">
                  {formatPrice(getTotalPrice())}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="text-gray-900 font-medium">
                  {getTotalPrice() > 100 ? 'Free' : formatPrice(10)}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Tax</span>
                <span className="text-gray-900 font-medium">
                  {formatPrice(getTotalPrice() * 0.1)}
                </span>
              </div>
              
              <div className="border-t border-gray-200 pt-4 flex justify-between">
                <span className="text-lg font-semibold text-gray-900">Total</span>
                <span className="text-lg font-bold text-gray-900">
                  {formatPrice(
                    getTotalPrice() + 
                    (getTotalPrice() > 100 ? 0 : 10) + 
                    (getTotalPrice() * 0.1)
                  )}
                </span>
              </div>
            </div>
            
            <Link to="/checkout">
              <Button 
                fullWidth 
                size="lg"
                rightIcon={<ArrowRight className="h-5 w-5" />}
              >
                Proceed to Checkout
              </Button>
            </Link>
            
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-900 mb-2">We Accept</h3>
              <div className="flex space-x-2">
                <img src="https://via.placeholder.com/40x25" alt="Visa" className="h-6" />
                <img src="https://via.placeholder.com/40x25" alt="Mastercard" className="h-6" />
                <img src="https://via.placeholder.com/40x25" alt="PayPal" className="h-6" />
                <img src="https://via.placeholder.com/40x25" alt="Bitcoin" className="h-6" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;