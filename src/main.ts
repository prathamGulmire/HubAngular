import themes from 'devextreme/ui/themes';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

// import { AppModule } from './app/app.module';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { provideHttpClient } from '@angular/common/http';

// themes.initialized(() => {
//   platformBrowserDynamic().bootstrapModule(AppModule)
//     .catch(err => console.error(err));
// });

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient()
  ]
})
  .catch(err => console.error(err));