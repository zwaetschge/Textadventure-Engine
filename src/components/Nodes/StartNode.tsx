import { NodeProps, Handle, Position } from 'reactflow';
import { StartNodeData } from '../../types/nodes';

export function StartNode({ selected }: NodeProps<StartNodeData>) {
  return (
    <div
      className={`px-4 py-3 rounded-lg border-2 ${
        selected ? 'border-blue-400 shadow-lg' : 'border-gray-700'
      } bg-gradient-to-br from-green-900 to-green-950 text-white min-w-[120px]`}
    >
      <div className="font-bold text-center text-lg">▶ START</div>
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 bg-green-500"
      />
    </div>
  );
}
