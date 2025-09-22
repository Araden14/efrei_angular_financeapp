import 'zone.js';
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app.component';
import { GridChartsModule } from 'ag-grid-enterprise';
import { ModuleRegistry } from 'ag-grid-community';

ModuleRegistry.registerModules([GridChartsModule]);

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
