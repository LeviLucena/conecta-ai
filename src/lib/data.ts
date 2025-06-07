import type { User, Chat, Message, Call, Attachment } from './types';

export let mockUsers: User[] = [
  { id: 'user1', name: 'Alice Wonderland', avatarUrl: 'https://placehold.co/100x100.png?text=AW', status: 'online', statusMessage: 'Coding away! 💻', email: 'alice@example.com', ddi: '+1', ddd: '555', phone: '1234567' },
  { id: 'user2', name: 'Bob The Builder', avatarUrl: 'https://placehold.co/100x100.png?text=BB', status: 'offline', statusMessage: 'Busy building things.', email: 'bob@example.com', ddi: '+44', ddd: '20', phone: '9876543' },
  { id: 'user3', name: 'Charlie Chaplin', avatarUrl: 'https://placehold.co/100x100.png?text=CC', status: 'online', statusMessage: 'At the movies 🎬', email: 'charlie@example.com' },
  { id: 'user4', name: 'Diana Prince', avatarUrl: 'https://placehold.co/100x100.png?text=DP', status: 'away', statusMessage: 'Saving the world!' },
  { id: 'currentUser', name: 'Connectify User', avatarUrl: 'https://placehold.co/100x100.png?text=ME', statusMessage: 'Hey there! I am using Connectify.', email: 'you@example.com' },
];

const createMessage = (id: string, senderId: string, chatId: string, content?: string, attachments?: Attachment[], minutesAgo: number = 0, emojis?: string[]): Message => ({
  id,
  senderId,
  chatId,
  content,
  attachments,
  timestamp: Date.now() - minutesAgo * 60 * 1000,
  status: 'read',
  emojis: emojis || [],
});

export let mockMessages: Message[] = [
  createMessage('msg1', 'user1', 'chat1', 'Hey Bob, how are you?', undefined, 60, ['👍']),
  createMessage('msg2', 'currentUser', 'chat1', 'Hi Alice! I am good, thanks for asking. How about you?', undefined, 58),
  createMessage('msg3', 'user1', 'chat1', 'Doing great! Working on a new project.', undefined, 57, ['🎉']),
  createMessage('msg4', 'currentUser', 'chat1', 'Sounds exciting! What is it about?', undefined, 55),
  createMessage('msg5', 'user1', 'chat1', 'It is a secret for now 😉', undefined, 50),
  createMessage('msg6', 'currentUser', 'chat1', 'Haha, okay! Let me know when you can share.', undefined, 48, ['😄']),
  createMessage('msg7', 'user1', 'chat1', 'Sure thing!', undefined, 45),
  createMessage('msg8', 'user1', 'chat1', 'Check out this image!', [{ type: 'image', url: 'https://placehold.co/600x400.png', fileName: 'landscape.png' }], 40, ['😮']),
  createMessage('msg9', 'currentUser', 'chat1', 'Wow, beautiful!', undefined, 38),
  createMessage('msg10', 'user1', 'chat1', 'And this document.', [{ type: 'pdf', url: '#', fileName: 'project_brief.pdf' }], 35),
  
  createMessage('msg11', 'user2', 'chat2', 'Hi! Are we still on for lunch?', undefined, 120),
  createMessage('msg12', 'currentUser', 'chat2', 'Yes, absolutely! See you at 1 PM.', undefined, 118, ['👍']),
  
  createMessage('msg13', 'user3', 'chat3', 'Can you call me later?', undefined, 5),
  createMessage('msg14', 'currentUser', 'chat3', 'Sure, around 5 PM?', undefined, 3),
  createMessage('msg15', 'user3', 'chat3', 'Perfect!', undefined, 1, ['👌']),

  createMessage('msg16', 'user4', 'chat4', 'Did you see the video I sent?', [{type: 'video', url: '#', thumbnailUrl: 'https://placehold.co/300x200.png?text=Video', fileName: 'funny_cat.mp4'}], 10),
  createMessage('msg17', 'currentUser', 'chat4', 'Not yet, will watch it soon!', undefined, 8),
];

export let mockChats: Chat[] = [
  {
    id: 'chat1',
    participants: [mockUsers[0], mockUsers[4]],
    messages: mockMessages.filter(m => m.chatId === 'chat1').sort((a,b) => a.timestamp - b.timestamp),
    lastMessage: mockMessages.filter(m => m.chatId === 'chat1').sort((a,b) => b.timestamp - a.timestamp)[0],
    unreadCount: 0,
  },
  {
    id: 'chat2',
    participants: [mockUsers[1], mockUsers[4]],
    messages: mockMessages.filter(m => m.chatId === 'chat2').sort((a,b) => a.timestamp - b.timestamp),
    lastMessage: mockMessages.filter(m => m.chatId === 'chat2').sort((a,b) => b.timestamp - a.timestamp)[0],
    unreadCount: 2,
  },
  {
    id: 'chat3',
    participants: [mockUsers[2], mockUsers[4]],
    messages: mockMessages.filter(m => m.chatId === 'chat3').sort((a,b) => a.timestamp - b.timestamp),
    lastMessage: mockMessages.filter(m => m.chatId === 'chat3').sort((a,b) => b.timestamp - a.timestamp)[0],
    unreadCount: 0,
  },
  {
    id: 'chat4',
    participants: [mockUsers[3], mockUsers[4]],
    messages: mockMessages.filter(m => m.chatId === 'chat4').sort((a,b) => a.timestamp - b.timestamp),
    lastMessage: mockMessages.filter(m => m.chatId === 'chat4').sort((a,b) => b.timestamp - a.timestamp)[0],
    unreadCount: 1,
  },
];

