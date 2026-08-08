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

## Git show: the commit details after `git log` seeing the commits from a branch

This shows the commit details plus a full diff of what changed in each file:
```bash
git show 9e28d706fbf614010cfcdee924c062111d41c6e2
```

If you only want the list of changed files, without the full diff, add `--stat`:
```bash
git show --stat 9e28d706fbf614010cfcdee924c062111d41c6e2
```

Or if you only want file names with no details at all:
```bash
git show --name-only 9e28d706fbf614010cfcdee924c062111d41c6e2
```

You don't need to type the full commit hash. The first 7 to 8 characters are usually enough, since git only needs enough characters to uniquely identify the commit. So `git show 9e28d70` works fine too.