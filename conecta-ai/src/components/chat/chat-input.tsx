
'use client';

import { useState, useRef, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Paperclip, Send, SmilePlus, Image as ImageIcon, Film } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import { PdfIcon, DocxIcon } from '@/components/icons/custom-icons';
import Picker, { EmojiClickData, EmojiStyle, Theme as EmojiTheme } from 'emoji-picker-react';

interface ChatInputProps {
  onSendMessage: (content: string, attachments?: File[]) => void; // attachments for future use
}

export function ChatInput({ onSendMessage }: ChatInputProps) {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();
  const [emojiPopoverOpen, setEmojiPopoverOpen] = useState(false);

  const handleEmojiPickerSelect = (emojiData: EmojiClickData) => {
    setMessage((prevMessage) => prevMessage + emojiData.emoji);
    textareaRef.current?.focus();
    setEmojiPopoverOpen(false);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (message.trim() === '') return;
    onSendMessage(message.trim());
    setMessage('');
  };
  
  const handleAttachment = (type: 'image' | 'video' | 'pdf' | 'docx') => {
    toast({
      title: `Attach ${type}`,
      description: `File selection for ${type} would open here. (UI only)`,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="sticky bottom-0 left-0 right-0 bg-card border-t border-border p-3 z-20">
      <div className="flex items-end gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" type="button" className="shrink-0 text-muted-foreground hover:text-primary">
              <Paperclip className="h-6 w-6" />
              <span className="sr-only">Attach file</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-2 grid grid-cols-2 gap-2">
            <Button variant="outline" className="flex flex-col h-auto p-3 gap-1" onClick={() => handleAttachment('image')}>
              <ImageIcon className="h-6 w-6 text-purple-500"/> <span className="text-xs">Image</span>
            </Button>
            <Button variant="outline" className="flex flex-col h-auto p-3 gap-1" onClick={() => handleAttachment('video')}>
              <Film className="h-6 w-6 text-orange-500"/> <span className="text-xs">Video</span>
            </Button>
            <Button variant="outline" className="flex flex-col h-auto p-3 gap-1" onClick={() => handleAttachment('pdf')}>
              <PdfIcon className="h-6 w-6 text-red-500"/> <span className="text-xs">PDF</span>
            </Button>
            <Button variant="outline" className="flex flex-col h-auto p-3 gap-1" onClick={() => handleAttachment('docx')}>
              <DocxIcon className="h-6 w-6 text-blue-500"/> <span className="text-xs">DOCX</span>
            </Button>
          </PopoverContent>
        </Popover>

        <Popover open={emojiPopoverOpen} onOpenChange={setEmojiPopoverOpen}>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" type="button" className="shrink-0 text-muted-foreground hover:text-primary">
              <SmilePlus className="h-6 w-6" />
              <span className="sr-only">Add emoji</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-0 w-full sm:w-auto border-none shadow-none">
            <Picker 
              onEmojiClick={handleEmojiPickerSelect} 
              theme={EmojiTheme.AUTO} 
              emojiStyle={EmojiStyle.NATIVE}
              width="100%"
              height={350}
              searchDisabled // Disable search for a cleaner look in popover, can be enabled if needed
              previewConfig={{showPreview: false}} // Disable preview for a cleaner look
            />
          </PopoverContent>
        </Popover>

        <Textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 min-h-[44px] max-h-28 resize-none rounded-full px-4 py-2.5 text-sm border-input focus-visible:ring-1 focus-visible:ring-primary"
          rows={1}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
        />
        <Button type="submit" size="icon" className="shrink-0 bg-primary hover:bg-primary/90 rounded-full w-11 h-11" disabled={message.trim() === ''}>
          <Send className="h-5 w-5 text-primary-foreground" />
          <span className="sr-only">Send message</span>
        </Button>
      </div>
    </form>
  );
}
