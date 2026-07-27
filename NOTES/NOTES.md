# NOTES

This is a place where I go through each module of the course and take the notes.

## Getting Started

### Creating A New Angular Project

Install Angular CLI, run:
```bash
npm install -g @angular/cli
```

Create a new Angular project:
```bash
ng new <project name> --no-zoneless
```

This is what I run for the course:
```bash
ng new first-angular-app --no-zoneless
```

`--no-zoneless` is used for Angular version >= 20.

Then chose:
```
- css styling 
- no server side rendering
```

### Setting Up An Angular Development Environment

Extensions installed on VS code:
```
- Angular Language Service
- Angular Essentials (Version 20) by John Papa
```

Run this to see what's the app like currently:
```bash
cd first-angular-app/
npm start
```

Go to Local: http://localhost:4200/

Keep the dev server up and running when making code changes. It will recompile on the spot.

## Angular Essentials - Components, Templates, Services & More

This section is creating a project, EasyTask. The notes about this project is in the `01-starting-project`.