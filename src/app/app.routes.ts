import { Routes } from '@angular/router';
import { HomeComponent } from "./home/home.component";
import { DashbordComponent } from "./dashbord/dashbord.component";
import { ProfileComponent }  from "./profile/profile.component";
import { LoginComponent } from "./login/login.component";
import { CategoryComponent } from './category/category.component';

export const routes: Routes = [

  { path: '', component: HomeComponent },
  { path: 'dashboard', component: DashbordComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'login', component: LoginComponent },
  { path: 'category', component: CategoryComponent }
];
