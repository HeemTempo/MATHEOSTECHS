import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Alert, AlertDescription } from '../components/ui/alert';
import { authApi } from '../api/auth';
import { useAuthStore } from '../store/authStore';

export function LoginPage() {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (response) => {
      // authApi.login returns response.data from axios
      // Backend structure: { success, message, data: { user, token } }
      if (response && response.data) {
        const { user, token } = response.data;
        if (user && token) {
          setAuth(user, token);
          toast.success('Login successful!', {
            description: `Welcome back, ${user.name}!`
          });
          navigate('/dashboard');
        }
      }
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.error || 
                          error?.response?.data?.message || 
                          'Invalid email or password. Please try again.';
      toast.error('Login failed', {
        description: errorMessage
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate({ email, password });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f1117] p-4 relative">
      {/* Back to Home Button */}
      <Link 
        to="/" 
        className="absolute top-4 left-4 flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="hidden sm:inline">Back to Home</span>
      </Link>

      <Card className="w-full max-w-md bg-[#1a1d27] border-[#2e3149]">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <AlertCircle className="w-10 h-10 text-indigo-400" />
          </div>
          <CardTitle className="text-2xl font-bold text-white text-center">
            Incident Log System
          </CardTitle>
          <CardDescription className="text-slate-400 text-center">
            Enter your credentials to access the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {loginMutation.isError && (
              <Alert variant="destructive" className="bg-red-500/10 border-red-500/20">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {(loginMutation.error as any)?.response?.data?.error || 'Incorrect email or password. Please try again.'}
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-300">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-[#0f1117] border-[#2e3149] text-white placeholder:text-slate-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-300">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-[#0f1117] border-[#2e3149] text-white placeholder:text-slate-500"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? 'Signing in...' : 'Sign In'}
            </Button>

            <div className="text-sm text-slate-400 text-center mt-4 space-y-1">
              <p className="font-medium">Demo Credentials:</p>
              <p>Email: admin@gmail.com</p>
              <p>Password: rahim123</p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
