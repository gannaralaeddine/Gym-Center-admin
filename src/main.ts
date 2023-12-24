import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { HttpClientModule } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { CategoryComponent } from './app/category/category.component';
import { DashbordComponent } from './app/dashbord/dashbord.component';
import { HomeComponent } from './app/home/home.component';
import { LoginComponent } from './app/login/login.component';
import { ProfileComponent } from './app/profile/profile.component';
import { RegisterComponent } from './app/register/register.component';
import { routes } from './app/app.routes';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

/*bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err))*/

  bootstrapApplication(AppComponent, {
    providers:[
      importProvidersFrom(HttpClientModule),
      provideRouter(routes)
    ]
  })
  .catch((err) => console.error(err))
