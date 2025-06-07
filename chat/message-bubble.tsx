import type { Message, User, Attachment } from '@/lib/types';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import Image from 'next/image';
import { Check, CheckCheck, Clock, AlertCircle, FileText, Film, Download, SmilePlus, Phone, Video as VideoIcon } from 'lucide-react'; // Renamed Video to VideoIcon
import { PdfIcon, DocxIcon } from '@/components/icons/custom-icons';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import Picker, { EmojiClickData, EmojiStyle, Theme as EmojiTheme } from 'emoji-picker-react';
import * as React from 'react';


interface MessageBubbleProps {
  message: Message;
  currentUser: User;
  sender?: User;
  onToggleReaction: (messageId: string, emoji: string) => void;
}

const AttachmentPreview = ({ attachment }: { attachment: Attachment }) => {
  const commonImageClass = "rounded-md object-cover max-w-xs max-h-60";
  switch (attachment.type) {
    case 'image':
      return <Image src={attachment.url} alt={attachment.fileName || 'Image attachment'} width={300} height={200} className={commonImageClass} data-ai-hint="photo message" />;
    case 'video':
      return (
        <div className="relative max-w-xs bg-black rounded-md overflow-hidden">
          {attachment.thumbnailUrl ? (
            <Image src={attachment.thumbnailUrl} alt={attachment.fileName || 'Video thumbnail'} width={300} height={180} className="object-cover opacity-70" data-ai-hint="video play" />
          ) : (
            <div className="w-[300px] h-[180px] bg-muted flex items-center justify-center rounded-md">
              <Film className="w-12 h-12 text-muted-foreground" />
            </div>
          )}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-black/50 p-3 rounded-full">
              <Film className="w-8 h-8 text-white" />
            </div>
          </div>
          {attachment.fileName && <p className="text-xs text-white bg-black/70 p-1 absolute bottom-1 left-1 rounded">{attachment.fileName}</p>}
        </div>
      );
    case 'pdf':
      return (
        <div className="flex items-center gap-2 p-2 border rounded-md bg-secondary/30 hover:bg-secondary/50 transition-colors cursor-pointer min-w-[200px]">
          <PdfIcon className="w-8 h-8 text-red-600 flex-shrink-0" />
          <div className="truncate">
            <p className="text-sm font-medium truncate">{attachment.fileName || 'PDF Document'}</p>
            <p className="text-xs text-muted-foreground">PDF File</p>
          </div>
          <Download className="w-5 h-5 text-muted-foreground ml-auto"/>
        </div>
      );
    case 'docx':
      return (
        <div className="flex items-center gap-2 p-2 border rounded-md bg-secondary/30 hover:bg-secondary/50 transition-colors cursor-pointer min-w-[200px]">
          <DocxIcon className="w-8 h-8 text-blue-600 flex-shrink-0" />
          <div className="truncate">
            <p className="text-sm font-medium truncate">{attachment.fileName || 'Word Document'}</p>
            <p className="text-xs text-muted-foreground">DOCX File</p>
          </div>
           <Download className="w-5 h-5 text-muted-foreground ml-auto"/>
        </div>
      );
    default:
      return (
         <div className="flex items-center gap-2 p-2 border rounded-md bg-secondary/30 hover:bg-secondary/50 transition-colors cursor-pointer min-w-[200px]">
          <FileText className="w-8 h-8 text-muted-foreground flex-shrink-0" />
           <div className="truncate">
            <p className="text-sm font-medium truncate">{attachment.fileName || 'File'}</p>
            <p className="text-xs text-muted-foreground">Attachment</p>
          </div>
          <Download className="w-5 h-5 text-muted-foreground ml-auto"/>
        </div>
      );
  }
};

const MessageStatusIcon = ({ status }: { status: Message['status'] }) => {
  if (status === 'sending') return <Clock className="h-3.5 w-3.5 text-muted-foreground" />;
  if (status === 'sent') return <Check className="h-3.5 w-3.5 text-muted-foreground" />;
  if (status === 'delivered') return <CheckCheck className="h-3.5 w-3.5 text-muted-foreground" />;
  if (status === 'read') return <CheckCheck className="h-3.5 w-3.5 text-accent" />; // Use accent for read
  if (status === 'failed') return <AlertCircle className="h-3.5 w-3.5 text-destructive" />;
  // No icon for 'system' status by default here, handled in main bubble render
  return null;
};


