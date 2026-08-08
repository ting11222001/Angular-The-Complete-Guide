# NOTES

This is a place where I take notes for the practice project of the section 10 of the course, `Making Sense of Change Detection - Deep Dive`.

## Section 10: Making Sense of Change Detection - Deep Dive

### Fixing `tsconfig.json`

#### Add `"rootDir": "./src",` under `"outDir": "./dist/out-tsc",` in `tsconfig.json`

That red squiggle is a new TypeScript diagnostic.

Right now, your tsconfig only sets `outDir`. It doesn't set `rootDir`. Older TypeScript versions would guess `rootDir` by looking at your files. From TypeScript 6.0, that guessing goes away. So the editor is telling you to set `rootDir` explicitly, or you might get build errors later.

The fix - Add `rootDir` next to your `outDir` in `tsconfig.json`:

```json
"compilerOptions": {
  "outDir": "./dist/out-tsc",
  "rootDir": "./src",
  ...
}
```

So TypeScript takes your `.ts` source files and copies them into JavaScript, keeping the same folder layout. `rootDir` tells it where your source files start, and `outDir` tells it where to put the copies.

TypeScript keeps the same folder structure when it copies files across. So `src/app/app.component.ts` becomes `dist/out-tsc/app/app.component.js`.

