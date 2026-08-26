import { Component, computed, DestroyRef, effect, inject, OnInit, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { interval, map} from 'rxjs';

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
  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
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
