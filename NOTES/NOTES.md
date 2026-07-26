# NOTES

This is a place where I go through each module of the course and take the notes.

## Getting Started

### Creating A New Angular Project

Install Angular CLI, run:
```bash
npm install -g @angular/cli
```

Create a new Angular project:
```bash
ng new <project name> --no-zoneless
```

This is what I run for the course:
```bash
ng new first-angular-app --no-zoneless
```

`--no-zoneless` is used for Angular version >= 20.

Then chose:
```
- css styling 
- no server side rendering
```

### Setting Up An Angular Development Environment

Extensions installed on VS code:
```
- Angular Language Service
- Angular Essentials (Version 20) by John Papa
```

Run this to see what's the app like currently:
```bash
cd first-angular-app/
npm start
```

Go to Local: http://localhost:4200/

Keep the dev server up and running when making code changes. It will recompile on the spot.

## Angular Essentials - Components, Templates, Services & More

### A New Starting Project & Analyzing The Project Structure

`tsconfig` files are for TypeScript configuration. Normally I don't need to do anything to them.

`package` files are for dependencies/packages I need to use in this project.

`angular.json` is for extra settings for Angular CLI. Normally I don't need to do anything to it.

Go into the project folder and run `npm install` to have all the dependencies. As long as it finishes without error, then it's good to go.

Then, run `npm start` which will run `ng serve` from Angular CLI under the hood.

Go to Local: http://localhost:4200/ in the browser.

Right click and select `view page source`, I can see:
```
<script src="polyfills.js" type="module"></script><script src="main.js" type="module"></script></body>
```

The `main.js` is acutally from `main.ts` which is compiled by the CLI tool:
```ts
// main.ts
import { bootstrapApplication } from '@angular/platform-browser';

import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent).catch((err) => console.error(err));
```

The `AppComponent` is actually from `app.component.ts`. The imported path doesn't need to have `.ts` in the typescript file. This is a component which can been as a custome HTML element.

```ts
// app.component.ts
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {}
```

`@Component` is called a decorator. It's a TypeScript feature which gives some metadata to the class `AppComponent`.

The passed in configuration object has several properties. For example, `selector: 'app-root',` this tells Angular which HTML element can be replaced by this component and its markup. The markup of this component is stored in `templateUrl: './app.component.html',`.

```html
<!-- app.component.html -->
<header>
  <img src="assets/angular-logo.png" alt="The Angular logo: The letter 'A'" />
  <h1>Let's get started!</h1>
  <p>Time to learn all about Angular!</p>
</header>
```

The `AppComponent` will then render in `index.html` at `<app-root></app-root>` line:
```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Essentials</title>
  <base href="/">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="icon" type="image/x-icon" href="favicon.ico">
</head>
<body>
  <app-root></app-root>
</body>
</html>
```

#### Fixing `tsconfig.json`

##### Add `"rootDir": "./src",` under `"outDir": "./dist/out-tsc",`

TypeScript needs to know where your source files start, so it can build the correct folder structure inside the output folder. Without `rootDir`, TypeScript has to guess this from your files, and it warns you when the guess is not certain.

Your source files live under `./src`. Setting `rootDir` to `./src` tells TypeScript this directly, so the warning goes away and the output folder structure stays correct.

##### Update `"moduleResolution": "node",` to `"moduleResolution": "bundler",`

The value `"node"` is being renamed to "node10", and it is marked as deprecated. It will stop working in TypeScript 7.0.

Angular's build tool, starting from Angular CLI 17, uses esbuild. The `"bundler"` option matches how esbuild resolves modules, so it is the setting that fits your current build process. It also allows relative imports without file extensions, which matches your existing code style.

### Creating a First Custom Component

Create `HeaderComponent`.

If using Angular 19+ then I don't need to manually set `standalone: true,`.

### Using the Custom Component

To see the `HeaderComponent` on screen, I can't just add it to the `index.html` like this:
```html
<body>
  <app-header></app-header>
  <app-root></app-root>
</body>
```

I need to add this here in `main.ts` too as Angular won't automatically scan all the files and register my components:
```ts
bootstrapApplication(HeaderComponent);
``` 

But eventually I should create a tree of components:
```
One Angular Application = One Component Tree
```

So I can just move `HeaderComponent` into the `AppComponent` like this:
```html
<!-- app.component.html -->
<app-header></app-header>
```

