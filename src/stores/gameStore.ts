import { create } from 'zustand';

interface GameState {
  // Current playback state
  currentNodeId: string | null;
  isPlaying: boolean;

  // Game variables
  variables: Record<string, any>;

  // Visual state
  currentBackground: string | null;
  characterLeft: string | null;
  characterCenter: string | null;
  characterRight: string | null;

  // Audio state
  currentMusic: {
    url: string;
    loop?: boolean;
    volume?: number;
  } | null;

  // Navigation history
  history: string[];

  // Actions
  setCurrentNodeId: (id: string | null) => void;
  setIsPlaying: (isPlaying: boolean) => void;

  setVariable: (name: string, value: any) => void;
  getVariable: (name: string) => any;

  setBackground: (url: string | null) => void;
  setCharacterLeft: (url: string | null) => void;
  setCharacterCenter: (url: string | null) => void;
  setCharacterRight: (url: string | null) => void;
  hideCharacter: (position: 'left' | 'center' | 'right' | 'all') => void;

  setMusic: (music: { url: string; loop?: boolean; volume?: number } | null) => void;

  pushHistory: (nodeId: string) => void;
  popHistory: () => string | undefined;

  resetGame: () => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  currentNodeId: null,
  isPlaying: false,
  variables: {},
  currentBackground: null,
  characterLeft: null,
  characterCenter: null,
  characterRight: null,
  currentMusic: null,
  history: [],

  setCurrentNodeId: (id) => set({ currentNodeId: id }),
  setIsPlaying: (isPlaying) => set({ isPlaying }),

  setVariable: (name, value) => {
    set((state) => ({
      variables: { ...state.variables, [name]: value },
    }));
  },

  getVariable: (name) => get().variables[name],

  setBackground: (url) => set({ currentBackground: url }),
  setCharacterLeft: (url) => set({ characterLeft: url }),
  setCharacterCenter: (url) => set({ characterCenter: url }),
  setCharacterRight: (url) => set({ characterRight: url }),

  hideCharacter: (position) => {
    if (position === 'all') {
      set({ characterLeft: null, characterCenter: null, characterRight: null });
    } else if (position === 'left') {
      set({ characterLeft: null });
    } else if (position === 'center') {
      set({ characterCenter: null });
    } else if (position === 'right') {
      set({ characterRight: null });
    }
  },

  setMusic: (music) => set({ currentMusic: music }),

  pushHistory: (nodeId) => {
    set((state) => ({
      history: [...state.history, nodeId],
    }));
  },

  popHistory: () => {
    const state = get();
    if (state.history.length === 0) return undefined;

    const history = [...state.history];
    const lastNode = history.pop();
    set({ history });
    return lastNode;
  },

  resetGame: () => {
    set({
      currentNodeId: null,
      isPlaying: false,
      variables: {},
      currentBackground: null,
      characterLeft: null,
      characterCenter: null,
      characterRight: null,
      currentMusic: null,
      history: [],
    });
  },
}));
