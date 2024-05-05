import { Component } from '@angular/core';
import {FormsModule, NgForm, ReactiveFormsModule} from "@angular/forms";
import {NgClass, NgIf} from "@angular/common";
import {Router, RouterLink} from "@angular/router";
import {UserService} from "../services/user.service";
import {UtilsService} from "../serviceutils/utils.service";
import {LoadingSpinnerComponent} from "../loading-spinner/loading-spinner.component";

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    FormsModule,
    NgIf,
    RouterLink,
    ReactiveFormsModule,
    LoadingSpinnerComponent,
    NgClass
  ],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent
{
  isLoading = false
  isPasswordVisible = false
  isSendingEmailOperation = true
  isSendingCodeOperation = false
  isSendingPasswordOperation = false
  userEmail!: string
  confirmationCode!: number
  passwordValue!: string
  confirmPasswordValue!: string

  constructor(private userService: UserService, private utils: UtilsService, private router: Router) {
  }


  sendVerificationCode(loginForm: NgForm)
  {
    this.isLoading = true
    this.userService.sendVerificationCode(loginForm.value.email).subscribe(
      {
        next: () => {
          this.isLoading = false
          this.userEmail = loginForm.value.email
          this.utils.successDialog("Opération réussite", "Un e-mail contenant votre code de vérification a été envoyé avec succès!", true)
          this.isSendingEmailOperation = false
          this.isSendingCodeOperation = true
        },
        error: (err) => {
          this.isLoading = false
          this.utils.successDialog("Erreur lors de l’envoi du courriel", err.message, false)
        }
      })
  }

  checkVerificationCode(loginForm: NgForm)
  {
    this.isLoading = true
    this.userService.checkVerificationCode(loginForm.value.code).subscribe(
      {
        next: () => {
          this.isLoading = false
          this.utils.successDialog("Code est valide", "Veuillez saisir votre nouveau mot de passe !", true)
          this.isSendingCodeOperation = false
          this.isSendingPasswordOperation = true
        },
        error: (err) => {
          if (err.status == 404)
          {
            this.isLoading = false
            this.utils.successDialog("Echec de l'opération !!", "Code incorrect ou invalide vérifier votre code dans votre boite de réception!", false)
          }
        }
      })
  }

  changePassword(loginForm: NgForm)
  {
        this.isLoading = true
        this.userService.changePassword(this.userEmail, loginForm.value.password).subscribe(
          {
            next: () => {
              this.isLoading = false
              this.utils.successDialog("Opération réussite", "Votre mot de passe a été changer avec succès !", true)
              this.router.navigate([""] )
            },
            error: (err) => {
              if (err.status == 404)
              {
                this.isLoading = false
                this.utils.successDialog("Échec de l'opération !!", "User not found!", false)
              }
            }
          })
  }

  togglePasswordVisibility()
  {
    const showPass = document.getElementById("showPass") as HTMLInputElement

    if (showPass)
    {
      this.isPasswordVisible = showPass.checked
    }
  }

  isDigit()
  {
    let result = true

    if (isNaN(this.confirmationCode) || this.confirmationCode.toString().indexOf('-') != -1 || this.confirmationCode.toString().indexOf('.') != -1)
    {
      result = false
    }

   return result
   
  }

  isIdenticalPasswords()
  {
    let result = true

    if (this.passwordValue != this.confirmPasswordValue)
    {
      result = false
    }

    return result
  }
}
