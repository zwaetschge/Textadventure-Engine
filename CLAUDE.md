# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A web-based Visual Novel / Text-Adventure Engine with a node-based visual editor (similar to n8n or ComfyUI). Users can create interactive stories by connecting nodes in a graph, then play them in a visual novel player.

## Tech Stack

- **React 18** + **TypeScript** + **Vite**
- **React Flow** - Node-based graph editor
- **Zustand** - State management
- **Tailwind CSS** - Styling

## Development Commands

```bash
npm install      # Install dependencies
npm run dev      # Start dev server (http://localhost:3000 or 3001)
npm run build    # Build for production (runs tsc + vite build)
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## Architecture

### Core Concept: ComfyUI-Style Modular Composition

The engine uses a ComfyUI-inspired architecture where content is composed through node connections rather than sequential state mutation:

- **Source Nodes** provide reusable assets and content (text, backgrounds, characters, music)
- **Scene Nodes** act as compositors that combine multiple inputs into rendered scenes
- **Flow Connections** (vertical, top-to-bottom) control story progression
- **Data Connections** (horizontal, "spaghetti" style) provide content to scenes
- **Editor** allows visual composition through drag-and-drop and connections
- **Player** interprets the graph, resolving dependencies at runtime

### State Management (Zustand)

Two separate stores manage different concerns:

**`editorStore` (src/stores/editorStore.ts)**
- Manages the node graph (nodes, edges)
- Handles editor UI state (selected node, live preview)
- Stores project assets (images, audio as Base64)
- Controls add/update/delete operations on nodes

**`gameStore` (src/stores/gameStore.ts)**
- Manages runtime game state during playback
- Tracks current position in the story graph
- Maintains game variables set by logic nodes
- Handles visual state (backgrounds, characters on screen)
- Manages navigation history for back button

### Node System

All nodes inherit from `BaseNodeData` and are typed in `src/types/nodes.ts`:

**Node Categories:**
1. **Flow Control**: Start, Scene, Choice, End
2. **Logic**: SetVariable, Branch (if/else), Random, Jump
3. **Visual**: Character, HideCharacter, Background (legacy nodes)
4. **Audio**: Music, SoundEffect (legacy nodes)
5. **Sources**: Text, BackgroundSource, CharacterSource, MusicSource (new modular system)
6. **Utility**: Delay, Comment

**Note**: The engine has two parallel systems - legacy nodes (Character, Background, Music) that work sequentially, and the newer Source nodes that connect to Scene nodes for modular composition. The Source system is recommended for new projects.

**Adding a New Node Type:**
1. Define interface in `src/types/nodes.ts` extending `BaseNodeData`
2. Add to `CustomNodeData` union type
3. Create React component in `src/components/Nodes/[NodeName]Node.tsx`
4. Register in `nodeTypes` object in `FlowEditor.tsx`
5. Add factory function in `createNodeByType()` in `FlowEditor.tsx`
6. Add to node palette in `NodePalette.tsx`
7. Add property editor case in `PropertyPanel.tsx`
8. Update `GamePlayer.tsx` to handle runtime behavior (if interactive)

### Component Structure

```
src/
├── components/
│   ├── Editor/
│   │   └── FlowEditor.tsx         # Main React Flow canvas
│   ├── Nodes/                     # Custom node components (15+ types)
│   ├── Player/
│   │   └── GamePlayer.tsx         # Runtime interpreter
│   ├── LivePreview/               # Preview panel
│   └── UI/
│       ├── TopBar.tsx             # Import/Export/Play controls
│       ├── NodePalette.tsx        # Drag-and-drop node list
│       ├── PropertyPanel.tsx      # Node property editor
│       └── AssetUpload.tsx        # Image/audio upload component
├── stores/
│   ├── editorStore.ts             # Editor state
│   └── gameStore.ts               # Game runtime state
├── types/
│   └── nodes.ts                   # All node type definitions
└── utils/
    └── assetHelpers.ts            # File upload utilities
