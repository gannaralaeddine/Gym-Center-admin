import { Component } from '@angular/core';
import {Router, RouterLink} from "@angular/router";
import { FormsModule, NgForm } from "@angular/forms";
import { AuthService } from "../services/auth.service";
import {routes} from "../app.routes";
import {AlertSuccessComponent} from "../alert-success/alert-success.component";
import {UtilsService} from "../serviceutils/utils.service";
import { NgIf } from '@angular/common';

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

  constructor( private authService: AuthService, private router: Router, private utils: UtilsService) {  }

  login(loginForm: NgForm )
  {

      this.authService.login(loginForm.value).subscribe({
        next: (response: any)  => {


          if ( (response.authorities[0].authority === "ROLE_ADMIN") || (response.authorities[0].authority === "ROLE_SUPER_ADMIN") )
          {
            console.log("You are connected as admin !!!")
            this.authService.setRolesLS(response.authorities)
            this.authService.setTokenLS(response.token)
            this.authService.setEmailLS(response.email)

            this.router.navigate(["app-component"])
          }
          else
          {

              this.utils.openDialog("Échec de connexion", "Vous n'avez pas les droit d'accès", false)
          }

        },
        error: (err: any)  => {
          if (err.status == 401)
          {
            this.utils.openDialog("Échec de connexion", "Vérifier vos informations d'identification", false)
          }
          else
          {
            this.utils.openDialog("error is not 401", "error is not 401", false)
          }

        }


      })

  }
}
