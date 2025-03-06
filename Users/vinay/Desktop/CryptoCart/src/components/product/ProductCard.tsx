import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Star } from 'lucide-react';
import { Product } from '../../types';
import { formatPrice } from '../../lib/utils';
import { useCartStore } from '../../store/cartStore';
import Button from '../ui/Button';
import { Card, CardContent } from '../ui/Card';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const addToCart = useCartStore(state => state.addItem);
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };
  
  return (
    <Card hoverable className="h-full flex flex-col overflow-hidden">
      <Link to={`/product/${product.id}`} className="flex flex-col h-full">
        <div className="relative pt-[100%] overflow-hidden bg-gray-100">
          <img
            src={product.image}
            alt={product.name}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
          {!product.inStock && (
            <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
              Out of Stock
            </div>
          )}
        </div>
        
        <CardContent className="flex flex-col flex-grow">
          <div className="flex items-center mb-1">
            <div className="flex items-center text-yellow-400">
              <Star className="h-4 w-4 fill-current" />
              <span className="ml-1 text-sm font-medium text-gray-700">
                {product.rating}
              </span>
            </div>
            <span className="ml-2 text-xs text-gray-500">
              ({Math.floor(product.rating * 10)} reviews)
            </span>
          </div>
          
          <h3 className="font-medium text-gray-900 mb-1 line-clamp-2">
            {product.name}
          </h3>
          
          <p className="text-sm text-gray-500 mb-4 line-clamp-2 flex-grow">
            {product.description}
          </p>
          
          <div className="mt-auto">
            <div className="flex items-center justify-between mb-3">
              <span className="text-lg font-bold text-gray-900">
                {formatPrice(product.price)}
              </span>
              <span className="text-sm text-gray-500">
                {product.category}
              </span>
            </div>
            
            <Button
              onClick={handleAddToCart}
              fullWidth
              disabled={!product.inStock}
              leftIcon={<ShoppingCart className="h-4 w-4" />}
            >
              Add to Cart
            </Button>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
};

export default ProductCard;