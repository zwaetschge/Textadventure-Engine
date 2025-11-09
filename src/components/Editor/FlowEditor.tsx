import { useCallback } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  Connection,
  ConnectionMode,
  Node,
} from 'reactflow';
import 'reactflow/dist/style.css';

import { useEditorStore } from '../../stores/editorStore';
import { CustomNode } from '../../types/nodes';

// Import all node components
import { StartNode } from '../Nodes/StartNode';
import { SceneNode } from '../Nodes/SceneNode';
import { ChoiceNode } from '../Nodes/ChoiceNode';
import { EndNode } from '../Nodes/EndNode';
import { TextNode } from '../Nodes/TextNode';
import { BackgroundSourceNode } from '../Nodes/BackgroundSourceNode';
import { CharacterSourceNode } from '../Nodes/CharacterSourceNode';
import { MusicSourceNode } from '../Nodes/MusicSourceNode';
import { SetVariableNode } from '../Nodes/SetVariableNode';
import { BranchNode } from '../Nodes/BranchNode';
import { RandomNode } from '../Nodes/RandomNode';
import { JumpNode } from '../Nodes/JumpNode';
import { CharacterNode } from '../Nodes/CharacterNode';
import { HideCharacterNode } from '../Nodes/HideCharacterNode';
import { BackgroundNode } from '../Nodes/BackgroundNode';
import { MusicNode } from '../Nodes/MusicNode';
import { SoundEffectNode } from '../Nodes/SoundEffectNode';
import { DelayNode } from '../Nodes/DelayNode';
import { CommentNode } from '../Nodes/CommentNode';

// Register all node types
const nodeTypes = {
  start: StartNode,
  scene: SceneNode,
  choice: ChoiceNode,
  end: EndNode,
  text: TextNode,
  backgroundSource: BackgroundSourceNode,
  characterSource: CharacterSourceNode,
  musicSource: MusicSourceNode,
  setVariable: SetVariableNode,
  branch: BranchNode,
  random: RandomNode,
  jump: JumpNode,
  character: CharacterNode,
  hideCharacter: HideCharacterNode,
  background: BackgroundNode,
  music: MusicNode,
  soundEffect: SoundEffectNode,
  delay: DelayNode,
  comment: CommentNode,
};

// Factory function to create nodes by type
export const createNodeByType = (
  type: string,
  position: { x: number; y: number }
): CustomNode => {
  const id = `${type}_${Date.now()}`;

  const baseNode = {
    id,
    type,
    position,
  };

  switch (type) {
    case 'start':
      return { ...baseNode, data: { type: 'start' } };

    case 'scene':
      return { ...baseNode, data: { type: 'scene', text: '' } };

    case 'choice':
      return {
        ...baseNode,
        data: {
          type: 'choice',
          text: 'What do you choose?',
          choices: [
            { id: 'choice_1', text: 'Option 1' },
            { id: 'choice_2', text: 'Option 2' },
          ],
        },
      };

    case 'end':
      return {
        ...baseNode,
        data: { type: 'end', text: 'The End', endingType: 'neutral' },
      };

    case 'text':
      return { ...baseNode, data: { type: 'text', content: '', speaker: '' } };

    case 'backgroundSource':
      return {
        ...baseNode,
        data: {
          type: 'backgroundSource',
          image: { url: '', name: '' },
          transition: 'fade',
        },
      };

    case 'characterSource':
      return {
        ...baseNode,
        data: {
          type: 'characterSource',
          name: 'Character',
          expressions: {},
          defaultExpression: '',
        },
      };

    case 'musicSource':
      return {
        ...baseNode,
        data: {
          type: 'musicSource',
          audio: { url: '', name: '' },
          loop: true,
          volume: 1,
          fadeIn: 0,
        },
      };

    case 'setVariable':
      return {
        ...baseNode,
        data: {
          type: 'setVariable',
          variableName: 'var',
          operation: 'set',
          value: 0,
        },
      };

    case 'branch':
      return {
        ...baseNode,
        data: {
          type: 'branch',
          variableName: 'var',
          operator: '==',
          value: 0,
        },
      };

    case 'random':
      return {
        ...baseNode,
        data: {
          type: 'random',
          outputs: [
            { id: 'output_1', weight: 1, label: 'Option 1' },
            { id: 'output_2', weight: 1, label: 'Option 2' },
          ],
        },
      };

    case 'jump':
      return { ...baseNode, data: { type: 'jump', targetNodeId: '' } };

    case 'character':
      return {
        ...baseNode,
        data: {
          type: 'character',
          position: 'center',
          sprite: { url: '', name: '' },
          transition: 'fade',
        },
      };

    case 'hideCharacter':
      return {
        ...baseNode,
        data: {
          type: 'hideCharacter',
          position: 'center',
          transition: 'fade',
        },
      };

    case 'background':
      return {
        ...baseNode,
        data: {
          type: 'background',
          image: { url: '', name: '' },
          transition: 'fade',
        },
      };

    case 'music':
      return {
        ...baseNode,
        data: {
          type: 'music',
          audio: { url: '', name: '' },
          loop: true,
          volume: 1,
          fadeIn: 0,
        },
      };

    case 'soundEffect':
      return {
        ...baseNode,
        data: {
          type: 'soundEffect',
          audio: { url: '', name: '' },
          volume: 1,
        },
      };

    case 'delay':
      return { ...baseNode, data: { type: 'delay', duration: 1000 } };

    case 'comment':
      return { ...baseNode, data: { type: 'comment', text: '', color: '#fef3c7' } };

    default:
      throw new Error(`Unknown node type: ${type}`);
  }
};

