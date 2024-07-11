import { Routes } from '@angular/router';
import { HomeComponent } from "./home/home.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { ProfileComponent } from "./profile/profile.component";
import { LoginComponent} from "./login/login.component";
import { CategoryComponent } from './category/category.component';
import { RegisterComponent } from "./user/register/register.component";
import { UserComponent } from "./user/user.component";
import { ActivityComponent } from './activity/activity.component';
import { DetailsCategoryComponent } from './category/details-category/details-category.component';
import { DetailsActivityComponent } from './activity/details-activity/details-activity.component';
import { AppComponent } from "./app.component";
import { DetailsSessionComponent } from './session/details-session/details-session.component';
import { SessionComponent } from './session/session.component';
import { SubscriptionComponent } from './subscription/subscription.component';
import { SubscriptionDetailsComponent } from './subscription/subscription-details/subscription-details.component';
import { OfferDetailsComponent } from './offer/offer-details/offer-details.component';
import { OfferComponent } from './offer/offer.component';
import { OptionComponent } from './option/option.component';
import {ForgotPasswordComponent} from "./forgot-password/forgot-password.component";

export const routes: Routes = [
  {path: 'app-component', component: AppComponent},
  {path: '', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'forgot-password', component: ForgotPasswordComponent},
  {path: 'home', component: HomeComponent},
  {path: 'dashboard', component: DashboardComponent},
  {path: 'profile', component: ProfileComponent},
  {path: 'category', component: CategoryComponent},
  {path: 'activity', component: ActivityComponent},
  {path: 'users', component: UserComponent, /* canActivate: [AuthGuard], data: {roles: "ADMIN"} */},
  {path: 'category-details', component: DetailsCategoryComponent},
  {path: 'activity-details', component: DetailsActivityComponent},
  {path: 'session-details', component: DetailsSessionComponent},
  {path: 'offer-details', component: OfferDetailsComponent},
  {path: 'subscription-details', component: SubscriptionDetailsComponent},
  {path: 'session', component: SessionComponent},
  {path: 'subscription', component: SubscriptionComponent},
  {path: 'offer', component: OfferComponent },
  {path: 'option', component: OptionComponent }
];
