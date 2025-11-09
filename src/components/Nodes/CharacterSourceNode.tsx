import { NodeProps, Handle, Position } from 'reactflow';
import { CharacterSourceNodeData } from '../../types/nodes';

export function CharacterSourceNode({ data, selected }: NodeProps<CharacterSourceNodeData>) {
  const expressionCount = Object.keys(data.expressions || {}).length;

  return (
    <div
      className={`px-4 py-3 rounded-lg border-2 ${
        selected ? 'border-blue-400 shadow-lg' : 'border-gray-700'
      } bg-gradient-to-br from-orange-700 to-orange-800 text-white min-w-[160px]`}
    >
      <div className="font-bold text-sm mb-1">👤 CHARACTER</div>
      <div className="text-xs opacity-90 font-semibold">
        {data.name || '(unnamed)'}
      </div>
      <div className="text-xs opacity-70">
        {expressionCount} expression{expressionCount !== 1 ? 's' : ''}
      </div>
      {data.defaultExpression && (
        <div className="text-xs opacity-60 truncate max-w-[140px]">
          Default: {data.defaultExpression}
        </div>
      )}

      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3"
        style={{ background: '#ea580c' }}
      />
    </div>
  );
}
