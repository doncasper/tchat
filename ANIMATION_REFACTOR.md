# Animation System Refactor - CSS Module Approach

## Overview

The animation system has been refactored to be completely theme-specific using CSS modules. This approach provides full encapsulation of animation logic within each theme, allowing themes to opt out of animations entirely or define their own unique animation behaviors.

## Key Improvements

### 1. **Theme-Specific CSS Modules**
- **Before**: Global animation styles injected by JavaScript
- **After**: Each theme has its own `animations.module.css` file

### 2. **Complete Theme Encapsulation**
- **Before**: Animation logic mixed with theme logic
- **After**: Animations are part of the theme's CSS modules

### 3. **Opt-Out Capability**
- **Before**: All themes forced to use animations
- **After**: Themes can completely opt out by not providing `animationModule`

### 4. **CSS Module Extraction**
- **Before**: Duplicated CSS in theme definitions
- **After**: Styles extracted directly from CSS modules

## Architecture

### Core Components

#### 1. **Animation Hook** (`src/hooks/useAnimationStyles.ts`)
- Provides CSS custom properties for dynamic durations
- Extracts styles from CSS modules when available
- Handles animation enabling/disabling globally

#### 2. **Theme Animation Modules**
Each theme can provide animation styles through CSS modules:

```typescript
// src/themes/themeName/animations.module.css
.themeMessage {
  animation: slideIn var(--animation-duration) ease-out;
}

@keyframes slideIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
```

```typescript
// src/themes/themeName/index.ts
import animations from './animations.module.css'

const Theme: Theme = {
  name: 'themeName',
  // ... other properties
  animationModule: animations
}
```

#### 3. **CSS Module Integration**
Themes use CSS modules for animation classes:

```typescript
import animations from './animations.module.css'

// In component
<div className={`${styles.message} ${animations.themeMessage}`}>
```

## Theme Examples

### Default Theme
- **File**: `src/themes/default/animations.module.css`
- **Style**: Clean slide-in animations
- **Approach**: Uses CSS custom properties for dynamic timing

### Tako Theme
- **File**: `src/themes/tako/animations.module.css`
- **Style**: Bouncy, playful animations with rotation
- **Approach**: Custom cubic-bezier easing, hover effects

### Minimal Theme
- **File**: No animation file
- **Style**: No animations at all
- **Approach**: Completely opts out of animation system

## Benefits

### 1. **Full Theme Encapsulation**
- Animation logic is part of the theme's CSS modules
- No global CSS conflicts
- Themes are self-contained

### 2. **Flexible Animation Control**
- Themes can define any animation behavior
- Complete opt-out capability
- No forced animation dependencies

### 3. **Better Performance**
- CSS modules are optimized by the build system
- No runtime style injection for theme animations
- Efficient CSS class application

### 4. **Developer Experience**
- Animations are co-located with theme code
- Easy to understand and modify
- Clear separation of concerns

### 5. **Build-Time Optimization**
- CSS modules are processed at build time
- Dead code elimination for unused animations
- Better tree-shaking

### 6. **No Code Duplication**
- CSS styles defined once in CSS modules
- Automatically extracted and applied
- No manual string duplication

## Implementation Guide

### For Themes with Animations

1. **Create Animation CSS Module**
```css
/* src/themes/themeName/animations.module.css */
.themeMessage {
  animation: slideIn var(--animation-duration) ease-out;
}

@keyframes slideIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
```

2. **Import in Theme Index**
```typescript
import animations from './animations.module.css'

const Theme: Theme = {
  name: 'themeName',
  // ... other properties
  animationModule: animations
}
```

3. **Use in Components**
```typescript
import animations from './animations.module.css'

<div className={`${styles.message} ${animations.themeMessage}`}>
```

### For Themes Without Animations

Simply omit the `animationModule` property:

```typescript
const Theme: Theme = {
  name: 'minimal',
  // ... other properties
  // No animationModule property = no animations
}
```

## CSS Custom Properties Available

```css
:root {
  --animation-duration: 0.3s;           /* Base duration */
  --animation-duration-fast: 0.2s;      /* 67% of base */
  --animation-duration-slow: 0.6s;      /* 200% of base */
  --animation-duration-very-slow: 1.2s; /* 400% of base */
  --animation-enabled: 1;               /* 0 when disabled */
}
```

## How CSS Module Extraction Works

1. **CSS Module Import**: Theme imports `animations.module.css`
2. **Class Name Extraction**: Hook extracts actual CSS class names from module
3. **StyleSheet Search**: Hook searches all stylesheets for matching rules
4. **Class Name Replacement**: CSS module classes replaced with theme-specific classes
5. **Style Injection**: Extracted styles injected into DOM with new class names

Example transformation:
```css
/* Original CSS module */
.themeMessage_abc123 {
  animation: slideIn 0.3s ease-out;
}

/* Extracted and transformed */
.theme-message {
  animation: slideIn 0.3s ease-out;
}
```

## Migration from Previous System

1. **Remove old animation logic** from theme index files
2. **Create `animations.module.css`** for each theme
3. **Update components** to use CSS module classes
4. **Add `animationModule`** property to theme definition
5. **Test animation behavior** with different speed settings

## Best Practices

1. **Use CSS Custom Properties** for dynamic timing
2. **Keep animations simple** and performant
3. **Provide fallbacks** for reduced motion preferences
4. **Test with different speeds** to ensure smooth behavior
5. **Document custom keyframes** in theme documentation
6. **Use descriptive class names** in CSS modules 