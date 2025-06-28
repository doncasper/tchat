# TChat Application Architecture

## Overview

TChat is a modern, themeable chat viewer application built with React, TypeScript, and Zustand. It's designed to simulate and display chat messages in a streaming context, with support for multiple themes, animations, and comprehensive customization options.

## Technology Stack

- **Frontend Framework**: React 19.1.0
- **Language**: TypeScript 5.8.3
- **State Management**: Zustand 5.0.5
- **Build Tool**: Vite 6.3.5
- **Styling**: CSS Modules with dynamic style injection
- **Development**: ESLint, TypeScript strict mode

## Application Structure

```
tchat/
├── src/
│   ├── components/          # Shared components
│   │   └── Settings/        # Settings modal component
│   ├── hooks/               # Custom React hooks
│   │   └── useAnimationStyles.ts
│   ├── store/               # Zustand state stores
│   │   ├── chatStore.ts     # Chat messages and settings
│   │   ├── themeStore.ts    # Theme management
│   │   └── uiStore.ts       # UI preferences
│   ├── themes/              # Theme system
│   │   ├── default/         # Default theme
│   │   ├── minimal/         # Minimal theme
│   │   ├── tako/            # Tako theme
│   │   ├── ThemeFactory.ts  # Theme registration
│   │   └── ThemeInterface.ts # Type definitions
│   ├── types/               # TypeScript types
│   │   └── ChatTypes.ts     # Core data types
│   ├── App.tsx              # Main application component
│   └── main.tsx             # Application entry point
└── public/
    └── themes/              # Theme-specific assets
```

## Core Architecture Patterns

### 1. Component-Based Architecture
The application follows React's component-based architecture with a clear hierarchy:
- **App** (ChatApp): Main orchestrator component
- **Theme Components**: Header, Chat, Message, Notification
- **Settings**: Modal for configuration

### 2. Plugin-Based Theme System
Themes are implemented as plugins that self-register with the ThemeFactory:
- Auto-discovery via Vite's glob imports
- Each theme provides implementations for all required components
- Themes can include custom styles and animations

### 3. State Management with Zustand
Three separate stores manage different aspects of the application:
- **chatStore**: Messages, auto-scroll, delays, message limits
- **themeStore**: Current theme, available themes, theme switching
- **uiStore**: Display options, animations, font size, compact mode

All stores support persistence via localStorage.

### 4. Factory Pattern
ThemeFactory implements a singleton pattern for managing theme registration and instantiation.

## Data Flow

1. **Message Pipeline**:
   ```
   Mock Data → Message Processing → State Store → Theme Components → UI
   ```

2. **User Interactions**:
   ```
   User Action → Store Update → Component Re-render → Persisted State
   ```

3. **Theme Switching**:
   ```
   Theme Selection → Factory Creation → Style Injection → Component Update
   ```

## Key Components

### App.tsx (ChatApp)
- Manages the overall application state
- Handles message simulation and timing
- Processes badges to determine user types
- Controls auto-scrolling behavior

### Theme System
Each theme must implement the following interface:
```typescript
interface Theme {
  name: string
  Header: ThemeComponent
  Chat: ThemeComponent
  Message: ThemeComponent
  Notification: ThemeComponent
  globalStyles: string
  animationStyles?: string
  animationModule?: any
}
```

### Message Types
The application supports various message types:
- **Regular Messages**: Standard chat messages
- **Notifications**: Subscriptions, raids, gifts, hosts, follows

### User Types
Derived from badges:
- Broadcaster
- Moderator
- Subscriber
- VIP
- Founder
- Bot
- Artist
- Verified

## Animation System

### Global Animation Control
- Animations can be toggled on/off globally
- Animation speed is configurable (slow, normal, fast)
- CSS custom properties control timing:
  - `--animation-duration`
  - `--animation-duration-fast`
  - `--animation-duration-slow`
  - `--animation-duration-very-slow`

### Theme-Specific Animations
Themes can provide custom animations through:
- CSS modules (`animations.module.css`)
- Inline animation styles
- Dynamic class name generation

## Settings and Customization

### Chat Settings
- Auto-scroll behavior
- Message delivery delay (0-5000ms)
- Maximum message limit (100-10000)
- Clear all messages

### Display Settings
- Show/hide timestamps
- Show/hide badges
- Compact mode
- Font size (small, medium, large)

### Animation Settings
- Enable/disable animations
- Animation speed control

## Performance Considerations

1. **Message Limiting**: Configurable maximum messages prevent memory issues
2. **Auto-scroll Optimization**: Only scrolls when necessary
3. **CSS Module Processing**: Efficient style extraction and injection
4. **React StrictMode**: Ensures best practices and catches potential issues

## Development Workflow

### Adding a New Theme
1. Create directory: `/src/themes/[theme-name]/`
2. Implement required components
3. Create `index.ts` with theme registration
4. Add styles and animations (optional)
5. Theme auto-discovers and becomes available

### Code Quality
- TypeScript strict mode ensures type safety
- ESLint configuration maintains code standards
- Component-based structure promotes reusability
- Clear separation of concerns

## Security Considerations

- No external API calls (uses mock data)
- All user preferences stored locally
- No sensitive data handling
- Input validation on settings

## Future Architecture Considerations

1. **Real-time Integration**: WebSocket support for live chat
2. **Message Virtualization**: Efficient rendering for thousands of messages
3. **Theme Marketplace**: Dynamic theme loading from external sources
4. **Plugin System**: Extended functionality through plugins
5. **Accessibility**: Enhanced keyboard navigation and screen reader support

## Conclusion

The TChat architecture provides a solid foundation for a themeable chat viewer with excellent extensibility and maintainability. The plugin-based theme system, combined with comprehensive state management and a clear component hierarchy, makes it easy to customize and extend the application while maintaining code quality and performance.