And use `imports` array in the configuration of `@Component`:
```ts
// AppComponent
import { Component } from '@angular/core';
import { HeaderComponent } from './header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {}
```

And keep `index.html` as before:
```html
<body>
  <app-root></app-root>
</body>
```

And keep `main.ts` as before:
```ts
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent).catch((err) => console.error(err));
```

### Styling the Header Component & Adding An Image

Add `styleUrl` to the `@Component`.

Also updated `styles.css`, `header.component.css` and `index.html` with the new font links.

Note that in `angular.json` here it needs to specify where the images are:
```json
"assets": [
    "src/favicon.ico",
    "src/assets"
],
```

### Managing & Creating Components with the Angular CLI

Create a `header` folder under `app` to put in all the header component related files.

Once moved, I can see `AppComponent`'s `HeaderComponent` import is updated:
```ts
import { HeaderComponent } from './header/header.component';
```

Then, use Angular CLI to create new component, `UserComponent`.

```bash
cd 01-starting-project
ng g c user
```

It will automatically generate these files:
```bash
CREATE src/app/user/user.component.html (20 bytes)
CREATE src/app/user/user.component.spec.ts (601 bytes)
CREATE src/app/user/user.component.ts (238 bytes)
CREATE src/app/user/user.component.css (0 bytes)
```

I can remove `spec.ts` file as it's for automated testing later.

###  Styling & Using Our Next Custom Component

Key things:

- I can use self-closing tag like this:
```html
<app-header />
```

- Added `UserComponent` to `AppComponent`:
```ts
import { Component } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { UserComponent } from './user/user.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HeaderComponent, UserComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {}
```

```html
<!-- app.component.html -->
<app-header />

<main>
    <ul id="users">
        <li>
            <app-user />
        </li>
    </ul>
</main>
```

- Updated `UserComponent`'s structure:
```html
<div>
    <button>
        <img />
        <span>NAME</span>
    </button>
</div>
```

### Preparing User Data (To Output Dynamic Content)

Added a new `user` folder with images in `assets` folder. Also, `dummy-user.ts` in the `app` folder.

### Storing Data in a Component Class

