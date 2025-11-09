import { Node } from 'reactflow';

// Asset types
export interface AssetFile {
  url: string;
  name: string;
}

// Base node data that all nodes extend
export interface BaseNodeData {
  type: string;
  label?: string;
}

// Flow Control Nodes
export interface StartNodeData extends BaseNodeData {
  type: 'start';
}

export interface SceneNodeData extends BaseNodeData {
  type: 'scene';
  text?: string;
  speaker?: string;
  background?: AssetFile;
  characterLeft?: AssetFile;
  characterCenter?: AssetFile;
  characterRight?: AssetFile;
  music?: AssetFile;
}

export interface ChoiceNodeData extends BaseNodeData {
  type: 'choice';
  text: string;
  choices: Array<{ id: string; text: string }>;
}

export interface EndNodeData extends BaseNodeData {
  type: 'end';
  text: string;
  endingType?: 'good' | 'bad' | 'neutral';
}

// Logic Nodes
export interface SetVariableNodeData extends BaseNodeData {
  type: 'setVariable';
  variableName: string;
  operation: 'set' | 'add' | 'subtract' | 'multiply' | 'divide';
  value: string | number;
}

export interface BranchNodeData extends BaseNodeData {
  type: 'branch';
  variableName: string;
  operator: '==' | '!=' | '>' | '<' | '>=' | '<=';
  value: string | number;
}

export interface RandomNodeData extends BaseNodeData {
  type: 'random';
  outputs: Array<{ id: string; weight: number; label?: string }>;
}

export interface JumpNodeData extends BaseNodeData {
  type: 'jump';
  targetNodeId?: string;
}

// Visual Nodes (Legacy)
export interface CharacterNodeData extends BaseNodeData {
  type: 'character';
  position: 'left' | 'center' | 'right';
  sprite: AssetFile;
  transition?: 'fade' | 'slide' | 'instant';
}

export interface HideCharacterNodeData extends BaseNodeData {
  type: 'hideCharacter';
  position: 'left' | 'center' | 'right' | 'all';
  transition?: 'fade' | 'instant';
}

export interface BackgroundNodeData extends BaseNodeData {
  type: 'background';
  image: AssetFile;
  transition?: 'fade' | 'instant';
}

// Audio Nodes (Legacy)
export interface MusicNodeData extends BaseNodeData {
  type: 'music';
  audio: AssetFile;
  loop?: boolean;
  volume?: number;
  fadeIn?: number;
}

export interface SoundEffectNodeData extends BaseNodeData {
  type: 'soundEffect';
  audio: AssetFile;
  volume?: number;
}

// Source Nodes (New Modular System)
export interface TextNodeData extends BaseNodeData {
  type: 'text';
  content: string;
  speaker?: string;
}

export interface BackgroundSourceNodeData extends BaseNodeData {
  type: 'backgroundSource';
  image: AssetFile;
  transition?: 'fade' | 'instant';
}

export interface CharacterSourceNodeData extends BaseNodeData {
  type: 'characterSource';
  name: string;
  expressions: Record<string, AssetFile>;  // e.g., { happy: {url, name}, sad: {url, name} }
  defaultExpression: string;
}

export interface MusicSourceNodeData extends BaseNodeData {
  type: 'musicSource';
  audio: AssetFile;
  loop?: boolean;
  volume?: number;
  fadeIn?: number;
}

// Utility Nodes
export interface DelayNodeData extends BaseNodeData {
  type: 'delay';
  duration: number;  // in milliseconds
}

export interface CommentNodeData extends BaseNodeData {
  type: 'comment';
  text: string;
  color?: string;
}

// Union type of all node data types
export type CustomNodeData =
  | StartNodeData
  | SceneNodeData
  | ChoiceNodeData
  | EndNodeData
  | SetVariableNodeData
  | BranchNodeData
  | RandomNodeData
  | JumpNodeData
  | CharacterNodeData
  | HideCharacterNodeData
  | BackgroundNodeData
  | MusicNodeData
  | SoundEffectNodeData
  | TextNodeData
  | BackgroundSourceNodeData
  | CharacterSourceNodeData
  | MusicSourceNodeData
  | DelayNodeData
  | CommentNodeData;

// Custom node type that combines React Flow Node with our data
export type CustomNode = Node<CustomNodeData>;

// Project file format
export interface ProjectFile {
  version: string;
  nodes: CustomNode[];
  edges: any[];
  assets: {
    images: AssetFile[];
    audio: AssetFile[];
  };
  metadata: {
    createdAt: string;
    updatedAt: string;
  };
}

// Resolved scene dependencies (for GamePlayer)
export interface ResolvedSceneDependencies {
  text?: string;
  speaker?: string;
  background?: string;  // URL
  characterLeft?: string;  // URL
  characterCenter?: string;  // URL
  characterRight?: string;  // URL
  music?: {
    url: string;
    loop?: boolean;
    volume?: number;
    fadeIn?: number;
  };
}
