import { NodeProps, Handle, Position } from 'reactflow';
import { SceneNodeData } from '../../types/nodes';

export function SceneNode({ data, selected }: NodeProps<SceneNodeData>) {
  return (
    <div
      className={`px-4 py-3 rounded-lg border-2 ${
        selected ? 'border-blue-400 shadow-lg' : 'border-gray-700'
      } bg-gradient-to-br from-purple-900 to-purple-950 text-white min-w-[200px]`}
    >
      {/* Input handles for data connections */}
      <Handle
        type="target"
        position={Position.Left}
        id="text"
        style={{ top: '20%', background: '#64748b' }}
        className="w-3 h-3"
      />
      <Handle
        type="target"
        position={Position.Left}
        id="background"
        style={{ top: '40%', background: '#0d9488' }}
        className="w-3 h-3"
      />
      <Handle
        type="target"
        position={Position.Left}
        id="character_left"
        style={{ top: '60%', background: '#ea580c' }}
        className="w-3 h-3"
      />
      <Handle
        type="target"
        position={Position.Left}
        id="character_center"
        style={{ top: '70%', background: '#ea580c' }}
        className="w-3 h-3"
      />
      <Handle
        type="target"
        position={Position.Left}
        id="character_right"
        style={{ top: '80%', background: '#ea580c' }}
        className="w-3 h-3"
      />
      <Handle
        type="target"
        position={Position.Left}
        id="music"
        style={{ top: '95%', background: '#db2777' }}
        className="w-3 h-3"
      />

      {/* Flow control handles */}
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-purple-500"
      />

      <div className="font-bold text-sm mb-1">🎬 SCENE</div>
      {data.text && (
        <div className="text-xs opacity-80 truncate max-w-[180px]">
          {data.speaker && <span className="font-semibold">{data.speaker}: </span>}
          {data.text}
        </div>
      )}

      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 bg-purple-500"
      />
    </div>
  );
}
