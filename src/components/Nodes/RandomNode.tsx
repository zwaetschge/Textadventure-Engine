import { NodeProps, Handle, Position } from 'reactflow';
import { RandomNodeData } from '../../types/nodes';

export function RandomNode({ data, selected }: NodeProps<RandomNodeData>) {
  return (
    <div
      className={`px-4 py-3 rounded-lg border-2 ${
        selected ? 'border-blue-400 shadow-lg' : 'border-gray-700'
      } bg-gradient-to-br from-indigo-700 to-indigo-800 text-white min-w-[160px]`}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-indigo-500"
      />

      <div className="font-bold text-sm mb-2">🎲 RANDOM</div>

      <div className="space-y-1">
        {data.outputs.map((output, index) => (
          <div key={output.id} className="flex items-center gap-2">
            <div className="text-xs flex-1">
              Weight: {output.weight}
              {output.label && ` - ${output.label}`}
            </div>
            <Handle
              type="source"
              position={Position.Right}
              id={output.id}
              style={{ top: `${30 + index * 25}%` }}
              className="w-3 h-3 bg-indigo-500 relative"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