`selectedUser` (it's a public property belonged to the component class) will be accessible in the `user.component.html`.

`randomIndex` can be generated by `Math.random()` but it's choosing between 0 and 1 (excluding 1), so I also need to use `Math.floor()`.

```ts
import { Component } from '@angular/core';
import { DUMMY_USERS }  from '../dummy-users';

const randomUserIndex = Math.floor(Math.random() * DUMMY_USERS.length);

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent {
  selectedUser = DUMMY_USERS[randomUserIndex]; // selectedUser is a public property
}
```

#### How to design `randomUserIndex` from scratch

Step 1: Write down what you actually want

You want a random position in the array. Positions in an array are called indexes. For an array of 5 items, the valid indexes are 0, 1, 2, 3, 4. Notice it starts at 0 and stops at one below the length.

So your goal in plain words: "give me a random whole number from 0 to (length minus 1)".

Step 2: Find out what random tool you have

In JavaScript the only built in random tool is `Math.random()`.

```ts
Math.random(); // e.g. 0.0, 0.42, 0.87, 0.999
```

Step 3: Fix the range first

You want the range to reach up to your array size. Right now it reaches up to 1. To stretch a 0-to-1 range so it reaches up to 5, you multiply by 5. And 5 is just the array length.

```ts
Math.random() * DUMMY_USERS.length; // e.g. 0.0, 2.1, 4.35, 4.99
```

Step 4: Fix the decimal problem last

You still have decimals like 4.35. You need whole numbers. You have three rounding tools, so you ask which one keeps you in range.

`Math.floor` rounds down, so 4.99 becomes 4. Your range becomes 0 to 4. That is exactly the valid indexes.

`Math.ceil` rounds up, so 0.1 becomes 1 and 4.99 becomes 5. But 5 is out of range. Bad.

`Math.round` rounds to nearest, which can also give you 5. Bad.

### Outputting Dynamic Content with String Interpolation

```html
<!-- user.component.html -->
 <div>
    <button>
        <img />
        <span>{{ selectedUser.name }}</span>
    </button>
</div>
```

### Property Binding & Outputting Computed Values

Property Binding: wrap the property with square brackets and inside the quote there will be the value assigned to this property.

E.g. in `<img>`:
```html
<div>
    <button>
        <img 
        [src]="'assets/users/' + selectedUser.avatar"
        [alt]="selectedUser.name" />
        <span>{{ selectedUser.name }}</span>
    </button>
</div>
```

#### String interpolation vs property binding in Angular

Both are common ways to display dynamic values in Angular.

The short answer: use interpolation to show text, and use property binding to pass a real value.

Use property binding when the value is not a string, or you are passing data to another component, or when setting values on a DOM element's property. 

Example:
```html
<button [disabled]="isDisabled">Save</button>
<app-profile [currentUser]="user"></app-profile>
```

Use interpolation when you want to display text content between tags. 

Example:
```html
<h1>Hello {{ userName }}</h1>
<p>You have {{ count }} messages</p>
```

### Using Getters For Computed Values

Replace this in `user.component.html`:
```html
[src]="'assets/users/' + selectedUser.avatar"
```

with this:
```html
[src]="imagePath"
```

by adding `getter` in `user.component.ts`:
```ts
@Component({
  selector: 'app-user',
  standalone: true,
  imports: [],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent {
  selectedUser = DUMMY_USERS[randomUserIndex];

  get imagePath() {
    return 'assets/users/' + this.selectedUser.avatar;
  }
}

```

so the `getter` method is just a function, and in JavaScript, I need to use `this` to access the property of the class.

This way the template is cleaner:
```html
<div>
    <button>
        <img 
        [src]="imagePath"
        [alt]="selectedUser.name" />
        <span>{{ selectedUser.name }}</span>
    </button>
</div>
```

### Listening to Events with Event Binding

Adding an event listener to an element e.g. `(click)` to the `button`:
```html
<div>
    <button (click)="onSelectUser()">
        <img 
        [src]="imagePath"
        [alt]="selectedUser.name" />
        <span>{{ selectedUser.name }}</span>
    </button>
</div>
```

Then, add a method to be called/executed upon some event using the `on` prefix, e.g. `onSelectUser`
```ts
const randomUserIndex = Math.floor(Math.random() * DUMMY_USERS.length);

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent {
  selectedUser = DUMMY_USERS[randomUserIndex];

  get imagePath() {
    return 'assets/users/' + this.selectedUser.avatar;
  }

  onSelectUser() {
    console.log('Clicked!');
  }
}
```

Go to the browser, and open the Console from the dev tool - the 'Clicked!' should be printed whenever the button is clicked.

### Managing State & Changing Data

Now, instead of outputting the value to the console, let's update the UI.

Use `state` when the data has an impact on the UI.

For example, the user info displayed in the button should be updated whenever the button is clicked.

The most simple way of doing it is by simply updating the value of `selectedUser` like the below:
```ts
const randomUserIndex = Math.floor(Math.random() * DUMMY_USERS.length);

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent {
  selectedUser = DUMMY_USERS[randomUserIndex];

  get imagePath() {
    return 'assets/users/' + this.selectedUser.avatar;
  }

  onSelectUser() {
    // Recompute randomUserIndex here, because the class field above only runs once when the component is first created.
    const randomUserIndex = Math.floor(Math.random() * DUMMY_USERS.length);
    this.selectedUser = DUMMY_USERS[randomUserIndex];
  }
}
```

### A Look Behind The Scenes Of Angular's Change Detection Mechanism

Under the hood Angular is using `zone.js` to detect changes. It listens to all the possible user events on the screen of a website.

That's the reason why I can just re-assign the value of a property and Angular will update the UI automatically:
```ts
  onSelectUser() {
    const randomUserIndex = Math.floor(Math.random() * DUMMY_USERS.length);
    this.selectedUser = DUMMY_USERS[randomUserIndex];
  }
```

### Introducing Signals

Supported since Angular 16.

Import signal from angular/core.

Store the signal in a property of a component.

Replace the `selectedUser` with a signal.

Signal is an object that stores a value (an initial value). Angular manages subscriptions to the signal to get notified about value changes.

Signals are trackable data containers. It notifies Angular when its value is changed so then Angular can update the UI accordingly.

Use `set()` to update the signal in `onSelectedUser()`.

The `user.component.ts` is now like this:
```ts
import { Component, signal } from '@angular/core';
export class UserComponent {
  selectedUser = signal(DUMMY_USERS[randomUserIndex]);
  
  onSelectUser() {
    const randomUserIndex = Math.floor(Math.random() * DUMMY_USERS.length);
    this.selectedUser.set(DUMMY_USERS[randomUserIndex]);
  }
}
```

Then, call the signal value as a function in the template:
```html
<div>
    <button (click)="onSelectUser()">
        <img 
        [src]="imagePath"
        [alt]="selectedUser().name" />
        <span>{{ selectedUser().name }}</span>
    </button>
</div>
```

In summary, using signals is more efficient than the old zone.js way.

Another thing worth noted - so the computed value, `imagePath`, should be replaced as the below. Use `computed()` from the `angular/core`, and it takes in a function as an argument:
```ts
// old
get imagePath() {
  return 'assets/users/' + this.selectedUser.avatar;
}
// new
imagePath = computed(() => 'assets/users/' + this.selectedUser().avatar);
```

The idea is that Angular sets up a subscription that tracks the signals read inside the `computed` function. Angular only re-computes `imagePath` when `selectedUser` changes, because `selectedUser()` is the only signal read in that computed function.

So the final UserComponent till now is like this:
```ts
import { Component, computed, signal } from '@angular/core';
import { DUMMY_USERS }  from '../dummy-users';

const randomUserIndex = Math.floor(Math.random() * DUMMY_USERS.length);

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent {
  selectedUser = signal(DUMMY_USERS[randomUserIndex]);
  imagePath = computed(() => 'assets/users/' + this.selectedUser().avatar);

  onSelectUser() {
    const randomUserIndex = Math.floor(Math.random() * DUMMY_USERS.length);
    this.selectedUser.set(DUMMY_USERS[randomUserIndex]);
  }
}
```

In the template, make sure I "execute" this computed property at `[src]="imagePath()"` for `img` as under the hood the computed function actually creates a signal:
```html
<div>
    <button (click)="onSelectUser()">
        <img 
        [src]="imagePath()"
        [alt]="selectedUser().name" />
        <span>{{ selectedUser().name }}</span>
    </button>
</div>
```

I can double check by hovering over `imagePath` in the `UserComponent`, it will show `Signal<String>`.

### We Need More Flexible Components!

Instead of allowing UserComponent to set the `randomUserIndex`, I make it configurable i.e. expose properties that can be fed with data from the `AppComponent` level, so I can use the components but with different data.

Current if I do this then all the userComponent will start with the same users:
```ts
import { Component, computed, signal } from '@angular/core';
import { DUMMY_USERS }  from '../dummy-users';

const randomUserIndex = Math.floor(Math.random() * DUMMY_USERS.length);

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent {
  selectedUser = signal(DUMMY_USERS[randomUserIndex]);
  imagePath = computed(() => 'assets/users/' + this.selectedUser().avatar);

  onSelectUser() {
    const randomUserIndex = Math.floor(Math.random() * DUMMY_USERS.length);
    this.selectedUser.set(DUMMY_USERS[randomUserIndex]);
  }
}
```

Why?
- The line that picks the random index sits outside the class, at the top of the file.
```ts
const randomUserIndex = Math.floor(Math.random() * DUMMY_USERS.length);  // module scope
```
Code at that level runs once, when the file is first imported by the browser. It does not run again each time Angular creates a `UserComponent`. So `Math.random()` is called a single time, the result is frozen into that const, and every instance later reads the same frozen number.

```html
<!-- AppComponent -->
<app-header />

<main>
    <ul id="users">
        <li>
            <app-user />
        </li>
        <li>
            <app-user />
        </li>
        <li>
            <app-user />
        </li>
        <li>
            <app-user />
        </li>
    </ul>
</main>
```

### Defining Component Inputs

Create configurable properties using `@Input` in `UserComponent`:
```ts
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent {
  @Input() avatar!: string; // the ! is TypeScript's way of promising this property will always have a value
  @Input() name!: string;

  get imagePath() {
    return 'assets/users/' + this.avatar; // using getter here as I'm not using signals in the image path anymore
  }

  onSelectUser() {
  }
}
```

And in `AppComponent` I need to create a property called `users` to have access to the dummy user data:
```ts
import { Component } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { UserComponent } from './user/user.component';
import { DUMMY_USERS }  from './dummy-users';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HeaderComponent, UserComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  users = DUMMY_USERS;
}
```

So in the `AppComponent` template I can pass in the data from `AppComponent` into `UserComponent`:
```html
<app-header />

<main>
    <ul id="users">
        <li>
            <app-user [avatar]="users[0].avatar" [name]="users[0].name" />
        </li>
        <li>
            <app-user [avatar]="users[1].avatar" [name]="users[1].name" />
        </li>
        <li>
            <app-user [avatar]="users[2].avatar" [name]="users[2].name" />
        </li>
        <li>
            <app-user [avatar]="users[3].avatar" [name]="users[3].name" />
        </li>
    </ul>
</main>
```

Finally, make sure `UserComponent` template replaced all the signals and computed value functions:
```html
<div>
    <button (click)="onSelectUser()">
        <img 
        [src]="imagePath"
        [alt]="name" />
        <span>{{ name }}</span>
    </button>
</div>
```

I now get a list of users on the screen and every user outputs some different data.

### Required & Optional Inputs

Use this required configuration object with the `@Input` i.e. `@Input({required: true})` to align with what I tell TypeScript so that a name or avatar of a user won't be missing in the `AppComponent`:
```ts
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent {
  @Input({required: true}) avatar!: string;
  @Input({required: true}) name!: string;

  get imagePath() {
    return 'assets/users/' + this.avatar;
  }

  onSelectUser() {
  }
}
```

E.g. If a `name` is missing in the `AppComponent` template, there will be a warning:
```html
<!-- AppComponent template -->
<!-- Warning: Required input 'name' from component UserComponent must be specified. -->
<app-user [avatar]="users[3].avatar" />
```

### Using Signal Inputs

I can also use signals to accept inputs.

Use `input` which is a special function (which is different from `Input` which is a decorator).

In the `input` function, I can set an initial value. I can use this angle bracket syntax, `<>`, to set the type of value this `input` function will receive. It's a TypeScript thing called `generic type`. When we see `input<T>`, `T` means `type placeholder`.

Hover over `avatar` it will show that it will produce a Input Signal which will eventually have a string value.

Then, I can make this input signal into required using `input.required()`. Then, with `<>`, I tell it about the type e.g. `input.required<string>()`. By using `input` we're setting values to the `name` and `avatar` properties, so I don't need to worry about telling TypeScript about `!`. I can change `imagePath` back to a computed value.

```ts
import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent {
  avatar = input.required<string>();
  name = input.required<string>();

  imagePath = computed(() => 'assets/users/' + this.avatar());

  onSelectUser() {
  }
}
```

Also update the UserComponent template by calling signal function on `name`. Same for `imagePath`.
```html
 <div>
    <button (click)="onSelectUser()">
        <img 
        [src]="imagePath()"
        [alt]="name()" />
        <span>{{ name() }}</span>
    </button>
</div>
```

But to continue to current section the tutorial just change back to use `@Input` for now. Later in the course there will be more signals usage.

```ts
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent {
  @Input({required: true}) avatar!: string;
  @Input({required: true}) name!: string;

  get imagePath() {
    return 'assets/users/' + this.avatar;
  }

  onSelectUser() {
  }
}
```

```html
<div>
    <button (click)="onSelectUser()">
        <img 
        [src]="imagePath"
        [alt]="name" />
        <span>{{ name }}</span>
    </button>
</div>
```

### We Need Custom Events! Working with Outputs & Emitting Data

For example, I can pass the selected user's `id` from the `UserComponent` back to the `AppComponent` by `EventEmitter()`, which is stored in `select`.
```ts
import { Component, computed, EventEmitter, input, Input, Output } from '@angular/core';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent {
  @Input({required: true}) avatar!: string;
  @Input({required: true}) name!: string;
  @Input({required: true}) id!: string;
  @Output() select = new EventEmitter(); // (select) in the parent template i.e. AppComponent must match @Output() select.

  get imagePath() {
    return 'assets/users/' + this.avatar;
  }

  onSelectUser() {
    this.select.emit(this.id);
  }
}
```

Whereas the `UserComponent` template remains the same:
```html
<div>
    <button (click)="onSelectUser()">
        <img 
        [src]="imagePath"
        [alt]="name" />
        <span>{{ name }}</span>
    </button>
</div>
```

For the `AppComponent` to listen to that event from `UserComponent`, add `(select)` in the `AppComponent` template:
```html
<app-header />

<main>
  <ul id="users">
    <li>
      <app-user [id]="users[0].id" [avatar]="users[0].avatar" [name]="users[0].name" (select)="onSelectUser($event)" />
    </li>
    <li>
      <app-user [id]="users[1].id" [avatar]="users[1].avatar" [name]="users[1].name" (select)="onSelectUser($event)" />
    </li>
    <li>
      <app-user [id]="users[2].id" [avatar]="users[2].avatar" [name]="users[2].name" (select)="onSelectUser($event)" />
    </li>
    <li>
      <app-user [id]="users[3].id" [avatar]="users[3].avatar" [name]="users[3].name" (select)="onSelectUser($event)" />
    </li>
  </ul>
</main>
```

And `(select)` will call the `onSelectUser()` function in `AppComponent`:
```ts
import { Component } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { UserComponent } from './user/user.component';
import { DUMMY_USERS }  from './dummy-users';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HeaderComponent, UserComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  users = DUMMY_USERS;

  onSelectUser(id: string) {
    console.log('Selected user with id: ' + id);
  }
}
```

`$event` is a special object provided by Angular and that will hold the data/value that was emitted by the event I'm listening to.


Now when I click on a User button e.g. the first user button, the dev tool console will print `Selected user with id: u1`.

### Using the `output()` Function

`@Output` might feel like acting same as `output()`, but `output()` is newer, safer and cleaner.

The reason why `output()` exists is that:
- Once inputs became `input()`, keeping `@Output()` would look odd. It would be weird to have inputs with `input()` and outputs with `@Output()`. The new signal-based authoring format is characterised by the absence of decorators. Mixing decorators and functions in one class is noise.
- `output()` is type safe on `emit()`, cleans up on destroy, and drops the RxJS baggage (as `EventEmitter` extends an RxJS Subject). The old `EventEmitter.emit()` with `@Output` let you emit nothing when a value was required. `output()` catches this at compile time.

Also,  `output()` gives `OutputEmitterRef`, not a signal.

So these will work the same in this tutorial:
```ts
// old
import { Component, EventEmitter, Output } from '@angular/core';

export class UserComponent {
  @Output() select = new EventEmitter();

  onSelectUser() {
    this.select.emit(this.id);
  }
}

// new
import { Component, output } from '@angular/core';

export class UserComponent {
  select = output<string>(); // select is OutputEmitterRef<string>, if I hover over it

  onSelectUser() {
    this.select.emit(this.id);
  }
}
```

Later the tutorial is still using `@Output` as it was not common to see `output()` back then.

### Adding Extra Type Information To EventEmitter

Adding type here for extra safety when using `@Output`:
```ts
import { Component, EventEmitter, Output } from '@angular/core';

export class UserComponent {
  @Output() select = new EventEmitter<string>();

  onSelectUser() {
    this.select.emit(this.id);
  }
}
```

### Exercise: Create a Configurable Component

In the project folder run this to create a new component and its other files and skip the .spec.ts file:
```bash
ng g c tasks --skip-tests
```

DUMMY-USERS data is flowing downwards from AppComponent into UserComponent and TaskComponent.

UserComponent button emit its id back to AppComponent. UserComponent got its id from AppComponent at first.

TaskComponent got the selected user name based on the selected user id stored in AppComponent.

```ts
import { Component } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { UserComponent } from './user/user.component';
import { DUMMY_USERS }  from './dummy-users';
import { TasksComponent } from './tasks/tasks.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HeaderComponent, UserComponent, TasksComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  users = DUMMY_USERS;
  selectedUserId = 'u1';

  //  The get in your code is a plain TypeScript getter that reruns every time, not a computed signal that caches its result.
  get selectedUser() {
    return this.users.find(user => user.id === this.selectedUserId)!; 
    // The ! is the non-null assertion operator. It tells TypeScript: "trust me, this value is not null and not undefined."
  }

  onSelectUser(id: string) {
    this.selectedUserId = id;
  }
}
```

AppComponent's html:
```html
<app-header />

<main>
  <ul id="users">
    <li>
      <app-user [id]="users[0].id" [avatar]="users[0].avatar" [name]="users[0].name" (select)="onSelectUser($event)" />
    </li>
    <li>
      <app-user [id]="users[1].id" [avatar]="users[1].avatar" [name]="users[1].name" (select)="onSelectUser($event)" />
    </li>
    <li>
      <app-user [id]="users[2].id" [avatar]="users[2].avatar" [name]="users[2].name" (select)="onSelectUser($event)" />
    </li>
    <li>
      <app-user [id]="users[3].id" [avatar]="users[3].avatar" [name]="users[3].name" (select)="onSelectUser($event)" />
    </li>
  </ul>

  <app-tasks [name]="selectedUser.name"/>
</main>
```

TasksComponent only needs to add `name` as a dynamic input property:
```ts
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.css'
})
export class TasksComponent {
  @Input({required: true}) name!: string;
}
```

TasksComponent's html:
```html
<p>{{ name }}</p>
```

I guess eventually I can change everything into signals

### TypeScript: Working With Potentially Undefined Values & Union Types

In `AppComponent`, I'm using `!` to tell TypeScript that there will be a value for `selectedUser`.

If I remove the `!` in the `.find()` in the `get selectedUser()`, in `AppComponent`'s template here it will complain `Object is possibly 'undefined'.`:
```html
<app-tasks [name]="selectedUser.name"/>
```

To solve that I can just add `?` in the template to tell it that when `selectedUser` is undefined use an empty string:
```ts
// new
export class AppComponent {
  users = DUMMY_USERS;
  selectedUserId = 'u1';

  get selectedUser() {
    return this.users.find(user => user.id === this.selectedUserId); // removed `!`
  }
  ...
}
```

If I allow this in the `TaskComponent` like adding `?` to the `name` property, which means the value might not be initialised yet and that's ok:
```ts
// new
export class TasksComponent {
  @Input() name?: string; // replaced `!` with `?`
}
```

Then, the new `AppComponent`'s template will be:
```html
<app-tasks [name]="selectedUser ? selectedUser.name : ''"/>
```

or this:
```html
<app-tasks [name]="selectedUser?.name"/>
```

Or I can just allow `undefined` type to the `name` in the `TaskComponent` by using `|` which is an union type  operator:
```ts
export class TasksComponent {
  @Input() name: string | undefined; // it's the same when I use: @Input() name?: string;
}
```

### Accepting Objects As Inputs & Adding Appropriate Typings

Now in `TasksComponent`, I'm using `?`:
```ts
export class TasksComponent {
  @Input() name?: string;
}
```

And it will show this when I hover over it:
```
(property) TasksComponent.name?: string | undefined
```

In `UserComponent` I'm simplifying the input properties as this:
```ts
// old
export class UserComponent {
  @Input({required: true}) avatar!: string;
  @Input({required: true}) name!: string;
  @Input({required: true}) id!: string;
  ...
}

// new
export class UserComponent {
  @Input({required: true}) user!: {
    id: string;
    name: string;
    avatar: string;
  };
  @Output() select = new EventEmitter<string>();

  get imagePath() {
    return 'assets/users/' + this.user.avatar;
  }

  onSelectUser() {
    this.select.emit(this.user.id);
  }
}
```

And update `UserComponent`'s template accordingly:
```html
<div>
    <button (click)="onSelectUser()">
        <img 
        [src]="imagePath"
        [alt]="user.name" />
        <span>{{ user.name }}</span>
    </button>
</div>
```

And update `AppComponent`'s template accordingly - instead of passing `id`, `name`, `avatar`, now I can just pass in `user`:
```html
<app-user [user]="users[0]" (select)="onSelectUser($event)" />
```

### TypeScript: Type Aliases & Interfaces

Use TypeScript to create type alias to make the code cleaner for the `user` property in `UserComponent`.

I can use either `type` or `interface` to define the type of an object e.g. `User`.

The key difference is that `interface` can only be used to define the object type, but `type` can be used for other types.

`UserComponent` and `type`:
```ts
// old
export class UserComponent {
  @Input({required: true}) user!: {
    id: string;
    name: string;
    avatar: string;
  };
  ...
}

// new
type User = {
  id: string;
  name: string;
  avatar: string;
};

export class UserComponent {
  @Input({required: true}) user!: User;
  ...
}
```

`UserComponent` and `interface`:
```ts
// new
interface User {
  id: string;
  name: string;
  avatar: string;
};


export class UserComponent {
  @Input({required: true}) user!: User;
  ...
}
```

### Outputting List Content

Use `@for` in the `AppComponent`'s template to dynamically output the users.

From this:
```html
<ul id="users">
  <li>
    <app-user [user]="users[0]" (select)="onSelectUser($event)" />
  </li>
  <li>
    <app-user [user]="users[1]" (select)="onSelectUser($event)" />
  </li>
  <li>
    <app-user [user]="users[2]" (select)="onSelectUser($event)" />
  </li>
  <li>
    <app-user [user]="users[3]" (select)="onSelectUser($event)" />
  </li>
</ul>
```

To this:
```html
<ul id="users">
  @for(user of users; track user.id) {
    <li>
      <app-user [user]="user" (select)="onSelectUser($event)" />
    </li>
  }
</ul>
```

What is `track` expression: `track` is used by Angular to use that user id to every list item it outputs so that every list item has a different id.

### Outputting Conditional Content

I want to render the `task` component in the `AppComponent` only when there's a selected User.

So if I update `selectedUserId` like this in the `AppComponent`:
```ts
export class AppComponent {
  users = DUMMY_USERS;
  selectedUserId?: string;
  ...
}
```

In the `AppComponent`'s template I can change from this:
```html
<app-tasks [name]="selectedUser ? selectedUser.name : ''"/>
```

To this to conditionally render by using `@if` and `@else` for fallback:
```html
@if(selectedUser) {
    <app-tasks [name]="selectedUser.name"/>  
} @else {
  <p>Select a user to see their tasks!</p>
}
```

I don't need the `?` operator for `selectedUser.name` anymore as there will be `selectedUser` in the `if` block.

### Quick recap for myself on Jul 25 2026

#### Migrating UserComponent to signal inputs and outputs

**What changed**

Moved from the decorator based inputs and outputs API to the signal based one.

In `UserComponent`, the old code is commented out:
```javascript
import { Component, EventEmitter, input, Input, output, Output } from '@angular/core';

interface User {
  id: string;
  name: string;
  avatar: string;
};

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent {
  // @Input({required: true}) user!: User;
  // @Output() select = new EventEmitter<string>();
  user = input.required<User>();
  select = output<string>();

  get imagePath() {
    // return 'assets/users/' + this.user.avatar;
    return 'assets/users/' + this.user().avatar;
  }

  onSelectUser() {
    // this.select.emit(this.user.id);
    this.select.emit(this.user().id);
  }
}
```

In the `UserComponent`'s template now needs to access `user` like this:
```html
<div>
    <button (click)="onSelectUser()">
        <img 
        [src]="imagePath"
        [alt]="user().name" />
        <span>{{ user().name }}</span>
    </button>
</div>
```

**The terms**

* `input()` and `input.required()` are *signal inputs*, also called signal
  based inputs. They return an `InputSignal<T>`.
* Calling `this.user()` is *reading the signal*. A signal is a getter function,
  so the brackets are how you unwrap the current value.
* A signal input is *read only* inside the child. Only the parent can set it.
  The old decorator input was a writable property.
* `output()` returns an `OutputEmitterRef<T>`. It is **not** a signal, because
  an event is a notification, not a piece of state. It replaces
  `EventEmitter`, and Angular handles the cleanup on destroy.
* The `!` in `user!: User` is TypeScript's *definite assignment assertion*.
  It promises the value will exist, without proving it. A required signal
  input removes the need for it, since Angular fails the build when a parent
  omits the binding.
* The *public template API* of the component did not change. The parent still
  writes `[user]` and `(select)`. Only the internals moved.

**Why**

1. Derived values can use `computed()`, which caches and only recalculates
   when the input actually changes. A `get` accessor runs on every read.
2. To react to a change, `effect()` replaces `ngOnChanges` and its
   `SimpleChanges` string keys.
3. Signals give Angular finer grained change detection. It can track which
   parts of the template read which signal, instead of checking the whole
   component. This is the groundwork for zoneless applications.
4. The input can no longer be overwritten by the child by accident.

**Gotcha**

Do not read a required signal input in the constructor. It is not set yet and
it throws. Read it in `ngOnInit`, or inside a `computed` or `effect`, which
run later.

### Adding More Components to the Demo App

Added `TaskComponent` under `TasksComponent`.


### Outputting User-specific Tasks

He's using `get` this getter to work with a computed property, e.g. `selectedUserTasks`.

Use the `@for` Angular template syntax again.

Add more properties using signal inputs in `TasksComponent` and update the `AppComponent` accordingly.