# NOTES

This is a place where I take notes for the practice project of the section 14 of the course, `Routing & Building Multi-page Single Page Applications`.

## Setup the Starting Project

Follow what I did for the section 9 exercise.

Then, run `npm install`, and then `npm start`.

## What is Routing

Angular apps are single page applications, which means there's only a single HTML page that's being served by the server that's hosting my Angular application to the client i.e. to the user visiting the website that's requesting this website/angular web app.

For example, `01-starting-project-section-14\src\index.html`.

It gives us a website that feels like it consists of multiple pages.

I will want to update the UI as the user navigates through my webpage.

The browser url will be updated so that it links to different parts of my website.

Angular allows the client-side routing:
- It watches and manipulates the url and renders different components for different urls.
- It's happening in the browser. There's no server-side routing involved.
- Angular takes care of updating the url, reading the url and loading different components depending on the currently active url.

## Enabling routing & adding the first route

First step - when a user is selected from the left side, the UI on the right side should be updated accordingly.

This time, instead of relying on the `state` variable to conditionally render a different UI component, I use a different route to display different components on the screen.

Add routing to the app in `main.ts`:

```ts
// main.ts
bootstrapApplication(AppComponent).catch((err) => console.error(err));
```

Add a second argument to `bootstrapApplication`, and call the `provideRouter()` function in the `providers`. `provideRouter()` is imported from Angular router. `provideRouter()` will want an array of routes as an argument:

```ts
// main.ts
bootstrapApplication(AppComponent, {
   providers: [provideRouter([])], // added!
}).catch((err) => console.error(err));
```

A route in Angular is a combination of a path in my url, and the information which component should become active and should be loaded when that path becomes active. It will be an object like this, including `path` and `component`:

```ts
// main.ts
bootstrapApplication(AppComponent, {
   providers: [provideRouter([
    {
        path: 'tasks', // <your-domain>/tasks  // added!
        component: TasksComponent  
    }
   ])], 
}).catch((err) => console.error(err));
```

It's quite common to have a dedicated file, `app.routes.ts`, next to my `AppComponent` to store that routes array:

```ts
// app.routes.ts
import { Routes } from "@angular/router";

export const routes: Routes = [
    {
        path: 'tasks', // <your-domain>/tasks
        component: TasksComponent  
    }
]
```

And then in `main.ts` import the `routes` array:

```ts
//main.ts
bootstrapApplication(AppComponent, {
   providers: [provideRouter(routes)],  // updated!
}).catch((err) => console.error(err));
```

I can even take that configuration object and put it in a dedicated file, `app.config.ts`, next to `app.routes.ts`, and export this `appConfig` object:

```ts
// app.config.ts
import { provideRouter } from "@angular/router";
import { routes } from "./app.routes";
import { ApplicationConfig } from "@angular/core";

export const appRoutes: ApplicationConfig = {
   providers: [provideRouter(routes)], 
}
```

So the final `main.ts` becomes:

```ts
import { appRoutes } from './app/app.config';

bootstrapApplication(AppComponent, appRoutes).catch((err) => console.error(err));
```

So now I've made all the files lean and clean and the routing is enabled for this application.

Next, I will be adding more routes to see the routing working.

## Rendering Routes

In `AppComponent` template, place a marker so that Angular knows where in the screen it should render the `TasksComponent` template.

First, add this import to the `AppComponent`:

```ts
@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [HeaderComponent, UsersComponent, RouterOutlet],
})
export class AppComponent {}
```

And replace `<p>Todo ...</p>` with `<router-outlet />`:

```html
<app-header />

<main>
  <app-users />

  <div>
    <router-outlet /> <--- here's where the loaded component should be displayed
  </div>
</main>
```

So now when I navigate to `http://localhost:4200/tasks` it will show `There are no tasks yet. Start adding some!` instead of `Todo ...` on the right side.

If I go back to `http://localhost:4200/`, there will be nothing on the right side.

Back to `http://localhost:4200/tasks` route, and open the Elements tab, I can see `<app-tasks>` rendered alongside the `<router-outlet />`:

```html
<div>
    <router-outlet />
    <app-tasks></app-tasks> <--- here!
</div>
```

## Registering Multiple Routes

Add a route that's empty and it will visit the `NoTaskComponent`.

For example, in `app.routes.ts`:

