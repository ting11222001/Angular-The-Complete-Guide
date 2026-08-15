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

### Using the `OnPush` strategy and Understanding the OnPush Strategy

It's used to make sure a specific component runs less of change detection to improve performance. 

In `MessagesComponent`, add `ChangeDetection.OnPush`:
```ts
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { MessagesListComponent } from './messages-list/messages-list.component';
import { NewMessageComponent } from './new-message/new-message.component';

@Component({
  selector: 'app-messages',
  standalone: true,
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.css',
  imports: [MessagesListComponent, NewMessageComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MessagesComponent {
 ....
}
```

Once that's added, the logs in the console will be from other components, not from `MessagesComponent` anymore.

So only the events happened in the `MessagesComponent` will trigger the change detection of this component.

This strategy just an extra optimisation on the performance.

Remmeber in the app component template here - the changes of the counter component will not be affecting the message component anymore after we add OnPush setting to the message component:

```html
<h1>Making Sense of Change Detection</h1>

<app-counter />
<app-messages />

<p class="debug-output">{{ debugOutput }}</p>
```

Add `changeDetection: ChangeDetectionStrategy.OnPush,` to the `NewMessageComponent` and type letters into the field, still trigger counter component's messages, as it bubbles up to the app component.

So I have to add `changeDetection: ChangeDetectionStrategy.OnPush,` to the `CounterComponent` too:

```ts
import { Component, NgZone, OnInit, signal, inject, ChangeDetectionStrategy } from '@angular/core';

import { InfoMessageComponent } from '../info-message/info-message.component';

@Component({
  selector: 'app-counter',
  standalone: true,
  templateUrl: './counter.component.html',
  styleUrl: './counter.component.css',
  imports: [InfoMessageComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CounterComponent implements OnInit {
    ...
}
```

I can see `InfoMessageComponent` still logging inside the console, as it's part of the counter component.

```html
<p>
  <button (click)="onDecrement()">Decrement</button>
  <span>{{ count() }}</span>
  <button (click)="onIncrement()">Increment</button>
</p>
<p class="debug-output">{{ debugOutput }}</p>
<app-info-message />
```

So add `changeDetection: ChangeDetectionStrategy.OnPush,` in the `InfoMessageComponent` as well.

After that, when I click on incrementing/decrementing the counts in the counter component, it will not print the message components related debug mesages in the console anymore.

Then, in the `MessageListComponent` I can do that too - so only when the input value is changed, then this component's change detection runs.

After that, when I just type in the message field before hitting `save`, the `MessageListComponent` is not printed/evaluated by change detection anymore.

```ts
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-messages-list',
  standalone: true,
  templateUrl: './messages-list.component.html',
  styleUrl: './messages-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,  
})
export class MessagesListComponent {
    ...
}
```

### Working with OnPush & Signals

In `CounterComponent`, the `count` signal will make changeDetection happen also.

It's okay when I'm using `services` and signal to store the data from services in the `OnPush` components.

Start by rewriting the `OnPush` components using signals from services.

For example, if now I'm managing those messages in the `MessagesService`.

- Remove `messages` signal and `onAddMessage` function from `MessagesComponent`. Update the template accordingly.
- Remove `add` output event and the `add` event emit from `onSubmit()` from `NewMessageComponent`.

Like this:
```ts
@Component({
  selector: 'app-new-message',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './new-message.component.html',
  styleUrl: './new-message.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewMessageComponent {
  // add = output<string>();
  private messagesService = inject(MessagesService);
  enteredText = signal('');

  get debugOutput() {
    console.log('[NewMessage] "debugOutput" binding re-evaluated.');
    return 'NewMessage Component Debug Output';
  }

  onSubmit() {
    // this.add.emit(this.enteredText());
    this.messagesService.addMessage(this.enteredText());
    this.enteredText.set('');
  }
}
```

- Remove `messages` input from `MessagesListComponent`, and inject from the `MessagesService` instead.

Like this:
```ts
@Component({
  selector: 'app-messages-list',
  standalone: true,
  templateUrl: './messages-list.component.html',
  styleUrl: './messages-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,  
})
export class MessagesListComponent {
  private messagesService = inject(MessagesService);
  messages = this.messagesService.allMessages;
  
  get debugOutput() {
    console.log('[MessagesList] "debugOutput" binding re-evaluated.');
    return 'MessagesList Component Debug Output';
  }
}
```

So till now, I've got the service setup for these components `MessagesListComponent` and `NewMessageComponent` and they both have `OnPush` setup.
- `MessagesComponent` also has `OnPush` setup, just without signals.

Currently the app will work as expected - the counter area got clicked then only counter related components and the root app components will print its debug output in the Console tab, so does the message area in the app.

### The problem with OnPush, Cross-Component Data (Services) and NOT using Signals

What if I'm using non-signal based service in those `OnPush` components?

For example, start by rewriting `MessagesService`. Remove all the signals:

```ts
@Injectable({
  providedIn: 'root',
})
export class MessagesService {
  private messages: string[] = [];
  get allMessages() {
    return [...this.messages];
  }

  addMessage(message: string) {
    this.messages = [...this.messages, message];
  }
}
```

