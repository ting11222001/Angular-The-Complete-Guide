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
