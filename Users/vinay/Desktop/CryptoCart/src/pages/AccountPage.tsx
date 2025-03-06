import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User, Mail, MapPin, Plus, Trash2 } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { Address } from '../types';

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
});

const addressSchema = z.object({
  fullName: z.string().min(3, 'Full name is required'),
  streetAddress: z.string().min(5, 'Street address is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  postalCode: z.string().min(5, 'Postal code is required'),
  country: z.string().min(2, 'Country is required'),
});

type ProfileFormData = z.infer<typeof profileSchema>;
type AddressFormData = z.infer<typeof addressSchema>;

const AccountPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout, addresses, addAddress, removeAddress, updateAddress } = useAuthStore();
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [editingAddressIndex, setEditingAddressIndex] = useState<number | null>(null);
  
  // Redirect if not authenticated
  React.useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);
  
  const { register: registerProfile, handleSubmit: handleSubmitProfile } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
    }
  });
  
  const { register: registerAddress, handleSubmit: handleSubmitAddress, reset: resetAddress } = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
  });
  
  const onSubmitProfile = (data: ProfileFormData) => {
    // In a real app, this would update the user profile
    console.log('Profile updated:', data);
  };
  
  const onSubmitAddress = (data: AddressFormData) => {
    if (editingAddressIndex !== null) {
      updateAddress(editingAddressIndex, data);
    } else {
      addAddress(data);
    }
    
    setIsEditingAddress(false);
    setEditingAddressIndex(null);
    resetAddress();
  };
  
  const handleEditAddress = (index: number) => {
    const address = addresses[index];
    resetAddress(address);
    setEditingAddressIndex(index);
    setIsEditingAddress(true);
  };
  
  const handleDeleteAddress = (index: number) => {
    removeAddress(index);
  };
  
  const handleAddNewAddress = () => {
    resetAddress({
      fullName: '',
      streetAddress: '',
      city: '',
      state: '',
      postalCode: '',
      country: '',
    });
    setEditingAddressIndex(null);
    setIsEditingAddress(true);
  };
  
  const handleCancelEditAddress = () => {
    setIsEditingAddress(false);
    setEditingAddressIndex(null);
  };
  
  if (!user) {
    return null; // Will redirect via useEffect
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Account</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex items-center space-x-4 mb-6">
              <div className="bg-blue-100 rounded-full p-3">
                <User className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{user.name}</h2>
                <p className="text-gray-500">{user.email}</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <button
                onClick={() => navigate('/orders')}
                className="w-full text-left px-4 py-2 rounded-md hover:bg-gray-100 text-gray-700"
              >
                My Orders
              </button>
              <button
                onClick={() => navigate('/wishlist')}
                className="w-full text-left px-4 py-2 rounded-md hover:bg-gray-100 text-gray-700"
              >
                Wishlist
              </button>
              <button
                onClick={() => logout()}
                className="w-full text-left px-4 py-2 rounded-md hover:bg-gray-100 text-red-600"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
        
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Profile Information
            </h2>
            
            <form onSubmit={handleSubmitProfile(onSubmitProfile)} className="space-y-6">
              <Input
                label="Full Name"
                leftIcon={<User className="h-5 w-5 text-gray-400" />}
                {...registerProfile('name')}
              />
              
              <Input
                label="Email Address"
                type="email"
                leftIcon={<Mail className="h-5 w-5 text-gray-400" />}
                {...registerProfile('email')}
                disabled
              />
              
              <Button type="submit">
                Update Profile
              </Button>
            </form>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Shipping Addresses
              </h2>
              
              {!isEditingAddress && (
                <Button
                  variant="outline"
                  leftIcon={<Plus className="h-5 w-5" />}
                  onClick={handleAddNewAddress}
                >
                  Add New Address
                </Button>
              )}
            </div>
            
            {isEditingAddress ? (
              <form onSubmit={handleSubmitAddress(onSubmitAddress)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Full Name"
                    {...registerAddress('fullName')}
                  />
                  
                  <Input
                    label="Street Address"
                    {...registerAddress('streetAddress')}
                  />
                  
                  <Input
                    label="City"
                    {...registerAddress('city')}
                  />
                  
                  <Input
                    label="State/Province"
                    {...registerAddress('state')}
                  />
                  
                  <Input
                    label="Postal Code"
                    {...registerAddress('postalCode')}
                  />
                  
                  <Input
                    label="Country"
                    {...registerAddress('country')}
                  />
                </div>
                
                <div className="flex space-x-4">
                  <Button type="submit">
                    {editingAddressIndex !== null ? 'Update Address' : 'Add Address'}
                  </Button>
                  
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancelEditAddress}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                {addresses.length === 0 ? (
                  <p className="text-gray-500">
                    You don't have any saved addresses yet.
                  </p>
                ) : (
                  addresses.map((address: Address, index: number) => (
                    <div
                      key={index}
                      className="border rounded-md p-4 flex justify-between"
                    >
                      <div className="flex">
                        <MapPin className="h-5 w-5 text-gray-400 mr-3 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium">{address.fullName}</p>
                          <p className="text-sm text-gray-500">{address.streetAddress}</p>
                          <p className="text-sm text-gray-500">
                            {address.city}, {address.state} {address.postalCode}
                          </p>
                          <p className="text-sm text-gray-500">{address.country}</p>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditAddress(index)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteAddress(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;