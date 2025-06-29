# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

TChat is a modern, themeable Twitch chat viewer application built with React 19, TypeScript, and Zustand state management. The app connects to Twitch IRC WebSocket to display real-time chat messages with full Twitch emote support, virtual scrolling performance optimization, comprehensive settings, and complete theme customization capabilities.

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

- **chatStore** (`src/store/chatStore.ts`): Messages with duplicate detection, connection status, channel management, message limits
- **themeStore** (`src/store/themeStore.ts`): Dynamic theme registration, available themes, theme switching with fallbacks
- **uiStore** (`src/store/uiStore.ts`): Display preferences (timestamps, badges, header, background), font size, border radius

All stores persist relevant settings to localStorage automatically with selective persistence strategies.

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
- Advanced IRC message parsing (PRIVMSG, USERNOTICE) with full tag support
- **Twitch Emote Parsing**: Complete emote position tracking and rendering data
- User type detection from comprehensive badge system
- Automatic reconnection with exponential backoff
- Channel switching without reconnection
- Color management with user color caching and auto-generation
- Support for notifications: subs, raids, gifts, bits, and special events

### Component Structure

```
src/
├── App.tsx                    # Main application with URL params, keyboard shortcuts (Ctrl+M)
├── components/
│   ├── EmoteRenderer/         # Twitch emote rendering with fallback handling
│   ├── Settings/              # Comprehensive settings modal with tooltips and sliders
│   └── VirtualScroll/         # Virtual scrolling for performance optimization
│       ├── VirtualScroll.tsx      # Core windowing with ResizeObserver
│       └── VirtualChatWrapper.tsx # Theme-friendly wrapper with auto-scroll
├── hooks/
│   ├── useTwitchChat.ts       # WebSocket singleton manager
│   └── useQueryParams.ts      # URL parameter handling (legacy)
├── store/                     # Zustand state stores with persistence
│   ├── chatStore.ts           # Messages, connection, duplicate detection
│   ├── themeStore.ts          # Dynamic theme management with fallbacks
│   ├── uiStore.ts             # Display preferences and UI state
│   └── useThemeInitializer.ts # Theme initialization hook
├── themes/                    # Theme implementations
│   ├── ThemeFactory.ts        # Dynamic theme registration system
│   ├── ThemeInterface.ts      # Comprehensive type definitions
│   ├── default/               # Default theme with gradient backgrounds
│   └── tako/                  # Tako animated theme with custom graphics
├── services/
│   └── twitchWebSocket.ts     # Enhanced WebSocket client with emote parsing
├── types/
│   └── ChatTypes.ts           # Core data types with TwitchEmote interface
└── utils/
    └── urlParams.ts           # URL parameter parsing and updating utilities
```

## Development Guidelines

### Adding New Themes

1. Create directory: `src/themes/[theme-name]/`
2. Implement required components (Header, Chat, Message, Notification)
3. Create `index.ts` that registers theme with ThemeFactory
4. Follow existing theme patterns for consistency

### Working with WebSocket Data

- Messages arrive as parsed `ChatDataItem` objects with optional `emotes` array
- **Emote Data**: Each emote includes `id`, `name`, `start`, and `end` positions
- User types are derived from comprehensive Twitch badge system
- Connection status updates are handled automatically
- Channel switching clears existing messages
- Duplicate detection prevents identical messages within 1 second

### Animation System

- Animations are theme-specific, not globally controlled
- Each theme can provide `animationStyles` string or `animationModule` CSS module
- `useAnimationStyles` hook applies theme-specific animations to DOM
- Themes have full control over their animation behavior

### Performance Optimization

**Virtual Scrolling (Windowing)**
- `VirtualScroll` component implements efficient message rendering
- Only visible messages (plus buffer) are rendered to DOM
- Automatic height measurement and adjustment for variable content
- Smooth scrolling with configurable overscan and buffer sizes
- `VirtualChatWrapper` provides theme-compatible integration

**Benefits:**
- Handles thousands of messages without performance degradation
- Reduces memory usage and DOM nodes
- Maintains smooth auto-scroll behavior
- Compatible with all existing themes

### State Management Patterns

- Use provided Zustand hooks: `useChatStore`, `useThemeStore`, `useUIStore`
- Store updates trigger React re-renders automatically
- Selective persistence: only relevant settings saved to localStorage
- Cross-store communication via React hooks and computed selectors

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

## Key Features

### Twitch Emote Support
- **Complete Integration**: Parses emote positions from Twitch IRC tags
- **EmoteRenderer Component**: Handles emote display with lazy loading and error fallback
- **CDN Integration**: Uses Twitch CDN with size 3.0 (large emotes) for optimal visibility
- **Performance**: Efficient rendering without empty spans or unnecessary DOM nodes

### Comprehensive Settings System
- **Display Controls**: Toggle timestamps, badges, header, background visibility
- **Appearance**: Font size (1.0-2.0x), border radius (0-30px) with sliders
- **URL Parameters**: All settings configurable via query string
- **Keyboard Shortcuts**: `Ctrl+M` (or `Cmd+M`) opens settings modal
- **Tooltips**: Helpful information for each setting

### Advanced Theme System
- **Current Themes**: Default (professional) and Tako (animated with custom graphics)
- **Dynamic Registration**: Themes self-register via ThemeFactory
- **Background Control**: Themes respect `showBackground` setting for overlay compatibility
- **Component Interface**: Header, Chat, Message, Notification components required

### Performance Optimizations
- **Virtual Scrolling**: Handles thousands of messages without performance degradation
- **Duplicate Detection**: Prevents identical messages within 1-second window
- **Memory Management**: Automatic message limit enforcement
- **Efficient Rendering**: Only visible messages rendered to DOM

## URL Parameter Support

All settings can be configured via URL parameters:
- `ch=channelname` - Set channel
- `th=themename` - Set theme
- `ts=0` - Disable timestamps
- `bd=0` - Disable badges
- `fs=1.5` - Set font size multiplier
- `md=1000` - Set message delay (ms)
- `mm=150` - Set max messages

## WebSocket Connection Details

- Connects to `wss://irc-ws.chat.twitch.tv:443`
- Uses anonymous authentication (`justinfan` + random number)
- Handles PING/PONG automatically
- **Enhanced Parsing**: Complete IRC tags for user metadata and emotes
- Supports channel switching without reconnection
- **Singleton Pattern**: Single connection shared across all components