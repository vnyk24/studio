'use client';

import { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send, MessageCircle } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Message {
  id: string;
  sender: string;
  avatarUrl: string;
  text: string;
  timestamp: string;
  isCurrentUser?: boolean;
}

const mockMessages: Message[] = [
  { id: '1', sender: 'Alice', avatarUrl: 'https://placehold.co/40x40.png?text=A', text: 'Hey everyone! Ready to watch?', timestamp: '10:00 AM' },
  { id: '2', sender: 'Bob', avatarUrl: 'https://placehold.co/40x40.png?text=B', text: 'Yeah, let\'s go!', timestamp: '10:01 AM', isCurrentUser: true },
  { id: '3', sender: 'Charlie', avatarUrl: 'https://placehold.co/40x40.png?text=C', text: 'Excited! 🎉', timestamp: '10:02 AM' },
];

export default function ChatPanel() {
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [newMessage, setNewMessage] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Auto-scroll to bottom
    if (scrollAreaRef.current) {
      const viewport = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (viewport) {
        viewport.scrollTop = viewport.scrollHeight;
      }
    }
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === '') return;

    const message: Message = {
      id: String(Date.now()),
      sender: 'CurrentUser', // Replace with actual user
      avatarUrl: 'https://placehold.co/40x40.png?text=U',
      text: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isCurrentUser: true,
    };
    setMessages([...messages, message]);
    setNewMessage('');
  };

  return (
    <div className="h-full flex flex-col p-1">
       <h3 className="text-lg font-semibold mb-3 px-3 pt-2 flex items-center gap-2 text-foreground">
        <MessageCircle className="w-5 h-5 text-primary" />
        Chat
      </h3>
      <ScrollArea className="flex-grow mb-4 p-2 rounded-md bg-background" ref={scrollAreaRef}>
        <div className="space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex items-start gap-2.5 ${msg.isCurrentUser ? 'justify-end' : ''}`}>
              {!msg.isCurrentUser && (
                <Avatar className="w-8 h-8">
                  <AvatarImage src={msg.avatarUrl} alt={msg.sender} data-ai-hint="person avatar" />
                  <AvatarFallback>{msg.sender.charAt(0)}</AvatarFallback>
                </Avatar>
              )}
              <div className={`flex flex-col w-full max-w-[320px] leading-1.5 p-3 border-border rounded-xl ${msg.isCurrentUser ? 'bg-primary text-primary-foreground rounded-ee-none' : 'bg-muted text-foreground rounded-es-none'}`}>
                {!msg.isCurrentUser && (
                  <div className="flex items-center space-x-2 rtl:space-x-reverse mb-1">
                    <span className="text-sm font-semibold">{msg.sender}</span>
                  </div>
                )}
                <p className="text-sm font-normal">{msg.text}</p>
                <span className={`text-xs mt-1 ${msg.isCurrentUser ? 'text-primary-foreground/70' : 'text-muted-foreground'} ${msg.isCurrentUser ? 'self-end' : 'self-start'}`}>{msg.timestamp}</span>
              </div>
              {msg.isCurrentUser && (
                <Avatar className="w-8 h-8">
                  <AvatarImage src={msg.avatarUrl} alt={msg.sender} data-ai-hint="person avatar" />
                  <AvatarFallback>{msg.sender.charAt(0)}</AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
      <form onSubmit={handleSendMessage} className="flex items-center space-x-2 p-2 border-t border-border">
        <Input
          type="text"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-grow bg-input border-border focus:ring-primary"
          aria-label="Chat message input"
        />
        <Button type="submit" size="icon" variant="default" aria-label="Send message">
          <Send className="w-5 h-5" />
        </Button>
      </form>
    </div>
  );
}
