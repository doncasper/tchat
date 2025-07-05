# TChat - Modern Twitch Chat Viewer

A modern, themeable Twitch chat viewer built with React 19, TypeScript, and Zustand. Connects to Twitch IRC WebSocket for real-time chat with support for multiple themes and comprehensive customization.

## Features

- **Real-time Twitch Chat**: WebSocket connection to Twitch IRC with full emote support
- **Multiple Themes**: Plugin-based theme system (Default and Tako themes)
- **Virtual Scrolling**: Efficient rendering for thousands of messages
- **Message Filtering**: Hide command messages (!), manage bot users, block users
- **URL Configuration**: Configure all settings via query parameters
- **Customizable Display**: Font size, timestamps, badges, border radius, visibility options
- **Auto-scroll**: Smart auto-scrolling with manual override
- **User Management**: Convert bot messages to notifications, hide blocked users
- **Keyboard Shortcuts**: Quick settings access with Ctrl/Cmd+M

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## URL Configuration

TChat supports configuration via URL query parameters, allowing you to bookmark specific chat configurations or share customized setups.

### Query Parameters

| Parameter | Description | Values | Default |
|-----------|-------------|---------|---------|
| `ch` | Channel name | Any Twitch channel | `takotoken` |
| `th` | Theme | `default`, `tako` | `default` |
| `ts` | Show timestamps | `0` (off), `1` (on) | `1` |
| `bd` | Show badges | `0` (off), `1` (on) | `1` |
| `fs` | Font size multiplier | `1.0` - `2.0` | `1.0` |
| `mm` | Max messages | `1` - `200` | `15` |
| `hd` | Show header | `0` (off), `1` (on) | `1` |
| `bg` | Show background | `0` (off), `1` (on) | `1` |
| `ov` | Only show fully visible messages | `0` (off), `1` (on) | `0` |
| `hc` | Hide command messages (!) | `0` (off), `1` (on) | `0` |

### Example URLs

```
# Basic usage - watch shroud's chat with tako theme
https://yoursite.com/?ch=shroud&th=tako

# Customized setup - large font, no timestamps, hide background
https://yoursite.com/?ch=xqc&fs=1.5&ts=0&bg=0

# Hide command messages and limit to 50 messages
https://yoursite.com/?ch=lirik&hc=1&mm=50

# Overlay mode - no header, no background
https://yoursite.com/?ch=summit1g&hd=0&bg=0
```

### URL Behavior

- Settings sync bidirectionally between URL and Settings modal
- URL updates automatically when settings change
- Only non-default values appear in URL for cleaner links
- Settings persist to localStorage and URL simultaneously

## Advanced Features

### User Filtering
- **Bot Users**: Convert messages from specified users to notifications
- **Blocked Users**: Completely hide messages from specified users
- **Command Messages**: Option to hide messages starting with "!"

### Themes
- **Default Theme**: Professional gradient background with clean design
- **Tako Theme**: Animated theme with custom graphics and playful styling

### Performance
- Virtual scrolling handles thousands of messages efficiently
- Duplicate message detection within 1-second window
- Automatic message limit enforcement (default: 15 messages)
- Only visible messages are rendered to DOM
