# NOTES

This is a place where I take notes for the practice project of the section 2 of the course, `Angular Essentials - Components, Templates, Services & More`.

The project folder is named `01-starting-project-section-2`, and the actual project is called `easy-task`.

## Section 2: Angular Essentials - Components, Templates, Services & More

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
import { bootstrapApplication } from "@angular/platform-browser";

import { AppComponent } from "./app/app.component";

bootstrapApplication(AppComponent).catch((err) => console.error(err));
```

The `AppComponent` is actually from `app.component.ts`. The imported path doesn't need to have `.ts` in the typescript file. This is a component which can been as a custome HTML element.

```ts
// app.component.ts
@Component({
  selector: "app-root",
  standalone: true,
  imports: [],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.css",
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
    <meta charset="utf-8" />
    <title>Essentials</title>
    <base href="/" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="icon" type="image/x-icon" href="favicon.ico" />
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
import { Component } from "@angular/core";
import { HeaderComponent } from "./header.component";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [HeaderComponent],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.css",
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
import { bootstrapApplication } from "@angular/platform-browser";
import { AppComponent } from "./app/app.component";

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
import { HeaderComponent } from "./header/header.component";
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

### Styling & Using Our Next Custom Component

Key things:

- I can use self-closing tag like this:

```html
<app-header />
```

- Added `UserComponent` to `AppComponent`:

```ts
import { Component } from "@angular/core";
import { HeaderComponent } from "./header/header.component";
import { UserComponent } from "./user/user.component";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [HeaderComponent, UserComponent],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.css",
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
import { Component } from "@angular/core";
import { DUMMY_USERS } from "../dummy-users";

const randomUserIndex = Math.floor(Math.random() * DUMMY_USERS.length);

@Component({
  selector: "app-user",
  standalone: true,
  imports: [],
  templateUrl: "./user.component.html",
  styleUrl: "./user.component.css",
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
    <img [src]="'assets/users/' + selectedUser.avatar" [alt]="selectedUser.name" />
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
<button [disabled]="isDisabled">Save</button> <app-profile [currentUser]="user"></app-profile>
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
  selector: "app-user",
  standalone: true,
  imports: [],
  templateUrl: "./user.component.html",
  styleUrl: "./user.component.css",
})
export class UserComponent {
  selectedUser = DUMMY_USERS[randomUserIndex];

  get imagePath() {
    return "assets/users/" + this.selectedUser.avatar;
  }
}
```

so the `getter` method is just a function, and in JavaScript, I need to use `this` to access the property of the class.

This way the template is cleaner:

```html
<div>
  <button>
    <img [src]="imagePath" [alt]="selectedUser.name" />
    <span>{{ selectedUser.name }}</span>
  </button>
</div>
```

### Listening to Events with Event Binding

Adding an event listener to an element e.g. `(click)` to the `button`:

```html
<div>
  <button (click)="onSelectUser()">
    <img [src]="imagePath" [alt]="selectedUser.name" />
    <span>{{ selectedUser.name }}</span>
  </button>
</div>
```

Then, add a method to be called/executed upon some event using the `on` prefix, e.g. `onSelectUser`

```ts
const randomUserIndex = Math.floor(Math.random() * DUMMY_USERS.length);

@Component({
  selector: "app-user",
  standalone: true,
  imports: [],
  templateUrl: "./user.component.html",
  styleUrl: "./user.component.css",
})
export class UserComponent {
  selectedUser = DUMMY_USERS[randomUserIndex];

  get imagePath() {
    return "assets/users/" + this.selectedUser.avatar;
  }

  onSelectUser() {
    console.log("Clicked!");
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
  selector: "app-user",
  standalone: true,
  imports: [],
  templateUrl: "./user.component.html",
  styleUrl: "./user.component.css",
})
export class UserComponent {
  selectedUser = DUMMY_USERS[randomUserIndex];

  get imagePath() {
    return "assets/users/" + this.selectedUser.avatar;
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
import { Component, signal } from "@angular/core";
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
    <img [src]="imagePath" [alt]="selectedUser().name" />
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
import { Component, computed, signal } from "@angular/core";
import { DUMMY_USERS } from "../dummy-users";

const randomUserIndex = Math.floor(Math.random() * DUMMY_USERS.length);

@Component({
  selector: "app-user",
  standalone: true,
  imports: [],
  templateUrl: "./user.component.html",
  styleUrl: "./user.component.css",
})
export class UserComponent {
  selectedUser = signal(DUMMY_USERS[randomUserIndex]);
  imagePath = computed(() => "assets/users/" + this.selectedUser().avatar);

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
    <img [src]="imagePath()" [alt]="selectedUser().name" />
    <span>{{ selectedUser().name }}</span>
  </button>
</div>
```

I can double check by hovering over `imagePath` in the `UserComponent`, it will show `Signal<String>`.

### We Need More Flexible Components!

Instead of allowing UserComponent to set the `randomUserIndex`, I make it configurable i.e. expose properties that can be fed with data from the `AppComponent` level, so I can use the components but with different data.

Current if I do this then all the userComponent will start with the same users:

```ts
import { Component, computed, signal } from "@angular/core";
import { DUMMY_USERS } from "../dummy-users";

const randomUserIndex = Math.floor(Math.random() * DUMMY_USERS.length);

@Component({
  selector: "app-user",
  standalone: true,
  imports: [],
  templateUrl: "./user.component.html",
  styleUrl: "./user.component.css",
})
export class UserComponent {
  selectedUser = signal(DUMMY_USERS[randomUserIndex]);
  imagePath = computed(() => "assets/users/" + this.selectedUser().avatar);

  onSelectUser() {
    const randomUserIndex = Math.floor(Math.random() * DUMMY_USERS.length);
    this.selectedUser.set(DUMMY_USERS[randomUserIndex]);
  }
}
```

Why?

- The line that picks the random index sits outside the class, at the top of the file.

```ts
const randomUserIndex = Math.floor(Math.random() * DUMMY_USERS.length); // module scope
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
import { Component, Input } from "@angular/core";

@Component({
  selector: "app-user",
  standalone: true,
  imports: [],
  templateUrl: "./user.component.html",
  styleUrl: "./user.component.css",
})
export class UserComponent {
  @Input() avatar!: string; // the ! is TypeScript's way of promising this property will always have a value
  @Input() name!: string;

  get imagePath() {
    return "assets/users/" + this.avatar; // using getter here as I'm not using signals in the image path anymore
  }

  onSelectUser() {}
}
```

And in `AppComponent` I need to create a property called `users` to have access to the dummy user data:

```ts
import { Component } from "@angular/core";
import { HeaderComponent } from "./header/header.component";
import { UserComponent } from "./user/user.component";
import { DUMMY_USERS } from "./dummy-users";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [HeaderComponent, UserComponent],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.css",
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
    <img [src]="imagePath" [alt]="name" />
    <span>{{ name }}</span>
  </button>
</div>
```

I now get a list of users on the screen and every user outputs some different data.

### Required & Optional Inputs

Use this required configuration object with the `@Input` i.e. `@Input({required: true})` to align with what I tell TypeScript so that a name or avatar of a user won't be missing in the `AppComponent`:

```ts
import { Component, Input } from "@angular/core";

@Component({
  selector: "app-user",
  standalone: true,
  imports: [],
  templateUrl: "./user.component.html",
  styleUrl: "./user.component.css",
})
export class UserComponent {
  @Input({ required: true }) avatar!: string;
  @Input({ required: true }) name!: string;

  get imagePath() {
    return "assets/users/" + this.avatar;
  }

  onSelectUser() {}
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
import { Component, computed, input } from "@angular/core";

@Component({
  selector: "app-user",
  standalone: true,
  imports: [],
  templateUrl: "./user.component.html",
  styleUrl: "./user.component.css",
})
export class UserComponent {
  avatar = input.required<string>();
  name = input.required<string>();

  imagePath = computed(() => "assets/users/" + this.avatar());

  onSelectUser() {}
}
```

Also update the UserComponent template by calling signal function on `name`. Same for `imagePath`.

```html
<div>
  <button (click)="onSelectUser()">
    <img [src]="imagePath()" [alt]="name()" />
    <span>{{ name() }}</span>
  </button>
</div>
```

But to continue to current section the tutorial just change back to use `@Input` for now. Later in the course there will be more signals usage.

```ts
import { Component, Input } from "@angular/core";

@Component({
  selector: "app-user",
  standalone: true,
  imports: [],
  templateUrl: "./user.component.html",
  styleUrl: "./user.component.css",
})
export class UserComponent {
  @Input({ required: true }) avatar!: string;
  @Input({ required: true }) name!: string;

  get imagePath() {
    return "assets/users/" + this.avatar;
  }

  onSelectUser() {}
}
```

```html
<div>
  <button (click)="onSelectUser()">
    <img [src]="imagePath" [alt]="name" />
    <span>{{ name }}</span>
  </button>
</div>
```

### We Need Custom Events! Working with Outputs & Emitting Data

For example, I can pass the selected user's `id` from the `UserComponent` back to the `AppComponent` by `EventEmitter()`, which is stored in `select`.

```ts
import { Component, computed, EventEmitter, input, Input, Output } from "@angular/core";

@Component({
  selector: "app-user",
  standalone: true,
  imports: [],
  templateUrl: "./user.component.html",
  styleUrl: "./user.component.css",
})
export class UserComponent {
  @Input({ required: true }) avatar!: string;
  @Input({ required: true }) name!: string;
  @Input({ required: true }) id!: string;
  @Output() select = new EventEmitter(); // (select) in the parent template i.e. AppComponent must match @Output() select.

  get imagePath() {
    return "assets/users/" + this.avatar;
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
    <img [src]="imagePath" [alt]="name" />
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
import { Component } from "@angular/core";
import { HeaderComponent } from "./header/header.component";
import { UserComponent } from "./user/user.component";
import { DUMMY_USERS } from "./dummy-users";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [HeaderComponent, UserComponent],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.css",
})
export class AppComponent {
  users = DUMMY_USERS;

  onSelectUser(id: string) {
    console.log("Selected user with id: " + id);
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

Also, `output()` gives `OutputEmitterRef`, not a signal.

So these will work the same in this tutorial:

```ts
// old
import { Component, EventEmitter, Output } from "@angular/core";

export class UserComponent {
  @Output() select = new EventEmitter();

  onSelectUser() {
    this.select.emit(this.id);
  }
}

// new
import { Component, output } from "@angular/core";

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
import { Component, EventEmitter, Output } from "@angular/core";

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
import { Component } from "@angular/core";
import { HeaderComponent } from "./header/header.component";
import { UserComponent } from "./user/user.component";
import { DUMMY_USERS } from "./dummy-users";
import { TasksComponent } from "./tasks/tasks.component";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [HeaderComponent, UserComponent, TasksComponent],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.css",
})
export class AppComponent {
  users = DUMMY_USERS;
  selectedUserId = "u1";

