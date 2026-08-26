# NOTES

This is a place where I take notes for the practice project of the section 11 of the course, `Working with RxJS (Observables) - Deep Dive`.

## Setup the Starting Project

Follow what I did for the section 9 exercise.

## Intro

I will learn about:
- What are Observables?
- Creating & Using Observables
- Observables Operators
- Observables vs Signals

## What are Observables & What is RxJS?

RxJS is a 3rd party library independent from Angular but widely used in Angular.

Observables are an object that produces and controls a stream of data.

RxJS Observables emit values over time. I can set up subscriptions to handle them.
- E.g. Observer 1, and Observer 2 can set up subscriptions to listen for values (and use them).

## Creating & Using an Observable

For example, `BehaviorSubjects` is from RxJS. It's a `subject` object that I can use to emit values to which I can then listen in another part of the application. Similar to `Signals` in Angular, but I will learn about their difference later in this section.

But, `Subjects` is just one way of creating observables. It acts as event emitters.

First practice - I can create an Observable with help of the RxJS library without creating a Subject.

RxJS actually has multiple functions I can use to create observables. Like RxJS API List [!here](https://rxjs.dev/api).

Try the `interval` observable [!here](https://rxjs.dev/api/index/function/interval).

I'm letting it give me new values every 1 sec and by `subscribe` it will kick off the `interval` observable. RxJS internally knows that if no one is interested in the values, then it won't emit any.

The `subscribe` method then takes an observer object, which is an object that can implement up to three methods:
- `next`: it will be triggered every time a new value is emitted. The emitted value is received as `val` parameter and I can log that.
- `complete`: it will be triggered when this `interval` is not emitting any more values. `interval` will keep emitting in this case, so `complete` method may not be ever executed.
- `error`: it will be triggered when there's an error. Useful when I'm using it when sending HTTP requests with Angular.

For example:

```ts
export class AppComponent implements OnInit {
  ngOnInit(): void {
    interval(1000).subscribe({
      next: (val) => console.log(val)
    });
  }
}
```

Note that:
- An `Observable` is a data source that emits a stream of values over time, while an `Observer` is the consumer that listens to and processes those emitted values.
- `Observable` is the Publisher. `Observer` is the Consumer.

I can also store the subscription into a variable for easy clean up later, like this:

```ts
export class AppComponent implements OnInit {
  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    const subscription = interval(1000).subscribe({
      next: (val) => console.log(val)
    });
    
    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }
}
```

`this.destroyRef.onDestroy()` will be executed when this component is about to be removed. `subscription.unsubscribe();` will do the clean up.

## Working with RxJS Operations

`Operators` can be used to pipe into my `observable` data stream to perform transformations or any sorts of operations on those `observable` values.

I can add `operators` to this `observable` pipeline by calling the `pipe` method before I subscribe:

```ts
const subscription = interval(1000).pipe().subscribe({
    next: (val) => console.log(val)
});
```

I can add a `map` method from RxJS [!here](https://rxjs.dev/api/index/function/map).

What `map` does is that it takes a function as the argument  and that function will then be executed on every value that's emitted bythe observbale and then the function reuslt will be passed to the subscribers. 

`map` will receive the value emitted by the `interval` observable, and it will return the updated value. This updated value will go to the `next` function's `val`.

```ts
export class AppComponent implements OnInit {
  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    const subscription = interval(1000).pipe(
      map((val) => val * 2)
    ).subscribe({
      next: (val) => console.log(val)
    });

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }
}
```

The result becomes from `0, 1, 2,...` to `0, 2, 4,...`.

## Working with Signals

`Subjects` are also `observables`. Just that `subjects` need me to take care of emitting those values manually. So I don't just subscribe but also emit the values.

But with `observables`, there are ones that produces values automatically.

Unlike `observables` coming from a 3rd party library, `RxJS`, `signals` are built into Angular.

I will practice how to turn `signals` into `observables` and vice versa.

Start with:

```ts
export class AppComponent implements OnInit {
  clickCount = signal(0);

  constructor() {
    effect(() => {
      console.log(`Clicked button ${this.clickCount()} times.`);
    });
  }

  ngOnInit(): void {}

  onClick() {
    this.clickCount.update(prevCount => prevCount + 1);
  }
}
```

So every time I click the button, the screen prints `Click count: 3` and the dev tool's Console tab prints:

```
Clicked button 1 times.
Clicked button 2 times.
Clicked button 3 times.
...
```

So far, it feels pretty similar to using signals and observables (because when the button is clicked, the signal gets updated and printed).

## Signals vs Observables

Also from the previous exercise, if I don't want to use `interval` observable from RxJS and use signals entirely, then there will be more code.

For example:
```ts
// previously using RxJS:
export class AppComponent implements OnInit {
  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    const subscription = interval(1000).pipe(
      map((val) => val * 2)
    ).subscribe({
      next: (val) => console.log(val)
    });

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }
}

// now using signals for the same result:
export class AppComponent implements OnInit {
  interval = signal(0);
  doubleInterval = computed(() => this.interval() * 2);

  constructor() {
    effect(() => {
      console.log(`Interval: ${this.interval()}`);
      console.log(`Double Interval: ${this.doubleInterval()}`);
    });
  }

  ngOnInit(): void {
    setInterval(() => {
      this.interval.update(prevCount => prevCount + 1);
    }, 1000);
  }
}
```

A couple of key differences:
- `Signal` has initial values, but `observable` doesn't.
- `Signal` version of `setInterval` will kick off without needing `subscribers` like the `observables`.
- I can read the value of `signals` at anytime without a subscription.

So:
- `Observables` are values over time. Great for managing events and streamed data. Great for asynchornous events.
- `Signals` are values in a container. Great for managing application state. It can set an initial value and can change over time and will be reflected on the UI.

## Converting signals to observables

I can convert signals to observables like the below.

Pass an un-executed signlas to the `toObservale()`.

```ts
export class AppComponent implements OnInit {
  clickCount = signal(0); // added!
  clickCount$ = toObservable(this.clickCount); // added!
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
```

So when the app starts up, it prints `Click count updated: 0`.

Then, whenever the click button is clicked, it will keep printing these in the dev tool > Console tab:
```
Click count updated: 1
Click count updated: 2
Click count updated: 3
```

The UI will only show the latest one:
```
Click count updated: 3
```

So bascially I can convert signals to observales or listen to signals with observables.

`$` means it's an observable. I need to `subscribe` to it to kick those properties off. For example, subscribing to `clickCount$` in the `ngOnInit` and make sure that subscription is being destroyed along with the component.

## Converting observables to signals

I can create an observable without subscribing to it, and convert it to a signal.

I can see `Interval: ` takes a short while to see the value counting from `0` - that's because observables (`interval` in this case), unlike signals, don't have an initial value. Signals and Subjects can create with initial values.

```ts
export class AppComponent implements OnInit {
  clickCount = signal(0);
  clickCount$ = toObservable(this.clickCount);
  interval$ = interval(1000); // added!
  intervalSignal = toSignal(this.interval$); // added!
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
```

Angular will give `intervalSignal = toSignal(this.interval$);` an initial value as `undefined`.

I can pass a configuration object into `toSignal()` and set a couple of things. For example, an initial value:
```ts
intervalSignal = toSignal(this.interval$, {initialValue: 0});
```

By doing that I can `Interval: 0` right from the start of the app up and running.

Another good thing from `toSignal()` is that it will automatically clean up the observable subscription for me.