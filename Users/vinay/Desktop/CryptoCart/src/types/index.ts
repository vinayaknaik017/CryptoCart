export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  rating: number;
  inStock: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  isAuthenticated: boolean;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  date: Date;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  paymentMethod: string;
  shippingAddress: Address;
}

export interface Address {
  fullName: string;
  streetAddress: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface PaymentMethod {
  id: string;
  type: 'credit' | 'debit' | 'crypto';
  lastFour: string;
  expiryDate?: string;
  network?: string;
}