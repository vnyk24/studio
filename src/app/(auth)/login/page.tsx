
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LogIn, Chrome, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { signInWithGoogle } from '@/lib/auth';
import { auth } from '@/lib/firebase'; // Import auth
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const isFirebaseConfigured = !!auth;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFirebaseConfigured) {
      toast({
        title: "Firebase Not Configured",
        description: "Please configure Firebase in .env.local and restart the server.",
        variant: "destructive",
      });
      return;
    }
    setIsLoading(true);
    // Placeholder for email/password login logic
    toast({
      title: "Login Attempted",
      description: "Email/Password login functionality is not yet implemented.",
      variant: "default"
    });
    setIsLoading(false);
  };

  const handleGoogleSignIn = async () => {
    if (!isFirebaseConfigured) {
      toast({
        title: "Firebase Not Configured",
        description: "Cannot sign in with Google. Please configure Firebase in .env.local and restart the server.",
        variant: "destructive",
      });
      return;
    }
    setIsLoading(true);
    try {
      const user = await signInWithGoogle();
      if (user) {
        toast({
          title: "Signed In Successfully!",
          description: `Welcome back, ${user.displayName || user.email}!`,
        });
        router.push('/'); // Redirect to homepage or dashboard
      }
    } catch (error: any) {
      console.error("Google Sign-In Error:", error);
      toast({
        title: "Google Sign-In Failed",
        description: error.message || "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12 flex items-center justify-center">
        <Card className="w-full max-w-md shadow-2xl">
          <CardHeader className="text-center">
            <LogIn className="mx-auto h-10 w-10 text-primary mb-2" />
            <CardTitle className="text-3xl font-headline">Welcome Back!</CardTitle>
            <CardDescription>Log in to access your SyncStream rooms.</CardDescription>
          </CardHeader>
          <CardContent>
            {!isFirebaseConfigured && (
              <Alert variant="destructive" className="mb-6">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Firebase Configuration Error</AlertTitle>
                <AlertDescription>
                  Firebase is not properly configured. Authentication will not work.
                  Please check your browser console for more details and ensure your
                  <code>.env.local</code> file has the correct Firebase credentials.
                  Remember to restart your development server after changes to <code>.env.local</code>.
                </AlertDescription>
              </Alert>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="you@example.com" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                  disabled={isLoading || !isFirebaseConfigured}
                  className="bg-input border-border focus:ring-primary"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="••••••••" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                  disabled={isLoading || !isFirebaseConfigured}
                  className="bg-input border-border focus:ring-primary"
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading || !isFirebaseConfigured}>
                {isLoading ? 'Logging in...' : 'Log In'}
              </Button>
            </form>
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={handleGoogleSignIn} 
              disabled={isLoading || !isFirebaseConfigured}
            >
              <Chrome className="mr-2 h-4 w-4" />
              {isLoading ? 'Signing in...' : 'Sign in with Google'}
            </Button>
            <p className="mt-6 text-center text-sm text-muted-foreground">
              Don't have an account?{' '}
              <Link href="/signup" className="font-medium text-primary hover:underline">
                Sign up
              </Link>
            </p>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
