export interface User {
  id: string;
  name: string;
  avatarUrl?: string;
  status?: 'online' | 'offline' | 'away'; // This is for presence
  statusMessage?: string; // This is for the custom status message like WhatsApp
  email?: string;
  ddi?: string;
  ddd?: string;
  phone?: string;
}

export type AttachmentType = 'image' | 'video' | 'pdf' | 'docx';

export interface Attachment {
  type: AttachmentType;
  url: string;
  fileName?: string;
  thumbnailUrl?: string; // For videos or large images
}

export interface Message {
  id: string;
  senderId: string; // Who initiated the event or sent the message
  chatId: string;
  content?: string; // Text content OR description of event
  attachments?: Attachment[];
  timestamp: number;
  status: 'sent' | 'delivered' | 'read' | 'sending' | 'failed' | 'system'; // Added 'system' status
  emojis?: string[];
  eventType?: 'call_event'; // Specific type of event
  callDetails?: {
    type: 'audio' | 'video';
    action: 'started'; // For now, just 'started'. Could expand to 'ended', 'missed'.
    // duration?: number; // Could be added if we track call end
  };
}

export interface Chat {
  id: string;
  participants: User[];
  messages: Message[];
  lastMessage?: Message;
  unreadCount?: number;
  isGroupChat?: boolean;
  groupName?: string;
  groupAvatarUrl?: string;
}

export type CallType = 'audio' | 'video';
export type CallStatus = 'outgoing' | 'incoming' | 'missed' | 'ended';

export interface Call {
  id: string;
  type: CallType;
  status: CallStatus;
  contact: User;
  timestamp: number;
  duration?: number; // in seconds
}
