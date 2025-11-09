import { NodeProps, Handle, Position } from 'reactflow';
import { JumpNodeData } from '../../types/nodes';

export function JumpNode({ data, selected }: NodeProps<JumpNodeData>) {
  return (
    <div
      className={`px-4 py-3 rounded-lg border-2 ${
        selected ? 'border-blue-400 shadow-lg' : 'border-gray-700'
      } bg-gradient-to-br from-violet-700 to-violet-800 text-white min-w-[140px]`}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-violet-500"
      />

      <div className="font-bold text-sm mb-1">↗️ JUMP</div>
      <div className="text-xs opacity-80 truncate max-w-[120px]">
        {data.targetNodeId || '(not set)'}
      </div>
    </div>
  );
}
