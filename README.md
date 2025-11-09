# Text Adventure Engine

A web-based Visual Novel / Text-Adventure Engine with a node-based visual editor inspired by ComfyUI and n8n. Create interactive stories by connecting nodes in a graph, then play them in a beautiful visual novel player.

![Text Adventure Engine](https://img.shields.io/badge/React-18-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![Vite](https://img.shields.io/badge/Vite-5-purple)

## Features

- **Visual Node Editor** - Intuitive drag-and-drop interface for creating story flows
- **19 Node Types** - From basic flow control to advanced logic and visual effects
- **Modular Composition** - ComfyUI-inspired Source nodes for reusable assets
- **Visual Novel Player** - Beautiful runtime player with sprites, backgrounds, and music
- **Project Management** - Import/export projects as JSON files
- **Asset Support** - Upload images and audio files (stored as Base64)
- **Variable System** - Create branching storylines with variables and conditions
- **TypeScript** - Fully typed for better development experience

## Getting Started

### Prerequisites

- Node.js 16+ and npm

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/Textadventure-Engine.git
cd Textadventure-Engine

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will open at `http://localhost:3000` (or the next available port).

### Building for Production

```bash
npm run build
npm run preview
```

## How to Use

### Creating Your First Story

1. **Add a Start Node** - Click on "Start" in the Node Palette
2. **Add a Scene Node** - This is where dialogue and visuals appear
3. **Connect Them** - Drag from the bottom of Start to the top of Scene
4. **Add Content** - Select the Scene node and edit properties in the right panel
5. **Add More Scenes** - Build your story flow by adding more nodes
6. **Test It** - Click the "Play" button to see your story in action

### Node Types

#### Flow Control
- **Start** - Entry point of your story
- **Scene** - Display text, characters, and backgrounds (compositor)
- **Choice** - Present options to the player
- **End** - Conclude your story

#### Source Nodes (Recommended)
- **Text** - Reusable dialogue/narration content
- **BackgroundSource** - Reusable background images
- **CharacterSource** - Character sprites with multiple expressions
- **MusicSource** - Background music with loop/volume controls

#### Logic Nodes
- **SetVariable** - Create and modify variables
- **Branch** - Conditional branching (if/else)
- **Random** - Random path selection with weighted probabilities
- **Jump** - Jump to a specific node

#### Legacy Nodes
- **Character** - Show character sprite (deprecated - use CharacterSource)
- **Background** - Set background (deprecated - use BackgroundSource)
- **Music** - Play music (deprecated - use MusicSource)
- **SoundEffect** - Play sound effects
- **HideCharacter** - Remove character from screen

#### Utility
- **Delay** - Pause execution
- **Comment** - Add notes (editor-only, not executed)

### Connection Types

**Flow Connections** (Vertical)
- Control story progression
- Connect from bottom to top of nodes
- Shown as solid lines

**Data Connections** (Horizontal)
- Provide content to Scene nodes
- Connect Source nodes to Scene handles
- Color-coded by type:
  - 📝 Text (slate)
  - 🖼️ Background (teal)
  - 👤 Character (orange)
  - 🎵 Music (pink)

### Keyboard Shortcuts

- `Delete` - Delete selected node
- `Ctrl/Cmd + C` - Copy (via browser)
- `Ctrl/Cmd + V` - Paste (via browser)

## Project Structure

```
src/
├── components/
│   ├── Editor/
│   │   └── FlowEditor.tsx         # Main React Flow canvas
│   ├── Nodes/                     # 19 custom node components
│   ├── Player/
│   │   └── GamePlayer.tsx         # Runtime interpreter
│   ├── LivePreview/               # Preview panel
│   └── UI/
│       ├── TopBar.tsx             # Import/Export/Play controls
│       ├── NodePalette.tsx        # Drag-and-drop node list
│       ├── PropertyPanel.tsx      # Node property editor
│       └── AssetUpload.tsx        # Image/audio upload
├── stores/
│   ├── editorStore.ts             # Editor state (Zustand)
│   └── gameStore.ts               # Game runtime state (Zustand)
├── types/
│   └── nodes.ts                   # All node type definitions
└── utils/
    └── assetHelpers.ts            # File upload utilities
```

## Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **React Flow** - Node-based graph editor
- **Zustand** - Lightweight state management
- **Tailwind CSS** - Utility-first styling

## Examples

### Simple Linear Story
```
Start → Scene (with Text, Background, Character sources) → End
```

### Branching Story
```
Start → Scene → Choice ─┬─ Scene → End (Good)
                        └─ Scene → End (Bad)
```

### Variable-Based Logic
```
Start → Scene → SetVariable → Branch ─┬─ (true) → Scene A
                                       └─ (false) → Scene B
```

## Export Format

Projects are saved as JSON files containing:
- All nodes and their properties
- All connections (edges)
- All assets (images/audio as Base64)
- Metadata (timestamps)

## Known Limitations

- Character expressions cannot change during gameplay (only defaultExpression is used)
- LivePreview doesn't resolve Source node dependencies
- No pre-play validation warnings (errors discovered at runtime)
- Audio limited to 20MB, images to 10MB per file

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this for your own projects!

## Credits

Inspired by:
- **ComfyUI** - Modular node-based composition
- **n8n** - Workflow automation visual editor
- **Ren'Py** - Visual novel engine

## Support

For issues and feature requests, please use the GitHub Issues page.

---

Built with ❤️ using React, TypeScript, and React Flow
