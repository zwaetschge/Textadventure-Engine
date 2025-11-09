import { ReactFlowProvider } from 'reactflow';
import { useEditorStore } from './stores/editorStore';
import { TopBar } from './components/UI/TopBar';
import { NodePalette } from './components/UI/NodePalette';
import { FlowEditor } from './components/Editor/FlowEditor';
import { PropertyPanel } from './components/UI/PropertyPanel';
import { GamePlayer } from './components/Player/GamePlayer';

function App() {
  const { isPlaying } = useEditorStore();

  if (isPlaying) {
    return <GamePlayer />;
  }

  return (
    <div className="w-screen h-screen flex flex-col bg-gray-950">
      <TopBar />
      <div className="flex-1 flex overflow-hidden">
        <NodePalette />
        <div className="flex-1">
          <ReactFlowProvider>
            <FlowEditor />
          </ReactFlowProvider>
        </div>
        <PropertyPanel />
      </div>
    </div>
  );
}

export default App;
