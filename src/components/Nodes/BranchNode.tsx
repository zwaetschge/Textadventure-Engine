import { NodeProps, Handle, Position } from 'reactflow';
import { BranchNodeData } from '../../types/nodes';

export function BranchNode({ data, selected }: NodeProps<BranchNodeData>) {
  return (
    <div
      className={`px-4 py-3 rounded-lg border-2 ${
        selected ? 'border-blue-400 shadow-lg' : 'border-gray-700'
      } bg-gradient-to-br from-cyan-700 to-cyan-800 text-white min-w-[160px]`}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-cyan-500"
      />

      <div className="font-bold text-sm mb-1">🔀 BRANCH</div>
      <div className="text-xs opacity-90 font-mono mb-2">
        {data.variableName || '(var)'} {data.operator} {data.value}
      </div>

      <div className="flex justify-between items-center">
        <div className="text-xs font-semibold text-green-300">TRUE</div>
        <div className="text-xs font-semibold text-red-300">FALSE</div>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        id="true"
        style={{ left: '30%' }}
        className="w-3 h-3 bg-green-500"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="false"
        style={{ left: '70%' }}
        className="w-3 h-3 bg-red-500"
      />
    </div>
  );
}
