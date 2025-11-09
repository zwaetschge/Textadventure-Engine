import { NodeProps, Handle, Position } from 'reactflow';
import { SetVariableNodeData } from '../../types/nodes';

export function SetVariableNode({ data, selected }: NodeProps<SetVariableNodeData>) {
  const operationSymbols = {
    set: '=',
    add: '+',
    subtract: '-',
    multiply: '×',
    divide: '÷',
  };

  return (
    <div
      className={`px-4 py-3 rounded-lg border-2 ${
        selected ? 'border-blue-400 shadow-lg' : 'border-gray-700'
      } bg-gradient-to-br from-blue-700 to-blue-800 text-white min-w-[160px]`}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-blue-500"
      />

      <div className="font-bold text-sm mb-1">🔢 SET VARIABLE</div>
      <div className="text-xs opacity-90 font-mono">
        {data.variableName || '(var)'} {operationSymbols[data.operation]} {data.value}
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 bg-blue-500"
      />
    </div>
  );
}
