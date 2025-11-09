import { NodeProps } from 'reactflow';
import { CommentNodeData } from '../../types/nodes';

export function CommentNode({ data, selected }: NodeProps<CommentNodeData>) {
  const bgColor = data.color || '#fef3c7';

  return (
    <div
      className={`px-4 py-3 rounded-lg border-2 ${
        selected ? 'border-blue-400 shadow-lg' : 'border-gray-400'
      } text-gray-800 min-w-[200px] max-w-[300px]`}
      style={{ backgroundColor: bgColor }}
    >
      <div className="font-bold text-sm mb-1">💬 Comment</div>
      <div className="text-xs whitespace-pre-wrap">
        {data.text || '(empty comment)'}
      </div>
    </div>
  );
}
