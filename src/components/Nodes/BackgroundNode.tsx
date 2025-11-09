import { NodeProps, Handle, Position } from 'reactflow';
import { BackgroundNodeData } from '../../types/nodes';

export function BackgroundNode({ data, selected }: NodeProps<BackgroundNodeData>) {
  return (
    <div
      className={`px-4 py-3 rounded-lg border-2 ${
        selected ? 'border-blue-400 shadow-lg' : 'border-gray-700'
      } bg-gradient-to-br from-emerald-700 to-emerald-800 text-white min-w-[160px] opacity-75`}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-emerald-500"
      />

      <div className="font-bold text-sm mb-1">🖼️ BACKGROUND (Legacy)</div>
      {data.image ? (
        <div className="text-xs opacity-80 truncate max-w-[140px]">
          {data.image.name}
        </div>
      ) : (
        <div className="text-xs opacity-50">(no image)</div>
      )}

      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 bg-emerald-500"
      />
    </div>
  );
}
