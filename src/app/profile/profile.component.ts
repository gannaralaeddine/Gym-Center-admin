import {Component, Inject, PLATFORM_ID} from '@angular/core';
import {UserService} from "../services/user.service";
import {AuthService} from "../services/auth.service";
import {isPlatformBrowser} from "@angular/common";

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent
{
    email!: string
    fullname!: string
    accountType!: string
    phoneNumber!: string
    country!: string

    constructor(private userService: UserService, private authService: AuthService, @Inject(PLATFORM_ID) private platformId: Object) {

      if (isPlatformBrowser(this.platformId)) {

          // @ts-ignore
          this.userService.retrieveUserByEmail(this.authService.getEmailLS()).subscribe(
            {
              next: (val) => this.populateUserData(val),
              error: (err) => console.error(err)
            }
          )
      }
    }

  populateUserData(user: any)
  {
    this.email = user.userEmail
    this.fullname = user.userFirstName+ " " + user.userLastName
    this.accountType = user.roles[0].roleName
    this.phoneNumber = user.userPhoneNumber
    this.country = user.userCountry
  }
}
