
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate, useLocation } from 'react-router-dom';
import AdminDashboard from '@/components/admin/AdminDashboard';

const Admin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login, currentUser } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  // Navigate to dashboard after login when currentUser is set
  useEffect(() => {
    if (currentUser && location.pathname === "/admin") {
      navigate("/admin/dashboard");
    }
  }, [currentUser, location.pathname, navigate]);

  // Check if we should show dashboard or login form
  useEffect(() => {
    // If user is authenticated and we're on the /admin/dashboard route, show dashboard
    if (currentUser && (location.pathname === '/admin/dashboard' || showDashboard)) {
      setShowDashboard(true);
    } 
    // If user is authenticated and we're on the /admin route, redirect to dashboard
    else if (currentUser && location.pathname === '/admin') {
      navigate('/admin/dashboard');
    }
  }, [currentUser, navigate, location, showDashboard]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      toast({
        title: "Login Successful",
        description: "You are now logged into the admin dashboard.",
      });
      setEmail('');
      setPassword('');
      // No immediate navigation here; navigation will occur in useEffect when currentUser is set.
    } catch (err: any) {
      setError(err.message || 'Failed to sign in');
      toast({
        title: "Login Failed",
        description: err.message || 'Failed to sign in',
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Show dashboard directly if already authenticated or we've just logged in
  if ((currentUser && location.pathname === '/admin/dashboard') || showDashboard) {
    return <AdminDashboard />;
  }

  // Display login form if not authenticated
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-100 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img 
            src="/logo.png" 
            alt="Humanity Verse Aid Foundation Logo" 
            className="h-16 w-auto mx-auto mb-4"
          />
          <h1 className="text-3xl font-bold text-brown-700 mb-2">Admin Login</h1>
          <p className="text-brown-600">
            Access the administrative dashboard to manage content and settings.
          </p>
        </div>
        
        <Card className="w-full max-w-md mx-auto shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">Admin Login</CardTitle>
            <CardDescription>Sign in to access the admin dashboard.</CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>
              <div className="space-y-2 relative">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  required
                />
                <button
                  type="button"
                  className="absolute right-2 top-8 text-xs text-gray-500"
                  onClick={() => setShowPassword((prev) => !prev)}
                  tabIndex={-1}
                  style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <span>
                    <span className="spinner-border spinner-border-sm mr-2 align-middle inline-block w-4 h-4 border-2 border-t-2 border-gray-200 border-t-blue-600 rounded-full animate-spin"></span>
                    Signing in...
                  </span>
                ) : 'Sign In'}
              </Button>
            </CardFooter>
          </form>
        </Card>
        
        <div className="mt-6 text-center">
          <Button
            variant="link"
            onClick={() => navigate('/')}
            className="text-primary hover:text-primary-600"
          >
            Back to Website
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Admin;
