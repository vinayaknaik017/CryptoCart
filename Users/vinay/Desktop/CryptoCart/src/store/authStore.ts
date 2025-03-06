import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, Address } from '../types';
import { generateRandomId } from '../lib/utils';

interface AuthState {
  user: User | null;
  addresses: Address[];
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  addAddress: (address: Address) => void;
  removeAddress: (index: number) => void;
  updateAddress: (index: number, address: Address) => void;
}

// Mock user database
const mockUsers = [
  {
    id: '1',
    email: 'user@example.com',
    password: 'password123',
    name: 'Demo User',
  }
];

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      addresses: [],
      
      login: async (email: string, password: string) => {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const user = mockUsers.find(
          u => u.email === email && u.password === password
        );
        
        if (user) {
          set({
            user: {
              id: user.id,
              email: user.email,
              name: user.name,
              isAuthenticated: true
            }
          });
          return true;
        }
        
        return false;
      },
      
      register: async (name: string, email: string, password: string) => {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Check if user already exists
        const userExists = mockUsers.some(u => u.email === email);
        
        if (userExists) {
          return false;
        }
        
        const newUser = {
          id: generateRandomId(),
          email,
          password,
          name
        };
        
        // In a real app, this would be an API call to create the user
        mockUsers.push(newUser);
        
        set({
          user: {
            id: newUser.id,
            email: newUser.email,
            name: newUser.name,
            isAuthenticated: true
          }
        });
        
        return true;
      },
      
      logout: () => {
        set({ user: null });
      },
      
      addAddress: (address: Address) => {
        set({ addresses: [...get().addresses, address] });
      },
      
      removeAddress: (index: number) => {
        const addresses = [...get().addresses];
        addresses.splice(index, 1);
        set({ addresses });
      },
      
      updateAddress: (index: number, address: Address) => {
        const addresses = [...get().addresses];
        addresses[index] = address;
        set({ addresses });
      }
    }),
    {
      name: 'auth-storage'
    }
  )
);