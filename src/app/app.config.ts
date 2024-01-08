import { ApplicationConfig} from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import {HTTP_INTERCEPTORS, provideHttpClient, withFetch} from '@angular/common/http';
import {AuthInterceptor} from "./auth/auth.interceptor";
import {AuthService} from "./auth/auth.service";
import {AuthGuard} from "./auth/authGuard";

export const appConfig: ApplicationConfig =
{
  providers: [
    provideRouter(routes),
    provideHttpClient(withFetch()),
    provideClientHydration(),


  ],

};
