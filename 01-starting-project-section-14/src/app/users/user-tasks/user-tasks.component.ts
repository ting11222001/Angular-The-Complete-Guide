import { Component, computed, DestroyRef, inject, input, OnInit } from '@angular/core';
import { UsersService } from '../users.service';
import { ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-user-tasks',
  standalone: true,
  templateUrl: './user-tasks.component.html',
  styleUrl: './user-tasks.component.css',
})
export class UserTasksComponent implements OnInit {
  // Solution 1:
  // userId = input.required<string>();

  // private usersService = inject(UsersService);
  // userName = computed(() => 
  //   this.usersService.users.find(user => user.id === this.userId())?.name
  // );

  // Solution 2:
  private activatedRoute = inject(ActivatedRoute);
  private usersService = inject(UsersService);
  private destroyRef = inject(DestroyRef);
  userName = '';

  ngOnInit() {
    console.log('activatedRoute: ', this.activatedRoute);
    const subscription = this.activatedRoute.paramMap.subscribe({
      next: (paramMap: ParamMap) => 
        this.userName = this.usersService.users.find(user => user.id === paramMap.get('userId'))?.name || ''
    });
    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }
}
