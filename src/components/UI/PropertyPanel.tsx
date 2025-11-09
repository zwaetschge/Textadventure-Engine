import { useEditorStore } from '../../stores/editorStore';
import { AssetUpload } from './AssetUpload';
import {
  SceneNodeData,
  ChoiceNodeData,
  EndNodeData,
  TextNodeData,
  BackgroundSourceNodeData,
  CharacterSourceNodeData,
  MusicSourceNodeData,
  SetVariableNodeData,
  BranchNodeData,
  RandomNodeData,
  JumpNodeData,
  CharacterNodeData,
  HideCharacterNodeData,
  BackgroundNodeData,
  MusicNodeData,
  SoundEffectNodeData,
  DelayNodeData,
  CommentNodeData,
} from '../../types/nodes';

export function PropertyPanel() {
  const { nodes, selectedNodeId, updateNode, deleteNode } = useEditorStore();

  const selectedNode = nodes.find((n) => n.id === selectedNodeId);

  if (!selectedNode) {
    return (
      <div className="w-80 bg-gray-900 border-l border-gray-700 p-4">
        <div className="text-gray-400 text-sm">
          Select a node to edit its properties
        </div>
      </div>
    );
  }

  const handleDelete = () => {
    if (confirm('Delete this node?')) {
      deleteNode(selectedNode.id);
    }
  };

  const renderProperties = () => {
    const data = selectedNode.data;

    switch (data.type) {
      case 'start':
        return <div className="text-gray-400 text-sm">Start node has no properties.</div>;

      case 'scene': {
        const sceneData = data as SceneNodeData;
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Speaker (optional)
              </label>
              <input
                type="text"
                value={sceneData.speaker || ''}
                onChange={(e) => updateNode(selectedNode.id, { speaker: e.target.value })}
                className="w-full px-3 py-2 bg-gray-800 text-white rounded"
                placeholder="Character name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Text
              </label>
              <textarea
                value={sceneData.text || ''}
                onChange={(e) => updateNode(selectedNode.id, { text: e.target.value })}
                className="w-full px-3 py-2 bg-gray-800 text-white rounded"
                rows={4}
                placeholder="Dialogue or narration..."
              />
            </div>
            <div className="text-xs text-gray-400 border-t border-gray-700 pt-2">
              💡 Connect Source nodes to this Scene to add visual elements
            </div>
          </div>
        );
      }

      case 'choice': {
        const choiceData = data as ChoiceNodeData;
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Question Text
              </label>
              <input
                type="text"
                value={choiceData.text}
                onChange={(e) => updateNode(selectedNode.id, { text: e.target.value })}
                className="w-full px-3 py-2 bg-gray-800 text-white rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Choices
              </label>
              {choiceData.choices.map((choice, index) => (
                <div key={choice.id} className="mb-2">
                  <input
                    type="text"
                    value={choice.text}
                    onChange={(e) => {
                      const newChoices = [...choiceData.choices];
                      newChoices[index] = { ...choice, text: e.target.value };
                      updateNode(selectedNode.id, { choices: newChoices });
                    }}
                    className="w-full px-3 py-2 bg-gray-800 text-white rounded"
                  />
                </div>
              ))}
              <button
                onClick={() => {
                  const newChoice = {
                    id: `choice_${Date.now()}`,
                    text: 'New choice',
                  };
                  updateNode(selectedNode.id, {
                    choices: [...choiceData.choices, newChoice],
                  });
                }}
                className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm"
              >
                + Add Choice
              </button>
            </div>
          </div>
        );
      }

      case 'end': {
        const endData = data as EndNodeData;
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Ending Text
              </label>
              <input
                type="text"
                value={endData.text}
                onChange={(e) => updateNode(selectedNode.id, { text: e.target.value })}
                className="w-full px-3 py-2 bg-gray-800 text-white rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Ending Type
              </label>
              <select
                value={endData.endingType || 'neutral'}
                onChange={(e) =>
                  updateNode(selectedNode.id, { endingType: e.target.value as any })
                }
                className="w-full px-3 py-2 bg-gray-800 text-white rounded"
              >
                <option value="good">Good</option>
                <option value="bad">Bad</option>
                <option value="neutral">Neutral</option>
              </select>
            </div>
          </div>
        );
      }

      case 'text': {
        const textData = data as TextNodeData;
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Speaker (optional)
              </label>
              <input
                type="text"
                value={textData.speaker || ''}
                onChange={(e) => updateNode(selectedNode.id, { speaker: e.target.value })}
                className="w-full px-3 py-2 bg-gray-800 text-white rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Content
              </label>
              <textarea
                value={textData.content}
                onChange={(e) => updateNode(selectedNode.id, { content: e.target.value })}
                className="w-full px-3 py-2 bg-gray-800 text-white rounded"
                rows={4}
              />
            </div>
          </div>
        );
      }

      case 'backgroundSource': {
        const bgData = data as BackgroundSourceNodeData;
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Background Image
              </label>
              <AssetUpload
                type="image"
                onUpload={(url, name) => {
                  updateNode(selectedNode.id, { image: { url, name } });
                }}
              />
              {bgData.image?.name && (
                <div className="mt-2 text-xs text-gray-400">{bgData.image.name}</div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Transition
              </label>
              <select
                value={bgData.transition || 'fade'}
                onChange={(e) =>
                  updateNode(selectedNode.id, { transition: e.target.value as any })
                }
                className="w-full px-3 py-2 bg-gray-800 text-white rounded"
              >
                <option value="fade">Fade</option>
                <option value="instant">Instant</option>
              </select>
            </div>
          </div>
        );
      }

      case 'characterSource': {
        const charData = data as CharacterSourceNodeData;
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Character Name
              </label>
              <input
                type="text"
                value={charData.name}
                onChange={(e) => updateNode(selectedNode.id, { name: e.target.value })}
                className="w-full px-3 py-2 bg-gray-800 text-white rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Expressions
              </label>
              {Object.entries(charData.expressions || {}).map(([key, asset]) => (
                <div key={key} className="mb-2 flex items-center gap-2">
                  <input
                    type="text"
                    value={key}
                    readOnly
                    className="flex-1 px-2 py-1 bg-gray-800 text-white rounded text-sm"
                  />
                  <span className="text-xs text-gray-400 truncate max-w-[100px]">
                    {asset.name}
                  </span>
                </div>
              ))}
              <div className="flex gap-2">
                <input
                  type="text"
                  id="new-expression-name"
                  placeholder="Expression name"
                  className="flex-1 px-2 py-1 bg-gray-800 text-white rounded text-sm"
                />
                <AssetUpload
                  type="image"
                  onUpload={(url, name) => {
                    const expressionName =
                      (document.getElementById('new-expression-name') as HTMLInputElement)
                        ?.value || 'default';
                    const newExpressions = {
                      ...charData.expressions,
                      [expressionName]: { url, name },
                    };
                    updateNode(selectedNode.id, { expressions: newExpressions });
                    (
                      document.getElementById('new-expression-name') as HTMLInputElement
                    ).value = '';
                  }}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Default Expression
              </label>
              <select
                value={charData.defaultExpression}
                onChange={(e) =>
                  updateNode(selectedNode.id, { defaultExpression: e.target.value })
                }
                className="w-full px-3 py-2 bg-gray-800 text-white rounded"
              >
                <option value="">Select...</option>
                {Object.keys(charData.expressions || {}).map((key) => (
                  <option key={key} value={key}>
                    {key}
                  </option>
                ))}
              </select>
            </div>
          </div>
        );
      }

      case 'musicSource': {
        const musicData = data as MusicSourceNodeData;
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Music File
              </label>
              <AssetUpload
                type="audio"
                onUpload={(url, name) => {
                  updateNode(selectedNode.id, { audio: { url, name } });
                }}
              />
              {musicData.audio?.name && (
                <div className="mt-2 text-xs text-gray-400">{musicData.audio.name}</div>
              )}
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm text-gray-300">
                <input
                  type="checkbox"
                  checked={musicData.loop ?? true}
                  onChange={(e) => updateNode(selectedNode.id, { loop: e.target.checked })}
                />
                Loop
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Volume: {Math.round((musicData.volume ?? 1) * 100)}%
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={musicData.volume ?? 1}
                onChange={(e) =>
                  updateNode(selectedNode.id, { volume: parseFloat(e.target.value) })
                }
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Fade In (ms)
              </label>
              <input
                type="number"
                value={musicData.fadeIn ?? 0}
                onChange={(e) =>
                  updateNode(selectedNode.id, { fadeIn: parseInt(e.target.value) || 0 })
                }
                className="w-full px-3 py-2 bg-gray-800 text-white rounded"
              />
            </div>
          </div>
        );
      }

      case 'setVariable': {
        const varData = data as SetVariableNodeData;
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Variable Name
              </label>
              <input
                type="text"
                value={varData.variableName}
                onChange={(e) =>
                  updateNode(selectedNode.id, { variableName: e.target.value })
                }
                className="w-full px-3 py-2 bg-gray-800 text-white rounded font-mono"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Operation
              </label>
              <select
                value={varData.operation}
                onChange={(e) =>
                  updateNode(selectedNode.id, { operation: e.target.value as any })
                }
                className="w-full px-3 py-2 bg-gray-800 text-white rounded"
              >
                <option value="set">Set (=)</option>
                <option value="add">Add (+)</option>
                <option value="subtract">Subtract (-)</option>
                <option value="multiply">Multiply (×)</option>
                <option value="divide">Divide (÷)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Value
              </label>
              <input
                type="text"
                value={varData.value}
                onChange={(e) => {
                  const val = isNaN(Number(e.target.value))
                    ? e.target.value
                    : Number(e.target.value);
                  updateNode(selectedNode.id, { value: val });
                }}
                className="w-full px-3 py-2 bg-gray-800 text-white rounded font-mono"
              />
            </div>
          </div>
        );
      }

      case 'branch': {
        const branchData = data as BranchNodeData;
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Variable Name
              </label>
              <input
                type="text"
                value={branchData.variableName}
                onChange={(e) =>
                  updateNode(selectedNode.id, { variableName: e.target.value })
                }
                className="w-full px-3 py-2 bg-gray-800 text-white rounded font-mono"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Operator
              </label>
              <select
                value={branchData.operator}
                onChange={(e) =>
                  updateNode(selectedNode.id, { operator: e.target.value as any })
                }
                className="w-full px-3 py-2 bg-gray-800 text-white rounded"
              >
                <option value="==">Equal (==)</option>
                <option value="!=">Not Equal (!=)</option>
                <option value=">">Greater Than (&gt;)</option>
                <option value="<">Less Than (&lt;)</option>
                <option value=">=">Greater or Equal (&gt;=)</option>
                <option value="<=">Less or Equal (&lt;=)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Value
              </label>
              <input
                type="text"
                value={branchData.value}
                onChange={(e) => {
                  const val = isNaN(Number(e.target.value))
                    ? e.target.value
                    : Number(e.target.value);
                  updateNode(selectedNode.id, { value: val });
                }}
                className="w-full px-3 py-2 bg-gray-800 text-white rounded font-mono"
              />
            </div>
          </div>
        );
      }

      case 'random': {
        const randomData = data as RandomNodeData;
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Outputs
              </label>
              {randomData.outputs.map((output, index) => (
                <div key={output.id} className="mb-3 p-2 bg-gray-800 rounded">
                  <div className="mb-2">
                    <input
                      type="text"
                      value={output.label || ''}
                      onChange={(e) => {
                        const newOutputs = [...randomData.outputs];
                        newOutputs[index] = { ...output, label: e.target.value };
                        updateNode(selectedNode.id, { outputs: newOutputs });
                      }}
                      placeholder="Label (optional)"
                      className="w-full px-2 py-1 bg-gray-700 text-white rounded text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400">Weight:</label>
                    <input
                      type="number"
                      min="0"
                      value={output.weight}
                      onChange={(e) => {
                        const newOutputs = [...randomData.outputs];
                        newOutputs[index] = {
                          ...output,
                          weight: parseInt(e.target.value) || 1,
                        };
                        updateNode(selectedNode.id, { outputs: newOutputs });
                      }}
                      className="w-full px-2 py-1 bg-gray-700 text-white rounded text-sm mt-1"
                    />
                  </div>
                </div>
              ))}
              <button
                onClick={() => {
                  const newOutput = {
                    id: `output_${Date.now()}`,
                    weight: 1,
                    label: `Option ${randomData.outputs.length + 1}`,
                  };
                  updateNode(selectedNode.id, {
                    outputs: [...randomData.outputs, newOutput],
                  });
                }}
                className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm"
              >
                + Add Output
              </button>
            </div>
          </div>
        );
      }

      case 'jump': {
        const jumpData = data as JumpNodeData;
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Target Node ID
              </label>
              <input
                type="text"
                value={jumpData.targetNodeId || ''}
                onChange={(e) =>
                  updateNode(selectedNode.id, { targetNodeId: e.target.value })
                }
                className="w-full px-3 py-2 bg-gray-800 text-white rounded font-mono text-sm"
                placeholder="node_id"
              />
            </div>
          </div>
        );
      }

      case 'character': {
        const charData = data as CharacterNodeData;
        return (
          <div className="space-y-4">
            <div className="text-xs text-yellow-400 border border-yellow-700 p-2 rounded">
              ⚠️ Legacy node - Consider using CharacterSource instead
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Position
              </label>
              <select
                value={charData.position}
                onChange={(e) =>
                  updateNode(selectedNode.id, { position: e.target.value as any })
                }
                className="w-full px-3 py-2 bg-gray-800 text-white rounded"
              >
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Sprite
              </label>
              <AssetUpload
                type="image"
                onUpload={(url, name) => {
                  updateNode(selectedNode.id, { sprite: { url, name } });
                }}
              />
              {charData.sprite?.name && (
                <div className="mt-2 text-xs text-gray-400">{charData.sprite.name}</div>
              )}
            </div>
          </div>
        );
      }

      case 'hideCharacter': {
        const hideData = data as HideCharacterNodeData;
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Position
              </label>
              <select
                value={hideData.position}
                onChange={(e) =>
                  updateNode(selectedNode.id, { position: e.target.value as any })
                }
                className="w-full px-3 py-2 bg-gray-800 text-white rounded"
              >
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
                <option value="all">All</option>
              </select>
            </div>
          </div>
        );
      }

      case 'background': {
        const bgData = data as BackgroundNodeData;
        return (
          <div className="space-y-4">
            <div className="text-xs text-yellow-400 border border-yellow-700 p-2 rounded">
              ⚠️ Legacy node - Consider using BackgroundSource instead
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Image
              </label>
              <AssetUpload
                type="image"
                onUpload={(url, name) => {
                  updateNode(selectedNode.id, { image: { url, name } });
                }}
              />
              {bgData.image?.name && (
                <div className="mt-2 text-xs text-gray-400">{bgData.image.name}</div>
              )}
            </div>
          </div>
        );
      }

      case 'music': {
        const musicData = data as MusicNodeData;
        return (
          <div className="space-y-4">
            <div className="text-xs text-yellow-400 border border-yellow-700 p-2 rounded">
              ⚠️ Legacy node - Consider using MusicSource instead
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Audio
              </label>
              <AssetUpload
                type="audio"
                onUpload={(url, name) => {
                  updateNode(selectedNode.id, { audio: { url, name } });
                }}
              />
              {musicData.audio?.name && (
                <div className="mt-2 text-xs text-gray-400">{musicData.audio.name}</div>
              )}
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm text-gray-300">
                <input
                  type="checkbox"
                  checked={musicData.loop ?? true}
                  onChange={(e) => updateNode(selectedNode.id, { loop: e.target.checked })}
                />
                Loop
              </label>
            </div>
          </div>
        );
      }

      case 'soundEffect': {
        const sfxData = data as SoundEffectNodeData;
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Audio
              </label>
              <AssetUpload
                type="audio"
                onUpload={(url, name) => {
                  updateNode(selectedNode.id, { audio: { url, name } });
                }}
              />
              {sfxData.audio?.name && (
                <div className="mt-2 text-xs text-gray-400">{sfxData.audio.name}</div>
              )}
            </div>
          </div>
        );
      }

      case 'delay': {
        const delayData = data as DelayNodeData;
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Duration (milliseconds)
              </label>
              <input
                type="number"
                value={delayData.duration}
                onChange={(e) =>
                  updateNode(selectedNode.id, { duration: parseInt(e.target.value) || 0 })
                }
                className="w-full px-3 py-2 bg-gray-800 text-white rounded"
              />
            </div>
          </div>
        );
      }

      case 'comment': {
        const commentData = data as CommentNodeData;
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Comment Text
              </label>
              <textarea
                value={commentData.text}
                onChange={(e) => updateNode(selectedNode.id, { text: e.target.value })}
                className="w-full px-3 py-2 bg-gray-800 text-white rounded"
                rows={4}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Background Color
              </label>
              <input
                type="color"
                value={commentData.color || '#fef3c7'}
                onChange={(e) => updateNode(selectedNode.id, { color: e.target.value })}
                className="w-full h-10 bg-gray-800 rounded"
              />
            </div>
          </div>
        );
      }

      default:
        return <div className="text-gray-400 text-sm">Unknown node type</div>;
    }
  };

  return (
    <div className="w-80 bg-gray-900 border-l border-gray-700 p-4 overflow-y-auto">
      <div className="mb-4">
        <h2 className="text-lg font-bold text-white mb-1">Properties</h2>
        <div className="text-sm text-gray-400">
          {selectedNode.data.type} • {selectedNode.id}
        </div>
      </div>

      {renderProperties()}

      <div className="mt-6 pt-4 border-t border-gray-700">
        <button
          onClick={handleDelete}
          className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded"
        >
          Delete Node
        </button>
      </div>
    </div>
  );
}
