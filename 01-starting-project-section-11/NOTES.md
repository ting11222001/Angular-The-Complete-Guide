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

