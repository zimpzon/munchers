# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- **Development**: `npm start` - Runs the app in development mode at http://localhost:3000
- **Build**: `npm run build` - Builds the production app to the build folder
- **Test**: `npm test` - Launches the test runner in interactive watch mode

## Architecture

This is a React + TypeScript ant colony simulation game using PixiJS for 2D graphics.

### Core Structure

- **App.tsx**: Main React component with 2-column layout (GameControls + GameCanvas)
- **Game Engine**: Located in `src/Game/` - Pure TypeScript game logic using PixiJS
  - `game.ts`: Main game controller, manages PIXI app, ants, and game state
  - `ant.ts`: Individual ant behavior with motivation states (lookForFood, pickingUpFood, deliverFood, droppingFood)
  - `level.ts`: Level loading, collision detection, home/food placement
  - `sprites.ts`: PIXI sprite management
  - `globals.ts`: Global game settings and constants
- **Components**: React UI components in `src/Components/`
  - `GameCanvas/`: Renders the PIXI canvas via useEffect
  - `GameControls/`: Game controls UI with buy buttons, settings toggles
  - `GameLoader/`: Level loading interface

### Game Loop

The game runs on a fixed timestep simulation:
1. GameCanvas component initializes PIXI app via `game.resetGame()`
2. Main game loop in `game.run()` calls `tickGame()` every frame
3. Each ant updates its state based on motivation (food seeking, carrying, etc.)
4. PixiJS handles rendering sprites, trails, and effects

### Key Technologies

- **React 18**: UI framework with functional components and hooks
- **TypeScript**: Strict typing enabled
- **PixiJS 6.4.2**: 2D WebGL rendering for game graphics
- **Bootstrap 5.3.2**: UI styling with react-bootstrap components
- **vector2d**: 2D vector math utilities

### Development Notes

- Game state is managed through the singleton `game` class
- Ant AI uses scent trails and motivation states for pathfinding
- Level data includes collision maps and home/food placement
- The game supports custom level loading via JSON (partially implemented)