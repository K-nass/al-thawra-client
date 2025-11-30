import { create } from 'zustand';

interface VideoData {
  src: string;
  poster?: string;
  title: string;
}

interface Position {
  x: number;
  y: number;
}

interface MiniViewState {
  isActive: boolean;
  videoElement: HTMLVideoElement | null;
  videoData: VideoData | null;
  position: Position;
  isDragging: boolean;
  activationCount: number;
  
  // Actions
  activate: (videoData: VideoData) => void;
  deactivate: () => void;
  setVideoElement: (element: HTMLVideoElement | null) => void;
  setPosition: (position: Position) => void;
  setIsDragging: (isDragging: boolean) => void;
}

// Default position: bottom-right corner with some padding
const DEFAULT_POSITION: Position = {
  x: typeof window !== 'undefined' ? window.innerWidth - 340 : 20,
  y: typeof window !== 'undefined' ? window.innerHeight - 640 : 20,
};

export const useMiniViewStore = create<MiniViewState>((set) => ({
  isActive: false,
  videoElement: null,
  videoData: null,
  position: DEFAULT_POSITION,
  isDragging: false,
  activationCount: 0,

  activate: (videoData: VideoData) => {
    set((state) => ({ 
      isActive: true, 
      videoData,
      // Reset position when activating
      position: {
        x: typeof window !== 'undefined' ? window.innerWidth - 340 : 20,
        y: typeof window !== 'undefined' ? window.innerHeight - 640 : 20,
      },
      activationCount: state.activationCount + 1,
    }));
  },

  deactivate: () => {
    set({ 
      isActive: false,
      // Keep videoElement so we can reattach Mini View later from the same source
      videoData: null,
      isDragging: false,
    });
  },

  setVideoElement: (element: HTMLVideoElement | null) => {
    set({ videoElement: element });
  },

  setPosition: (position: Position) => {
    set({ position });
  },

  setIsDragging: (isDragging: boolean) => {
    set({ isDragging });
  },
}));
