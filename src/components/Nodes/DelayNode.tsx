import { NodeProps, Handle, Position } from 'reactflow';
import { DelayNodeData } from '../../types/nodes';

export function DelayNode({ data, selected }: NodeProps<DelayNodeData>) {
  return (
    <div
      className={`px-4 py-3 rounded-lg border-2 ${
        selected ? 'border-blue-400 shadow-lg' : 'border-gray-700'
      } bg-gradient-to-br from-zinc-700 to-zinc-800 text-white min-w-[140px]`}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-zinc-500"
      />

      <div className="font-bold text-sm mb-1">⏱️ DELAY</div>
      <div className="text-xs opacity-90">
        {data.duration}ms
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 bg-zinc-500"
      />
    </div>
  );
}
