import { bootstrapApplication } from '@angular/platform-browser';

import { AppComponent } from './app/app.component';
import { appRoutes } from './app/app.config';

bootstrapApplication(AppComponent, appRoutes).catch((err) => console.error(err));
