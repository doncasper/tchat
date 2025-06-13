import { create } from 'zustand';
import type { ChatItem, ChatMessage, ChatNotification } from '../types/chat';
import type { ChatConfig } from '../types/config';

interface ChatStore {
  items: ChatItem[];
  status: 'connecting' | 'connected' | 'disconnected' | 'error';
  addMessage: (message: ChatMessage) => void;
  addNotification: (notification: ChatNotification) => void;
  removeItem: (id: string) => void;
  clearItems: () => void;
  setStatus: (status: ChatStore['status']) => void;
}

export const useChatStore = create<ChatStore>((set, get) => ({
  items: [],
  status: 'disconnected',

  addMessage: (message: ChatMessage) => {
    set(state => {
      const newItems = [...state.items, message];
      
      // Cleanup old items based on duration
      const now = Date.now();
      const filteredItems = newItems.filter(item => {
        const age = now - item.timestamp.getTime();
        return age < 100000; // Default 100 seconds
      });

      // Limit to maxMessages (default 35)
      if (filteredItems.length > 35) {
        return {
          items: filteredItems.slice(-35)
        };
      }

      return { items: filteredItems };
    });
  },

  addNotification: (notification: ChatNotification) => {
    set(state => {
      const newItems = [...state.items, notification];
      
      // Cleanup old items
      const now = Date.now();
      const filteredItems = newItems.filter(item => {
        const age = now - item.timestamp.getTime();
        return item.type === 'message' 
          ? age < 100000 // Default 100 seconds for messages
          : age < (notification.duration || 10000); // Default 10s for notifications
      });

      // Limit to maxMessages (default 35)
      if (filteredItems.length > 35) {
        return {
          items: filteredItems.slice(-35)
        };
      }

      return { items: filteredItems };
    });
  },

  removeItem: (id: string) => {
    set(state => ({
      items: state.items.filter(item => item.id !== id)
    }));
  },

  clearItems: () => set({ items: [] }),
  setStatus: (status) => set({ status })
})); 