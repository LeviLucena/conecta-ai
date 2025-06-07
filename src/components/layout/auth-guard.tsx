
'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isInitialCheckComplete, setIsInitialCheckComplete] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Efeito para a verificação inicial de autenticação no mount
    if (typeof window !== 'undefined') {
      const hasRegistered = localStorage.getItem('hasRegisteredConnectify') === 'true';
      setIsAuthenticated(hasRegistered);
      setIsInitialCheckComplete(true);
    }
  }, []); // Executa uma vez no mount

  useEffect(() => {
    // Efeito para manter isAuthenticated sincronizado com localStorage quando pathname muda,
    // mas apenas *após* a verificação inicial estar completa.
    if (isInitialCheckComplete && typeof window !== 'undefined') {
      const hasRegistered = localStorage.getItem('hasRegisteredConnectify') === 'true';
      // Só atualiza se for diferente, para evitar re-renderizações desnecessárias
      if (hasRegistered !== isAuthenticated) {
        setIsAuthenticated(hasRegistered);
      }
    }
  }, [pathname, isInitialCheckComplete, isAuthenticated]); // Reavalia se o caminho muda ou a verificação inicial é concluída

  useEffect(() => {
    // Lógica de redirecionamento, só executa após a verificação inicial estar completa.
    if (isInitialCheckComplete) {
      if (!isAuthenticated && pathname !== '/signup') {
        router.replace('/signup');
      } else if (isAuthenticated && pathname === '/signup') {
        router.replace('/');
      }
    }
  }, [isInitialCheckComplete, isAuthenticated, pathname, router]);

  if (!isInitialCheckComplete) {
    // Loader para a verificação inicial.
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  // Se a verificação inicial estiver completa, mas o redirecionamento for necessário:
  if (!isAuthenticated && pathname !== '/signup') {
    // Usuário não autenticado tentando acessar uma página protegida
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (isAuthenticated && pathname === '/signup') {
    // Usuário autenticado tentando acessar a página de signup
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  // Se nenhuma verificação estiver pendente e nenhum redirecionamento for necessário para o caminho atual, renderiza os filhos.
  return <>{children}</>;
}
