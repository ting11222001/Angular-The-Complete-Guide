# NOTES

This is a place where I take notes for the practice project of the section 12 of the course, `Sending HTTP Requests and Handling Responses`.

## Setup the Starting Project

Follow what I did for the section 9 exercise.

Then, run `npm install`, and then `npm start` for the main project folder of this section, which is the angular app folder.

Then, go inside `backend` and then run `npm install` there also.

Essentially, the angular and the backend are two separate projects with their own dependencies. Then, run `npm start` to start the backend web API. I will need to keep this backend process up and running to allow my angular app to connect to it later.

Then, in a separate terminal, run the angular app by entering the main project folder of this section. Run `npm start`.

Its branch is `app-http-place-picker`.

I also created a folder for screenshots of this app practice, `section12-demo`.

## The starting projects: frontend & backend

`backend` folder is a simple Node Express application for this exercise.

`data` > `places.json` etc.: these are dummy data.

This section is to practice to reach out to the backend from Angular app.

Run up the angular app by `npm start` in the main project folder of this section. I'm able to see this:

![Project12-screenshot1](/01-starting-project-section-12/section12-demo/Project-12-2026-09-09-1.png)