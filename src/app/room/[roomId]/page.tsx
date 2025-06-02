'use client';

import { useParams, useSearchParams } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import VideoPlayer from '@/components/room/VideoPlayer';
import ChatPanel from '@/components/room/ChatPanel';
import UserListPanel from '@/components/room/UserListPanel';
import InviteModal from '@/components/room/InviteModal';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Volume2, VolumeX, Play, Pause, Maximize } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function RoomPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const roomId = typeof params.roomId === 'string' ? params.roomId : '';
  const videoId = searchParams.get('videoId');

  // Placeholder states for player controls - real implementation would be complex
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (videoId) {
      setIsLoading(false);
    }
  }, [videoId]);

  if (isLoading) {
    return (
      <div className="flex flex-col h-screen bg-background text-foreground">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <p className="text-xl animate-pulse">Loading Room...</p>
        </main>
        <Footer />
      </div>
    );
  }


  return (
    <div className="flex flex-col h-screen bg-background text-foreground overflow-hidden">
      <Header />
      <main className="flex-grow flex flex-col md:flex-row p-2 sm:p-4 gap-2 sm:gap-4 overflow-hidden">
        {/* Main content area: Video + Controls + Invite */}
        <div className="flex flex-col flex-grow-[3] min-w-0 gap-2 sm:gap-4">
          <Card className="bg-card shadow-lg overflow-hidden flex-grow flex flex-col">
            <CardContent className="p-1 sm:p-2 flex-grow flex flex-col relative">
              <VideoPlayer videoId={videoId} />
              {/* Placeholder for custom controls overlay - very basic */}
              <div className="absolute bottom-2 left-2 right-2 bg-black/50 p-2 rounded-md flex items-center justify-between opacity-0 hover:opacity-100 transition-opacity duration-300">
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" onClick={() => setIsPlaying(!isPlaying)} className="text-white hover:bg-white/20">
                    {isPlaying ? <Pause className="w-5 h-5"/> : <Play className="w-5 h-5"/>}
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => setIsMuted(!isMuted)} className="text-white hover:bg-white/20">
                    {isMuted ? <VolumeX className="w-5 h-5"/> : <Volume2 className="w-5 h-5"/>}
                  </Button>
                </div>
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                  <Maximize className="w-5 h-5"/>
                </Button>
              </div>
            </CardContent>
          </Card>
          <div className="flex flex-col sm:flex-row justify-between items-center gap-2 p-2 bg-card rounded-lg shadow-md">
             <Button variant="outline" asChild className="w-full sm:w-auto">
                <Link href="/">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
                </Link>
            </Button>
            <h2 className="text-sm sm:text-lg font-semibold text-muted-foreground truncate">Room ID: <span className="text-accent font-mono">{roomId}</span></h2>
            <InviteModal roomId={roomId} />
          </div>
        </div>

        {/* Sidebar for Chat and Participants */}
        <Card className="flex-grow-[1] md:max-w-sm bg-card shadow-lg flex flex-col overflow-hidden min-h-[300px] md:min-h-0">
          <Tabs defaultValue="chat" className="w-full flex-grow flex flex-col">
            <TabsList className="grid w-full grid-cols-2 rounded-none border-b border-border">
              <TabsTrigger value="chat" className="rounded-none data-[state=active]:bg-muted data-[state=active]:shadow-none data-[state=active]:text-primary">Chat</TabsTrigger>
              <TabsTrigger value="participants" className="rounded-none data-[state=active]:bg-muted data-[state=active]:shadow-none data-[state=active]:text-primary">Participants</TabsTrigger>
            </TabsList>
            <TabsContent value="chat" className="flex-grow overflow-y-auto focus-visible:ring-0 focus-visible:ring-offset-0">
              <ChatPanel />
            </TabsContent>
            <TabsContent value="participants" className="flex-grow overflow-y-auto focus-visible:ring-0 focus-visible:ring-offset-0">
              <UserListPanel />
            </TabsContent>
          </Tabs>
        </Card>
      </main>
      {/* Footer is less prominent on room page or could be omitted */}
      {/* <Footer /> */}
    </div>
  );
}
