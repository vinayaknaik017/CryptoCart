import React from 'react';
import { useLocation, Link, Navigate } from 'react-router-dom';
import { CheckCircle, ShoppingBag } from 'lucide-react';
import Button from '../components/ui/Button';

const CheckoutSuccessPage: React.FC = () => {
  const location = useLocation();
  const { orderId } = location.state || {};
  
  // Redirect if accessed directly without an order ID
  if (!orderId) {
    return <Navigate to="/" />;
  }
  
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <div className="max-w-md mx-auto">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-6">
          <CheckCircle className="h-10 w-10 text-green-600" />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Order Successful!</h1>
        
        <p className="text-gray-600 mb-2">
          Thank you for your purchase. Your order has been received and is being processed.
        </p>
        
        <p className="text-gray-600 mb-8">
          Your order ID is: <span className="font-medium">{orderId}</span>
        </p>
        
        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">What's Next?</h2>
          
          <ul className="text-left text-gray-600 space-y-2">
            <li className="flex items-start">
              <span className="inline-block w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex-shrink-0 mr-2 text-center">1</span>
              <span>You'll receive an email confirmation shortly.</span>
            </li>
            <li className="flex items-start">
              <span className="inline-block w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex-shrink-0 mr-2 text-center">2</span>
              <span>We'll notify you when your order ships.</span>
            </li>
            <li className="flex items-start">
              <span className="inline-block w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex-shrink-0 mr-2 text-center">3</span>
              <span>You can track your order in your account dashboard.</span>
            </li>
          </ul>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/orders">
            <Button variant="outline">
              View Order
            </Button>
          </Link>
          
          <Link to="/products">
            <Button leftIcon={<ShoppingBag className="h-5 w-5" />}>
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSuccessPage;