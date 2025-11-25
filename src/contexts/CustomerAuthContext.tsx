import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

interface Customer {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  businessType: 'services' | 'ecommerce' | 'digital' | 'community';
  emailVerified: boolean;
}

interface CustomerAuthContextType {
  customer: Customer | null;
  token: string | null;
  login: (token: string, customer: Customer) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const CustomerAuthContext = createContext<CustomerAuthContextType | undefined>(undefined);

export const CustomerAuthProvider = ({ children }: { children: ReactNode }) => {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for existing token on mount
    const storedToken = localStorage.getItem('customer_token');
    const storedCustomer = localStorage.getItem('customer_data');

    if (storedToken && storedCustomer) {
      setToken(storedToken);
      setCustomer(JSON.parse(storedCustomer));
    }
    setIsLoading(false);
  }, []);

  const login = (newToken: string, customerData: Customer) => {
    localStorage.setItem('customer_token', newToken);
    localStorage.setItem('customer_data', JSON.stringify(customerData));
    setToken(newToken);
    setCustomer(customerData);

    // Navigate to appropriate dashboard
    if (customerData.businessType === 'services') {
      navigate('/customer/services/dashboard');
    } else if (customerData.businessType === 'ecommerce') {
      navigate('/customer/ecommerce/orders');
    } else if (customerData.businessType === 'digital') {
      navigate('/customer/blogging/reading');
    } else {
      navigate('/customer/blogging/reading');
    }
  };

  const logout = () => {
    localStorage.removeItem('customer_token');
    localStorage.removeItem('customer_data');
    setToken(null);
    setCustomer(null);
    navigate('/customer/login');
  };

  return (
    <CustomerAuthContext.Provider
      value={{
        customer,
        token,
        login,
        logout,
        isAuthenticated: !!token && !!customer,
        isLoading,
      }}
    >
      {children}
    </CustomerAuthContext.Provider>
  );
};

export const useCustomerAuth = () => {
  const context = useContext(CustomerAuthContext);
  if (context === undefined) {
    throw new Error('useCustomerAuth must be used within CustomerAuthProvider');
  }
  return context;
};