```ts
export const routes: Routes = [
    {
        path: '',  // <your-domain>/
        component: NoTaskComponent
    },
    {
        path: 'tasks', // <your-domain>/tasks
        component: TasksComponent  
    }
]
```

So now if I go to `http://localhost:4200/`, then on the right side, it will just show `Select a user to see their tasks!`.


## Adding Links the Right Way

The goal is to do this - when a user is clicked in the left side navigation, it should navigate to the url that includes an user id.

In the `UserComponent` template, if I directly add `href` to the `a` tag, it will keep fetching the `index.html` and loading all the JavaScript files for `TasksComponent` in the Network tab, and the screen will keep refreshing:

```html
<div>
  <a href="/tasks">
    <img [src]="imagePath()" [alt]="user().name" />
    <span>{{ user().name }}</span>
  </a>
</div>
```

Instead, I should use the `routerLink` directive - Angular will block the default browser behavior which was to fetch the `index.html` all the time, and Angular will look at the `app.route.ts` to load the right component for me.

So update the `UserComponent` template with `routerLink="/tasks"`:

```html
<div>
  <a routerLink="/tasks">
    <img [src]="imagePath()" [alt]="user().name" />
    <span>{{ user().name }}</span>
  </a>
</div>

```

And add the `RouterLink` import to the `UserComponent`:

```ts
@Component({
  selector: 'app-user',
  standalone: true,
  imports: [RouterLink], // added!
  templateUrl: './user.component.html',
  styleUrl: './user.component.css',
})
export class UserComponent {
  user = input.required<User>();

  imagePath = computed(() => 'users/' + this.user().avatar);
}
```

So now when I click on each user in the left side bar, the page will not flicker. The HTML and JavaScript files are fetched once in the Network tab.

## Styling Active Navigation Links

The goal is to set up dynamic styling to the active tab i.e. when a user is clicked in the left side bar, its tab should be lit up.

I can do this by adding some code to the dynamic property `[class.selected]="isSelected()"`:
```html
<div>
  <a routerLink="/tasks" [class.selected]="isSelected()">
    <img [src]="imagePath()" [alt]="user().name" />
    <span>{{ user().name }}</span>
  </a>
</div>
```

Note:
- `[class.selected]` is a class binding. It tells Angular to add or remove one CSS class, here selected, based on a condition.
- Angular calls `isSelected()` on your component. If it returns true, the anchor tag gets the class added, so it becomes `<a class="selected" ...>`. If it returns false, the class stays off.

I can also use this `routerLinkActive` directive like this:

```html
<div>
  <a routerLink="/tasks" routerLinkActive="selected">
    <img [src]="imagePath()" [alt]="user().name" />
    <span>{{ user().name }}</span>
  </a>
</div>
```

And add the `RouterLink` import to the `UserComponent`:

```ts
@Component({
  selector: 'app-user',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css',
})
export class UserComponent {
  user = input.required<User>();

  imagePath = computed(() => 'users/' + this.user().avatar);
}
```

Now on the screen, all the user tabs are lit up as they're all pointing to the same route, `/tasks`.

I should start adding the user id of whom I clicked to this path, `/tasks`. I also need to set up a route that allows me to encode the dynamic info into the path in `app.routes.ts`.

## Setting up and Navigating to Dynamic Routes

`:userId` is the dynamic path segment. It's up to me how to name it. It can be `:uId`.

`users/:userId` will be `<your-domain>/users/u1`, `<your-domain>/users/u2`, etc., because `User` interface has `id` property and the mock data has `u1`, `u2`, etc.:

```ts
export const routes: Routes = [
    ...
    {
        path: 'users/:userId', // <your-domain>/users/u1
        component: UserTasksComponent
    }
]
```

To give `routerLink` dynamic values, I need to change it to property binding like the below.

In `UserComponent` template:

```html
<!-- old -->
<div>
  <a routerLink="/users/" routerLinkActive="selected">
    <img [src]="imagePath()" [alt]="user().name" />
    <span>{{ user().name }}</span>
  </a>
</div>

<!-- new -->
<div>
  <a [routerLink]="'/users/' + user().id" routerLinkActive="selected">
    <img [src]="imagePath()" [alt]="user().name" />
    <span>{{ user().name }}</span>
  </a>
</div>
```

In `UserComponent`, I've got a `user` InputSignal so I could use it with `user()`:

```ts
export class UserComponent {
  user = input.required<User>();
}
```

