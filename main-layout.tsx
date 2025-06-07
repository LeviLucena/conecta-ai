// src/components/layout/main-layout.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MessageCircle, Phone, Users, Settings, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

interface MainLayoutProps {
  children: React.ReactNode;
  title: string;
  showBackButton?: boolean;
  headerActions?: React.ReactNode;
}

const navItems = [
  { href: '/', label: 'Chats', icon: MessageCircle },
  { href: '/calls', label: 'Calls', icon: Phone },
  { href: '/contacts', label: 'Contacts', icon: Users },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export function MainLayout({ children, title, showBackButton = false, headerActions }: MainLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-background shadow-lg border border-border md:rounded-lg overflow-hidden">
      <header className="bg-primary text-primary-foreground p-4 flex items-center justify-between sticky top-0 z-50 h-16 shadow-md">
        <div className="flex items-center gap-2 min-w-0"> {/* Added min-w-0 for truncate to work */}
          {showBackButton && (
            <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary/80" onClick={() => router.back()}>
              <ArrowLeft className="h-6 w-6" />
            </Button>
          )}
          {typeof title === 'string' ? (
            <h1 className="text-xl font-headline font-semibold truncate">{title}</h1>
          ) : (
            <div className="text-xl font-headline font-semibold truncate">{title}</div>
          )}
        </div>
        {headerActions && <div className="flex items-center gap-2">{headerActions}</div>}
      </header>

      <main className="flex-1 overflow-y-auto p-0 pb-16 bg-background"> {/* Ensure padding bottom for nav, changed from bg-card-background */}
        {children}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-card border-t border-border shadow-t-lg h-16 z-50 md:rounded-b-lg">
        <div className="flex justify-around items-center h-full">
          {navItems.map((item) => {
            const isActive = pathname === item.href || 
                             (item.href === '/' && pathname.startsWith('/chat')) ||
                             (item.href === '/settings' && pathname === '/settings');
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex flex-col items-center justify-center p-2 rounded-lg transition-colors duration-200 w-1/4 ${isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
              >
                <item.icon className={`h-6 w-6 mb-0.5 ${isActive ? 'fill-primary/20' : ''}`} />
                <span className={`text-xs font-medium ${isActive ? 'font-semibold' : ''}`}>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
