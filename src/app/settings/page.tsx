
'use client';

import * as React from 'react';
import { MainLayout } from '@/components/layout/main-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { getCurrentUser, updateCurrentUserSettings } from '@/lib/data';
import type { User } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Camera, Save, User as UserIcon, Loader2 } from 'lucide-react'; // Added Save, UserIcon, Loader2

const getInitials = (name: string = '') => {
  if (!name) return '';
  const names = name.split(' ');
  if (names.length > 1 && names[0] && names[1]) {
    return `${names[0][0]}${names[1][0]}`.toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

export default function SettingsPage() {
  const { toast } = useToast();
  const [currentUser, setCurrentUser] = React.useState<User | null>(null);
  const [name, setName] = React.useState('');
  const [statusMessage, setStatusMessage] = React.useState('');
  const [avatarPreview, setAvatarPreview] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSaving, setIsSaving] = React.useState(false);

  React.useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      setCurrentUser(user);
      setName(user.name);
      setStatusMessage(user.statusMessage || '');
      setAvatarPreview(user.avatarUrl || null);
    }
    setIsLoading(false);
  }, []);

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // Limit file size to 2MB
        toast({
          title: "Arquivo muito grande",
          description: "Por favor, selecione uma imagem menor que 2MB.",
          variant: "destructive",
        });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (!currentUser) return;
    setIsSaving(true);

    const updatedSettings: { name?: string; avatarUrl?: string; statusMessage?: string } = {};
    
    let changesMade = false;
    if (name.trim() && name.trim() !== currentUser.name) {
      updatedSettings.name = name.trim();
      changesMade = true;
    }
    if (avatarPreview && avatarPreview !== currentUser.avatarUrl) {
      updatedSettings.avatarUrl = avatarPreview;
      changesMade = true;
    }
    // Allow clearing the status message
    if (statusMessage !== (currentUser.statusMessage || '')) {
      updatedSettings.statusMessage = statusMessage;
      changesMade = true;
    }
    
    if (changesMade) {
      const updatedUser = updateCurrentUserSettings(updatedSettings);
      if (updatedUser) {
        setCurrentUser(updatedUser); 
        toast({
          title: 'Perfil Atualizado',
          description: 'Suas informações de perfil foram salvas.',
        });
      } else {
        toast({
          title: 'Erro',
          description: 'Não foi possível atualizar o perfil. Por favor, tente novamente.',
          variant: 'destructive',
        });
      }
    } else {
       toast({
          title: 'Nenhuma Alteração',
          description: 'Nenhuma alteração foi feita em seu perfil.',
          variant: "default"
        });
    }
    setIsSaving(false);
  };

  if (isLoading) {
    return (
      <MainLayout title="Configurações">
        <div className="p-4 flex justify-center items-center h-full">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </MainLayout>
    );
  }
  
  if (!currentUser) {
    return (
      <MainLayout title="Configurações">
        <div className="p-4 text-center">Usuário não encontrado.</div>
      </MainLayout>
    );
  }


  return (
    <MainLayout title="Configurações">
      <div className="p-4 space-y-6">
        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <UserIcon className="h-6 w-6 text-primary" />
              <div>
                <CardTitle className="text-xl">Informações do Perfil</CardTitle>
                <CardDescription>Atualize sua foto, nome e mensagem de status.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 pt-4">
            <div className="flex flex-col items-center space-y-3">
              <div className="relative group">
                <Avatar className="h-28 w-28 text-3xl border-2 border-primary/30 shadow-md">
                  <AvatarImage src={avatarPreview || undefined} alt={name} data-ai-hint="profile picture" />
                  <AvatarFallback>{getInitials(name)}</AvatarFallback>
                </Avatar>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute bottom-1 right-1 rounded-full bg-background/80 backdrop-blur-sm group-hover:bg-muted h-9 w-9 border-primary/50 hover:border-primary"
                  onClick={() => fileInputRef.current?.click()}
                  aria-label="Mudar foto do perfil"
                >
                  <Camera className="h-5 w-5 text-primary" />
                </Button>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/png, image/jpeg, image/webp"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name" className="font-semibold text-foreground/90">Nome</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Seu Nome Completo"
                className="h-11 text-base focus:border-primary"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="statusMessage" className="font-semibold text-foreground/90">Mensagem de Status</Label>
              <Textarea
                id="statusMessage"
                value={statusMessage}
                onChange={(e) => setStatusMessage(e.target.value)}
                placeholder="Sua mensagem de status..."
                rows={3}
                className="text-base focus:border-primary"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleSave} className="w-full h-11 text-base bg-accent hover:bg-accent/90 text-accent-foreground" disabled={isSaving}>
              {isSaving ? <Loader2 className="animate-spin mr-2" /> : <Save className="mr-2 h-5 w-5" />}
              {isSaving ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
          </CardFooter>
        </Card>

         {/* Example of another settings card, can be expanded */}
        <Card className="shadow-lg">
            <CardHeader>
                <CardTitle className="text-xl">Privacidade</CardTitle>
                <CardDescription>Controle suas configurações de privacidade.</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground">Opções de privacidade apareceriam aqui.</p>
            </CardContent>
        </Card>

      </div>
    </MainLayout>
  );
}
