
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
import { UserPlus, Chrome } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { signUpWithGoogle } from '@/lib/auth'; // Updated import

export default function SignupPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Placeholder for email/password signup logic
     toast({
      title: "Signup Attempted",
      description: "Email/Password signup functionality is not yet implemented.",
      variant: "default"
    });
    setIsLoading(false);
  };

  const handleGoogleSignUp = async () => {
    setIsLoading(true);
    try {
      const user = await signUpWithGoogle();
      if (user) {
        toast({
          title: "Signed Up Successfully!",
          description: `Welcome, ${user.displayName || user.email}! Your account has been created.`,
        });
        router.push('/'); // Redirect to homepage or dashboard
      }
    } catch (error: any) {
      console.error("Google Sign-Up Error:", error);
      toast({
        title: "Google Sign-Up Failed",
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
            <UserPlus className="mx-auto h-10 w-10 text-primary mb-2" />
            <CardTitle className="text-3xl font-headline">Join SyncStream</CardTitle>
            <CardDescription>Create an account to start watching with friends.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-1.5">
                <Label htmlFor="username">Username</Label>
                <Input 
                  id="username" 
                  type="text" 
                  placeholder="Your cool username" 
                  value={username} 
                  onChange={(e) => setUsername(e.target.value)} 
                  required 
                  disabled={isLoading}
                  className="bg-input border-border focus:ring-primary"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="you@example.com" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                  disabled={isLoading}
                  className="bg-input border-border focus:ring-primary"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="Choose a strong password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                  disabled={isLoading}
                  className="bg-input border-border focus:ring-primary"
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Creating Account...' : 'Create Account'}
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
            <Button variant="outline" className="w-full" onClick={handleGoogleSignUp} disabled={isLoading}>
              <Chrome className="mr-2 h-4 w-4" />
              {isLoading ? 'Signing up...' : 'Sign up with Google'}
            </Button>
            <p className="mt-6 text-center text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link href="/login" className="font-medium text-primary hover:underline">
                Log in
              </Link>
            </p>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
