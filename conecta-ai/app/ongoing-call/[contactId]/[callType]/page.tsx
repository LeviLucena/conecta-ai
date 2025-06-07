
'use client';

import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Mic, MicOff, Video, VideoOff, PhoneOff, Volume2, ArrowLeft, Loader2 } from 'lucide-react';
import { getUserById, getCurrentUser } from '@/lib/data';
import type { User } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const getInitials = (name: string = '') => {
  const names = name.split(' ');
  if (names.length > 1) {
    return `${names[0][0]}${names[1][0]}`.toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

export default function OngoingCallPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();

  const contactId = params.contactId as string;
  const callType = params.callType as 'audio' | 'video';

  const [contact, setContact] = React.useState<User | null>(null);
  const [currentUser, setCurrentUser] = React.useState<User | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const videoRef = React.useRef<HTMLVideoElement>(null);
  const [hasPermission, setHasPermission] = React.useState(false);
  const [isMuted, setIsMuted] = React.useState(false);
  const [isCameraOff, setIsCameraOff] = React.useState(callType === 'audio'); // Camera starts off for audio calls
  const [callStatus, setCallStatus] = React.useState<'connecting' | 'connected' | 'ended'>('connecting');
  
  React.useEffect(() => {
    const const_currentUser = getCurrentUser();
    const const_contact = getUserById(contactId);
    setCurrentUser(const_currentUser);

    if (!const_contact) {
      setError('Contato não encontrado.');
      setIsLoading(false);
      return;
    }
    setContact(const_contact);

    if (callType !== 'audio' && callType !== 'video') {
      setError('Tipo de chamada inválido.');
      setIsLoading(false);
      return;
    }
    setIsLoading(false);
  }, [contactId, callType]);

  React.useEffect(() => {
    if (isLoading || error) return;

    const getPermissions = async () => {
      try {
        const constraints = {
          audio: true,
          video: callType === 'video' ? true : false,
        };
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        setHasPermission(true);
        if (videoRef.current && callType === 'video' && !isCameraOff) { // Only set srcObject if camera is not initially off
          videoRef.current.srcObject = stream;
        }
        // Simulate connection
        setTimeout(() => setCallStatus('connected'), 1500);
      } catch (err) {
        console.error('Error accessing media devices:', err);
        setHasPermission(false);
        setCallStatus('ended'); // Can't proceed without permissions
        toast({
          variant: 'destructive',
          title: 'Acesso Negado',
          description: `Por favor, habilite as permissões de ${callType === 'video' ? 'câmera e ' : ''}microfone nas configurações do seu navegador.`,
        });
      }
    };

    getPermissions();

    // Cleanup function to stop media tracks when component unmounts or call ends
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isLoading, error, callType, toast, isCameraOff]);

  const handleEndCall = () => {
    setCallStatus('ended');
    // Stop media tracks
     if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    router.back(); 
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        const audioTrack = stream.getAudioTracks()[0];
        if (audioTrack) {
          audioTrack.enabled = !audioTrack.enabled; 
        }
      }
  };
  const toggleCamera = async () => {
    if (callType === 'video') {
      const newCameraState = !isCameraOff;
      setIsCameraOff(newCameraState);
      
      if (videoRef.current) {
        const currentStream = videoRef.current.srcObject as MediaStream;
        if (newCameraState) { // Turning camera OFF
          if (currentStream) {
            currentStream.getVideoTracks().forEach(track => track.stop());
          }
          videoRef.current.srcObject = null; // Clear the video element
        } else { // Turning camera ON
          try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true }); // Request audio too, to keep mic active if needed
            videoRef.current.srcObject = stream;
            setHasPermission(true); // Ensure permission state is true
             // Ensure mic state is consistent with isMuted
            const audioTrack = stream.getAudioTracks()[0];
            if (audioTrack) {
              audioTrack.enabled = !isMuted;
            }
          } catch (err) {
            console.error("Error accessing camera:", err);
            setIsCameraOff(true); // Revert if permission denied
            setHasPermission(false);
            toast({
              variant: 'destructive',
              title: 'Camera Access Denied',
              description: 'Please enable camera permissions in your browser settings.',
            });
          }
        }
      }
    }
  };


  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-background text-foreground p-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p>Carregando chamada...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-background text-foreground p-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertTitle>Erro na Chamada</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button onClick={() => router.back()} className="mt-4">Voltar</Button>
      </div>
    );
  }
  
  const callStatusText = {
    connecting: `Chamando ${contact?.name || 'Contato'}...`,
    connected: callType === 'video' ? `Em videochamada com ${contact?.name}` : `Em chamada com ${contact?.name}`,
    ended: 'Chamada encerrada',
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      <div className="absolute top-0 left-0 p-4 z-10">
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="text-white hover:bg-white/10">
          <ArrowLeft className="h-6 w-6" />
        </Button>
      </div>
      
      <div className="flex-1 flex flex-col items-center justify-center relative overflow-hidden">
        {callType === 'video' && !isCameraOff && hasPermission ? (
          <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
        ) : (
          <div className="flex flex-col items-center">
            <Avatar className="h-32 w-32 text-5xl border-4 border-white/50 mb-4">
              <AvatarImage src={contact?.avatarUrl} alt={contact?.name} data-ai-hint="person large_avatar" />
              <AvatarFallback>{getInitials(contact?.name)}</AvatarFallback>
            </Avatar>
            <h1 className="text-2xl font-semibold">{contact?.name}</h1>
             {callType === 'video' && (isCameraOff || !hasPermission) && (
                <p className="text-sm text-gray-400 mt-2">
                    {isCameraOff && hasPermission ? "Sua câmera está desligada" : "Câmera indisponível"}
                </p>
            )}
          </div>
        )}

        {/* Dim overlay for video call when camera is off or permission is denied */}
        {callType === 'video' && (isCameraOff || !hasPermission) && (
             <div className="absolute inset-0 bg-black/50 flex items-center justify-center -z-10">
             </div>
        )}
      </div>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mt-20 md:mt-28 text-center p-2 bg-black/30 rounded-md">
         <p className="text-lg">{callStatusText[callStatus]}</p>
      </div>

      <div className="bg-gray-800/80 p-4 flex justify-around items-center fixed bottom-0 left-0 right-0 z-20 md:relative md:bg-gray-900">
        <Button 
            variant="ghost" 
            size="lg" 
            className={cn("flex flex-col h-auto p-2 text-white hover:bg-white/10 rounded-full w-16 h-16 md:w-20 md:h-20", isMuted ? "bg-white/20" : "")} 
            onClick={toggleMute}
        >
          {isMuted ? <MicOff className="h-6 w-6 md:h-8 md:w-8" /> : <Mic className="h-6 w-6 md:h-8 md:w-8" />}
          <span className="text-xs mt-1">{isMuted ? 'Ativar Som' : 'Mudo'}</span>
        </Button>

        {callType === 'video' && (
          <Button 
            variant="ghost" 
            size="lg" 
            className={cn("flex flex-col h-auto p-2 text-white hover:bg-white/10 rounded-full w-16 h-16 md:w-20 md:h-20", isCameraOff ? "bg-white/20" : "")} 
            onClick={toggleCamera}
          >
            {isCameraOff || !hasPermission ? <VideoOff className="h-6 w-6 md:h-8 md:w-8" /> : <Video className="h-6 w-6 md:h-8 md:w-8" />}
            <span className="text-xs mt-1">{isCameraOff || !hasPermission ? 'Ativar Câm.' : 'Desl. Câm.'}</span>
          </Button>
        )}
        
        <Button variant="ghost" size="lg" className="flex flex-col h-auto p-2 text-white hover:bg-white/10 rounded-full w-16 h-16 md:w-20 md:h-20">
          <Volume2 className="h-6 w-6 md:h-8 md:w-8" />
          <span className="text-xs mt-1">Viva-voz</span>
        </Button>

        <Button 
            variant="destructive" 
            size="lg" 
            className="bg-red-600 hover:bg-red-700 text-white rounded-full w-16 h-16 md:w-20 md:h-20 flex flex-col h-auto p-2" 
            onClick={handleEndCall}
        >
          <PhoneOff className="h-6 w-6 md:h-8 md:w-8" />
           <span className="text-xs mt-1">Encerrar</span>
        </Button>
      </div>
       {!hasPermission && callStatus !== 'ended' && (
         <div className="absolute bottom-24 left-1/2 -translate-x-1/2 w-full max-w-md p-4 z-30 md:bottom-32">
            <Alert variant="destructive">
              <AlertTitle>Permissão Necessária</AlertTitle>
              <AlertDescription>
                Para {callType === 'video' ? 'videochamadas' : 'chamadas de voz'}, precisamos de acesso ao seu {callType === 'video' ? 'microfone e câmera' : 'microfone'}. Por favor, habilite nas configurações do seu navegador.
              </AlertDescription>
            </Alert>
        </div>
      )}
    </div>
  );
}

    