And besides writing like this `[routerLink]="'/users/' + user().id"`, I can also write like this to pass an array (basically each item in the array is a segment in the path, and Angular will automatically insert `/` in between the segments):

```html
<div>
  <a [routerLink]="['/users', user().id]" routerLinkActive="selected">
    <img [src]="imagePath()" [alt]="user().name" />
    <span>{{ user().name }}</span>
  </a>
</div>
```

So now on screen, when I click on each user tab in the left side nav bar, the url will change to the clicked user like `http://localhost:4200/users/u3`, and it will be lit up as `active` style.

## Extracting Dynamic Route Parameters via Inputs

My goal is to get the path parameter in a component e.g. from `users/:userId` into `UserTasksComponent`.

In `app.routes.ts` I have this:

```ts
{
    path: 'users/:userId', // <your-domain>/users/u1
    component: UserTasksComponent
}
```

Use an input with the same name as the path parameter like `userId` in the `UserTasksComponent`:

```ts
export class UserTasksComponent {
  userId = input.required<string>();
}
```

`userId` from the url will be a string as the entire url is going to be a long string.

I then need to go to `app.config.ts` to tell Angular that I want to use this input based approach, and add `withComponentInputBinding()` like this:

```ts
export const appRoutes: ApplicationConfig = {
   providers: [
      provideRouter(routes, withComponentInputBinding())
   ], 
}
```

Once that's done, which is `Enables binding information from the Router state directly to the inputs of the component in Route configurations.`, then in the `UserTasksComponent` I should be able to do this:

```html
<!-- old -->
<section id="tasks">
  <header>
    <h2>USERS Tasks</h2>
    <menu>
      <a>Add Task</a>
    </menu>
  </header>

  <p>Todo ...</p>
</section>


<!-- new -->

```

Note that the user data is from `UsersService` which is getting dummy users data from `DUMMY_USERS`.

```ts
@Injectable({
  providedIn: 'root',
})
export class UsersService {
  get users() {
    return DUMMY_USERS;
  }
}
```

```ts
export const DUMMY_USERS = [
  {
    id: 'u1',
    name: 'Jasmine Washington',
    avatar: 'user-1.jpg',
  },
    ...
];
```

So then I can inject the `UsersService` into the `UserTasksComponent` and then create a computed signal, `userName`, to find the user with userId from the url. Retrieve its name to display:

```ts
export class UserTasksComponent {
  userId = input.required<string>();

  private usersService = inject(UsersService);
  userName = computed(() => 
    this.usersService.users.find(user => user.id === this.userId())?.name
  );
}
```

