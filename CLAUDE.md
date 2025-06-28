# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

TChat is a modern, themeable Twitch chat viewer application built with React 19, TypeScript, and Zustand state management. The app connects to Twitch IRC WebSocket to display real-time chat messages with support for multiple themes, animations, and comprehensive customization options.

## Development Commands

```bash
# Choose node version
nvm use 20

# Start development server
npm run dev

# Build for production
npm run build

# Run linting
npm run lint

# Preview production build
npm run preview
```

## Architecture Overview

### Core Technology Stack
- **React 19.1.0** with TypeScript 5.8.3
- **Zustand 5.0.5** for state management
- **Vite 6.3.5** for build tooling
- **CSS Modules** for component styling
- **WebSocket connection** to Twitch IRC

### Key Architectural Patterns

1. **Plugin-Based Theme System**: Themes are self-registering plugins managed by `ThemeFactory`
2. **Singleton WebSocket Manager**: `WebSocketManager` in `useTwitchChat.ts` manages connections
3. **Modular State Management**: Three separate Zustand stores handle different concerns
4. **Component-Based Rendering**: Theme components implement a consistent interface

### State Management (Zustand Stores)

- **chatStore** (`src/store/chatStore.ts`): Messages, auto-scroll, connection status, channel management
- **themeStore** (`src/store/themeStore.ts`): Current theme, available themes, theme switching
- **uiStore** (`src/store/uiStore.ts`): Display preferences, animations, font size, compact mode

All stores persist to localStorage automatically.

### Theme System Architecture

Each theme must implement the `Theme` interface with these components:
- `Header`: Stream title, viewer count, settings, theme switcher
- `Chat`: Message container and scrolling
- `Message`: Individual message rendering
- `Notification`: Subscription, raid, gift notifications

Themes are auto-discovered via Vite's glob imports and self-register with `ThemeFactory`.

### WebSocket Connection Management

The `TwitchWebSocket` class handles:
- Anonymous connection to Twitch IRC
- Message parsing (PRIVMSG, USERNOTICE)
- User type detection from badges
- Automatic reconnection with exponential backoff
- Channel switching without reconnection

### Component Structure

```
src/
├── App.tsx                    # Main application orchestrator
├── components/Settings/       # Settings modal
├── hooks/
│   ├── useTwitchChat.ts      # WebSocket connection hook
│   └── useAnimationStyles.ts # Dynamic animation styles
├── store/                    # Zustand state stores
├── themes/                   # Theme implementations
│   ├── ThemeFactory.ts       # Theme registration system
│   ├── ThemeInterface.ts     # Type definitions
│   ├── default/              # Default theme
│   ├── minimal/              # Minimal theme
│   └── tako/                 # Tako theme with animations
├── services/
│   └── twitchWebSocket.ts    # WebSocket client implementation
└── types/
    └── ChatTypes.ts          # Core data types
```

## Development Guidelines

### Adding New Themes

1. Create directory: `src/themes/[theme-name]/`
2. Implement required components (Header, Chat, Message, Notification)
3. Create `index.ts` that registers theme with ThemeFactory
4. Follow existing theme patterns for consistency

### Working with WebSocket Data

- Messages arrive as parsed `ChatDataItem` objects
- User types are derived from Twitch badges
- Connection status updates are handled automatically
- Channel switching clears existing messages

### Animation System

- Animations are theme-specific, not globally controlled
- Each theme can provide `animationStyles` string or `animationModule` CSS module
- `useAnimationStyles` hook applies theme-specific animations to DOM
- Themes have full control over their animation behavior

### State Management Patterns

- Use provided Zustand hooks: `useChatStore`, `useThemeStore`, `useUIStore`
- Store updates trigger React re-renders automatically
- Persist sensitive settings in localStorage

### Message Types and User Classifications

**Message Types:**
- `message`: Regular chat messages
- `notification`: Subs, raids, gifts, bits

**User Types** (from badges):
- broadcaster, moderator, subscriber, vip, founder, staff, partner, artist, turbo

## Testing and Code Quality

- TypeScript strict mode enforced
- ESLint with React hooks and refresh plugins
- No test framework currently configured
- Code follows React 19 patterns and best practices

## File Naming Conventions

- Components: PascalCase (e.g., `Settings.tsx`)
- Hooks: camelCase with `use` prefix (e.g., `useTwitchChat.ts`)
- Stores: camelCase with `Store` suffix (e.g., `chatStore.ts`)
- CSS Modules: `ComponentName.module.css`
- Types: PascalCase with `Types` suffix (e.g., `ChatTypes.ts`)

## WebSocket Connection Details

- Connects to `wss://irc-ws.chat.twitch.tv:443`
- Uses anonymous authentication (`justinfan` + random number)
- Handles PING/PONG automatically
- Parses IRC tags for user metadata
- Supports channel switching without reconnection