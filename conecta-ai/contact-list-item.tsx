
import Link from 'next/link';
import type { User } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { MessageCircle, Phone, Video } from 'lucide-react';
import { useRouter } from 'next/navigation'; // Import useRouter

interface ContactListItemProps {
  contact: User;
}

const getInitials = (name: string) => {
  const names = name.split(' ');
  if (names.length > 1) {
    return `${names[0][0]}${names[1][0]}`.toUpperCase();
  }
  return names[0].substring(0, 2).toUpperCase();
};

export function ContactListItem({ contact }: ContactListItemProps) {
  const router = useRouter(); // Initialize useRouter

  const handleCall = (callType: 'audio' | 'video') => {
    // Navigate to the ongoing call page
    router.push(`/ongoing-call/${contact.id}/${callType}`);
    // Note: Initiating a call from contact list doesn't log to a specific chat history
    // unless we implement logic to find or create a chat first.
    // For now, it directly goes to the call screen.
  };
  
  // Assuming a convention for chat IDs or a function to find/create chat ID
  const chatId = `chat_with_${contact.id}`;


  return (
    <div className="flex items-center p-3 hover:bg-secondary/50 transition-colors duration-150 border-b border-border last:border-b-0">
      <Avatar className="h-12 w-12 mr-3">
        <AvatarImage src={contact.avatarUrl} alt={contact.name} data-ai-hint="person portrait" />
        <AvatarFallback>{getInitials(contact.name)}</AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold truncate font-headline text-foreground">{contact.name}</h3>
        <p className="text-sm text-muted-foreground capitalize">{contact.status || 'Offline'}</p>
      </div>
      <div className="flex gap-1">
        <Link href={`/chat/${chatId}`} passHref>
          <Button variant="ghost" size="icon" className="text-primary hover:bg-primary/10" aria-label={`Chat with ${contact.name}`}>
            <MessageCircle className="h-5 w-5" />
          </Button>
        </Link>
        <Button variant="ghost" size="icon" className="text-green-500 hover:bg-green-500/10" onClick={() => handleCall('audio')} aria-label={`Audio call ${contact.name}`}>
          <Phone className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="text-blue-500 hover:bg-blue-500/10" onClick={() => handleCall('video')} aria-label={`Video call ${contact.name}`}>
          <Video className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
