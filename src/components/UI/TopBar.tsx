import { useEditorStore } from '../../stores/editorStore';
import { useGameStore } from '../../stores/gameStore';

export function TopBar() {
  const { exportProject, importProject, clearProject, setIsPlaying } = useEditorStore();
  const { setIsPlaying: setGamePlaying, resetGame } = useGameStore();

  const handleExport = () => {
    const project = exportProject();
    const json = JSON.stringify(project, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `project_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      try {
        const text = await file.text();
        const project = JSON.parse(text);
        importProject(project);
        alert('Project imported successfully!');
      } catch (error) {
        alert(`Error importing project: ${(error as Error).message}`);
      }
    };
    input.click();
  };

  const handleNew = () => {
    if (confirm('Create new project? This will clear the current project.')) {
      clearProject();
    }
  };

  const handlePlay = () => {
    setIsPlaying(true);
    setGamePlaying(true);
    resetGame();
  };

  return (
    <div className="h-14 bg-gray-900 border-b border-gray-700 flex items-center justify-between px-4">
      <div className="flex items-center gap-3">
        <h1 className="text-xl font-bold text-white">Text Adventure Engine</h1>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={handleNew}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded text-sm"
        >
          New
        </button>
        <button
          onClick={handleImport}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded text-sm"
        >
          Import
        </button>
        <button
          onClick={handleExport}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded text-sm"
        >
          Export
        </button>
        <button
          onClick={handlePlay}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded text-sm font-semibold ml-2"
        >
          ▶ Play
        </button>
      </div>
    </div>
  );
}
