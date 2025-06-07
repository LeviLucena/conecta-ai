
'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { MainLayout } from '@/components/layout/main-layout';
import { MessageBubble } from '@/components/chat/message-bubble';
import { ChatInput } from '@/components/chat/chat-input';
import { getChatById, getCurrentUser, getUserById, addMessageToChat, toggleEmojiReaction } from '@/lib/data';
import type { Chat, Message, User } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Phone, Video, MoreVertical } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from '@/components/ui/skeleton';


const getInitials = (name: string) => {
  const names = name.split(' ');
  if (names.length > 1) {
    return `${names[0][0]}${names[1][0]}`.toUpperCase();
  }
  return names[0].substring(0, 2).toUpperCase();
};

export default function ChatPage() {
  const params = useParams();
  const chatId = params.id as string;
  const router = useRouter();
  const { toast } = useToast();

  const [chat, setChat] = useState<Chat | null | undefined>(undefined); // undefined for loading state
  const [messages, setMessages] = useState<Message[]>([]);
  const currentUser = getCurrentUser();
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchChatData = useCallback(() => {
    const fetchedChat = getChatById(chatId);
    if (fetchedChat) {
      setChat(fetchedChat);
      setMessages(fetchedChat.messages);
    } else {
      const contactId = chatId.replace('chat_with_', '');
      const contactUser = getUserById(contactId);
      if(contactUser && currentUser) {
        const newChatTemplate: Chat = {
          id: chatId,
          participants: [contactUser, currentUser],
          messages: [],
          lastMessage: undefined,
          unreadCount: 0,
        };
        setChat(newChatTemplate);
        setMessages([]);
      } else {
        setChat(null); // Not found
      }
    }
  }, [chatId, currentUser]);

  useEffect(() => {
    fetchChatData();
  }, [fetchChatData]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (content: string) => {
    if (!chat || !currentUser) return; 
    const newMessage: Message = {
      id: `msg${Date.now()}`,
      senderId: currentUser.id,
      chatId: chat.id,
      content,
      timestamp: Date.now(),
      status: 'sent', 
      emojis: [],
    };
    addMessageToChat(chat.id, newMessage); 
    fetchChatData(); 
  };
  
  const handleToggleReaction = useCallback((messageId: string, emoji: string) => {
    if (!chat || !currentUser) return;
    const updatedMessage = toggleEmojiReaction(chat.id, messageId, emoji);
    if (updatedMessage) {
      setMessages(prevMessages => 
        prevMessages.map(msg => 
          msg.id === messageId ? { ...msg, emojis: updatedMessage.emojis } : msg
        )
      );
    }
  }, [chat, currentUser]);


  const handleCall = (type: 'audio' | 'video') => {
    if (!otherParticipant || !chat || !currentUser) return;
    
    // Log call event in chat history
    const callEventMessage: Message = {
      id: `evt${Date.now()}`,
      senderId: currentUser.id, 
      chatId: chat.id,
      timestamp: Date.now(),
      status: 'system',
      eventType: 'call_event',
      callDetails: {
        type: type,
        action: 'started',
      },
      content: type === 'audio' ? `${currentUser.name} iniciou uma chamada de áudio.` : `${currentUser.name} iniciou uma videochamada.`,
    };
    addMessageToChat(chat.id, callEventMessage);
    fetchChatData(); // Refresh chat data to show the event message

    // Navigate to the ongoing call page
    router.push(`/ongoing-call/${otherParticipant.id}/${type}`);
  };

  if (chat === undefined) { 
    return (
      <MainLayout title="Carregando Chat..." showBackButton>
        <div className="p-4 space-y-4">
          <Skeleton className="h-16 w-3/4 rounded-lg" />
          <Skeleton className="h-16 w-1/2 rounded-lg self-end" />
          <Skeleton className="h-20 w-2/3 rounded-lg" />
        </div>
      </MainLayout>
    );
  }

  if (!chat) {
    return (
      <MainLayout title="Chat não encontrado" showBackButton>
        <div className="p-4 text-center">Chat não encontrado ou não existe.</div>
      </MainLayout>
    );
  }

  const otherParticipant = chat.participants.find(p => p.id !== currentUser?.id) || chat.participants[0]; 

  const headerActions = (
    <>
      <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary/80" onClick={() => handleCall('audio')}>
        <Phone className="h-5 w-5" />
      </Button>
      <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary/80" onClick={() => handleCall('video')}>
        <Video className="h-5 w-5" />
      </Button>
    </>
  );
  
  const chatHeaderTitle = otherParticipant ? (
    <div className="flex items-center gap-2 -ml-2">
       <Avatar className="h-9 w-9 border-2 border-primary-foreground/50">
        <AvatarImage src={otherParticipant.avatarUrl} alt={otherParticipant.name} data-ai-hint="person avatar" />
        <AvatarFallback>{getInitials(otherParticipant.name)}</AvatarFallback>
      </Avatar>
      <div>
        <h2 className="font-semibold text-base leading-tight truncate">{otherParticipant.name}</h2>
        <p className="text-xs opacity-80 leading-tight">{otherParticipant.status || 'Offline'}</p>
      </div>
    </div>
  ) : "Chat";


  return (
    <MainLayout title={chatHeaderTitle as unknown as string} showBackButton headerActions={headerActions}>
      <div className="flex flex-col h-full">
        <div className="flex-1 overflow-y-auto pt-4 bg-background">
          {messages.map((msg) => (
            <MessageBubble
              key={msg.id}
              message={msg}
              currentUser={currentUser!} 
              sender={chat.participants.find(p => p.id === msg.senderId)}
              onToggleReaction={handleToggleReaction}
            />
          ))}
          <div ref={messagesEndRef} />
        </div>
        <ChatInput onSendMessage={handleSendMessage} />
      </div>
    </MainLayout>
  );
}
