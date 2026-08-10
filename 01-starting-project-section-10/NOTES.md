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

### Remove `"zone.js"` from `angular.json`

`angular.json` defines how this angular app is built.

I need to make sure this `"zone.js"` is removed from `polyfills`:

```json
// old:
{
  "$schema": "./node_modules/@angular/cli/lib/config/schema.json",
  "version": 1,
  "newProjectRoot": "projects",
  "projects": {
    "change-detection-deep-dive": {
      "projectType": "application",
      "schematics": {},
      "root": "",
      "sourceRoot": "src",
      "prefix": "app",
      "architect": {
        "build": {
          "builder": "@angular-devkit/build-angular:application",
          "options": {
            "outputPath": "dist/change-detection-deep-dive",
            "index": "src/index.html",
            "browser": "src/main.ts",
            "polyfills": [
              "zone.js"
            ],

// new:
{
  "$schema": "./node_modules/@angular/cli/lib/config/schema.json",
  "version": 1,
  "newProjectRoot": "projects",
  "projects": {
    "change-detection-deep-dive": {
      "projectType": "application",
      "schematics": {},
      "root": "",
      "sourceRoot": "src",
      "prefix": "app",
      "architect": {
        "build": {
          "builder": "@angular-devkit/build-angular:application",
          "options": {
            "outputPath": "dist/change-detection-deep-dive",
            "index": "src/index.html",
            "browser": "src/main.ts",
            "polyfills": [],
```

Then, restart the local dev server for that to take effect.