  //  The get in your code is a plain TypeScript getter that reruns every time, not a computed signal that caches its result.
  get selectedUser() {
    return this.users.find((user) => user.id === this.selectedUserId)!;
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

  <app-tasks [name]="selectedUser.name" />
</main>
```

TasksComponent only needs to add `name` as a dynamic input property:

```ts
import { Component, Input } from "@angular/core";

@Component({
  selector: "app-tasks",
  standalone: true,
  imports: [],
  templateUrl: "./tasks.component.html",
  styleUrl: "./tasks.component.css",
})
export class TasksComponent {
  @Input({ required: true }) name!: string;
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
<app-tasks [name]="selectedUser.name" />
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
<app-tasks [name]="selectedUser ? selectedUser.name : ''" />
```

or this:

```html
<app-tasks [name]="selectedUser?.name" />
```

Or I can just allow `undefined` type to the `name` in the `TaskComponent` by using `|` which is an union type operator:

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
    <img [src]="imagePath" [alt]="user.name" />
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
<app-tasks [name]="selectedUser ? selectedUser.name : ''" />
```

To this to conditionally render by using `@if` and `@else` for fallback:

```html
@if(selectedUser) {
<app-tasks [name]="selectedUser.name" />
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
    <img [src]="imagePath" [alt]="user().name" />
    <span>{{ user().name }}</span>
  </button>
</div>
```

**The terms**

- `input()` and `input.required()` are _signal inputs_, also called signal
  based inputs. They return an `InputSignal<T>`.
- Calling `this.user()` is _reading the signal_. A signal is a getter function,
  so the brackets are how you unwrap the current value.
- A signal input is _read only_ inside the child. Only the parent can set it.
  The old decorator input was a writable property.
- `output()` returns an `OutputEmitterRef<T>`. It is **not** a signal, because
  an event is a notification, not a piece of state. It replaces
  `EventEmitter`, and Angular handles the cleanup on destroy.
- The `!` in `user!: User` is TypeScript's _definite assignment assertion_.
  It promises the value will exist, without proving it. A required signal
  input removes the need for it, since Angular fails the build when a parent
  omits the binding.
- The _public template API_ of the component did not change. The parent still
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

I also moved the dummy tasks data to a constant file, similar to the dummy users data.

### Outputting Task Data in the Task Component

In this `TaskComponent`, I'm using the `@Input` decorator to define property instead of input signal as I notice that in my current workplace I will see this too:

```javascript
import { Component, Input } from '@angular/core';

interface Task {
  title: string;
  dueDate: string;
  summary: string;
};

@Component({
  selector: 'app-task',
  standalone: true,
  imports: [],
  templateUrl: './task.component.html',
  styleUrl: './task.component.css'
})
export class TaskComponent {
  @Input({ required: true }) task!: Task;
}
```

### Storing Data Models in Separate Files

Move the interface type into a separate file like a data model file, `user.model.ts`.

Optional, but I can use `type` to make it clear that it's a type definition.

For example, I moved the `interface` of `User` from the `UserComponent` into `user.model.ts`. Added `export`:

```ts
export interface User {
  id: string;
  name: string;
  avatar: string;
}
```

Then `import` in the `UserComponent`:

```javascript
import { type User } from './user.model';
```

### Dynamic CSS Styling with Class Bindings

When we selected a user in the `AppComponent`, we want to pass the `selected` status to the `UserComponent` to highlight it with purple.

So we add a new property in the `UserComponent` called `selected` and it's a `boolean`value:

```ts
export class UserComponent {
  user = input.required<User>();
  select = output<string>();
  @Input({ required: true }) selected!: boolean;
```

Then in the `AppComponent` add that `selected` property to the `app-user` tag:

```html
<ul id="users">
  @for(user of users; track user.id) {
  <li>
    <app-user [user]="user" [selected]="user.id === selectedUserId" (select)="onSelectUser($event)" />
  </li>
  }
</ul>
```

`UserComponent` has this styling:

```css
.active {
  background-color: #9965dd;
  color: #150722;
}
```

`UserComponent` template can add this class binding like this:

```html
<div>
    <button [class.active]="selected" (click)="onSelectUser()">
</div>
```

So when the button is `active` i.e. true, then the colour will be applied to the button.

### More Component Communication: Deleting Tasks

Similar to `UserComponent` capture the `select` event, the `TaskComponent` now has a `complete` event that it will emit the task id bac kto the `TasksComponent`.

`TaskComponent` template:

```html
<article>
  <h2>{{ task.title }}</h2>
  <time>{{ task.dueDate }}</time>
  <p>{{ task.summary }}</p>
  <p class="actions">
    <button (click)="onCompleteTask()">Complete</button>
  </p>
</article>
```

`TaskComponent` see `onCompleteTask()`:

```ts
import { Component, EventEmitter, Input, Output } from "@angular/core";
import { type Task } from "./task.model";

@Component({
  selector: "app-task",
  standalone: true,
  imports: [],
  templateUrl: "./task.component.html",
  styleUrl: "./task.component.css",
})
export class TaskComponent {
  @Input({ required: true }) task!: Task;
  @Output() complete = new EventEmitter<string>();

  onCompleteTask() {
    this.complete.emit(this.task.id);
  }
}
```

`TasksComponent` template should make sure to capture the emitted data from `TaskComponent` i.e. the task id. See `(complete)`:

```ts
<section id="tasks">
  <header>
    <h2>{{ name() }}'s Tasks</h2>
    <menu>
      <button>Add Task</button>
    </menu>
  </header>
  <ul>
    @for(task of selectedUserTasks; track task.id) {
        <li>
            <app-task [task]="task" (complete)="onCompleteTask($event)"></app-task>
        </li>
    }
  </ul>
</section>
```

And finally, `TasksComponent` should only show all the tasks EXCEPT the completed task's id. See `onCompleteTask`:

```ts
import { Component, input, Input } from "@angular/core";
import { TaskComponent } from "./task/task.component";
import { DUMMY_TASKS } from "../dummy-tasks";

@Component({
  selector: "app-tasks",
  standalone: true,
  imports: [TaskComponent],
  templateUrl: "./tasks.component.html",
  styleUrl: "./tasks.component.css",
})
export class TasksComponent {
  userId = input.required<String>();
  name = input.required<String>();
  tasks = DUMMY_TASKS;

  get selectedUserTasks() {
    return this.tasks.filter((task) => task.userId === this.userId());
  }

  onCompleteTask(taskId: string) {
    this.tasks = this.tasks.filter((task) => task.id !== taskId);
  }
}
```

### Creating & Conditionally Rendering Another Component

Run:

```bash
ng g c tasks/new-task --skip-tests
```

In `TasksComponent`, add a click listener on the `Add Task` to call this `onStartAddTask()`, which will set true to the `isAddingTask` flag, so we can see the `NewTaskComponent` conditionally.

`TasksComponent` template:

```html
@if(isAddingTask) {
<app-new-task />
}

<section id="tasks">
  <header>
    <h2>{{ name() }}'s Tasks</h2>
    <menu>
      <button (click)="onStartAddTask()">Add Task</button>
    </menu>
  </header>
  ...
</section>
```

`TasksComponent`:

```ts

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [TaskComponent, NewTaskComponent],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.css'
})
export class TasksComponent {
  userId = input.required<String>();
  name = input.required<String>();
  tasks = DUMMY_TASKS;
  isAddingTask = false;

...

  onStartAddTask() {
    this.isAddingTask = true;
  }
}
```

### Managing The "New Task" Dialog

Start with `TasksComponent` by adding `onCancelAddTask()`.

```ts
export class TasksComponent {
  userId = input.required<String>();
  name = input.required<String>();
  tasks = DUMMY_TASKS;
  isAddingTask = false;

  onCancelAddTask() {
    this.isAddingTask = false;
  }
}
```

In `TasksComponent` template, `NewTasksComponent` can have `cancel` custom event created by an output property (declared with the @Output() decorator).

```ts
@Component({
  selector: "app-new-task",
  standalone: true,
  imports: [],
  templateUrl: "./new-task.component.html",
  styleUrl: "./new-task.component.css",
})
export class NewTaskComponent {
  @Output() cancel = new EventEmitter<void>(); // void: as the output event emitter is not emitting any data

  onCancel() {
    this.cancel.emit();
  }
}
```

`@Output() cancel` is the bell button wired up inside the house. `this.cancel.emit()` is someone pressing it. And `(cancel)="onCancelAddTask()"` in the parent is you saying "when that bell rings, I will go answer the door".

You may also hear people say the child "emits an event up to the parent". That is the general pattern name: child to parent communication.

It will emit `void`, which will then trigger `onCancelAddTask()`.

```html
@if(isAddingTask) {
<app-new-task (cancel)="onCancelAddTask()" />
}

<section id="tasks">
  <header>
    <h2>{{ name() }}'s Tasks</h2>
    <menu>
      <button (click)="onStartAddTask()">Add Task</button>
    </menu>
  </header>
  <ul>
    @for(task of selectedUserTasks; track task.id) {
    <li>
      <app-task [task]="task" (complete)="onCompleteTask($event)"></app-task>
    </li>
    }
  </ul>
</section>
```

The reverse direction, `[task]="task"` in your `app-task` line, is property binding using an input property.

A coupld of things in the `NewTaskComponent` template:

- Make sure the backdrop and the cancel button of the `NewTaskComponent` template both places had added the click listener.
- Note that the cancel button is of `button` type so that it won't accidentally submit the form when it's clicked.

```html
<div class="backdrop" (click)="onCancel()"></div>
<dialog open>
  <h2>Add Task</h2>
  <form>
    <p>
      <label for="title">Title</label>
      <input type="text" id="title" name="title" />
    </p>

    <p>
      <label for="summary">Summary</label>
      <textarea id="summary" rows="5" name="summary"></textarea>
    </p>

    <p>
      <label for="due-date">Due Date</label>
      <input type="date" id="due-date" name="due-date" />
    </p>

    <p class="actions">
      <button type="button" (click)="onCancel()">Cancel</button>
      <button type="submit">Create</button>
    </p>
  </form>
</dialog>
```

### Using Directives & Two-Way-Binding

Now I need to get the input value when the form is submitted.

So I need to use `ngModel` to do two-way-binding to do the data binding.

With angular, we can "enhance" elements by adding "Directives" to them.

For example, `<input ngModel>` where `ngModel` helps with extracting or changing user input values.

Component are directives just that they are directives with templates.

I'm setting a two-way binding on this `enteredTitle` property. In order to use that `ngModel` directive in the `NewTaskComponent` template, I need to import the `FormModule` first:

```ts
@Component({
  selector: 'app-new-task',
  standalone: true,
  imports: [FormsModule],
...
})
```

Then, `NewTaskComponent` template:

```html
<input type="text" id="title" name="title" [(ngModel)]="enteredTitle" />
```

And add the `enteredTitle` property to the `NewTaskComponent`:

```ts
@Component({
  selector: 'app-new-task',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './new-task.component.html',
  styleUrl: './new-task.component.css'
})
export class NewTaskComponent {
  @Output() cancel = new EventEmitter<void>();
  enteredTitle = '';
  enteredSummary = '';
  enteredDate = '';
```

Note that the input even with the type as date, it will still give me a string value, not a date object:

```html
<input type="date" />
```

### Signals & Two-way-binding

I can just make those properties into signals and the ngModel directives will know they're now signals, so in the template I don't need to change anything:
```ts
export class NewTaskComponent {
  @Output() cancel = new EventEmitter<void>();
  enteredTitle = signal('');
  enteredSummary = signal('');
  enteredDate = signal('');
```

So template remains as this:
```html
<input type="text" id="title" name="title" [(ngModel)]="enteredTitle" />
<textarea id="summary" rows="5" name="summary" [(ngModel)]="enteredSummary"></textarea>
etc.
```

not this:
```html
<input type="text" id="title" name="title" [(ngModel)]="enteredTitle()" />
```

but the rest of this exercise will not be using signals for these three properties. He just demonstrated that this will work.

### Handling Form Submission

When we use the `FormsModule` from angular, it automatically prevents the browser to send a request with the form data to the browser for us. Our local development server only handles the `index.html` file.

The `FormsModule` takes control of the `<form>` element and allows us to listen with the `ngSubmit` event which will occur when that form submission happened and that browser default was prevented.

`NewTaskComponent` template:
```html
  <form (ngSubmit)="onSubmit()">
```

And add `onSubmit()` to the `NewTaskComponent`.

### Using the Submitted data

`NewTaskComponent` will emit the submit event that pass a data object:
```html
<form (ngSubmit)="onSubmit()">
```

```ts
export class NewTaskComponent {
  @Output() cancel = new EventEmitter<void>();
  @Output() add = new EventEmitter<NewTaskData>();
  enteredTitle = '';
  enteredSummary = '';
  enteredDate = '';
  
  onCancel() {
    this.cancel.emit();
  }

  onSubmit() {
    this.add.emit({
      title: this.enteredTitle,
      summary: this.enteredSummary,
      date: this.enteredDate
    });
  }
}
```

The shape of the data object is called `NewTaskData` exported from a dedicated file `task.model.ts`:
```ts
export interface NewTaskData {
  title: string;
  summary: string;
  date: string;
}
```

`TasksComponent` is where the local task array data is at, so it needs to listen to the `NewTaskComponent` custom event, `add()`, and call its `onAddTask()` accordingly:

```html
@if(isAddingTask) {
  <app-new-task (cancel)="onCancelAddTask()" (add)="onAddTask($event)"/>
}
```

```ts
export class TasksComponent {
  @Input({ required: true }) userId!: string; // I've changed this back to use decorators
  @Input({ required: true }) name!: string;   // I've changed this back to use decorators
  tasks = DUMMY_TASKS;
  isAddingTask = false;

  get selectedUserTasks() {
    return this.tasks.filter((task) => task.userId === this.userId);
  }

  onCompleteTask(taskId: string) {
    this.tasks = this.tasks.filter((task) => task.id !== taskId);
  }

  onStartAddTask() {
    this.isAddingTask = true;
  }

  onCancelAddTask() {
    this.isAddingTask = false;
  }

  onAddTask(newTaskData: NewTaskData) {
    // In a real application, you would typically send the new task data to a backend service here
    // For demonstration purposes, I'm just adding it to the local tasks array
    // Use the built-in method in JavaScript to add the task to the top of the array
    this.tasks.unshift({
      id: new Date().getTime().toString(), // use timestamp as a unique id for the new task
      userId: this.userId,
      title: newTaskData.title,
      summary: newTaskData.summary,
      dueDate: newTaskData.date,
    });
    this.isAddingTask = false; // close the form after adding a new task
  }
```

Until now, I can add a new task to each user!

### Content Projection with ng-content

Now I want to each task card has a specific styling. 

So I'm learning to create a shared component called `CardComponent` in the `src/app/shared` folder.

```bash
cd 01-starting-project/src/app

ng g c shared/card --skip-tests
```

Refer to the `UserComponent` css here and move this to `CardComponent` css file:
```css
div {
  border-radius: 6px;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}
```

And make the template of the `CardComponent` to be just like this:
```html
<div>...</div>
```

Then, apply this `CardComponent` to be a wrapper of the `UserComponent`.

So in the `UserComponent`, replace the outer `div` with the `app-card` elements:
```html
<!-- old -->
<div>
    <button [class.active]="selected" (click)="onSelectUser()">
        <img 
        [src]="imagePath"
        [alt]="user().name" />
        <span>{{ user().name }}</span>
    </button>
</div>

<!-- new -->
<app-card>
    <button [class.active]="selected" (click)="onSelectUser()">
        <img 
        [src]="imagePath"
        [alt]="user().name" />
        <span>{{ user().name }}</span>
    </button>
</app-card>
```

But now all the `UserComponents` will become just `...`, as Angular here just uses the markup of the new template from `app-card`. The `button` part aka the old markup will be replaced.

So add this `ng-content` to the wrapping component, `CardComponent`, template:
```html
<div>
    <ng-content />
</div>
```

Now each user button has the right names and the outer card has rounded corner now.

I can use this `CardComponent` to other components too like to the `TaskComponent`.

Remember to import the `CardComponent` to the `UserComponent`, `TaskComponent`, etc. when I'm using it!

### Transforming Template Data with Pipes

In `TaskComponent`, I used the built-in `date pipe` which will format the date in a human readable way.

Refer to the doc about `DatePipe` [here](!https://angular.dev/api/common/DatePipe).

```html
<app-card>
    <article>
        <h2>{{ task.title }}</h2>
        <time>{{ task.dueDate | date: 'fullDate' }}</time>
        <p>{{ task.summary }}</p>
        <p class="actions">
            <button (click)="onCompleteTask()">Complete</button>
        </p>
    </article>
</app-card>
```

This will give me `Saturday, June 15, 2024` instead of the default `May 31, 2024`.

### Getting Started with Services

So far all the features are ready.

But I should keep my components as lean as possible. I should use a `service` to manage the data that will be used in multiple places in the app.

For example, `TasksComponent`'s task data should be moved to a dedicated service class.

Create `src\app\tasks\tasks.service.ts`. Start outsourcing all the task's data management related logic to here e.g. the dummy tasks data, and several functions of getting, adding and removing tasks.

So now `TasksService` looks like this:
```ts
import { type NewTaskData } from "./task/task.model"; // add `type` keyword to make it clear that it's an interface

export class TasksService {
    private tasks = [
        {
            id: 't1',
            userId: 'u1',
            title: 'Master Angular',
            summary:
            'Learn all the basic and advanced features of Angular & how to apply them.',
            dueDate: '2025-12-31',
        },
        {
            id: 't2',
            userId: 'u3',
            title: 'Build first prototype',
            summary: 'Build a first prototype of the online shop website',
            dueDate: '2024-05-31',
        },
        {
            id: 't3',
            userId: 'u3',
            title: 'Prepare issue template',
            summary:
            'Prepare and describe an issue template which will help with project management',
            dueDate: '2024-06-15',
        },
    ];

    getUserTasks(userId: string) {
        return this.tasks.filter((task) => task.userId === userId);
    }

    addTask(userId: string, newTaskData: NewTaskData) {
        this.tasks.unshift({
            id: new Date().getTime().toString(), // use timestamp as a unique id for the new task
            userId: userId,
            title: newTaskData.title,
            summary: newTaskData.summary,
            dueDate: newTaskData.date,
        });
    }

    removeTask(taskId: string) {
        this.tasks = this.tasks.filter((task) => task.id !== taskId);
    }
}
```

### Getting Started with Dependency Injection

If I just do this, it will be a huge problem as I'm creating a separate independent instance of this service for this `TasksComponent` only, so if the data in the `TasksService` had been changed by other components, then the new change will noe be reflected in `TasksComponent`:
```ts
export class TasksComponent {
  @Input({ required: true }) userId!: string;
  @Input({ required: true }) name!: string;
  tasks = DUMMY_TASKS;
  isAddingTask = false;
  private tasksService = new TasksService(); // here :(

  get selectedUserTasks() {
    return this.tasksService.getUserTasks(this.userId);
  }

  onCompleteTask(taskId: string) {
    this.tasksService.removeTask(taskId);
  }
```

So I need to use `Dependency Injection` along with this concept of `service`.

Basically, I don't create an instance on my own. I tell Angular to create it for me. Angular can create it once and this instance can be used in different components in the app.

Replace that private property with a constructor, which will be instantiated when this `TasksComponent` class is created.
```ts
@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [TaskComponent, NewTaskComponent],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.css'
})
export class TasksComponent {
  @Input({ required: true }) userId!: string;
  @Input({ required: true }) name!: string;
  isAddingTask = false;

  constructor(private tasksService: TasksService) {} // here :)

  get selectedUserTasks() {
    return this.tasksService.getUserTasks(this.userId); // updated to use TasksService instead
  }

  onCompleteTask(taskId: string) {
    this.tasksService.removeTask(taskId); // updated to use TasksService instead
  }

  onStartAddTask() {
    this.isAddingTask = true;
  }

  onCancelAddTask() {
    this.isAddingTask = false;
  }
}
```

Actually writing that `private tasksService` is a shorthand in TypeScript where it creates property of the same name `tasksService`.

And then add this decorator to `TasksService` class to make it injectable.

```ts
@Injectable({ providedIn: 'root'})
export class TasksService {
  ...
```

### More Service Usage & Alternative Dependency Injection Mechanism

Other than the `TasksComponent`, I can also use service in the `NewTasksComponent`.

So in the `NewTasksComponent`, instead of emitting the new task data to update the local tasks array in the parent component, `TasksComponent`, I can directly update and add the tasks data from the child component, `NewTasksComponent` there (ofc it only works after I inject the `TasksService`):

```ts
@Component({
  selector: 'app-new-task',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './new-task.component.html',
  styleUrl: './new-task.component.css'
})
export class NewTaskComponent {
  @Input({ required: true}) userId!: string; // added for this.tasksService.addTask()
  @Output() close = new EventEmitter<void>(); // even though now I can use TasksService to add a new task, I still want to emit the new task data to the parent component (TasksComponent) to close the dialog 
  enteredTitle = '';
  enteredSummary = '';
  enteredDate = '';
  private tasksService = inject(TasksService); // another way to write the dependency injection for the TasksService

  onCancel() {
    this.close.emit();
  }

  onSubmit() {
    this.tasksService.addTask(this.userId, {
      title: this.enteredTitle,
      summary: this.enteredSummary,
      date: this.enteredDate
    });
    this.close.emit();
  }
}
```

I also removed the `add` output event as I no longer need to emit the new task data to update the tasks, and also change the `cancel` output event to a more generic name as `close`, so this child component, `NewTasksComponent`, can still let the parent component, `TasksComponent`, know that this child component is ready to be closed (it's a dialog to be closed after a task is clicked with the created or the cancelled button).

Another minor change - `onCancelAddTask()` is also updated to `onCloseAddTask()`:
```ts
@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [TaskComponent, NewTaskComponent],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.css'
})
export class TasksComponent {
  @Input({ required: true }) userId!: string;
  @Input({ required: true }) name!: string;
  isAddingTask = false;

  constructor(private tasksService: TasksService) {}

  get selectedUserTasks() {
    return this.tasksService.getUserTasks(this.userId);
  }

  onCompleteTask(taskId: string) {
    this.tasksService.removeTask(taskId);
  }

  onStartAddTask() {
    this.isAddingTask = true;
  }

  onCloseAddTask() {  // updated!
    this.isAddingTask = false;
  }
}
```

#### The service is a single shared object

In `TasksService`, `@Injectable({ providedIn: 'root' })` tells Angular to create one instance of `TasksService` for the whole app. Every component that asks for it gets the same object.

So think of `tasks` as one shared notebook sitting on a desk. Anyone who writes in it changes the notebook everyone else reads.

#### `unshift` writes into that notebook

`this.tasks.unshift(...)` does not make a copy. It adds the new task to the front of the existing array. The private property now points to a list with one extra item, and it stays that way until the app stops.


#### `filter` builds a brand new array

`removeTask` does something slightly different. `filter` builds a brand new array, then `this.tasks = ...` swaps the old notebook for the new one.

#### Why this is not "forever"

The array lives in memory only. It was written directly into the class as a starting value. When you refresh the page, the browser throws away all the JavaScript memory, Angular starts again, and the class field is created fresh from that original list of three tasks. Your added task is gone. Your removed task is back.

To make it survive a refresh you need to save it somewhere outside memory. In a small learning project that is usually `localStorage`. In a real app it is a backend API and a database.

### Time to Practice: Services

Remove the `complete` output event from `TaskComponent`, so I don't need to pass on the `taskId` to the `TasksComponent`, the parent component, and do `onCompleteTask()` there.

Instead now I can directly run `onCompleteTask()` in the child compoennt, `TaskCompoent`, here as now it has access directly to the `TasksService`.

```ts
@Component({
  selector: 'app-task',
  standalone: true,
  imports: [CardComponent, DatePipe],
  templateUrl: './task.component.html',
  styleUrl: './task.component.css'
})
export class TaskComponent {
  @Input({ required: true }) task!: Task;
  private tasksService = inject(TasksService); // updated!
  
  onCompleteTask() {
    this.tasksService.removeTask(this.task.id); // updated!
  }
}
```

And in the parent `TasksComponent` I don't need it to listen to the `complete` event anymore, so everything is cleaner:
```html
@for(task of selectedUserTasks; track task.id) {
    <li>
        <app-task [task]="task"></app-task>
    </li>
} 
```

### Using localStorage for Data Storage

Moving the tasks data in the `TasksService` into `localStorage` for now.

Use a `constructor` in the `TasksService` to make sure it will check if the tasks data exists in the local storage when the app is up.

Since the local storage can only save values in strings, I will need to parse it into json format before using it.

Then, whenever I add or remove a task, it has to update the local storage accordingly. This step will need me to convert the json data format into string format in order to get into the local storage.

```ts
import { type NewTaskData } from "./task/task.model";
import { Injectable } from "@angular/core";

@Injectable({ providedIn: 'root'})
export class TasksService {
    private tasks = [
        {
            id: 't1',
            userId: 'u1',
            title: 'Master Angular',
            summary:
            'Learn all the basic and advanced features of Angular & how to apply them.',
            dueDate: '2025-12-31',
        },
        {
            id: 't2',
            userId: 'u3',
            title: 'Build first prototype',
            summary: 'Build a first prototype of the online shop website',
            dueDate: '2024-05-31',
        },
        {
            id: 't3',
            userId: 'u3',
            title: 'Prepare issue template',
            summary:
            'Prepare and describe an issue template which will help with project management',
            dueDate: '2024-06-15',
        },
    ];

    constructor() {
        const tasks = localStorage.getItem('tasks');
        if (tasks) {
            this.tasks = JSON.parse(tasks);
        }
    }

    private saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks)); // Cool!
    }

    getUserTasks(userId: string) {
        return this.tasks.filter((task) => task.userId === userId);
    }

    addTask(userId: string, newTaskData: NewTaskData) {
        this.tasks.unshift({
            id: new Date().getTime().toString(), // use timestamp as a unique id for the new task
            userId: userId,
            title: newTaskData.title,
            summary: newTaskData.summary,
            dueDate: newTaskData.date,
        });
        this.saveTasks();
    }

    removeTask(taskId: string) {
        this.tasks = this.tasks.filter((task) => task.id !== taskId);
        this.saveTasks();
    }
}
```

Here is the sequence on a fresh browser with empty local storage:

1. App boots. The service is created. The constructor runs `getItem('tasks')` and gets `null`. Nothing is stored yet, so `this.tasks` keeps your three defaults, in memory only.
2. Local storage is still empty at this point. You could open DevTools now and see no `tasks` key.
3. You click something. Maybe you added a task. Maybe you completed or deleted one.
4. That click runs `addTask` or `removeTask`. Both end with `this.saveTasks()`.
5. `saveTasks()` runs `setItem('tasks', JSON.stringify(this.tasks))`. This is the first ever write. And here is the important bit: `this.tasks` at that moment is your three defaults, changed by that one action.

The key thing I learned is that the `saveTasks()` actually save the whole updated tasks array into the local storage, regardless of the adding or the removing happened first:
```ts
// You added one task. But JSON.stringify writes the WHOLE array.
localStorage.setItem('tasks', JSON.stringify(this.tasks));
```

### Module Summary

I was creating component tree to faster development workflow, practice how the parent components can talk to the child components using `@Input` and the child components can talk back to the parent components using `@Output`. 

Template binding for dynamic data display e.g. string interpolation. 

Property binding to set the property of an element in the template. 

Event binding allows elements to listen to events so it knows what to execute when the event occurs.

Two-way binding for the form inputs setup by `ngModel` directive from `FormsModule` to setup two-way communication on an `Input` element.

Whenever I want to change the UI, there are two ways:
- with zone.js, update some data in the `TasksComponent` with `isAddingTask = false;`, and output that data in the template using some template binding features e.g. `{{ name }}` in the `TasksComponent` template, and Angular will figure out the rest 
- with signal, I can explicitly tell Angular that there is a change. Angular will set up a subscription when I read the signal e.g. `user()` in the `UserComponent` template. This will lead to better state management mechanism and better performance.

Control flow block, `@if` and `@for`, and `@for` are helpful and common to use nowadays since angular 17+.

Use `ng-content` to create a slot in the markup of a template to render the content that's passed between the tags of that component.

Other important concepts: `pipe`, `ngSubmit()` and `services` (with dependency injection).