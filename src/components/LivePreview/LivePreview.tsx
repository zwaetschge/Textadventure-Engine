import { useEditorStore } from '../../stores/editorStore';
import {
  SceneNodeData,
  BackgroundNodeData,
} from '../../types/nodes';

export function LivePreview() {
  const { nodes, selectedNodeId } = useEditorStore();

  const selectedNode = nodes.find((n) => n.id === selectedNodeId);

  if (!selectedNode) {
    return (
      <div className="w-80 bg-gray-900 border-l border-gray-700 p-4">
        <h2 className="text-lg font-bold text-white mb-2">Live Preview</h2>
        <div className="text-gray-400 text-sm">
          Select a node to preview its visual state
        </div>
      </div>
    );
  }

  const data = selectedNode.data;

  // Simple preview for Scene nodes (legacy)
  if (data.type === 'scene') {
    const sceneData = data as SceneNodeData;
    return (
      <div className="w-80 bg-gray-900 border-l border-gray-700 p-4">
        <h2 className="text-lg font-bold text-white mb-2">Live Preview</h2>
        <div className="bg-gray-800 rounded-lg p-4 aspect-video flex flex-col justify-end">
          {sceneData.background?.url && (
            <div
              className="absolute inset-0 bg-cover bg-center rounded-lg opacity-50"
              style={{ backgroundImage: `url(${sceneData.background.url})` }}
            />
          )}
          <div className="relative bg-black bg-opacity-75 p-3 rounded">
            {sceneData.speaker && (
              <div className="font-bold text-sm text-white mb-1">
                {sceneData.speaker}
              </div>
            )}
            <div className="text-xs text-white">
              {sceneData.text || '(no text)'}
            </div>
          </div>
        </div>
        <div className="text-xs text-gray-400 mt-2">
          Note: Live preview doesn't show Source node dependencies yet
        </div>
      </div>
    );
  }

  // Preview for Text Source
  if (data.type === 'text') {
    const textData = data as any;
    return (
      <div className="w-80 bg-gray-900 border-l border-gray-700 p-4">
        <h2 className="text-lg font-bold text-white mb-2">Live Preview</h2>
        <div className="bg-gray-800 rounded-lg p-4">
          {textData.speaker && (
            <div className="font-bold text-sm text-white mb-1">
              {textData.speaker}
            </div>
          )}
          <div className="text-xs text-white">
            {textData.content || '(no text)'}
          </div>
        </div>
      </div>
    );
  }

  // Preview for Background Source
  if (data.type === 'backgroundSource' || data.type === 'background') {
    const bgData = data as BackgroundNodeData;
    return (
      <div className="w-80 bg-gray-900 border-l border-gray-700 p-4">
        <h2 className="text-lg font-bold text-white mb-2">Live Preview</h2>
        {bgData.image?.url ? (
          <div className="bg-gray-800 rounded-lg overflow-hidden aspect-video">
            <img
              src={bgData.image.url}
              alt="Background"
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="bg-gray-800 rounded-lg p-4 aspect-video flex items-center justify-center">
            <div className="text-gray-500 text-sm">No image</div>
          </div>
        )}
      </div>
    );
  }

  // Preview for Character Source
  if (data.type === 'characterSource' || data.type === 'character') {
    const charData = data as any;
    let spriteUrl = null;

    if (data.type === 'characterSource' && charData.defaultExpression) {
      spriteUrl = charData.expressions?.[charData.defaultExpression]?.url;
    } else if (data.type === 'character') {
      spriteUrl = charData.sprite?.url;
    }

    return (
      <div className="w-80 bg-gray-900 border-l border-gray-700 p-4">
        <h2 className="text-lg font-bold text-white mb-2">Live Preview</h2>
        {spriteUrl ? (
          <div className="bg-gray-800 rounded-lg overflow-hidden aspect-video flex items-end justify-center">
            <img
              src={spriteUrl}
              alt="Character"
              className="max-h-full object-contain"
            />
          </div>
        ) : (
          <div className="bg-gray-800 rounded-lg p-4 aspect-video flex items-center justify-center">
            <div className="text-gray-500 text-sm">No sprite</div>
          </div>
        )}
      </div>
    );
  }

  // Default for other nodes
  return (
    <div className="w-80 bg-gray-900 border-l border-gray-700 p-4">
      <h2 className="text-lg font-bold text-white mb-2">Live Preview</h2>
      <div className="text-gray-400 text-sm">
        No preview available for {data.type} nodes
      </div>
    </div>
  );
}
