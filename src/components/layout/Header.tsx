
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Clapperboard, LogOut } from 'lucide-react';
import { useEffect, useState } from 'react';
// Use the User type for structural consistency, though it won't be a Firebase User object anymore
import type { User } from 'firebase/auth'; 
import { onAuthStateChanged, signOutUser } from '@/lib/auth'; // These are now placeholder functions
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';


export default function Header() {
  const [user, setUser] = useState<User | null>(null);
  // With placeholder onAuthStateChanged, loading is less of an issue,
  // but we keep the pattern for potential future async operations.
  const [loading, setLoading] = useState(true); 
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    // onAuthStateChanged is now a placeholder that will immediately call back (likely with null)
    const unsubscribe = onAuthStateChanged((currentUser) => {
      setUser(currentUser); // currentUser will be null from placeholder
      setLoading(false);
    });
    return () => unsubscribe(); 
  }, []);

  const handleSignOut = async () => {
    try {
      await signOutUser(); // Calls the placeholder signOutUser
      toast({ title: "Signed Out", description: "You have been signed out (placeholder action)." });
      // setUser(null); // Explicitly set user to null for UI update, as onAuthStateChanged might not re-trigger in placeholder
      router.push('/'); 
      // To ensure UI updates immediately after placeholder logout, explicitly set user state
      // This is because the placeholder onAuthStateChanged might not be "listening" for this change.
      setUser(null);
    } catch (error) {
      console.error("Error signing out (placeholder): ", error);
      toast({ title: "Sign Out Error", description: "Could not sign you out (placeholder action).", variant: "destructive" });
    }
  };

  return (
    <header className="bg-card shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-primary hover:opacity-80 transition-opacity">
          <Clapperboard className="w-8 h-8" />
          <span className="font-headline">SyncStream</span>
        </Link>
        <nav className="space-x-2">
          {loading ? (
             <div className="flex items-center space-x-2">
                <Skeleton className="h-10 w-20" />
                <Skeleton className="h-10 w-24" />
            </div>
          ) : user ? ( // user will typically be null due to placeholder onAuthStateChanged
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.photoURL || undefined} alt={user.displayName || user.email || 'User avatar'} data-ai-hint="user profile" />
                    <AvatarFallback>{user.displayName ? user.displayName.charAt(0).toUpperCase() : (user.email ? user.email.charAt(0).toUpperCase() : 'U')}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.displayName || 'User'}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button variant="default" asChild>
                <Link href="/signup">Sign Up</Link>
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