```

### Connection Validation

`FlowEditor.tsx` enforces connection rules via `isValidConnection` callback:

**Data Connections** (horizontal, Source → Scene):
- Text nodes → Scene `text` handle only
- BackgroundSource → Scene `background` handle only
- CharacterSource → Scene `character_left/center/right` handles only
- MusicSource → Scene `music` handle only
- Prevents duplicate connections to same handle
- Prevents incompatible node type pairings

**Flow Connections** (vertical, story progression):
- Valid sources: Start, Scene, Choice, Branch, Random, Jump, logic nodes
- Valid targets: Scene, Choice, End, logic nodes
- Cannot connect TO Start node or Source nodes
- Source nodes cannot participate in flow

### Dependency Resolution

When a Scene node is reached during playback, `GamePlayer` resolves its dependencies:

1. **`resolveDependencies(nodeId, nodes, edges)`** finds all incoming connections
2. For each edge, checks `targetHandle` to determine type:
   - `text` handle → extracts content and speaker from Text node
   - `background` handle → extracts image URL from BackgroundSource
   - `character_left/center/right` → extracts sprite from CharacterSource (uses defaultExpression)
   - `music` handle → extracts audio, loop, volume, fadeIn from MusicSource
3. Returns `ResolvedSceneDependencies` object with all resolved data
4. Scene renders with composed content from connected sources

### Data Flow

**Editor Mode:**
1. User drags node from `NodePalette` → drops on `FlowEditor`
2. `createNodeByType()` creates node with default data
3. Node added to `editorStore.nodes`
4. User creates connections (validated by `isValidConnection`)
5. User selects node → `PropertyPanel` shows editable properties
6. Property changes update node via `editorStore.updateNode()`
7. `LivePreview` shows visual preview of selected node

**Play Mode:**
1. User clicks "Play" → `gameStore.resetGame()` called
2. `GamePlayer` finds Start node, follows first edge
3. For each node:
   - **Scene**: Resolves dependencies, renders UI, waits for user input
   - **Choice**: Renders UI, waits for user input
   - **Source nodes** (Text, BackgroundSource, etc.): Auto-continue immediately (non-executable)
   - **Character/Background/Music** (legacy): Updates visual state, auto-continues
   - **SetVariable**: Modifies `gameStore.variables`, auto-continues
   - **Branch**: Evaluates condition, follows true/false edge
   - **Random**: Picks weighted random edge
   - **End**: Shows ending screen
4. Navigation tracked in `gameStore.history` for back button (excludes Source nodes)

### Asset Management

Assets (images, audio) are stored as Base64 data URLs:
- Upload via `AssetUpload.tsx` component
- Validated and converted in `assetHelpers.ts`
- Stored in `editorStore.images` or `editorStore.audio`
- Referenced in nodes via `{ url: string, name: string }` objects
- Included in JSON export for portability

### Project File Format

Projects export as JSON containing:
```typescript
{
  version: string
  nodes: CustomNode[]        // React Flow nodes
  edges: Edge[]              // React Flow edges
  assets: {
    images: AssetFile[]      // Base64 encoded
    audio: AssetFile[]       // Base64 encoded
  }
  metadata: {
    createdAt: string
    updatedAt: string
  }
}
```

## Key Patterns

### Node Component Pattern
All custom nodes follow this structure:
```tsx
export function MyNode({ data, selected }: NodeProps<MyNodeData>) {
  return (
    <div className={selected ? 'border-blue-400' : 'border-gray-700'}>
      <Handle type="target" position={Position.Top} />
      {/* Node content */}
      <Handle type="source" position={Position.Bottom} />
    </div>
  )
}
```

### Auto-Continue vs Interactive Nodes
- **Interactive**: Scene, Choice, End - wait for user input
- **Non-executable** (auto-skip): Text, BackgroundSource, CharacterSource, MusicSource - provide data only, immediately continue
- **Auto-continue**: Character, Background, Music (legacy), SetVariable, Branch, Random, Jump, Delay - execute and immediately continue to next node

### Character Expression System
CharacterSource nodes support multiple expressions per character:
- Define expressions as a key-value map: `{ happy: {url, name}, sad: {url, name}, ... }`
- Set `defaultExpression` to specify which expression to use by default
- Currently, GamePlayer only uses `defaultExpression` during dependency resolution
- **Limitation**: No runtime expression switching implemented yet (expressions cannot change during gameplay)

### Multi-Output Nodes
Choice and Random nodes have multiple source handles:
- Choice: One handle per choice option (`handleId` matches edge `sourceHandle`)
- Random: Weighted random selection among outputs
- Branch: Fixed "true" and "false" handles

### Property Panel Dynamic Forms
`PropertyPanel.tsx` uses a large switch statement on `node.data.type` to render type-specific forms. When adding nodes, ensure proper TypeScript casting to the specific node data interface.

## Important Notes

- React Flow nodes are positioned in canvas coordinates
- `nodeTypes` registry maps node type strings to React components
- Comment nodes are editor-only, filtered out during playback
- Source nodes are non-executable - they provide data to Scene nodes via connections
- The Player auto-continues through non-interactive nodes using `setTimeout()`
- Variable operations in SetVariable node support: set, add, subtract, multiply, divide
- Branch node operators: ==, !=, >, <, >=, <=
- Connection validation prevents invalid connections between incompatible node types
- Scene nodes support 6 input handles: text, background, character_left, character_center, character_right, music
- MiniMap colors for Source nodes: text=#64748b, backgroundSource=#0d9488, characterSource=#ea580c, musicSource=#db2777

## Known Limitations

- **Character expressions cannot switch during gameplay** - only defaultExpression is used
- **LivePreview doesn't resolve Source node dependencies** - only shows legacy Scene data
- **No pre-play validation warnings** - errors only discovered at runtime
- **Dual node systems** - Legacy (Character, Background, Music) and Source nodes coexist, causing potential confusion
