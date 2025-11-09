import { NodeProps, Handle, Position } from 'reactflow';
import { SoundEffectNodeData } from '../../types/nodes';

export function SoundEffectNode({ data, selected }: NodeProps<SoundEffectNodeData>) {
  return (
    <div
      className={`px-4 py-3 rounded-lg border-2 ${
        selected ? 'border-blue-400 shadow-lg' : 'border-gray-700'
      } bg-gradient-to-br from-rose-700 to-rose-800 text-white min-w-[160px] opacity-75`}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-rose-500"
      />

      <div className="font-bold text-sm mb-1">🔊 SOUND EFFECT</div>
      {data.audio ? (
        <div className="text-xs opacity-80 truncate max-w-[140px]">
          {data.audio.name}
        </div>
      ) : (
        <div className="text-xs opacity-50">(no audio)</div>
      )}

      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 bg-rose-500"
      />
    </div>
  );
}