export function MessageBubble({ message, currentUser, sender, onToggleReaction }: MessageBubbleProps) {
  const isSentByCurrentUser = message.senderId === currentUser.id;
  const [emojiPopoverOpen, setEmojiPopoverOpen] = React.useState(false);

  const handleEmojiSelect = (emojiData: EmojiClickData) => {
    onToggleReaction(message.id, emojiData.emoji);
    setEmojiPopoverOpen(false);
  };
  
  const handleReactionClick = (emoji: string) => {
    onToggleReaction(message.id, emoji);
  };

  if (message.status === 'system' && message.eventType === 'call_event' && message.callDetails) {
    const CallIcon = message.callDetails.type === 'audio' ? Phone : VideoIcon;
    const callActionText = message.callDetails.action === 'started' ? 'started' : 'ended'; // Example for future expansion
    let initiatorName = "Someone";
    if (message.senderId === currentUser.id) {
      initiatorName = "You";
    } else if (sender) {
      initiatorName = sender.name.split(' ')[0]; // First name
    }
    
    const callDescription = message.content || `${initiatorName} ${callActionText} a ${message.callDetails.type} call.`;

    return (
      <div className="flex justify-center items-center my-2 mx-3">
        <div className="text-xs text-muted-foreground bg-secondary py-1 px-3 rounded-full flex items-center gap-1.5 shadow-sm">
          <CallIcon className="h-3.5 w-3.5" />
          <span>{callDescription}</span>
          <span className="opacity-70">{format(new Date(message.timestamp), 'HH:mm')}</span>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('flex mb-1 px-3 group relative', isSentByCurrentUser ? 'justify-end' : 'justify-start')}>
      <div
        className={cn(
          'max-w-[70%] p-2.5 rounded-xl shadow-sm relative', 
          isSentByCurrentUser
            ? 'bg-primary text-primary-foreground rounded-br-none'
            : 'bg-card text-card-foreground border border-border rounded-bl-none'
        )}
      >
        {!isSentByCurrentUser && sender && (
          <p className="text-xs font-semibold mb-0.5 opacity-80">{sender.name}</p>
        )}
        {message.attachments && message.attachments.length > 0 && (
          <div className="space-y-2 my-1">
            {message.attachments.map((att, index) => (
              <AttachmentPreview key={index} attachment={att} />
            ))}
          </div>
        )}
        {message.content && <p className="whitespace-pre-wrap break-words">{message.content}</p>}
        
        <div className={cn('flex items-center gap-1 mt-1', isSentByCurrentUser ? 'justify-end' : 'justify-start')}>
          <p className="text-xs opacity-70">{format(new Date(message.timestamp), 'HH:mm')}</p>
          {isSentByCurrentUser && <MessageStatusIcon status={message.status} />}
        </div>

        {message.emojis && message.emojis.length > 0 && (
          <div className={cn(
            "flex flex-wrap gap-1 mt-1.5 px-1 py-0.5 rounded-full w-fit",
            isSentByCurrentUser ? "bg-primary/80" : "bg-muted"
            )}>
            {message.emojis.map((emoji, index) => (
              <button
                key={index}
                onClick={() => handleReactionClick(emoji)}
                className={cn(
                  "text-xs p-0.5 rounded hover:bg-opacity-50",
                  isSentByCurrentUser ? "hover:bg-primary-foreground/20" : "hover:bg-foreground/10"
                )}
                title={`React with ${emoji}`}
              >
                {emoji}
              </button>
            ))}
          </div>
        )}
      </div>
      <Popover open={emojiPopoverOpen} onOpenChange={setEmojiPopoverOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "absolute -top-3 p-1 rounded-full bg-card border shadow-md h-7 w-7 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity",
              isSentByCurrentUser ? "right-1" : "left-1"
            )}
          >
            <SmilePlus className={cn("h-4 w-4", isSentByCurrentUser ? "text-primary" : "text-muted-foreground")} />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0 w-auto border-none shadow-lg z-30">
           <Picker 
              onEmojiClick={handleEmojiSelect} 
              theme={EmojiTheme.AUTO} 
              emojiStyle={EmojiStyle.NATIVE}
              width="100%"
              height={300}
              searchDisabled
              previewConfig={{showPreview: false}}
            />
        </PopoverContent>
      </Popover>
    </div>
  );
}
