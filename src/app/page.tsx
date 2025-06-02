import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CreateRoomForm from '@/components/room/CreateRoomForm';
import Image from 'next/image';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12 flex flex-col items-center justify-center">
        <section className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold font-headline mb-4">
            <span className="text-primary">Sync</span>Stream
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Watch YouTube videos together with friends in perfect sync. Chat, laugh, and enjoy shared moments, no matter the distance.
          </p>
        </section>
        
        <CreateRoomForm />

        <section className="mt-16 w-full max-w-4xl text-center">
          <h2 className="text-3xl font-headline font-semibold mb-8">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold text-primary mb-2">1. Create a Room</h3>
              <p className="text-muted-foreground">Paste any YouTube video link to instantly create a private watch party room.</p>
            </div>
            <div className="bg-card p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold text-primary mb-2">2. Invite Friends</h3>
              <p className="text-muted-foreground">Share the unique room link or send email invites to your friends.</p>
            </div>
            <div className="bg-card p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold text-primary mb-2">3. Watch Together</h3>
              <p className="text-muted-foreground">Enjoy synchronized video playback, text chat, and voice call features.</p>
            </div>
          </div>
        </section>
        <div className="mt-12 w-full max-w-4xl">
          <Image 
            src="https://placehold.co/1200x600.png" 
            alt="Friends watching video together" 
            data-ai-hint="friends computer screen"
            width={1200} 
            height={600}
            className="rounded-lg shadow-xl" 
          />
        </div>
      </main>
      <Footer />
    </div>
  );
}
