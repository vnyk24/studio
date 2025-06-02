'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Mail, Copy, Wand2, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface InviteModalProps {
  roomId: string;
}

export default function InviteModal({ roomId }: InviteModalProps) {
  const [emails, setEmails] = useState('');
  const [inviteText, setInviteText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();
  const roomUrl = typeof window !== 'undefined' ? `${window.location.origin}/room/${roomId}` : '';


  const generateInviteText = async () => {
    setIsGenerating(true);
    // Simulate AI call
    await new Promise(resolve => setTimeout(resolve, 1000));
    const generatedText = `Hey!

I found this cool app called SyncStream where we can watch YouTube videos together in real-time. 

I've set up a room to watch something. Join me!

Room Link: ${roomUrl}

See you there!`;
    setInviteText(generatedText);
    setIsGenerating(false);
    toast({ title: 'Invite text generated!', description: 'You can now copy the text or customize it.' });
  };

  const copyToClipboard = (textToCopy: string, type: string) => {
    navigator.clipboard.writeText(textToCopy).then(() => {
      toast({ title: `${type} Copied!`, description: `${type} copied to clipboard.` });
    }).catch(err => {
      toast({ title: 'Copy Failed', description: `Could not copy ${type.toLowerCase()}.`, variant: 'destructive' });
      console.error('Failed to copy: ', err);
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full md:w-auto">
          <Users className="mr-2 h-4 w-4" /> Invite Friends
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg bg-card border-border text-foreground">
        <DialogHeader>
          <DialogTitle className="text-2xl font-headline flex items-center gap-2"><Mail className="text-primary"/>Invite Friends to Your Watch Party</DialogTitle>
          <DialogDescription>
            Share the room link or generate a message to invite friends via email.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <Label htmlFor="roomLink" className="text-foreground">Room Link</Label>
            <div className="flex items-center space-x-2 mt-1">
              <Input id="roomLink" type="text" readOnly value={roomUrl} className="bg-input border-border" />
              <Button variant="outline" size="icon" onClick={() => copyToClipboard(roomUrl, 'Room Link')} aria-label="Copy room link">
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="space-y-1">
            <Label htmlFor="emails" className="text-foreground">Friend's Emails (Optional)</Label>
            <Input
              id="emails"
              type="email"
              placeholder="email1@example.com, email2@example.com"
              value={emails}
              onChange={(e) => setEmails(e.target.value)}
              className="bg-input border-border"
              aria-label="Friend's email addresses"
            />
            <p className="text-xs text-muted-foreground">Comma-separated email addresses.</p>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <Label htmlFor="inviteText" className="text-foreground">Invite Message</Label>
              <Button variant="ghost" size="sm" onClick={generateInviteText} disabled={isGenerating}>
                <Wand2 className="mr-2 h-4 w-4" /> {isGenerating ? 'Generating...' : 'Suggest Text'}
              </Button>
            </div>
            <Textarea
              id="inviteText"
              placeholder="Your personalized invite message will appear here... Click 'Suggest Text' or write your own!"
              value={inviteText}
              onChange={(e) => setInviteText(e.target.value)}
              rows={6}
              className="bg-input border-border min-h-[150px]"
              aria-label="Invite message text"
            />
          </div>
        </div>
        <DialogFooter className="sm:justify-between">
          <Button variant="outline" onClick={() => copyToClipboard(inviteText, 'Invite Text')} disabled={!inviteText}>
            <Copy className="mr-2 h-4 w-4" /> Copy Invite Text
          </Button>
          {/* Actual email sending is not handled by the app. */}
          <Button type="button" variant="default" disabled={!emails || !inviteText} onClick={() => toast({title: "Note", description: "Email sending is not implemented. Please copy the text and send it manually."})}>
            <Mail className="mr-2 h-4 w-4" /> Send (Manual)
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
