# NOTES

This is a place where I take notes for the practice project of the section 9 of the course, `Understanding Services & Dependency Injection - Deep Dive`.

## Setup the Starting Project

I need to:
- pull down the starting project and install ready on the main branch
- after that, then create and checkout to the new feature branch to continue working

This makes the commit history simpler.

## Understanding Services

Services allow me to share logic and data across the app.

## Creating a Service

Create this service class, `TasksService`, in `\src\app\tasks\tasks.service.ts`:

```ts
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root', // this service can be injected into any component/directive/service, anywhere, in the app.
})
export class TasksService {}
```

Then, add these properties and methods:

- `tasks = signal<Task[]>([]);`: this service will manage a list of tasks, so I use a signal with an inital value of an empty array. Then, make use of the generic type feature of signals to define the array will be an array of `Tasks`, which has the interface defined in `task.model.ts`.
- `addTask(taskData: { title: string; description: string }) {}`: this is a single argument way. I can also do this two arguments way - `addTask(title: string, description: string) {}`. 
    - Then, use `this.tasks.update()` to update the `tasks` signal array. 
        - `update()` then takes a function which will be executed by Angular.
            - This function will automatically receive the `oldTasks` before the update, and then should yield the new tasks array that should be managed by the signal.
                - copy the `oldTasks` object into a whole new array and add `newTask`. This way is better - just make a new copy of the object and make changes to it instead of changing the original objects.


Final version for now:

```ts
import { Injectable, signal } from "@angular/core";
import { Task } from "./task.model";

@Injectable({
  providedIn: 'root',
})
export class TasksService {
    tasks = signal<Task[]>([]);

    addTask(taskData: { title: string; description: string }) {
        const newTask: Task = {
            ...taskData,
            id: Math.random().toString(),
            status: 'OPEN'
        };
        this.tasks.update((oldTasks) => [...oldTasks, newTask]);
    }
}
```

Next, I will use this `TasksService` in the `NewTaskComponent`.

## How NOT to provide a service. Use Angular's dependency injection mechanism instead!

Don't put `new TasksService()` in the `constructors`! Otherwise, different components will end up having separate `TasksService` instances.

So don't do this, or I'm not able to share data with other components:
```ts
export class NewTaskComponent {
  private formEl = viewChild<ElementRef<HTMLFormElement>>('form');
  private tasksService: TasksService;

  constructor() {
    this.tasksService = new TasksService(); // this will create a new TasksService instance just for this
  }

  onAddTask(title: string, description: string) {
    this.tasksService.addTask({ title, description });
    this.formEl()?.nativeElement.reset();
  }
}
```

But do this with Angular's dependency injection mechanism:
```ts
export class NewTaskComponent {
  private formEl = viewChild<ElementRef<HTMLFormElement>>('form');
  private tasksService: TasksService;

  constructor(tasksService: TasksService) { // Angular will provide this tasksService parameter in the constructor
    this.tasksService = tasksService;
  }

  onAddTask(title: string, description: string) {
    this.tasksService.addTask({ title, description });
    this.formEl()?.nativeElement.reset();
  }
}
```

So I don't create service instances myself. I request them from Angular.

A even shorter way to write this requesting a service code. It is a TypeScript magic - TypeScipt will go ahead and create a proerpty with the same name for this class.

```ts
export class NewTaskComponent {
  private formEl = viewChild<ElementRef<HTMLFormElement>>('form');

  constructor(private tasksService: TasksService) {}

  onAddTask(title: string, description: string) {
    this.tasksService.addTask({ title, description });
    this.formEl()?.nativeElement.reset();
  }
}
```

That `private` means it makes sure the template will not be able to directly use the `tasksService`. We usually only use the services inside the component class:
```ts
constructor(private tasksService: TasksService) {}
```

By doing this, I can make sure I'm using the one shared service instance of `TasksService` across the whole app.

## Using the alternative dependency injection syntax

Use `inject()` to inject the `TasksService` instead of using `constructors`.

```ts
export class TasksListComponent {
  private tasksService = inject(TasksService); // updated!
  selectedFilter = signal<string>('all');
  tasks = this.tasksService.allTasks; // updated!

  onChangeTasksFilter(filter: string) {
    this.selectedFilter.set(filter);
  }
}
```

When hovering over `tasks` property in the `TasksListComponent`, it shows this `(property) TasksListComponent.tasks: WritableSignal<Task[]>`. Change that to NOT changeable with `private` in the `TasksService`, and create a new property, `allTasks = this.tasks.asReadonly()` to safely expose this property. 

