'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Film, Link2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getYouTubeVideoId } from '@/lib/youtubeHelper';

// Dummy function to simulate room ID generation
const generateRoomId = () => Math.random().toString(36).substring(2, 10);

export default function CreateRoomForm() {
  const [videoUrl, setVideoUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const videoId = getYouTubeVideoId(videoUrl);

    if (!videoId) {
      toast({
        title: 'Invalid YouTube URL',
        description: 'Please enter a valid YouTube video URL.',
        variant: 'destructive',
      });
      setIsLoading(false);
      return;
    }

    // Simulate room creation
    const roomId = generateRoomId();
    
    // In a real app, you'd save the room and videoId to a backend here.
    // For now, we'll pass videoId as a query parameter.
    router.push(`/room/${roomId}?videoId=${videoId}`);
    
    // No need to setIsLoading(false) if navigating away
  };

  return (
    <Card className="w-full max-w-lg mx-auto shadow-2xl">
      <CardHeader className="text-center">
        <Film className="mx-auto h-12 w-12 text-primary mb-2" />
        <CardTitle className="text-3xl font-headline">Create a Watch Party</CardTitle>
        <CardDescription>Enter a YouTube video link to start watching with friends.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="videoUrl" className="text-sm font-medium text-foreground">YouTube Video URL</label>
            <div className="flex items-center space-x-2">
              <Link2 className="text-muted-foreground" />
              <Input
                id="videoUrl"
                type="url"
                placeholder="e.g., https://www.youtube.com/watch?v=VIDEO_ID"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                required
                className="bg-input border-border focus:ring-primary"
                aria-label="YouTube Video URL"
              />
            </div>
          </div>
          <Button type="submit" className="w-full text-lg py-3" disabled={isLoading}>
            {isLoading ? 'Creating Room...' : 'Create Room & Start Watching'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
