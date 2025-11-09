import { useEffect, useState, useRef } from 'react';
import { useEditorStore } from '../../stores/editorStore';
import { useGameStore } from '../../stores/gameStore';
import {
  CustomNode,
  ResolvedSceneDependencies,
  SceneNodeData,
  ChoiceNodeData,
  EndNodeData,
  SetVariableNodeData,
  BranchNodeData,
  RandomNodeData,
  CharacterNodeData,
  BackgroundNodeData,
  MusicNodeData,
  TextNodeData,
  BackgroundSourceNodeData,
  CharacterSourceNodeData,
  MusicSourceNodeData,
} from '../../types/nodes';
import { Edge } from 'reactflow';

export function GamePlayer() {
  const { nodes, edges, setIsPlaying: setEditorPlaying } = useEditorStore();
  const {
    currentNodeId,
    setCurrentNodeId,
    setIsPlaying,
    variables,
    setVariable,
    currentBackground,
    characterLeft,
    characterCenter,
    characterRight,
    setBackground,
    setCharacterLeft,
    setCharacterCenter,
    setCharacterRight,
    hideCharacter,
    setMusic,
    pushHistory,
    popHistory,
    resetGame,
  } = useGameStore();

  const [currentText, setCurrentText] = useState('');
  const [currentSpeaker, setCurrentSpeaker] = useState('');
  const [currentChoices, setCurrentChoices] = useState<
    Array<{ id: string; text: string }>
  >([]);
  const [isWaitingForInput, setIsWaitingForInput] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize game on mount
  useEffect(() => {
    resetGame();
    const startNode = nodes.find((n) => n.data.type === 'start');
    if (startNode) {
      const nextEdge = edges.find((e) => e.source === startNode.id);
      if (nextEdge) {
        setCurrentNodeId(nextEdge.target);
      }
    }
  }, []);

  // Process current node
  useEffect(() => {
    if (!currentNodeId) return;

    const node = nodes.find((n) => n.id === currentNodeId);
    if (!node) return;

    processNode(node);
  }, [currentNodeId]);

  // Resolve dependencies for Scene nodes
  const resolveDependencies = (
    nodeId: string,
    nodes: CustomNode[],
    edges: Edge[]
  ): ResolvedSceneDependencies => {
    const incomingEdges = edges.filter((e) => e.target === nodeId);
    const dependencies: ResolvedSceneDependencies = {};

    for (const edge of incomingEdges) {
      const sourceNode = nodes.find((n) => n.id === edge.source);
      if (!sourceNode) continue;

      const targetHandle = edge.targetHandle;

      if (targetHandle === 'text' && sourceNode.data.type === 'text') {
        const textData = sourceNode.data as TextNodeData;
        dependencies.text = textData.content;
        dependencies.speaker = textData.speaker;
      } else if (targetHandle === 'background' && sourceNode.data.type === 'backgroundSource') {
        const bgData = sourceNode.data as BackgroundSourceNodeData;
        dependencies.background = bgData.image?.url;
      } else if (
        (targetHandle === 'character_left' ||
          targetHandle === 'character_center' ||
          targetHandle === 'character_right') &&
        sourceNode.data.type === 'characterSource'
      ) {
        const charData = sourceNode.data as CharacterSourceNodeData;
        const expression = charData.expressions[charData.defaultExpression];
        const characterUrl = expression?.url;

        if (targetHandle === 'character_left') dependencies.characterLeft = characterUrl;
        if (targetHandle === 'character_center') dependencies.characterCenter = characterUrl;
        if (targetHandle === 'character_right') dependencies.characterRight = characterUrl;
      } else if (targetHandle === 'music' && sourceNode.data.type === 'musicSource') {
        const musicData = sourceNode.data as MusicSourceNodeData;
        dependencies.music = {
          url: musicData.audio?.url || '',
          loop: musicData.loop,
          volume: musicData.volume,
          fadeIn: musicData.fadeIn,
        };
      }
    }

    return dependencies;
  };

  const processNode = (node: CustomNode) => {
    const data = node.data;

    // Filter out Comment nodes
    if (data.type === 'comment') {
      continueToNext(node.id);
      return;
    }

    // Source nodes - auto-continue (non-executable)
    if (
      data.type === 'text' ||
      data.type === 'backgroundSource' ||
      data.type === 'characterSource' ||
      data.type === 'musicSource'
    ) {
      continueToNext(node.id);
      return;
    }

    switch (data.type) {
      case 'scene': {
        const sceneData = data as SceneNodeData;

        // Resolve dependencies
        const deps = resolveDependencies(node.id, nodes, edges);

        // Apply visual state
        if (deps.background) setBackground(deps.background);
        if (deps.characterLeft !== undefined) setCharacterLeft(deps.characterLeft || null);
        if (deps.characterCenter !== undefined) setCharacterCenter(deps.characterCenter || null);
        if (deps.characterRight !== undefined) setCharacterRight(deps.characterRight || null);
        if (deps.music) {
          setMusic(deps.music);
          playAudio(deps.music.url, deps.music.loop, deps.music.volume);
        }

        // Set text (prefer dependencies over node data)
        setCurrentText(deps.text || sceneData.text || '');
        setCurrentSpeaker(deps.speaker || sceneData.speaker || '');
        setCurrentChoices([]);
        setIsWaitingForInput(true);

        pushHistory(node.id);
        break;
      }

      case 'choice': {
        const choiceData = data as ChoiceNodeData;
        setCurrentText(choiceData.text);
        setCurrentSpeaker('');
        setCurrentChoices(choiceData.choices);
        setIsWaitingForInput(true);
        pushHistory(node.id);
        break;
      }

      case 'end': {
        const endData = data as EndNodeData;
        setCurrentText(endData.text);
        setCurrentSpeaker('THE END');
        setCurrentChoices([]);
        setIsWaitingForInput(false);
        setCurrentNodeId(null);
        break;
      }

      case 'setVariable': {
        const varData = data as SetVariableNodeData;
        const currentValue = variables[varData.variableName] || 0;
        let newValue: any;

        switch (varData.operation) {
          case 'set':
            newValue = varData.value;
            break;
          case 'add':
            newValue = Number(currentValue) + Number(varData.value);
            break;
          case 'subtract':
            newValue = Number(currentValue) - Number(varData.value);
            break;
          case 'multiply':
            newValue = Number(currentValue) * Number(varData.value);
            break;
          case 'divide':
            newValue = Number(currentValue) / Number(varData.value);
            break;
        }

        setVariable(varData.variableName, newValue);
        continueToNext(node.id);
        break;
      }

      case 'branch': {
        const branchData = data as BranchNodeData;
        const varValue = variables[branchData.variableName];
        const compareValue = branchData.value;

        let result = false;
        switch (branchData.operator) {
          case '==':
            result = varValue == compareValue;
            break;
          case '!=':
            result = varValue != compareValue;
            break;
          case '>':
            result = Number(varValue) > Number(compareValue);
            break;
          case '<':
            result = Number(varValue) < Number(compareValue);
            break;
          case '>=':
            result = Number(varValue) >= Number(compareValue);
            break;
          case '<=':
            result = Number(varValue) <= Number(compareValue);
            break;
        }

        const targetHandle = result ? 'true' : 'false';
        const nextEdge = edges.find(
          (e) => e.source === node.id && e.sourceHandle === targetHandle
        );
        if (nextEdge) {
          setCurrentNodeId(nextEdge.target);
        }
        break;
      }

      case 'random': {
        const randomData = data as RandomNodeData;
        const totalWeight = randomData.outputs.reduce((sum, o) => sum + o.weight, 0);
        let random = Math.random() * totalWeight;

        let selectedOutput = randomData.outputs[0];
        for (const output of randomData.outputs) {
          random -= output.weight;
          if (random <= 0) {
            selectedOutput = output;
            break;
          }
        }

        const nextEdge = edges.find(
          (e) => e.source === node.id && e.sourceHandle === selectedOutput.id
        );
        if (nextEdge) {
          setCurrentNodeId(nextEdge.target);
        }
        break;
      }

      case 'jump': {
        const jumpData = data as any;
        if (jumpData.targetNodeId) {
          setCurrentNodeId(jumpData.targetNodeId);
        }
        break;
      }

      // Legacy nodes
      case 'character': {
        const charData = data as CharacterNodeData;
        const url = charData.sprite?.url;
        if (charData.position === 'left') setCharacterLeft(url || null);
        if (charData.position === 'center') setCharacterCenter(url || null);
        if (charData.position === 'right') setCharacterRight(url || null);
        continueToNext(node.id);
        break;
      }

      case 'hideCharacter': {
        const hideData = data as any;
        hideCharacter(hideData.position);
        continueToNext(node.id);
        break;
      }

      case 'background': {
        const bgData = data as BackgroundNodeData;
        setBackground(bgData.image?.url || null);
        continueToNext(node.id);
        break;
      }

      case 'music': {
        const musicData = data as MusicNodeData;
        if (musicData.audio?.url) {
          setMusic({
            url: musicData.audio.url,
            loop: musicData.loop,
            volume: musicData.volume,
          });
          playAudio(musicData.audio.url, musicData.loop, musicData.volume);
        }
        continueToNext(node.id);
        break;
      }

      case 'soundEffect': {
        const sfxData = data as any;
        if (sfxData.audio?.url) {
          playAudio(sfxData.audio.url, false, sfxData.volume);
        }
        continueToNext(node.id);
        break;
      }

      case 'delay': {
        const delayData = data as any;
        setTimeout(() => {
          continueToNext(node.id);
        }, delayData.duration || 1000);
        break;
      }

      default:
        continueToNext(node.id);
    }
  };

  const continueToNext = (nodeId: string) => {
    setTimeout(() => {
      const nextEdge = edges.find((e) => e.source === nodeId);
      if (nextEdge) {
        setCurrentNodeId(nextEdge.target);
      }
    }, 50);
  };

  const playAudio = (url: string, loop = false, volume = 1) => {
    if (!url) return;

    if (audioRef.current) {
      audioRef.current.pause();
    }

    const audio = new Audio(url);
    audio.loop = loop ?? false;
    audio.volume = volume ?? 1;
    audio.play().catch((err) => console.error('Audio playback error:', err));
    audioRef.current = audio;
  };

  const handleContinue = () => {
    if (!isWaitingForInput) return;

    setIsWaitingForInput(false);
    continueToNext(currentNodeId!);
  };

  const handleChoice = (choiceId: string) => {
    if (!currentNodeId) return;

    setIsWaitingForInput(false);
    const nextEdge = edges.find(
      (e) => e.source === currentNodeId && e.sourceHandle === choiceId
    );
    if (nextEdge) {
      setCurrentNodeId(nextEdge.target);
    }
  };

  const handleBack = () => {
    const prevNodeId = popHistory();
    if (prevNodeId) {
      setCurrentNodeId(prevNodeId);
      setIsWaitingForInput(false);
    }
  };

  const handleExit = () => {
    if (confirm('Exit to editor?')) {
      setIsPlaying(false);
      setEditorPlaying(false);
      resetGame();
      if (audioRef.current) {
        audioRef.current.pause();
      }
    }
  };

  return (
    <div className="w-full h-full relative overflow-hidden">
      {/* Background */}
      {currentBackground && (
        <div
          className="absolute inset-0 bg-cover bg-center transition-opacity duration-500"
          style={{ backgroundImage: `url(${currentBackground})` }}
        />
      )}

      {/* Characters */}
      <div className="absolute inset-0 flex items-end justify-between pointer-events-none">
        <div className="w-1/3 h-full flex items-end justify-center">
          {characterLeft && (
            <img
              src={characterLeft}
              alt="Character Left"
              className="max-h-full object-contain transition-opacity duration-300"
            />
          )}
        </div>
        <div className="w-1/3 h-full flex items-end justify-center">
          {characterCenter && (
            <img
              src={characterCenter}
              alt="Character Center"
              className="max-h-full object-contain transition-opacity duration-300"
            />
          )}
        </div>
        <div className="w-1/3 h-full flex items-end justify-center">
          {characterRight && (
            <img
              src={characterRight}
              alt="Character Right"
              className="max-h-full object-contain transition-opacity duration-300"
            />
          )}
        </div>
      </div>

      {/* UI Overlay */}
      <div className="absolute inset-0 flex flex-col justify-end pointer-events-none">
        {/* Top bar */}
        <div className="absolute top-0 left-0 right-0 p-4 flex justify-between pointer-events-auto">
          <button
            onClick={handleBack}
            className="px-4 py-2 bg-gray-800 bg-opacity-80 hover:bg-opacity-100 text-white rounded"
          >
            ← Back
          </button>
          <button
            onClick={handleExit}
            className="px-4 py-2 bg-gray-800 bg-opacity-80 hover:bg-opacity-100 text-white rounded"
          >
            Exit
          </button>
        </div>

        {/* Text box */}
        <div className="bg-black bg-opacity-80 text-white p-6 m-4 rounded-lg pointer-events-auto">
          {currentSpeaker && (
            <div className="font-bold text-lg mb-2">{currentSpeaker}</div>
          )}
          <div className="text-base mb-4">{currentText}</div>

          {currentChoices.length > 0 ? (
            <div className="space-y-2">
              {currentChoices.map((choice) => (
                <button
                  key={choice.id}
                  onClick={() => handleChoice(choice.id)}
                  className="w-full text-left px-4 py-3 bg-blue-600 hover:bg-blue-700 rounded"
                >
                  {choice.text}
                </button>
              ))}
            </div>
          ) : (
            isWaitingForInput && (
              <button
                onClick={handleContinue}
                className="px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded"
              >
                Continue →
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
}
