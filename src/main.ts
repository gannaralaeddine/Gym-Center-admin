import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import {AuthInterceptor} from "./app/auth/auth.interceptor";
import {AuthService} from "./app/auth/auth.service";
import {AuthGuard} from "./app/auth/authGuard";
import {MatGridListModule} from '@angular/material/grid-list';


/*bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err))*/

  bootstrapApplication(AppComponent, {
    providers:[
    importProvidersFrom(HttpClientModule, MatGridListModule),
    provideRouter(routes),
    provideAnimations(),
      { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
]
  })
  .catch((err) => console.error(err))