```ts
@Injectable({
  providedIn: 'root',
})
export class TasksService {
    private tasks = signal<Task[]>([]); // updated!

    allTasks = this.tasks.asReadonly(); // updated!

    addTask(taskData: { title: string; description: string }) {
        const newTask: Task = {
            ...taskData,
            id: Math.random().toString(),
            status: 'OPEN'
        };
        this.tasks.update((oldTasks) => [...oldTasks, newTask]);
    }
}
```

`asReadonly`: it will be `(method) WritableSignal<Task[]>.asReadonly(): Signal<Task[]>` which is a read only signal.


Also, update the template for `TasksListComponent`, use signal `tasks()` and use `task.id` as unique identifier for individual task items:
```html
<ul>
  @for (task of tasks(); track task.id) {
    <li>
      <app-task-item [task]="task" />
    </li>
  }
</ul>
```

Now in the app, I can create a task with title and description and click `Add Task`, it will be added to the `My Tasks` list.

## Reusing logic with Services

For example, in `TasksService`, add a new method:
```ts
@Injectable({
  providedIn: 'root',
})
export class TasksService {
    private tasks = signal<Task[]>([]);

    allTasks = this.tasks.asReadonly();

    addTask(taskData: { title: string; description: string }) {
        const newTask: Task = {
            ...taskData,
            id: Math.random().toString(),
            status: 'OPEN'
        };
        this.tasks.update((oldTasks) => [...oldTasks, newTask]);
    }

    updateTaskStatus(taskId: string, newStatus: TaskStatus) { // new!
        this.tasks.update((oldTasks) => 
            oldTasks.map((task) => 
                task.id === taskId ? { ...task, status: newStatus } : task
        ));
    }
}
```

The goal was to return a new array of tasks with a specific task's status is updated.

`.map()` will execute on arrays and each of its item and returns a new array. When it finds the task with the id I want, it copies the values of the task object and overwrite the old stask status with the new status before returning the new task object.

If not the task I want, it returns the original task as is.

Always try to return a new copy of array/object instead of mutating the existing ones.

Then, in the `TasksListComponent` template, the user can use the drop down list to filter the task status.

So change the `tasks` property into a computed signal (which is like a function that tracks the reactive data):

```ts
@Component({
  selector: 'app-tasks-list',
  standalone: true,
  templateUrl: './tasks-list.component.html',
  styleUrl: './tasks-list.component.css',
  imports: [TaskItemComponent],
})
export class TasksListComponent {
  private tasksService = inject(TasksService);
  private selectedFilter = signal<string>('all');
  // tasks = this.tasksService.allTasks; // old
  tasks = computed(() => {  // new!
    switch (this.selectedFilter()) {
      case 'open':
        return this.tasksService.allTasks().filter((task) => task.status === 'OPEN');
      case 'in-progress':
        return this.tasksService.allTasks().filter((task) => task.status === 'IN_PROGRESS');
      case 'done':
        return this.tasksService.allTasks().filter((task) => task.status === 'DONE');
      default:
        return this.tasksService.allTasks();
    }
  });

  onChangeTasksFilter(filter: string) {
    this.selectedFilter.set(filter);
  }
}
```

The `switch` cases are aligned with the `select` drop down in the template:
```html
<select (change)="onChangeTasksFilter(filter.value)" #filter>
    <option value="all">All</option>
    <option value="open">Open</option>
    <option value="in-progress">In-Progress</option>
    <option value="done">Completed</option>
</select>
```

And whenever the `selectedFilter` change, the `tasks` will change.

Until now, the filter drop down should work in the app.

Next, make sure the update task status would work for each task.

In `TaskItemComponent` it looked like this initially:

```ts
@Component({
  selector: 'app-task-item',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './task-item.component.html',
  styleUrl: './task-item.component.css',
})
export class TaskItemComponent {
  task = input.required<Task>();
  taskStatus = computed(() => {
    switch (this.task().status) {
      case 'OPEN':
        return 'Open';
      case 'IN_PROGRESS':
        return 'Working on it';
      case 'DONE':
        return 'Completed';
      default:
        return 'Open';
    }
  });

  onChangeTaskStatus(taskId: string, status: string) {
    let newStatus: TaskStatus = 'OPEN';

    switch (status) {
      case 'open':
        newStatus = 'OPEN';
        break;
      case 'in-progress':
        newStatus = 'IN_PROGRESS';
        break;
      case 'done':
        newStatus = 'DONE';
        break;
      default:
        break;
    }
  }
}
```

Now I inject the `TasksService` into this component, and make sure `onChangeTaskStatus` will now call the `TasksService` to update the tasks accordingly to the selected change status of the task:

```ts
@Component({
  selector: 'app-task-item',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './task-item.component.html',
  styleUrl: './task-item.component.css',
})
export class TaskItemComponent {
  private tasksService = inject(TasksService); // added!
  task = input.required<Task>();
  taskStatus = computed(() => {
    switch (this.task().status) {
      case 'OPEN':
        return 'Open';
      case 'IN_PROGRESS':
        return 'Working on it';
      case 'DONE':
        return 'Completed';
      default:
        return 'Open';
    }
  });

  onChangeTaskStatus(taskId: string, status: string) {
    let newStatus: TaskStatus = 'OPEN';

    switch (status) {
      case 'open':
        newStatus = 'OPEN';
        break;
      case 'in-progress':
        newStatus = 'IN_PROGRESS';
        break;
      case 'done':
        newStatus = 'DONE';
        break;
      default:
        break;
    }

    this.tasksService.updateTaskStatus(taskId, newStatus); // added!
  }
}
```

And the template of `TaskItemComponent` remains same:

```html
<article
  [class]="{
    'status-open': task().status === 'OPEN',
    'status-in-progress': task().status === 'IN_PROGRESS',
    'status-done': task().status === 'DONE'
  }"
>
  <header>
    <h3>{{ task().title }}</h3>
    <p>{{ taskStatus() }}</p>
  </header>
  <p>{{ task().description }}</p>
  <form (ngSubmit)="onChangeTaskStatus(task().id, status.value)">
    <select #status>
      <option value="open" [selected]="task().status === 'OPEN'">Open</option>
      <option value="in-progress" [selected]="task().status === 'IN_PROGRESS'">
        In-Progress
      </option>
      <option value="done" [selected]="task().status === 'DONE'">
        Completed
      </option>
    </select>
    <p>
      <button>Change Status</button>
    </p>
  </form>
</article>
```

## Angular has multiple injectors

So this `@Injectable` is not the only way to make Angular aware of injectable value:

```ts
@Injectable({
  providedIn: 'root',
})
export class TasksService {
    ...
```

I don't create service instances myself, instead I should request them from Angular.

E.g. `PlatformInjector` allows multiple applications that are under one Angular project to use the same service. In `main.ts`, I can have multiple `bootstrapApplication` and set up a platform injector to allow them to access a service instance.

Most of the time, we use the application root `EnvironmentInjector` (if using ngModules, then `ModuleInjector`).

There's also `ElementInjector`.

A component reaches out to them in this order: `ElementInjector` > the application root `EnvironmentInjector` OR ngModules `ModuleInjector` >  `PlatformInjector`.

If I comment out this annotation:

```ts
// @Injectable({
//   providedIn: 'root',
// })
export class TasksService {
    ...
```

The app will crash with this error `NullInjectorError`:
```
NullInjectorError: No provider for TasksService!
```

## There are multiple ways of providing a Service

For example, if I don't use the `@Injectable` decorator in the `TasksService` class to provide the service, I can provide the service in `main.ts` like the below instead i.e. by adding a configuration object on `bootstrapApplication`:

```ts
// main.ts:
// old
bootstrapApplication(AppComponent).catch((err) => console.error(err));

// new
bootstrapApplication(AppComponent, {
    providers: [TasksService],
}).catch((err) => console.error(err));

// tasks.service.ts:
// @Injectable({            // removed this
//   providedIn: 'root',
// })
export class TasksService {...
```

One downside is that `TasksService` will be loaded and included during the code bundel initialisation even though it might not be needed initially.

I will learn about the concept of lazy loading and splitting the code across multiple bundles to improve efficiency later in this course.

In fact, using this `@Injectable` in the `TasksService` can lead to more optimised code bundles and to a smaller initial code base:

```ts
@Injectable({
  providedIn: 'root',
})
export class TasksService {...
```

So it's more recommended to use this `@Injectable` approach instead of using the providers array in the `bootstrapApplication` in the `main.ts`:

```ts
@Injectable({
  providedIn: 'root',
})
export class TasksService {...
```


## Providing Services via the Element injector

For example, comment out this:
```ts
// @Injectable({
//   providedIn: 'root',
// })
export class TasksService
```

And add `providers` array in the `TasksComponent` instead:
```ts
@Component({
  selector: 'app-tasks',
  standalone: true,
  templateUrl: './tasks.component.html',
  imports: [NewTaskComponent, TasksListComponent],
  providers: [TasksService]
})
export class TasksComponent {}
```

All the child components of `TasksComponent` i.e. those present in the template will have access to the `TasksService`:

```html
<app-new-task />
<app-tasks-list />
```

## Understanding the Element Injector's Behavior

If I use Element Injector in the `TasksComponent`, and then have two `TasksComponent` in the root `AppComponent`, these two `TasksComponent` won't share the same `TasksService` instances.

For example, in the template of `AppComponent`:
```html
<app-tasks />
<app-tasks />
```

Then on the screen, there will be two My Tasks lists - when adding a new task to one list, it won't show up in another list.