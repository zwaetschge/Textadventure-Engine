import { NodeProps, Handle, Position } from 'reactflow';
import { MusicSourceNodeData } from '../../types/nodes';

export function MusicSourceNode({ data, selected }: NodeProps<MusicSourceNodeData>) {
  return (
    <div
      className={`px-4 py-3 rounded-lg border-2 ${
        selected ? 'border-blue-400 shadow-lg' : 'border-gray-700'
      } bg-gradient-to-br from-pink-700 to-pink-800 text-white min-w-[160px]`}
    >
      <div className="font-bold text-sm mb-1">🎵 MUSIC</div>
      {data.audio ? (
        <>
          <div className="text-xs opacity-80 truncate max-w-[140px]">
            {data.audio.name}
          </div>
          <div className="text-xs opacity-60">
            {data.loop ? '🔁 Loop' : '▶️ Once'}
            {data.volume !== undefined && ` • ${Math.round(data.volume * 100)}%`}
          </div>
        </>
      ) : (
        <div className="text-xs opacity-50">(no audio)</div>
      )}

      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3"
        style={{ background: '#db2777' }}
      />
    </div>
  );
}
