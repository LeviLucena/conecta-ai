
'use client'; // Add this for useState and event handling

import * as React from 'react'; // Import React for useState
import { MainLayout } from '@/components/layout/main-layout';
import { CallListItem } from '@/components/call/call-list-item';
import { mockCalls } from '@/lib/data';
import type { Call } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Search, PhoneMissed as NoCallsIcon } from 'lucide-react';

export default function CallsPage() {
  const calls: Call[] = mockCalls;
  const [searchTerm, setSearchTerm] = React.useState('');

  // Sort calls by timestamp, most recent first
  const sortedCalls = [...calls].sort((a, b) => b.timestamp - a.timestamp);

  const filteredCalls = sortedCalls.filter(call =>
    call.contact.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <MainLayout title="Calls">
       <div className="p-3 bg-card sticky top-0 z-10 border-b">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input 
            type="search" 
            placeholder="Search calls..." 
            className="pl-10 h-10 rounded-full bg-muted border-none focus-visible:ring-primary"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <div className="flex flex-col bg-card">
        {filteredCalls.length > 0 ? (
          filteredCalls.map((call) => (
            <CallListItem key={call.id} call={call} />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)] p-8 text-center">
            <NoCallsIcon className="w-16 h-16 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">
              {searchTerm ? 'Nenhuma chamada encontrada' : 'Nenhum Histórico de Chamadas'}
            </h2>
            <p className="text-muted-foreground">
              {searchTerm ? 'Tente um termo de busca diferente.' : 'Suas chamadas recentes aparecerão aqui.'}
            </p>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
