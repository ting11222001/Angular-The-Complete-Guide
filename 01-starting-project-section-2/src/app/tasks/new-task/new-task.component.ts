import { Component, EventEmitter, inject, Output, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TasksService } from '../tasks.service';

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
