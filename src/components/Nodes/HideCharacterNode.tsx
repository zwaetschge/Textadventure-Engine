import { NodeProps, Handle, Position } from 'reactflow';
import { HideCharacterNodeData } from '../../types/nodes';

export function HideCharacterNode({ data, selected }: NodeProps<HideCharacterNodeData>) {
  return (
    <div
      className={`px-4 py-3 rounded-lg border-2 ${
        selected ? 'border-blue-400 shadow-lg' : 'border-gray-700'
      } bg-gradient-to-br from-stone-700 to-stone-800 text-white min-w-[160px] opacity-75`}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-stone-500"
      />

      <div className="font-bold text-sm mb-1">👻 HIDE CHARACTER</div>
      <div className="text-xs opacity-90">
        Position: {data.position}
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 bg-stone-500"
      />
    </div>
  );
}
