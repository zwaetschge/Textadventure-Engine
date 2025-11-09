import { NodeProps, Handle, Position } from 'reactflow';
import { CharacterNodeData } from '../../types/nodes';

export function CharacterNode({ data, selected }: NodeProps<CharacterNodeData>) {
  return (
    <div
      className={`px-4 py-3 rounded-lg border-2 ${
        selected ? 'border-blue-400 shadow-lg' : 'border-gray-700'
      } bg-gradient-to-br from-amber-700 to-amber-800 text-white min-w-[160px] opacity-75`}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-amber-500"
      />

      <div className="font-bold text-sm mb-1">👤 CHARACTER (Legacy)</div>
      <div className="text-xs opacity-90">
        Position: {data.position}
      </div>
      {data.sprite && (
        <div className="text-xs opacity-70 truncate max-w-[140px]">
          {data.sprite.name}
        </div>
      )}

      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 bg-amber-500"
      />
    </div>
  );
}
