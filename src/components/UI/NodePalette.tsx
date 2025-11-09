import { useEditorStore } from '../../stores/editorStore';
import { createNodeByType } from '../Editor/FlowEditor';

interface NodeTypeInfo {
  type: string;
  label: string;
  icon: string;
  category: string;
}

const nodeTypes: NodeTypeInfo[] = [
  // Flow Control
  { type: 'start', label: 'Start', icon: '▶', category: 'Flow Control' },
  { type: 'scene', label: 'Scene', icon: '🎬', category: 'Flow Control' },
  { type: 'choice', label: 'Choice', icon: '🔀', category: 'Flow Control' },
  { type: 'end', label: 'End', icon: '■', category: 'Flow Control' },

  // Sources
  { type: 'text', label: 'Text', icon: '📝', category: 'Sources' },
  { type: 'backgroundSource', label: 'Background', icon: '🖼️', category: 'Sources' },
  { type: 'characterSource', label: 'Character', icon: '👤', category: 'Sources' },
  { type: 'musicSource', label: 'Music', icon: '🎵', category: 'Sources' },

  // Logic
  { type: 'setVariable', label: 'Set Variable', icon: '🔢', category: 'Logic' },
  { type: 'branch', label: 'Branch', icon: '🔀', category: 'Logic' },
  { type: 'random', label: 'Random', icon: '🎲', category: 'Logic' },
  { type: 'jump', label: 'Jump', icon: '↗️', category: 'Logic' },

  // Legacy
  { type: 'character', label: 'Character (Legacy)', icon: '👤', category: 'Legacy' },
  { type: 'hideCharacter', label: 'Hide Character', icon: '👻', category: 'Legacy' },
  { type: 'background', label: 'Background (Legacy)', icon: '🖼️', category: 'Legacy' },
  { type: 'music', label: 'Music (Legacy)', icon: '🎵', category: 'Legacy' },
  { type: 'soundEffect', label: 'Sound Effect', icon: '🔊', category: 'Legacy' },

  // Utility
  { type: 'delay', label: 'Delay', icon: '⏱️', category: 'Utility' },
  { type: 'comment', label: 'Comment', icon: '💬', category: 'Utility' },
];

export function NodePalette() {
  const { addNode } = useEditorStore();

  const handleAddNode = (type: string) => {
    // Add node to center of viewport
    const position = {
      x: Math.random() * 300 + 100,
      y: Math.random() * 300 + 100,
    };
    const node = createNodeByType(type, position);
    addNode(node);
  };

  // Group nodes by category
  const categories = Array.from(new Set(nodeTypes.map((n) => n.category)));

  return (
    <div className="w-64 bg-gray-900 border-r border-gray-700 overflow-y-auto">
      <div className="p-4">
        <h2 className="text-lg font-bold text-white mb-4">Node Palette</h2>

        {categories.map((category) => (
          <div key={category} className="mb-4">
            <h3 className="text-sm font-semibold text-gray-400 mb-2">{category}</h3>
            <div className="space-y-1">
              {nodeTypes
                .filter((n) => n.category === category)
                .map((nodeType) => (
                  <button
                    key={nodeType.type}
                    onClick={() => handleAddNode(nodeType.type)}
                    className="w-full text-left px-3 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded text-sm flex items-center gap-2"
                  >
                    <span>{nodeType.icon}</span>
                    <span>{nodeType.label}</span>
                  </button>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