export function FlowEditor() {
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    setSelectedNodeId,
  } = useEditorStore();

  // Connection validation
  const isValidConnection = useCallback(
    (connection: Connection) => {
      if (!connection.source || !connection.target) return false;

      const sourceNode = nodes.find((n) => n.id === connection.source);
      const targetNode = nodes.find((n) => n.id === connection.target);

      if (!sourceNode || !targetNode) return false;

      const sourceType = sourceNode.data.type;
      const targetType = targetNode.data.type;
      const targetHandle = connection.targetHandle;

      // Source nodes cannot receive flow connections (they provide data only)
      const sourceNodeTypes = ['text', 'backgroundSource', 'characterSource', 'musicSource'];
      if (sourceNodeTypes.includes(targetType) && !targetHandle) {
        return false;
      }

      // Cannot connect TO start node
      if (targetType === 'start') {
        return false;
      }

      // Data connections (horizontal, with specific handles)
      if (targetHandle) {
        // Check for duplicate connections to the same handle
        const existingConnection = edges.find(
          (edge) =>
            edge.target === connection.target &&
            edge.targetHandle === targetHandle
        );
        if (existingConnection) {
          return false; // Already has a connection to this handle
        }

        // Validate source-to-target compatibility
        if (targetHandle === 'text' && sourceType !== 'text') return false;
        if (targetHandle === 'background' && sourceType !== 'backgroundSource') return false;
        if (
          (targetHandle === 'character_left' ||
            targetHandle === 'character_center' ||
            targetHandle === 'character_right') &&
          sourceType !== 'characterSource'
        )
          return false;
        if (targetHandle === 'music' && sourceType !== 'musicSource') return false;

        return true;
      }

      // Flow connections (vertical, no specific handles)
      const validFlowSources = [
        'start',
        'scene',
        'choice',
        'branch',
        'random',
        'jump',
        'setVariable',
        'character',
        'hideCharacter',
        'background',
        'music',
        'soundEffect',
        'delay',
      ];

      const validFlowTargets = [
        'scene',
        'choice',
        'end',
        'branch',
        'random',
        'jump',
        'setVariable',
        'character',
        'hideCharacter',
        'background',
        'music',
        'soundEffect',
        'delay',
      ];

      if (!validFlowSources.includes(sourceType)) return false;
      if (!validFlowTargets.includes(targetType)) return false;

      return true;
    },
    [nodes, edges]
  );

  // Handle node selection
  const handleNodeClick = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      setSelectedNodeId(node.id);
    },
    [setSelectedNodeId]
  );

  // Handle canvas click (deselect)
  const handlePaneClick = useCallback(() => {
    setSelectedNodeId(null);
  }, [setSelectedNodeId]);

  // MiniMap node colors
  const nodeColor = (node: Node) => {
    const colorMap: Record<string, string> = {
      start: '#166534',
      scene: '#581c87',
      choice: '#854d0e',
      end: '#374151',
      text: '#64748b',
      backgroundSource: '#0d9488',
      characterSource: '#ea580c',
      musicSource: '#db2777',
      setVariable: '#1e40af',
      branch: '#0e7490',
      random: '#4338ca',
      comment: '#fef3c7',
    };
    return colorMap[node.type || ''] || '#6b7280';
  };

  return (
    <div className="w-full h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={handleNodeClick}
        onPaneClick={handlePaneClick}
        isValidConnection={isValidConnection}
        nodeTypes={nodeTypes}
        connectionMode={ConnectionMode.Loose}
        fitView
      >
        <Background />
        <Controls />
        <MiniMap nodeColor={nodeColor} zoomable pannable />
      </ReactFlow>
    </div>
  );
}
