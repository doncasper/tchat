# TChat - Modern Twitch Chat Viewer

A modern, themeable Twitch chat viewer built with React 19, TypeScript, and Zustand. Connects to Twitch IRC WebSocket for real-time chat with support for multiple themes and comprehensive customization.

## Features

- **Real-time Twitch Chat**: WebSocket connection to Twitch IRC
- **Multiple Themes**: Plugin-based theme system with built-in themes
- **Virtual Scrolling**: Efficient rendering for thousands of messages
- **URL Configuration**: Configure chat settings via query parameters
- **Customizable Display**: Font size, timestamps, badges, and animations
- **Auto-scroll**: Smart auto-scrolling with manual override

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
| `ch` | Channel name | Any Twitch channel | `lirik` |
| `th` | Theme | `default`, `minimal`, `tako` | `default` |
| `as` | Auto-scroll | `0` (off), `1` (on) | `1` |
| `ts` | Show timestamps | `0` (off), `1` (on) | `1` |
| `bd` | Show badges | `0` (off), `1` (on) | `1` |
| `fs` | Font size multiplier | `1.0` - `2.0` | `1.0` |
| `md` | Message delay (ms) | `0` - `50000` | `0` |
| `mm` | Max messages | `1` - `200` | `100` |

### Example URLs

```
# Basic usage - watch shroud's chat with tako theme
https://yoursite.com/?ch=shroud&th=tako

# Customized setup - large font, no timestamps, minimal theme
https://yoursite.com/?ch=xqc&th=minimal&fs=1.5&ts=0

# Delayed chat for spoiler avoidance
https://yoursite.com/?ch=lirik&md=30000&mm=50
```

### URL Behavior

- Settings sync bidirectionally between URL and Settings modal
- URL updates automatically when settings change
- Only non-default values appear in URL for cleaner links
- Settings persist to localStorage and URL simultaneously

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```
