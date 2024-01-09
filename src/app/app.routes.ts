import { Routes } from '@angular/router';
import { HomeComponent } from "./home/home.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { ProfileComponent }  from "./profile/profile.component";
import { LoginComponent } from "./login/login.component";
import { CategoryComponent } from './category/category.component';
import {RegisterComponent} from "./register/register.component";
import {UserComponent} from "./user/user.component";
import { ActivityComponent } from './activity/activity.component';
import { DetailsCategoryComponent } from './category/details-category/details-category.component';
import { DetailsActivityComponent } from './activity/details-activity/details-activity.component';
import {AppComponent} from "./app.component";
import { SessionComponent } from './session/session.component';
import { DetailsSessionComponent } from './session/details-session/details-session.component';

export const routes: Routes = [

  { path: 'app-component', component: AppComponent },
  { path: '', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'home', component: HomeComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'category', component: CategoryComponent },
  { path: 'activity', component: ActivityComponent },
  { path: 'session', component: SessionComponent },
  { path: 'users', component: UserComponent },
  { path: 'category-details', component: DetailsCategoryComponent },
  { path: 'session-details', component: DetailsSessionComponent },
  { path: 'activity-details', component: DetailsActivityComponent }
];
