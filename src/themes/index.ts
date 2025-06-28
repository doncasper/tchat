/**
 * This file is used to bootstrap the theme registration process.
 * It uses Vite's glob import feature to automatically find and
 * import all themes.
 *
 * To add a new theme, you just need to create a new directory
 * inside `src/themes` and it will be automatically registered.
 * The theme's directory must contain an `index.ts` file that
 * calls `themeFactory.registerTheme()` on itself.
 */

// Eagerly import all theme index files to trigger self-registration.
// The { eager: true } option ensures the modules are executed immediately.
const modules = import.meta.glob('./*/index.ts', { eager: true })

// Optional: Log registered modules for debugging in development
if (import.meta.env.DEV) {
  console.log(
    'Automatically registered themes:', 
    Object.keys(modules).map(path => path.split('/')[1])
  );
} 