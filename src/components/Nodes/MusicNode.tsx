import { NodeProps, Handle, Position } from 'reactflow';
import { MusicNodeData } from '../../types/nodes';

export function MusicNode({ data, selected }: NodeProps<MusicNodeData>) {
  return (
    <div
      className={`px-4 py-3 rounded-lg border-2 ${
        selected ? 'border-blue-400 shadow-lg' : 'border-gray-700'
      } bg-gradient-to-br from-fuchsia-700 to-fuchsia-800 text-white min-w-[160px] opacity-75`}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-fuchsia-500"
      />

      <div className="font-bold text-sm mb-1">🎵 MUSIC (Legacy)</div>
      {data.audio ? (
        <>
          <div className="text-xs opacity-80 truncate max-w-[140px]">
            {data.audio.name}
          </div>
          <div className="text-xs opacity-60">
            {data.loop ? '🔁 Loop' : '▶️ Once'}
          </div>
        </>
      ) : (
        <div className="text-xs opacity-50">(no audio)</div>
      )}

      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 bg-fuchsia-500"
      />
    </div>
  );
}
