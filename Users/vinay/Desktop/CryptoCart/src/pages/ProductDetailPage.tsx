import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart, Share2, Star, Truck, Shield, ArrowLeft } from 'lucide-react';
import { getProductById, products } from '../data/products';
import { useCartStore } from '../store/cartStore';
import Button from '../components/ui/Button';
import ProductGrid from '../components/product/ProductGrid';
import { formatPrice } from '../lib/utils';

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  
  const product = id ? getProductById(id) : null;
  const addToCart = useCartStore(state => state.addItem);
  
  // Get related products (same category, excluding current product)
  const relatedProducts = product
    ? products
        .filter(p => p.category === product.category && p.id !== product.id)
        .slice(0, 4)
    : [];
  
  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
        <p className="text-gray-600 mb-8">The product you're looking for doesn't exist or has been removed.</p>
        <Button onClick={() => navigate('/products')}>
          Back to Products
        </Button>
      </div>
    );
  }
  
  const handleAddToCart = () => {
    // Add the product to cart multiple times based on quantity
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    
    // Reset quantity
    setQuantity(1);
  };
  
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (value > 0) {
      setQuantity(value);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-600 hover:text-blue-600 mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back
      </button>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        {/* Product Image */}
        <div className="bg-gray-100 rounded-lg overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-contain object-center"
            style={{ maxHeight: '500px' }}
          />
        </div>
        
        {/* Product Details */}
        <div>
          <div className="mb-4">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              {product.name}
            </h1>
            
            <div className="flex items-center mb-2">
              <div className="flex items-center text-yellow-400 mr-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(product.rating)
                        ? 'fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-gray-600">
                {product.rating} ({Math.floor(product.rating * 10)} reviews)
              </span>
            </div>
            
            <p className="text-gray-500">Category: {product.category}</p>
          </div>
          
          <div className="mb-6">
            <p className="text-3xl font-bold text-gray-900 mb-4">
              {formatPrice(product.price)}
            </p>
            
            <p className="text-gray-700 mb-6">
              {product.description}
            </p>
            
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-24">
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                  Quantity
                </label>
                <input
                  type="number"
                  id="quantity"
                  min="1"
                  value={quantity}
                  onChange={handleQuantityChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div className="flex-grow">
                <Button
                  onClick={handleAddToCart}
                  fullWidth
                  size="lg"
                  disabled={!product.inStock}
                  leftIcon={<ShoppingCart className="h-5 w-5" />}
                >
                  {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                </Button>
              </div>
            </div>
            
            <div className="flex space-x-4 mb-8">
              <Button
                variant="outline"
                leftIcon={<Heart className="h-5 w-5" />}
              >
                Add to Wishlist
              </Button>
              
              <Button
                variant="outline"
                leftIcon={<Share2 className="h-5 w-5" />}
              >
                Share
              </Button>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-6 space-y-4">
            <div className="flex items-start">
              <Truck className="h-5 w-5 text-gray-600 mr-3 mt-0.5" />
              <div>
                <h3 className="font-medium text-gray-900">Free Shipping</h3>
                <p className="text-sm text-gray-500">Free standard shipping on orders over $100</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <Shield className="h-5 w-5 text-gray-600 mr-3 mt-0.5" />
              <div>
                <h3 className="font-medium text-gray-900">Secure Payments</h3>
                <p className="text-sm text-gray-500">Pay with credit card or cryptocurrency</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Products</h2>
          <ProductGrid products={relatedProducts} />
        </div>
      )}
    </div>
  );
};

export default ProductDetailPage;