And sub the task title with the `userName` of the selected user (the url with append with that selected user's id too):

```html
<section id="tasks">
  <header>
    <h2>{{ userName() }} Tasks</h2>
    <menu>
      <a>Add Task</a>
    </menu>
  </header>

  <p>Todo ...</p>
</section>
```

This is one way of extracting the data from the url and using it in a component.

## Extracting Dynamic Route Parameters via Observables

Alternatively, I can use an observable.

For example, using `activatedRoute` will give me an object. One of the properties is `paramMap`, and it's an observable.

`ActivatedRoute` provides information about the route associated with the currently loaded component. Read ![here](https://angular.dev/api/router/ActivatedRoute).

```ts
export class UserTasksComponent implements OnInit {
  private activatedRoute = inject(ActivatedRoute); // added!

  private usersService = inject(UsersService);

  ngOnInit() {
    console.log('activatedRoute: ', this.activatedRoute);   // added!
    this.activatedRoute.paramMap.subscribe((paramMap) => {  // added!
      console.log('paramMap: ', paramMap);
    });
  }
}
```

And the `paramMap` looks like this:

```
{
    "params": {
        "userId": "u2"
    }
}
```

`paramMap` has a `get` method to allow me to extract one of its key value pairs. Read ![here](https://angular.dev/api/router/ParamMap).

So I can do this:

```ts
export class UserTasksComponent implements OnInit {
  private activatedRoute = inject(ActivatedRoute);
  private usersService = inject(UsersService);
  private destroyRef = inject(DestroyRef); // added!
  userName = '';

  ngOnInit() {
    const subscription = this.activatedRoute.paramMap.subscribe({  // updated! whenever there is user id changes, it will notify
      next: (paramMap: ParamMap) => 
        this.userName = this.usersService.users.find(user => user.id === paramMap.get('userId'))?.name || ''
    });
    this.destroyRef.onDestroy(() => subscription.unsubscribe()); // added!
  }
}
```

And since the `userName` is no longer a signal in this approach, so the template here should update as this `userName` instead of `userName()`:

```html
<section id="tasks">
  <header>
    <h2>{{ userName }} Tasks</h2>
    <menu>
      <a>Add Task</a>
    </menu>
  </header>

  <p>Todo ...</p>
</section>
```

And it will have the same effect as the previous section's code:

```ts
export class UserTasksComponent {
  userId = input.required<string>();

  private usersService = inject(UsersService);
  userName = computed(() => 
    this.usersService.users.find(user => user.id === this.userId())?.name
  );
}
```

```html
<section id="tasks">
  <header>
    <h2>{{ userName() }} Tasks</h2>
    <menu>
      <a>Add Task</a>
    </menu>
  </header>

  <p>Todo ...</p>
</section>
```

Another thing I noticed is that when using `ActivatedRoute` and clicked on each user to go to different routes, the `UserTasksComponent` is actually reused between the routes, `http://localhost:4200/users/u5`, `http://localhost:4200/users/u4`, etc.

Console log of `activatedRoute` in `ngOnInit` only happened once:

```ts
export class UserTasksComponent implements OnInit {
  private activatedRoute = inject(ActivatedRoute);
  private usersService = inject(UsersService);
  private destroyRef = inject(DestroyRef);
  userName = '';

  ngOnInit() {
    console.log('activatedRoute: ', this.activatedRoute); // logged once
    const subscription = this.activatedRoute.paramMap.subscribe({
      next: (paramMap: ParamMap) => 
        this.userName = this.usersService.users.find(user => user.id === paramMap.get('userId'))?.name || ''
    });
    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }
}
```

## Working with Nested Routes

My goal is to show the list of tasks of an user:

`UserTasksComponent` template:

```html
<section id="tasks">
  <header>
    <h2>{{ userName }} Tasks</h2>
    <menu>
      <a>Add Task</a>
    </menu>
  </header>

  <p>Todo ...</p>
</section>
```

Start with registering a child path under the `users/:userId` path.

Note that the child path will be appended to the the parent path like this - `users/:userId/tasks`.

In `app.routes.ts`:

```ts
export const routes: Routes = [
    {
        path: '',  // <your-domain>/
        component: NoTaskComponent
    },
    {
        path: 'users/:userId', // <your-domain>/users/u1
        component: UserTasksComponent,
        children: [
            {
                path: 'tasks', // <your-domain>/users/u1/tasks
                component: TasksComponent
            }
        ]
    }
]
```

Then, I also need to add a child `router outlet` in the `UserTasksComponent` template.

Like this:

```html
<section id="tasks">
  <header>
    <h2>{{ userName }} Tasks</h2>
    <menu>
      <a>Add Task</a>
    </menu>
  </header>

  <router-outlet />
</section>
```

And add that `router outlet` into the `imports` in the component here:

```ts
@Component({
  selector: 'app-user-tasks',
  standalone: true,
  imports: [RouterOutlet], // added!
  templateUrl: './user-tasks.component.html',
  styleUrl: './user-tasks.component.css',
})
export class UserTasksComponent implements OnInit {}
```

So now going to `http://localhost:4200/users/u2/tasks` will show `There are no tasks yet. Start adding some!` in that user's card on the right hand side.

Note that the `router outlet` in the `AppComponent` template is only for the parent path:

```html
<app-header />

<main>
  <app-users />

  <div>
    <router-outlet />
  </div>
</main>
```

So I had to add a `router outlet` in the parent path of `UserTasksComponent` to let Angular know where to display the child component `TasksComponent` when the path is `tasks` and `NewTaskComponent` when the path is `tasks/new`.

Next, add another child path to the `app.route.ts` like this:

```ts
export const routes: Routes = [
    {
        path: '',  // <your-domain>/
        component: NoTaskComponent
    },
    {
        path: 'users/:userId', // <your-domain>/users/u1
        component: UserTasksComponent,
        children: [
            {
                path: 'tasks', // <your-domain>/users/u1/tasks
                component: TasksComponent
            },
            {
                path: 'tasks/new', // <your-domain>/users/u1/tasks/new  // added!
                component: NewTaskComponent
            }
        ]
    }
]
```

Then, go to `http://localhost:4200/users/u2/tasks/new` will show a `Add Task` form for that user.

### Screenshots

Currently, going to `http://localhost:4200/users/u2/tasks`, it will show:

![Project 14 screenshot4](../demo/Project-14-2026-09-05-1.png)

And, going to `http://localhost:4200/users/u2/tasks/new`, it will show:

![Project 14 screenshot5](../demo/Project-14-2026-09-05-2.png)

## Route Links & Relative Links

To make sure that the UI can let me directly go to `http://localhost:4200/users/u2/tasks/new` instead of me manually typing it, go to `UserTasksComponent`, and add `routerLink="tasks/new"`, which is called a `relative link` to its template:

```html
<section id="tasks">
  <header>
    <h2>{{ userName }} Tasks</h2>
    <menu>
      <a routerLink="tasks/new">Add Task</a>
    </menu>
  </header>

  <router-outlet />
</section>
```

When I  write `routerLink="tasks/new"` (no leading slash), Angular treats it as relative to the currently activated route at the point in the component tree where the link lives.

Since this link is inside `UserTasksComponent`'s template, and `UserTasksComponent` is activated for the route, `users/:userId`, Angular resolves the relative path against that route's own path segment. So:

- Current activated route: `users/u1`
- Relative link: `tasks/new`
- Resolved URL: `users/u1/tasks/new`

If I wrote `routerLink="/tasks/new"` (with a leading slash), Angular would treat it as absolute, starting from the root.


### what does `router-outlet` in `UserTasksComponent` do?

`UserTasksComponent` is loaded for the path `users/:userId`. That component's template has its own `<router-outlet />`. This is a nested outlet, separate from the root outlet in `AppComponent`.

When Angular matches a child route (like `tasks` or `tasks/new`), it renders that child component inside the parent's outlet, not the root one. So:

- `/users/u1/tasks` → `UserTasksComponent` renders, and `TasksComponent` shows up inside its `<router-outlet />`.
- `/users/u1/tasks/new` → `UserTasksComponent` renders, and `NewTaskComponent` shows up inside its `<router-outlet />`.

## Accessing Parent Route Data From Inside Nested Routes

To inject the dynamic route path parameters into the child routes like into `TasksComponent`, in `app.config.ts`, add `withRouterConfig()` along with its argument:

```ts
export const appRoutes: ApplicationConfig = {
   providers: [
      provideRouter(
         routes, 
         withComponentInputBinding(),
         withRouterConfig({
            paramsInheritanceStrategy: 'always'
         })
      )
   ], 
}
```

Then, in `TasksComponent` add this:

```ts
export class TasksComponent {
  userId = input.required<string>(); // added!
  userTasks: Task[] = [];
}
```

And add this in `TasksComponent` template:

```html
<!-- added this h3 tag temporarily! -->
<h3>{{ userId() }}</h3> 

<ul>
  @for (task of userTasks; track task.id) {
    <li>
      <app-task [task]="task" />
    </li>
  } @empty {
    <p>There are no tasks yet. Start adding some!</p>
  }
</ul>
```

So that on screen when going to `http://localhost:4200/users/u2/tasks`, on screen it shows the `userId` parameter:

![Project 14 screenshot6](../demo/Project-14-2026-09-07-1.png)

Next, I will use `TasksService` and its `allTasks` signal and filter out the correct user's tasks based on that `userId`.

##  Loading Data Based On Route Parameters In Child Routes

In `TasksComponent` add the below.

Whenever the `allTasks` or `userId` signals change, then the `userTasks` this computed signal will be updated:

```ts
// old
export class TasksComponent {
  userId = input.required<string>();
  userTasks: Task[] = [];
}

// new
export class TasksComponent {
  userId = input.required<string>();
  private tasksService = inject(TasksService); // added!
  userTasks = computed(() => 
    this.tasksService.allTasks().filter(task => task.userId === this.userId()) // added!
  );
}
```

Then, read that `userTasks()` signal in the `TasksComponent` template:

```html
<ul>
  @for (task of userTasks(); track task.id) {
    <li>
      <app-task [task]="task" />
    </li>
  } @empty {
    <p>There are no tasks yet. Start adding some!</p>
  }
</ul>
```

It will show tasks for each user now:

![Project 14 screenshot7](../demo/Project-14-2026-09-07-2.png)