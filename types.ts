export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
  isError?: boolean;
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
}

export interface KnowledgeBase {
  content: string;
  lastUpdated: number;
}

export enum TabView {
  CHAT = 'CHAT',
  KNOWLEDGE = 'KNOWLEDGE'
}