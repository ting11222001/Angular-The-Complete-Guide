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