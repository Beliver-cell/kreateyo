import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBusinessContext } from '@/contexts/BusinessContext';

const Index = () => {
  const navigate = useNavigate();
  const { businessProfile } = useBusinessContext();

  useEffect(() => {
    if (businessProfile.onboarded) {
      navigate('/dashboard');
    }
  }, [businessProfile.onboarded, navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-subtle">
      <div className="text-center">
        <h1 className="text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-4">
          NexusCreate
        </h1>
        <p className="text-xl text-muted-foreground">Loading your business platform...</p>
      </div>
    </div>
  );
};

export default Index;
