import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Clapperboard } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-card shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-primary hover:opacity-80 transition-opacity">
          <Clapperboard className="w-8 h-8" />
          <span className="font-headline">SyncStream</span>
        </Link>
        <nav className="space-x-2">
          <Button variant="ghost" asChild>
            <Link href="/login">Login</Link>
          </Button>
          <Button variant="default" asChild>
            <Link href="/signup">Sign Up</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
