import { Component, input, Input } from '@angular/core';
import { TaskComponent } from './task/task.component';
import { DUMMY_TASKS } from '../dummy-tasks';
import { NewTaskComponent } from './new-task/new-task.component';
import { NewTaskData } from './task/task.model';

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
}
