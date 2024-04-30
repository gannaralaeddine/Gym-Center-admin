import { Component } from '@angular/core';
import {Router, RouterLink} from "@angular/router";
import { FormsModule, NgForm } from "@angular/forms";
import { AuthService } from "../auth/auth.service";
import {UtilsService} from "../serviceutils/utils.service";
import { NgIf } from '@angular/common';
import {UserService} from "../services/user.service";
import {User} from "../user/user";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    RouterLink,
    FormsModule,
    NgIf
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent
{
  isEnabled = false
  isPasswordVisible = false

  constructor( private authService: AuthService, private router: Router, private utils: UtilsService, private userService: UserService) {  }

  login(loginForm: NgForm )
  {
      this.authService.login(loginForm.value).subscribe({
        next: (response: any)  => {

          this.userService.retrieveUserByEmail(response.email).subscribe(
            {
              next: (val) => {
                const user = val as User
                this.isEnabled = user.userIsEnabled

                if(!user.userIsEnabled)
                {
                  this.utils.successDialog("Échec de connexion", "Vous devez valider votre compte en cliquant sur le lien envoyé par e-mail !", false)
                }
                else if ( (response.authorities[0].authority === "ROLE_ADMIN") || (response.authorities[0].authority === "ROLE_SUPER_ADMIN")
                  || (response.authorities[0].authority === "ROLE_COACH") || (response.authorities[0].authority === "ROLE_USER"))
                {
                  console.log("You are connected as admin !!!")
                  this.authService.setRolesLS(response.authorities)
                  this.authService.setTokenLS(response.token)
                  this.authService.setEmailLS(response.email)

                  this.router.navigate(["app-component"])
                }
                else
                {
                  this.utils.successDialog("Échec de connexion", "Vous n'avez pas les droit d'accès", false)
                }

              },
              error: (err) => console.error(err)
            }
          )




        },
        error: (err: any)  => {
          if (err.status == 401)
          {
            this.utils.successDialog("Échec de connexion", "Vérifier vos informations d'identification", false)
          }
          else
          {
            this.utils.successDialog("error is not 401", "error is not 401", false)
          }
        }
      })
  }

  togglePasswordVisibility()
  {
    const showPassword = document.getElementById("showPassword") as HTMLInputElement

    if (showPassword)
    {
      this.isPasswordVisible = showPassword.checked
    }
  }
}
