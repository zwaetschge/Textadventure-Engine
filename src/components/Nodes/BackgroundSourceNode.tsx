import { NodeProps, Handle, Position } from 'reactflow';
import { BackgroundSourceNodeData } from '../../types/nodes';

export function BackgroundSourceNode({ data, selected }: NodeProps<BackgroundSourceNodeData>) {
  return (
    <div
      className={`px-4 py-3 rounded-lg border-2 ${
        selected ? 'border-blue-400 shadow-lg' : 'border-gray-700'
      } bg-gradient-to-br from-teal-700 to-teal-800 text-white min-w-[160px]`}
    >
      <div className="font-bold text-sm mb-1">🖼️ BACKGROUND</div>
      {data.image ? (
        <div className="text-xs opacity-80 truncate max-w-[140px]">
          {data.image.name}
        </div>
      ) : (
        <div className="text-xs opacity-50">(no image)</div>
      )}

      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3"
        style={{ background: '#0d9488' }}
      />
    </div>
  );
}
