
'use client'; // Add this for useState and event handling

import * as React from 'react'; // Import React for useState
import { MainLayout } from '@/components/layout/main-layout';
import { ChatListItem } from '@/components/chat/chat-list-item';
import { mockChats, getCurrentUser } from '@/lib/data';
import type { Chat } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Search, MessageCircle } from 'lucide-react';

export default function ChatsPage() {
  const chats: Chat[] = mockChats; 
  const currentUser = getCurrentUser();
  const [searchTerm, setSearchTerm] = React.useState('');

  // Sort chats by the timestamp of their last message, most recent first
  const sortedChats = [...chats].sort((a, b) => {
    const lastMessageATime = a.lastMessage?.timestamp || 0;
    const lastMessageBTime = b.lastMessage?.timestamp || 0;
    return lastMessageBTime - lastMessageATime;
  });

  const filteredChats = sortedChats.filter(chat => {
    const otherParticipant = chat.participants.find(p => p.id !== currentUser.id) || chat.participants[0];
    return otherParticipant.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <MainLayout title="Conecta Aí">
      <div className="p-3 bg-card sticky top-0 z-10 border-b">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input 
            type="search" 
            placeholder="Search chats..." 
            className="pl-10 h-10 rounded-full bg-muted border-none focus-visible:ring-primary"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <div className="flex flex-col bg-card">
        {filteredChats.length > 0 ? (
          filteredChats.map((chat) => (
            <ChatListItem key={chat.id} chat={chat} currentUser={currentUser} />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)] p-8 text-center">
            <MessageCircle className="w-16 h-16 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">
              {searchTerm ? 'Nenhum chat encontrado' : 'Nenhum chat ainda'}
            </h2>
            <p className="text-muted-foreground">
              {searchTerm ? 'Tente um termo de busca diferente.' : 'Inicie uma nova conversa a partir dos seus contatos.'}
            </p>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
