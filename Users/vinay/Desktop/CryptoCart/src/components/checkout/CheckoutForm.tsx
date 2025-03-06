import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CreditCard, Bitcoin } from 'lucide-react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { useAuthStore } from '../../store/authStore';
import { Address } from '../../types';

const addressSchema = z.object({
  fullName: z.string().min(3, 'Full name is required'),
  streetAddress: z.string().min(5, 'Street address is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  postalCode: z.string().min(5, 'Postal code is required'),
  country: z.string().min(2, 'Country is required'),
});

const paymentSchema = z.object({
  cardNumber: z.string().regex(/^\d{16}$/, 'Card number must be 16 digits'),
  cardholderName: z.string().min(3, 'Cardholder name is required'),
  expiryDate: z.string().regex(/^\d{2}\/\d{2}$/, 'Expiry date must be in MM/YY format'),
  cvv: z.string().regex(/^\d{3,4}$/, 'CVV must be 3 or 4 digits'),
});

const checkoutSchema = z.object({
  address: addressSchema,
  payment: paymentSchema,
  paymentMethod: z.enum(['credit', 'crypto']),
  saveInformation: z.boolean().optional(),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

interface CheckoutFormProps {
  onSubmit: (data: CheckoutFormData) => void;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ onSubmit }) => {
  const { addresses } = useAuthStore();
  const [selectedAddress, setSelectedAddress] = React.useState<number | null>(null);
  const [paymentMethod, setPaymentMethod] = React.useState<'credit' | 'crypto'>('credit');
  
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      paymentMethod: 'credit',
      saveInformation: true,
    }
  });
  
  React.useEffect(() => {
    setValue('paymentMethod', paymentMethod);
  }, [paymentMethod, setValue]);
  
  const handleAddressSelect = (index: number) => {
    setSelectedAddress(index);
    const address = addresses[index];
    setValue('address.fullName', address.fullName);
    setValue('address.streetAddress', address.streetAddress);
    setValue('address.city', address.city);
    setValue('address.state', address.state);
    setValue('address.postalCode', address.postalCode);
    setValue('address.country', address.country);
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Shipping Address */}
      <div>
        <h2 className="text-lg font-medium text-gray-900 mb-4">Shipping Address</h2>
        
        {addresses.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Saved Addresses</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {addresses.map((address: Address, index: number) => (
                <div 
                  key={index}
                  className={`border rounded-md p-4 cursor-pointer ${
                    selectedAddress === index ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                  }`}
                  onClick={() => handleAddressSelect(index)}
                >
                  <p className="font-medium">{address.fullName}</p>
                  <p className="text-sm text-gray-500">{address.streetAddress}</p>
                  <p className="text-sm text-gray-500">
                    {address.city}, {address.state} {address.postalCode}
                  </p>
                  <p className="text-sm text-gray-500">{address.country}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Full Name"
            {...register('address.fullName')}
            error={errors.address?.fullName?.message}
          />
          
          <Input
            label="Street Address"
            {...register('address.streetAddress')}
            error={errors.address?.streetAddress?.message}
          />
          
          <Input
            label="City"
            {...register('address.city')}
            error={errors.address?.city?.message}
          />
          
          <Input
            label="State/Province"
            {...register('address.state')}
            error={errors.address?.state?.message}
          />
          
          <Input
            label="Postal Code"
            {...register('address.postalCode')}
            error={errors.address?.postalCode?.message}
          />
          
          <Input
            label="Country"
            {...register('address.country')}
            error={errors.address?.country?.message}
          />
        </div>
      </div>
      
      {/* Payment Method */}
      <div>
        <h2 className="text-lg font-medium text-gray-900 mb-4">Payment Method</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div
            className={`border rounded-md p-4 cursor-pointer flex items-center ${
              paymentMethod === 'credit' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
            }`}
            onClick={() => setPaymentMethod('credit')}
          >
            <CreditCard className="h-6 w-6 text-gray-600 mr-3" />
            <div>
              <p className="font-medium">Credit/Debit Card</p>
              <p className="text-sm text-gray-500">Pay with Visa, Mastercard, etc.</p>
            </div>
          </div>
          
          <div
            className={`border rounded-md p-4 cursor-pointer flex items-center ${
              paymentMethod === 'crypto' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
            }`}
            onClick={() => setPaymentMethod('crypto')}
          >
            <Bitcoin className="h-6 w-6 text-gray-600 mr-3" />
            <div>
              <p className="font-medium">Cryptocurrency</p>
              <p className="text-sm text-gray-500">Pay with Bitcoin, Ethereum, etc.</p>
            </div>
          </div>
        </div>
        
        {paymentMethod === 'credit' && (
          <div className="space-y-4">
            <Input
              label="Card Number"
              placeholder="1234 5678 9012 3456"
              {...register('payment.cardNumber')}
              error={errors.payment?.cardNumber?.message}
            />
            
            <Input
              label="Cardholder Name"
              placeholder="John Doe"
              {...register('payment.cardholderName')}
              error={errors.payment?.cardholderName?.message}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Expiry Date"
                placeholder="MM/YY"
                {...register('payment.expiryDate')}
                error={errors.payment?.expiryDate?.message}
              />
              
              <Input
                label="CVV"
                placeholder="123"
                {...register('payment.cvv')}
                error={errors.payment?.cvv?.message}
              />
            </div>
          </div>
        )}
        
        {paymentMethod === 'crypto' && (
          <div className="bg-gray-100 p-4 rounded-md">
            <p className="text-sm text-gray-700 mb-2">
              You will be redirected to our secure crypto payment gateway after placing your order.
            </p>
            <p className="text-sm text-gray-700">
              We accept Bitcoin, Ethereum, Litecoin, and other major cryptocurrencies.
            </p>
          </div>
        )}
      </div>
      
      <div className="flex items-center">
        <input
          type="checkbox"
          id="saveInformation"
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          {...register('saveInformation')}
        />
        <label htmlFor="saveInformation" className="ml-2 text-sm text-gray-700">
          Save this information for next time
        </label>
      </div>
      
      <Button type="submit" size="lg" fullWidth>
        Complete Order
      </Button>
    </form>
  );
};

export default CheckoutForm;