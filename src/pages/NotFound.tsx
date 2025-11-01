import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="text-center max-w-md mx-auto">
        <h1 className="mb-4 text-6xl md:text-8xl font-bold bg-gradient-primary bg-clip-text text-transparent">404</h1>
        <p className="mb-4 text-xl md:text-2xl text-foreground font-semibold">Oops! Page not found</p>
        <p className="mb-8 text-muted-foreground">The page you're looking for doesn't exist or has been moved.</p>
        <a 
          href="/" 
          className="inline-flex items-center justify-center rounded-lg bg-gradient-primary px-6 py-3 text-sm font-medium text-white hover:opacity-90 transition-opacity"
        >
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
