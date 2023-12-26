import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { HttpClientModule } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { AddCategoryComponent } from './app/category/add-category/add-category.component';

/*bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err))*/

  bootstrapApplication(AppComponent, {
    providers:[
      importProvidersFrom(HttpClientModule),
      provideRouter(routes)
    ]
  })
  .catch((err) => console.error(err))
