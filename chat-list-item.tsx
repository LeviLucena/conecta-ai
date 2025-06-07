import Link from 'next/link';
import Image from 'next/image';
import type { Chat, User } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDistanceToNowStrict } from 'date-fns';

interface ChatListItemProps {
  chat: Chat;
  currentUser: User;
}

export function ChatListItem({ chat, currentUser }: ChatListItemProps) {
  const otherParticipant = chat.participants.find(p => p.id !== currentUser.id) || chat.participants[0];
  const lastMessage = chat.lastMessage;

  const getInitials = (name: string) => {
    const names = name.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return names[0].substring(0, 2).toUpperCase();
  };

  return (
    <Link
      href={`/chat/${chat.id}`}
      className="flex items-center p-3 hover:bg-secondary/50 transition-colors duration-150 border-b border-border last:border-b-0"
    >
      <Avatar className="h-12 w-12 mr-3">
        <AvatarImage src={otherParticipant.avatarUrl} alt={otherParticipant.name} data-ai-hint="person portrait" />
        <AvatarFallback>{getInitials(otherParticipant.name)}</AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold truncate font-headline text-foreground">{otherParticipant.name}</h3>
          {lastMessage && (
            <p className="text-xs text-muted-foreground whitespace-nowrap">
              {formatDistanceToNowStrict(new Date(lastMessage.timestamp), { addSuffix: true })}
            </p>
          )}
        </div>
        <div className="flex justify-between items-center">
          <p className="text-sm text-muted-foreground truncate">
            {lastMessage?.senderId === currentUser.id ? 'You: ' : ''}
            {lastMessage?.content || (lastMessage?.attachments && lastMessage.attachments.length > 0 ? `${lastMessage.attachments[0].type === 'image' ? '📷 Image' : lastMessage.attachments[0].type === 'video' ? '📹 Video' : '📄 Document'}` : 'No messages yet')}
          </p>
          {chat.unreadCount && chat.unreadCount > 0 && (
            <span className="ml-2 bg-primary text-primary-foreground text-xs font-bold px-2 py-0.5 rounded-full">
              {chat.unreadCount}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
