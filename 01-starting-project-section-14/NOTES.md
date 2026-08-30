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