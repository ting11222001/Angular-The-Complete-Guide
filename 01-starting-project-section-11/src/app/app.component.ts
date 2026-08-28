import { Component, computed, DestroyRef, effect, inject, OnInit, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { interval, map, Observable} from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  clickCount = signal(0);
  clickCount$ = toObservable(this.clickCount);
  interval$ = interval(1000);
  intervalSignal = toSignal(this.interval$, {initialValue: 0});
  customInterval$ = new Observable((subscriber) => {
    let count = 0;

    const interval = setInterval(() => {
      if (count > 3) {
        clearInterval(interval);
        subscriber.complete(); // emit an event to clean up the subscription
        return; // exit the function to prevent further emissions
      }

      console.log('Emitting new value...');
      
      subscriber.next({
        message: 'New value'
      });

      count++; // whenever a new value is emitted, increment the count
    }, 2000);
  });
  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.customInterval$.subscribe({
      next: value => console.log(value),
      complete: () => console.log('COMPLETED!')
    });
    const subscription = this.clickCount$.subscribe({
      next: (value) => {
        console.log('Click count updated:', value);
      }
    });
    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  } 

  onClick() {
    this.clickCount.update(prevCount => prevCount + 1);
  }
}
