import { Routes } from "@angular/router";
import { TasksComponent } from "./tasks/tasks.component";
import { NoTaskComponent } from "./tasks/no-task/no-task.component";
import { UserTasksComponent } from "./users/user-tasks/user-tasks.component";
import { NewTaskComponent } from "./tasks/new-task/new-task.component";

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
                path: 'tasks', // <your-domain>/users/u1/tasks -> temporary route to show all tasks for a user
                component: TasksComponent
            },
            {
                path: 'tasks/new', // <your-domain>/users/u1/tasks/new
                component: NewTaskComponent
            }
        ]
    }
]