# 2048 React Game

A modern implementation of the classic 2048 puzzle game built with React, TypeScript, and Vite.

## Features

- 🎮 Classic 2048 gameplay
- ⌨️ Keyboard controls (Arrow keys or WASD)
- 📱 Responsive design for mobile and desktop
- 💾 Persistent best score using localStorage
- 🎨 Smooth animations and clean UI
- ✨ TypeScript for type safety
- ⚡ Fast development with Vite

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Navigate to the project directory:
```bash
cd 2048-react-game
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The game will be available at `http://localhost:3000`

## Available Scripts

- `npm run dev` - Start development server on port 3000
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking

## How to Play

1. Use **arrow keys** or **WASD** keys to move tiles
2. When two tiles with the same number touch, they **merge into one**
3. Create a tile with the number **2048** to win!
4. The game ends when you can't make any more moves

## Project Structure

```
2048-react-game/
├── src/
│   ├── components/      # React components
│   │   ├── Board.tsx
│   │   ├── Tile.tsx
│   │   ├── GameHeader.tsx
│   │   ├── GameOverlay.tsx
│   │   └── index.ts
│   ├── hooks/           # Custom React hooks
│   │   └── useGame.ts
│   ├── utils/           # Game logic utilities
│   │   └── gameLogic.ts
│   ├── types/           # TypeScript type definitions
│   │   └── index.ts
│   ├── styles/          # CSS styles
│   │   ├── index.css
│   │   └── App.css
│   ├── App.tsx          # Main app component
│   └── main.tsx         # Entry point
├── index.html
├── vite.config.ts
├── tsconfig.json
└── package.json
```

## Technologies Used

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **CSS3** - Styling with animations

## License

MIT

## Acknowledgments

Based on the original 2048 game by Gabriele Cirulli.
