import { NodeProps, Handle, Position } from 'reactflow';
import { ChoiceNodeData } from '../../types/nodes';

export function ChoiceNode({ data, selected }: NodeProps<ChoiceNodeData>) {
  return (
    <div
      className={`px-4 py-3 rounded-lg border-2 ${
        selected ? 'border-blue-400 shadow-lg' : 'border-gray-700'
      } bg-gradient-to-br from-yellow-900 to-yellow-950 text-white min-w-[180px]`}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-yellow-500"
      />

      <div className="font-bold text-sm mb-2">🔀 CHOICE</div>
      <div className="text-xs mb-2 opacity-80">{data.text}</div>

      <div className="space-y-1">
        {data.choices.map((choice, index) => (
          <div key={choice.id} className="flex items-center gap-2">
            <div className="text-xs flex-1 truncate">{choice.text}</div>
            <Handle
              type="source"
              position={Position.Right}
              id={choice.id}
              style={{ top: `${30 + index * 20}%` }}
              className="w-3 h-3 bg-yellow-500 relative"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
