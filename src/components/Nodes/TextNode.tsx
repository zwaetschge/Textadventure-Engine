import { NodeProps, Handle, Position } from 'reactflow';
import { TextNodeData } from '../../types/nodes';

export function TextNode({ data, selected }: NodeProps<TextNodeData>) {
  return (
    <div
      className={`px-4 py-3 rounded-lg border-2 ${
        selected ? 'border-blue-400 shadow-lg' : 'border-gray-700'
      } bg-gradient-to-br from-slate-700 to-slate-800 text-white min-w-[160px]`}
    >
      <div className="font-bold text-sm mb-1">📝 TEXT</div>
      {data.speaker && (
        <div className="text-xs font-semibold opacity-90">{data.speaker}</div>
      )}
      <div className="text-xs opacity-80 truncate max-w-[140px]">
        {data.content || '(empty)'}
      </div>

      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3"
        style={{ background: '#64748b' }}
      />
    </div>
  );
}