In the `NewMessageComponent`, update `enteredText` to just a property string, and also update `onSubmit()`:
```ts
@Component({
  selector: 'app-new-message',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './new-message.component.html',
  styleUrl: './new-message.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewMessageComponent {
  private messagesService = inject(MessagesService);
  enteredText = '';

  get debugOutput() {
    console.log('[NewMessage] "debugOutput" binding re-evaluated.');
    return 'NewMessage Component Debug Output';
  }

  onSubmit() {
    this.messagesService.addMessage(this.enteredText);
    this.enteredText = '';
  }
}
```

In the `MessagesListComponent`, replace `messages` with a getter property and update its template accordingly:

```ts
@Component({
  selector: 'app-messages-list',
  standalone: true,
  templateUrl: './messages-list.component.html',
  styleUrl: './messages-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,  
})
export class MessagesListComponent {
  private messagesService = inject(MessagesService);
  get messages() {
   return this.messagesService.allMessages; 
  }
  
  get debugOutput() {
    console.log('[MessagesList] "debugOutput" binding re-evaluated.');
    return 'MessagesList Component Debug Output';
  }
}
```

So now in the app, once I types a text of message and hit save - the new message is not shown in the MessageList and no log printed for it as no change detection is triggered for that `MessageListComponent`.

Because there's no `input` in the `MessageListComponent`, and I'm not triggering it manually either, and there's no event happending in that component either, and there's also no signals in that component, so that's why `MessageListComponent` is never checked for changes.

### Triggering change detection manually and using RxJS Subjects

I can use the below things to trigger CD manually in the `MessageListComponent`.

Like this:
```ts
private cdRef = inject(ChangeDetectorRef);
```

I need to call `cdRef` when the data in the service changes. Also, I need a way to find out something changed - by using `RxJS`.

So, add `RxJS` in the `MessagesService` where the changes happen:
```ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MessagesService {
    messages$ = new BehaviorSubject<string[]>([]); // added!
    private messages: string[] = [];
    get allMessages() {
        return [...this.messages];
    }

    addMessage(message: string) {
        this.messages = [...this.messages, message];
        this.messages$.next(this.messages);  // added!
    }
}
```

`BehaviorSubject` is similar to `signals` which is a wrapper around a value, and use `.next()` to emit a new value in the end.

Then, add a subscription in the `MessageListComponent` to be notified whenever this event (`this.messages$.next(this.messages);`) is emitted.

Like this:
```ts
this.messagesService.messages$.subscribe(() => {});
```

This `() => {}` function will be executed by RxJS whenever a new value is emitted by that subject.


Then, add `this.cdRef.markForCheck()` function which will tell Angular it should check this component (as this is the place where change detection is injected) now for changes.

And I can change the `get messages()` to just a property like this and directly reassign my local `messages: string[] = [];` with the `messages` from the service like this `this.messagesService.messages$.subscribe((messages) => {`:
```ts
messages: string[] = [];

ngOnInit() {
  this.messagesService.messages$.subscribe((messages) => {
    this.messages = messages;
    this.cdRef.markForCheck();
  });
}
```

So, the final change of `MessagesListComponent`:
```ts
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { MessagesService } from '../messages.service';

@Component({
  selector: 'app-messages-list',
  standalone: true,
  templateUrl: './messages-list.component.html',
  styleUrl: './messages-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,  
})
export class MessagesListComponent implements OnInit {
  private messagesService = inject(MessagesService);
  private cdRef = inject(ChangeDetectorRef);
  messages: string[] = [];

  ngOnInit() {
    this.messagesService.messages$.subscribe((messages) => {
      this.messages = messages;
      this.cdRef.markForCheck(); // triggering CD manually!
    });
  }
  
  get debugOutput() {
    console.log('[MessagesList] "debugOutput" binding re-evaluated.');
    return 'MessagesList Component Debug Output';
  }
}
```

And the final change of `MessagesService`:
```ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MessagesService {
    messages$ = new BehaviorSubject<string[]>([]);
    private messages: string[] = [];
    get allMessages() {
        return [...this.messages];
    }

    addMessage(message: string) {
        this.messages = [...this.messages, message];
        this.messages$.next(this.messages);
    }
}
```

So now, after I type a new message and click save, the new messages is printed in MessageList and the MessageListComponent's debug log is printed in the console tab.

One additional thing - remember to destroy the subscription like this in the `ngOnInit`. So, when a component is removed, this subscription can be terminated along with it:
```ts
export class MessagesListComponent implements OnInit {
  private messagesService = inject(MessagesService);
  private cdRef = inject(ChangeDetectorRef);
  private destroyRef = inject(DestroyRef); // added destroy!
  messages: string[] = [];

  ngOnInit() {
    const subscription = this.messagesService.messages$.subscribe((messages) => {
      this.messages = messages;
      this.cdRef.markForCheck();
    });
    this.destroyRef.onDestroy(() => { // added destroy the subscription!
      subscription.unsubscribe();
    });
  }
  
  get debugOutput() {
    console.log('[MessagesList] "debugOutput" binding re-evaluated.');
    return 'MessagesList Component Debug Output';
  }
}
```