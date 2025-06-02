import OnlineStatusIndicator from '@/components/shared/OnlineStatusIndicator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Users } from 'lucide-react';

// Mock user data
const mockUsers = [
  { id: '1', name: 'Alice', status: 'online' as const, avatarUrl: 'https://placehold.co/40x40.png?text=A' },
  { id: '2', name: 'Bob', status: 'offline' as const, avatarUrl: 'https://placehold.co/40x40.png?text=B' },
  { id: '3', name: 'Charlie', status: 'connecting' as const, avatarUrl: 'https://placehold.co/40x40.png?text=C' },
  { id: '4', name: 'Diana', status: 'online' as const, avatarUrl: 'https://placehold.co/40x40.png?text=D' },
];

export default function UserListPanel() {
  return (
    <div className="h-full flex flex-col p-1">
      <h3 className="text-lg font-semibold mb-3 px-3 pt-2 flex items-center gap-2 text-foreground">
        <Users className="w-5 h-5 text-primary" />
        Participants ({mockUsers.filter(u => u.status === 'online').length}/{mockUsers.length})
      </h3>
      <ul className="space-y-2 overflow-y-auto flex-grow">
        {mockUsers.map((user) => (
          <li key={user.id} className="flex items-center justify-between p-2 hover:bg-muted/50 rounded-md transition-colors">
            <div className="flex items-center space-x-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.avatarUrl} alt={user.name} data-ai-hint="person avatar" />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <span className="text-sm text-foreground">{user.name}</span>
            </div>
            <OnlineStatusIndicator status={user.status} />
          </li>
        ))}
      </ul>
       {/* Placeholder for Voice Chat button */}
       <div className="mt-auto p-2 border-t border-border">
        <button className="w-full py-2 px-4 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm flex items-center justify-center gap-2 transition-colors">
          <User className="w-4 h-4"/> Join Voice Chat (Coming Soon)
        </button>
      </div>
    </div>
  );
}