export const mockCalls: Call[] = [
  {
    id: 'call1',
    type: 'video',
    status: 'missed',
    contact: mockUsers[0], // Alice
    timestamp: Date.now() - 2 * 60 * 60 * 1000, // 2 hours ago
  },
  {
    id: 'call2',
    type: 'audio',
    status: 'outgoing',
    contact: mockUsers[1], // Bob
    timestamp: Date.now() - 25 * 60 * 1000, // 25 minutes ago
    duration: 300, // 5 minutes
  },
  {
    id: 'call3',
    type: 'video',
    status: 'incoming',
    contact: mockUsers[2], // Charlie
    timestamp: Date.now() - 5 * 24 * 60 * 60 * 1000, // 5 days ago
    duration: 1200, // 20 minutes
  },
  {
    id: 'call4',
    type: 'audio',
    status: 'missed',
    contact: mockUsers[3], // Diana
    timestamp: Date.now() - 10 * 60 * 1000, // 10 minutes ago
  },
   {
    id: 'call5',
    type: 'audio',
    status: 'incoming',
    contact: mockUsers[0], // Alice
    timestamp: Date.now() - 3 * 24 * 60 * 60 * 1000, // 3 days ago
    duration: 600, // 10 minutes
  },
];


export const getChatById = (id: string): Chat | undefined => {
  const chat = mockChats.find(chat => chat.id === id);
  // Ensure messages are sorted when fetching
  if (chat) {
    return {
      ...chat,
      messages: [...chat.messages].sort((a, b) => a.timestamp - b.timestamp)
    };
  }
  return undefined;
};

export const getUserById = (id: string): User | undefined => mockUsers.find(user => user.id === id);
export const getCurrentUser = (): User => mockUsers.find(user => user.id === 'currentUser')!;

export function addMockUser(newUserInfo: Omit<User, 'id' | 'avatarUrl' | 'status' | 'statusMessage'>): User {
  const initials = newUserInfo.name.split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase() || '??';
  const newUser: User = {
    ...newUserInfo,
    id: `user${Date.now()}`,
    avatarUrl: `https://placehold.co/100x100.png?text=${initials}`,
    status: 'offline', // Default presence status
    statusMessage: 'Hey there! I am new to Connectify.', // Default status message
  };
  mockUsers.push(newUser);
  return newUser;
}

export function updateCurrentUserSettings(settings: { name?: string; avatarUrl?: string; statusMessage?: string }): User | null {
  const currentUserIndex = mockUsers.findIndex(user => user.id === 'currentUser');
  if (currentUserIndex !== -1) {
    const updatedUser = { ...mockUsers[currentUserIndex] };
    if (settings.name) {
      updatedUser.name = settings.name;
    }
    if (settings.avatarUrl) {
      updatedUser.avatarUrl = settings.avatarUrl;
    }
    if (settings.statusMessage !== undefined) { // Allow empty string for status message
      updatedUser.statusMessage = settings.statusMessage;
    }
    mockUsers[currentUserIndex] = updatedUser;

    // Update user in participants lists of chats (important for UI consistency)
    mockChats = mockChats.map(chat => ({
      ...chat,
      participants: chat.participants.map(p => p.id === 'currentUser' ? updatedUser : p)
    }));

    return updatedUser;
  }
  return null;
}

export function addMessageToChat(chatId: string, message: Message): void {
  const chatIndex = mockChats.findIndex(c => c.id === chatId);
  if (chatIndex !== -1) {
    const updatedChat = { ...mockChats[chatIndex] };
    updatedChat.messages = [...updatedChat.messages, message].sort((a, b) => a.timestamp - b.timestamp);
    updatedChat.lastMessage = message;
    
    // Update the message in the global mockMessages array as well
    const messageIndex = mockMessages.findIndex(m => m.id === message.id);
    if (messageIndex !== -1) {
      mockMessages[messageIndex] = message;
    } else {
      mockMessages.push(message);
    }
    mockMessages.sort((a,b) => a.timestamp - b.timestamp); // keep it sorted

    mockChats[chatIndex] = updatedChat;
  } else {
    const contactId = chatId.replace('chat_with_', '');
    const contactUser = getUserById(contactId);
    const currentUser = getCurrentUser();
    if (contactUser && currentUser) {
       const newChat: Chat = {
          id: chatId,
          participants: [contactUser, currentUser],
          messages: [message],
          lastMessage: message,
          unreadCount: 0, 
        };
        mockChats.push(newChat);
        // Add to global messages as well
        mockMessages.push(message);
        mockMessages.sort((a,b) => a.timestamp - b.timestamp);
    }
  }
}

export function toggleEmojiReaction(chatId: string, messageId: string, emoji: string): Message | undefined {
  const chatIndex = mockChats.findIndex(c => c.id === chatId);
  if (chatIndex === -1) return undefined;

  const chat = mockChats[chatIndex];
  const messageIndexInChat = chat.messages.findIndex(m => m.id === messageId);
  if (messageIndexInChat === -1) return undefined;

  const message = { ...chat.messages[messageIndexInChat] }; // Create a shallow copy
  message.emojis = message.emojis ? [...message.emojis] : []; // Ensure emojis array exists and is a copy

  const emojiIndex = message.emojis.indexOf(emoji);
  if (emojiIndex > -1) {
    message.emojis.splice(emojiIndex, 1); // Remove emoji
  } else {
    message.emojis.push(emoji); // Add emoji
  }

  // Update message in chat's messages array
  chat.messages[messageIndexInChat] = message;

  // Update message in global mockMessages array
  const messageIndexGlobal = mockMessages.findIndex(m => m.id === messageId);
  if (messageIndexGlobal !== -1) {
    mockMessages[messageIndexGlobal] = message;
  }
  
  // No need to re-sort chats or messages here as only an existing message is modified

  return message; // Return the updated message
}
