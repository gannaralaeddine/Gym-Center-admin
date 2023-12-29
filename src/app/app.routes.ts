import { Routes } from '@angular/router';
import { HomeComponent } from "./home/home.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { ProfileComponent }  from "./profile/profile.component";
import { LoginComponent } from "./login/login.component";
import { CategoryComponent } from './category/category.component';
import {RegisterComponent} from "./register/register.component";
import {UserComponent} from "./user/user.component";
import { ActivityComponent } from './activity/activity.component';

export const routes: Routes = [

  { path: '', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'home', component: HomeComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'category', component: CategoryComponent },
  { path: 'activity', component: ActivityComponent },
  { path: 'users', component: UserComponent }
];
