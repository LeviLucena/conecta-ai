
'use client';
import * as React from 'react';
import { MainLayout } from '@/components/layout/main-layout';
import { ContactListItem } from '@/components/contact/contact-list-item';
import { mockUsers, getCurrentUser } from '@/lib/data';
import type { User } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Search, UserPlus, Users2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AddContactForm } from '@/components/contact/add-contact-form';

export default function ContactsPage() {
  const currentUser = getCurrentUser();
  const contacts: User[] = mockUsers.filter(user => user.id !== currentUser.id);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [isAddContactOpen, setIsAddContactOpen] = React.useState(false);

  // Sort contacts alphabetically by name
  const sortedContacts = [...contacts].sort((a, b) => a.name.localeCompare(b.name));

  const filteredContacts = sortedContacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <MainLayout title="Contacts">
      <div className="p-3 bg-card sticky top-0 z-10 border-b flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input 
            type="search" 
            placeholder="Search contacts..." 
            className="pl-10 h-10 rounded-full bg-muted border-none focus-visible:ring-primary"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Dialog open={isAddContactOpen} onOpenChange={setIsAddContactOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon" className="text-primary hover:bg-primary/10">
                <UserPlus className="h-6 w-6" />
                <span className="sr-only">Add Contact</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[480px]">
            <AddContactForm onFormSubmit={() => setIsAddContactOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>
      <div className="flex flex-col bg-card">
        {filteredContacts.length > 0 ? (
          filteredContacts.map((contact) => (
            <ContactListItem key={contact.id} contact={contact} />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)] p-8 text-center">
            <Users2 className="w-16 h-16 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">
              {searchTerm ? 'Nenhum contato encontrado' : 'Nenhum Contato'}
            </h2>
            <p className="text-muted-foreground">
              {searchTerm ? 'Tente um termo de busca diferente.' : 'Adicione contatos para começar a se conectar.'}
            </p>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
