import { NodeProps, Handle, Position } from 'reactflow';
import { EndNodeData } from '../../types/nodes';

export function EndNode({ data, selected }: NodeProps<EndNodeData>) {
  const colorMap = {
    good: 'from-green-900 to-green-950',
    bad: 'from-red-900 to-red-950',
    neutral: 'from-gray-900 to-gray-950',
  };

  const color = colorMap[data.endingType || 'neutral'];

  return (
    <div
      className={`px-4 py-3 rounded-lg border-2 ${
        selected ? 'border-blue-400 shadow-lg' : 'border-gray-700'
      } bg-gradient-to-br ${color} text-white min-w-[120px]`}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-gray-500"
      />

      <div className="font-bold text-center text-lg">■ END</div>
      <div className="text-xs text-center opacity-80 mt-1">{data.text}</div>
    </div>
  );
}
