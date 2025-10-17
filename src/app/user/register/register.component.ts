import { Component } from '@angular/core';
import { RouterLink } from "@angular/router";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import { UserService } from "../../services/user.service";
import { User } from "../user";
import { UtilsService } from "../../serviceutils/utils.service";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {CoachModule} from "../coach.module";
import {MemberModule} from "../member.module";
import {AuthService} from "../../auth/auth.service";
import { LoadingSpinnerComponent } from '../../loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    RouterLink,
    FormsModule,
    ReactiveFormsModule,
    NgForOf,
    NgIf,
    LoadingSpinnerComponent,
    NgClass,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent
{
    isLoading = false
    userForm !: FormGroup
    roles: any
    selectList!: HTMLSelectElement
    selectedOptionValue!: string
    admin = new User()
    member = new MemberModule()
    coach = new CoachModule()

    isPasswordVisible = false

    public constructor(
      private userFormBuilder: FormBuilder,
      private userService: UserService,
      private authService: AuthService,
      private utilsService: UtilsService)
    {
      this.getAllRoles()

      this.userForm = this.userFormBuilder.group({
        userEmail : ['',Validators.required],
        userLastName : ['',Validators.required],
        userFirstName : ['',Validators.required],
        userPassword: ['',Validators.required],
        userRole: [undefined,Validators.required]
      })
    }

    createUser()
    {
        this.selectList =  document.getElementById("register_userRoleSelect") as  HTMLSelectElement
        this.selectedOptionValue = this.selectList.options[this.selectList.selectedIndex].value
        this.isLoading = true

        switch (this.selectedOptionValue)
        {
          case "1": this.registerMember()
            break;
          case "2": this.registerCoach()
            break;
          case "3": this.registerAdmin()
            break;
          default:
            this.utilsService.successDialog("Opération échouée", "Veuillez choisir le type de compte svp !", false)
        }
    }

    registerMember()
    {
      this.member.userEmail = this.userForm.value.userEmail
      this.member.userFirstName = this.userForm.value.userFirstName
      this.member.userLastName = this.userForm.value.userLastName
      this.member.userPassword = this.userForm.value.userPassword

      this.userService.registerMember(this.member).subscribe({
        next:(statusCode)=> {
          if (statusCode == 200)
          {
            this.isLoading = false
            this.utilsService.successDialog("Opération réussite", "Compte MEMBRE a été créé avec succès", true)
          }
        },
        error: (err)=> {
          this.isLoading = false
          switch (err.status)
          {
            case 302:
            { this.utilsService.successDialog("Opération échouée", "Compte déjà existe! Veuillez essayer avec un autre E-mail!", false); break }
            default:
            { this.utilsService.successDialog("Opération échouée", err.message, false); break }
          }
        },
      })
    }

    registerCoach()
    {
      this.coach.userEmail = this.userForm.value.userEmail
      this.coach.userFirstName = this.userForm.value.userFirstName
      this.coach.userLastName = this.userForm.value.userLastName
      this.coach.userPassword = this.userForm.value.userPassword

        this.userService.registerCoach(this.coach).subscribe({
          next:(statusCode)=> {
            if (statusCode == 200)
            {
              this.isLoading = false
              this.utilsService.successDialog("Opération réussite", "Compte COACH a été créé avec succès", true)
            }
          },
          error: (err)=> {
              this.isLoading = false
              switch (err.status)
              {
                case 302:
                { this.utilsService.successDialog("Opération échouée", "Compte déjà existe! Veuillez essayer avec un autre E-mail!", false); break }
                default:
                { this.utilsService.successDialog("Opération échouée", err.message, false); break }
              }

          },
        })
    }

    registerAdmin()
    {
        this.admin.userEmail = this.userForm.value.userEmail
        this.admin.userFirstName = this.userForm.value.userFirstName
        this.admin.userLastName = this.userForm.value.userLastName
        this.admin.userPassword = this.userForm.value.userPassword

        this.userService.registerAdmin(this.admin).subscribe({
          next:(statusCode)=> {
            if (statusCode == 200)
            {
              this.isLoading = false
              this.utilsService.successDialog("Opération réussite", "Compte ADMIN a été créé avec succès", true)
            }
          },
          error: (err)=> {
              this.isLoading = false
              switch (err.status)
              {
                case 302:
                { this.utilsService.successDialog("Opération échouée", "Compte déjà existe! Veuillez essayer avec un autre E-mail!", false); break }
                default:
                { this.utilsService.successDialog("Opération échouée", err.message, false); break }
              }
          },
        })
    }

    getAllRoles()
    {
      this.userService.getAllRoles().subscribe({
        next :(val)=> this.roles = val,
        error: (err) => console.error(err)
      })
    }


    isRoleMatches(role: string): boolean
    {
        return this.authService.isRoleMatches(role)
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
