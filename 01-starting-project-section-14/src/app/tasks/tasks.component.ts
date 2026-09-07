import { Component, computed, effect, inject, input } from '@angular/core';

import { TaskComponent } from './task/task.component';
import { TasksService } from './tasks.service';

@Component({
  selector: 'app-tasks',
  standalone: true,
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.css',
  imports: [TaskComponent],
})
export class TasksComponent {
  userId = input.required<string>();
  private tasksService = inject(TasksService);
  userTasks = computed(() => this.tasksService.allTasks().filter(task => task.userId === this.userId()));
  constructor() {
    effect(() => {
      console.log('User tasks updated:', this.userTasks());
      console.log('userId: ', this.userId());
    });
  }
}
