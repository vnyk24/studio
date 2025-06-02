type Status = 'online' | 'offline' | 'connecting';

interface OnlineStatusIndicatorProps {
  status: Status;
}

export default function OnlineStatusIndicator({ status }: OnlineStatusIndicatorProps) {
  let bgColorClass = 'bg-muted-foreground'; // Default to offline
  let title = 'Offline';

  if (status === 'online') {
    bgColorClass = 'bg-accent'; // Use accent for online
    title = 'Online';
  } else if (status === 'connecting') {
    bgColorClass = 'bg-yellow-500 animate-pulse';
    title = 'Connecting...';
  }

  return (
    <span title={title} className={`inline-block w-3 h-3 rounded-full ${bgColorClass}`}></span>
  );
}
