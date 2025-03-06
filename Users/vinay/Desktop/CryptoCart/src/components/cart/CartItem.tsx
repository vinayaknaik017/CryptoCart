import React from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { CartItem as CartItemType } from '../../types';
import { formatPrice } from '../../lib/utils';
import { useCartStore } from '../../store/cartStore';
import Button from '../ui/Button';

interface CartItemProps {
  item: CartItemType;
}

const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { updateQuantity, removeItem } = useCartStore();
  
  const handleIncrement = () => {
    updateQuantity(item.product.id, item.quantity + 1);
  };
  
  const handleDecrement = () => {
    if (item.quantity > 1) {
      updateQuantity(item.product.id, item.quantity - 1);
    } else {
      removeItem(item.product.id);
    }
  };
  
  const handleRemove = () => {
    removeItem(item.product.id);
  };
  
  return (
    <div className="flex flex-col sm:flex-row py-6 border-b border-gray-200">
      <div className="flex-shrink-0 w-full sm:w-24 h-24 mb-4 sm:mb-0">
        <img
          src={item.product.image}
          alt={item.product.name}
          className="w-full h-full object-cover rounded-md"
        />
      </div>
      
      <div className="flex-grow sm:ml-6">
        <div className="flex flex-col sm:flex-row sm:justify-between">
          <div>
            <h3 className="text-base font-medium text-gray-900">
              {item.product.name}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {item.product.category}
            </p>
          </div>
          
          <div className="mt-2 sm:mt-0 text-right">
            <p className="text-base font-medium text-gray-900">
              {formatPrice(item.product.price)}
            </p>
          </div>
        </div>
        
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center border border-gray-300 rounded-md">
            <button
              onClick={handleDecrement}
              className="p-2 text-gray-600 hover:text-gray-900"
              aria-label="Decrease quantity"
            >
              <Minus className="h-4 w-4" />
            </button>
            
            <span className="px-4 py-2 text-gray-900">
              {item.quantity}
            </span>
            
            <button
              onClick={handleIncrement}
              className="p-2 text-gray-600 hover:text-gray-900"
              aria-label="Increase quantity"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          
          <div className="flex items-center">
            <p className="text-base font-medium text-gray-900 mr-4">
              {formatPrice(item.product.price * item.quantity)}
            </p>
            
            <Button
              variant="ghost"
              onClick={handleRemove}
              aria-label="Remove item"
              className="text-red-500 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;