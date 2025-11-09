import { create } from 'zustand';
import { Edge, addEdge, Connection, EdgeChange, NodeChange, applyNodeChanges, applyEdgeChanges } from 'reactflow';
import { CustomNodeData, CustomNode, AssetFile, ProjectFile } from '../types/nodes';

interface EditorState {
  // Node graph
  nodes: CustomNode[];
  edges: Edge[];

  // Assets
  images: AssetFile[];
  audio: AssetFile[];

  // UI state
  selectedNodeId: string | null;
  isPlaying: boolean;

  // Actions
  setNodes: (nodes: CustomNode[]) => void;
  setEdges: (edges: Edge[]) => void;
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;

  addNode: (node: CustomNode) => void;
  updateNode: (id: string, data: Partial<CustomNodeData>) => void;
  deleteNode: (id: string) => void;

  addImage: (image: AssetFile) => void;
  addAudio: (audio: AssetFile) => void;

  setSelectedNodeId: (id: string | null) => void;
  setIsPlaying: (isPlaying: boolean) => void;

  // Project management
  exportProject: () => ProjectFile;
  importProject: (project: ProjectFile) => void;
  clearProject: () => void;
}

export const useEditorStore = create<EditorState>((set, get) => ({
  nodes: [],
  edges: [],
  images: [],
  audio: [],
  selectedNodeId: null,
  isPlaying: false,

  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),

  onNodesChange: (changes) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes) as CustomNode[],
    });
  },

  onEdgesChange: (changes) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },

  onConnect: (connection) => {
    set({
      edges: addEdge(connection, get().edges),
    });
  },

  addNode: (node) => {
    set({ nodes: [...get().nodes, node] });
  },

  updateNode: (id, data) => {
    set({
      nodes: get().nodes.map((node) =>
        node.id === id
          ? { ...node, data: { ...node.data, ...data } as CustomNodeData }
          : node
      ),
    });
  },

  deleteNode: (id) => {
    set({
      nodes: get().nodes.filter((node) => node.id !== id),
      edges: get().edges.filter(
        (edge) => edge.source !== id && edge.target !== id
      ),
    });
  },

  addImage: (image) => {
    set({ images: [...get().images, image] });
  },

  addAudio: (audio) => {
    set({ audio: [...get().audio, audio] });
  },

  setSelectedNodeId: (id) => set({ selectedNodeId: id }),
  setIsPlaying: (isPlaying) => set({ isPlaying }),

  exportProject: () => {
    const state = get();
    return {
      version: '1.0.0',
      nodes: state.nodes,
      edges: state.edges,
      assets: {
        images: state.images,
        audio: state.audio,
      },
      metadata: {
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    };
  },

  importProject: (project) => {
    set({
      nodes: project.nodes,
      edges: project.edges,
      images: project.assets.images,
      audio: project.assets.audio,
    });
  },

  clearProject: () => {
    set({
      nodes: [],
      edges: [],
      images: [],
      audio: [],
      selectedNodeId: null,
    });
  },
}));
