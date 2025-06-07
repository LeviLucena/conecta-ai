import type { Call } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button }
from '@/components/ui/button';
import { Phone, Video, PhoneIncoming, PhoneOutgoing, PhoneMissed } from 'lucide-react';
import { formatDistanceToNowStrict, format } from 'date-fns';

interface CallListItemProps {
  call: Call;
}

const CallStatusIcon = ({ status, type }: { status: Call['status'], type: Call['type'] }) => {
  const commonClasses = "h-4 w-4 mr-1";
  if (status === 'missed') return <PhoneMissed className={`${commonClasses} text-destructive`} />;
  if (status === 'incoming') return <PhoneIncoming className={`${commonClasses} text-green-500`} />;
  if (status === 'outgoing') return <PhoneOutgoing className={`${commonClasses} text-blue-500`} />;
  return type === 'audio' ? <Phone className={commonClasses} /> : <Video className={commonClasses} />;
};

const getInitials = (name: string) => {
  const names = name.split(' ');
  if (names.length > 1) {
    return `${names[0][0]}${names[1][0]}`.toUpperCase();
  }
  return names[0].substring(0, 2).toUpperCase();
};

export function CallListItem({ call }: CallListItemProps) {
  const callTime = new Date(call.timestamp);
  const timeAgo = formatDistanceToNowStrict(callTime, { addSuffix: true });
  const fullDate = format(callTime, 'PPpp');

  return (
    <div className="flex items-center p-3 hover:bg-secondary/50 transition-colors duration-150 border-b border-border last:border-b-0">
      <Avatar className="h-12 w-12 mr-3">
        <AvatarImage src={call.contact.avatarUrl} alt={call.contact.name} data-ai-hint="person portrait" />
        <AvatarFallback>{getInitials(call.contact.name)}</AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <h3 className={`font-semibold truncate font-headline ${call.status === 'missed' ? 'text-destructive' : 'text-foreground'}`}>
          {call.contact.name}
        </h3>
        <div className="flex items-center text-sm text-muted-foreground">
          <CallStatusIcon status={call.status} type={call.type} />
          <span>{timeAgo}</span>
          {call.duration && <span>&nbsp;&middot; {Math.floor(call.duration / 60)}m {call.duration % 60}s</span>}
        </div>
      </div>
      <Button variant="ghost" size="icon" className="text-primary hover:bg-primary/10">
        {call.type === 'audio' ? <Phone className="h-5 w-5" /> : <Video className="h-5 w-5" />}
      </Button>
    </div>
  );
}
