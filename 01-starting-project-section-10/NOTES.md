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

### The main concept of this practice is to use `signal`

The main concept of this practice is to use `signal` instead of `zone.js` to track changes in the app.

### Understanding how angular performs change detection (zone.js) and ExpressionChangedAfterChecked errors

Angular with `zone.js` used to check all templates bindings in the app if their value has changed when a change detection process starts.

E.g. `MessagesListComponent` template:
```html
<ul>
  @for (message of messages(); track message) {
    <li>{{ message }}</li>
  }
</ul>

<p class="debug-output">{{ debugOutput }}</p>
```

For example, when I click `Increment` button in the counter, all the components are visited, even the components that are not related to the counter, e.g. the Messages components:
```
[AppComponent] "debugOutput" binding re-evaluated.
[Counter] "debugOutput" binding re-evaluated.
[InfoMessages] "debugOutput" binding re-evaluated.
[Messages] "debugOutput" binding re-evaluated.
[NewMessage] "debugOutput" binding re-evaluated.
[MessagesList] "debugOutput" binding re-evaluated.
```

but why does Angular performance the checks twice? It's a development mode feature where it double checks if there's any changes after the first round of change detection cycle is finished:

```
[AppComponent] "debugOutput" binding re-evaluated.
[Counter] "debugOutput" binding re-evaluated.
[InfoMessages] "debugOutput" binding re-evaluated.
[Messages] "debugOutput" binding re-evaluated.
[NewMessage] "debugOutput" binding re-evaluated.
[MessagesList] "debugOutput" binding re-evaluated.

[AppComponent] "debugOutput" binding re-evaluated.
[Counter] "debugOutput" binding re-evaluated.
[InfoMessages] "debugOutput" binding re-evaluated.
[Messages] "debugOutput" binding re-evaluated.
[NewMessage] "debugOutput" binding re-evaluated.
[MessagesList] "debugOutput" binding re-evaluated.
```

For example, `InfoMessageComponent`:
```ts
@Component({
  selector: 'app-info-message',
  standalone: true,
  imports: [],
  templateUrl: './info-message.component.html',
  styleUrl: './info-message.component.css',
})
export class InfoMessageComponent {
  get debugOutput() {
    console.log('[InfoMessages] "debugOutput" binding re-evaluated.');
    return Math.random(); // added this!
  }

  onLog() {
    console.log('Clicked!');
  }
}
```

The error in the console:
```
[InfoMessages] "debugOutput" binding re-evaluated.
main.ts:5 ERROR RuntimeError: NG0100: ExpressionChangedAfterItHasBeenCheckedError: Expression has changed after it was checked. Previous value: '0.4186440121985564'. Current value: '0.5113666341246308'. Expression location: _InfoMessageComponent component. 
```

#### Avoid heavy tasks in the `get` in a component

Avoid performance expensive tasks in a getter:
```ts
@Component({
  selector: 'app-messages-list',
  standalone: true,
  templateUrl: './messages-list.component.html',
  styleUrl: './messages-list.component.css',
})
export class MessagesListComponent {
  messages = input.required<string[]>();

  get debugOutput() {
    console.log('[MessagesList] "debugOutput" binding re-evaluated.');
    return 'MessagesList Component Debug Output';
  }
}
```

### Writing Efficient Template Bindings

The template bindings should be simple. E.g. avoid calling functions there (signal reads are the exceptions) as Angular runs change detection a lot.

E.g. like this from `InfoMessageComponent` template, keep `debugOutput` very simple:
```html
<p (click)="onLog()">This is just an info message!</p>
<p class="debug-output">{{ debugOutput }}</p>
```

If I want to do any calculations, use `pipe` instead which caches values by default.

### Avoiding Zone Pollution

Another optimisation strategy is to tell Angular certain events doesn't matter for change detection.

For example, in `CounterComponent`:
```ts
export class CounterComponent implements OnInit {
  count = signal(0);

  ngOnInit() { // added this chunk!
    setTimeout(() => {
      this.count.set(0);
    }, 4000); // reset counts to zero after 4 sec

    setTimeout(() => {
      console.log('[Counter] "count" signal updated to 0 after 2 seconds.');
    }, 5000); // log this msg after 5 sec
  }

  onDecrement() {
    this.count.update((prevCount) => prevCount - 1);
  }

  onIncrement() {
    this.count.update((prevCount) => prevCount + 1);
  }
}
```

After two seconds, the `counts` reset to 0, and the console prints:
```
[Counter] "count" signal updated to 0 after 2 seconds.
```

When Angular sees this, it just runs the change detection again, it doesn't care that it doesn't impact components itself:
```ts
setTimeout(() => {
    console.log('[Counter] "count" signal updated to 0 after 4 seconds.');
}, 4000);
```

So I can wrap this code into a opt out of change detection watch mode service like this `NgZone`:
```ts
@Component({
  selector: 'app-counter',
  standalone: true,
  templateUrl: './counter.component.html',
  styleUrl: './counter.component.css',
  imports: [InfoMessageComponent],
})
export class CounterComponent implements OnInit {
  count = signal(0);
  private zone = inject(NgZone); // added this!

  get debugOutput() {
    console.log('[Counter] "debugOutput" binding re-evaluated.');
    return 'Counter Component Debug Output';
  }

  ngOnInit() {
    setTimeout(() => {
      this.count.set(0);
    }, 4000);

    this.zone.runOutsideAngular(() => { // added this!
      setTimeout(() => {
        console.log('[Counter] "count" signal updated to 0 after 4 seconds.');
      }, 5000);
    })
  }

  onDecrement() {
    this.count.update((prevCount) => prevCount - 1);
  }

  onIncrement() {
    this.count.update((prevCount) => prevCount + 1);
  }
}
```

Then refresh browser and clear the console. Click increment. After 4 sec, it will reset to zero, and the console tab will print `[Counter] "count" signal updated to 0 after 4 seconds.` and just that. No more other component's `debugOutput` messages.

So using `runOutsideAngular` helped avoiding polluting `zone.js` from events that don't matter.

### Using the `OnPush` strategy