# AngularCLI

## Create an Angular project 

Run:
```bash
ng new first-angular-app --no-zoneless
```

`--no-zoneless` is used for Angular version >= 20.

For angular 21+ `zoneless` is the default. This tutorial was using angular 18, so it was using `zone.js` still, so I ended up taking his starting project, and run `npm install` directly without trying to create a new angular project from scratch using
my Angular 21 version.

## Create a New Component with Angular CLI

Run:
```bash
ng generate component component-name
```

Or in short:
```bash
ng g c component-name --skip-tests
```

`--skip-tests`: skip the .spec.ts file.

## Check Angular and NodeJS version

Inside a Project Directory, run:
```bash
$ ng version

     _                      _                 ____ _     ___
    / \   _ __   __ _ _   _| | __ _ _ __     / ___| |   |_ _|
   / △ \ | '_ \ / _` | | | | |/ _` | '__|   | |   | |    | |
  / ___ \| | | | (_| | |_| | | (_| | |      | |___| |___ | |
 /_/   \_\_| |_|\__, |\__,_|_|\__,_|_|       \____|_____|___|
                |___/
    

Angular CLI       : 21.1.5
Node.js           : 24.13.0
Package Manager   : npm 11.6.2
Operating System  : win32 x64
```

## Git add: current folder vs whole repo

`git rev-parse --show-toplevel` printed the very top folder (`Angular-The-Complete-Guide-2026`) while you were inside the section folder, that means there is no separate .git inside the section folder.

`git add .` only stages files in your current folder and below. If you run it from inside 01-starting-project-section-2, it cannot see NOTES.md, because that file sits in a sibling folder, outside your current location.

`git add -A`, with no folder or file named after it, stages changes across the whole repository, no matter where you are standing. It is not limited to your current folder.