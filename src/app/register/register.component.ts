import { Component } from '@angular/core';
import { RouterLink } from "@angular/router";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import { UserService } from "../services/user.service";
import { User } from "../user/user";
import { UtilsService } from "../serviceutils/utils.service";
import {NgForOf, NgIf} from "@angular/common";
import {CoachModule} from "../user/coach.module";
import {MemberModule} from "../user/member.module";
import {AuthService} from "../services/auth.service";


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    RouterLink,
    FormsModule,
    ReactiveFormsModule,
    NgForOf,
    NgIf,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent
{
    userForm !: FormGroup
    roles: any
    selectList!: HTMLSelectElement
    selectedOptionValue!: string

    admin = new User()
    member = new MemberModule()
    coach = new CoachModule()


    public constructor( private userFormBuilder: FormBuilder, private userService: UserService, private authService: AuthService,
                        private utilsService: UtilsService )
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
        console.log("email: " + this.userForm.value.userEmail)

        this.selectList =  document.getElementById("userRoleSelect") as  HTMLSelectElement

        this.selectedOptionValue = this.selectList.options[this.selectList.selectedIndex].value

        switch (this.selectedOptionValue)
        {
          case "1": this.registerMember()
            break;
          case "2": this.registerCoach()
            break;
          case "3": this.registerAdmin()
            break;
          default:
            console.log(this.selectedOptionValue)

        }
    }

    registerMember()
    {
      this.member.userEmail = this.userForm.value.userEmail
      this.member.userFirstName = this.userForm.value.userFirstName
      this.member.userLastName = this.userForm.value.userLastName
      this.member.userPassword = this.userForm.value.userPassword

      this.userService.registerMember(this.member).subscribe({
        next:()=> this.utilsService.openDialog("Opération réussite", "Compte MEMBRE a été créer avec succès", true),
        error: (err)=> this.utilsService.openDialog("Opération échouée", err.message, false),
      })
    }

    registerCoach()
    {
      this.coach.userEmail = this.userForm.value.userEmail
      this.coach.userFirstName = this.userForm.value.userFirstName
      this.coach.userLastName = this.userForm.value.userLastName
      this.coach.userPassword = this.userForm.value.userPassword

        this.userService.registerCoach(this.coach).subscribe({
          next:()=> this.utilsService.openDialog("Opération réussite", "Compte COACH a été créer avec succès", true),
          error: (err)=> this.utilsService.openDialog("Opération échouée", err.message, false),
        })
    }

    registerAdmin()
    {
        this.admin.userEmail = this.userForm.value.userEmail
        this.admin.userFirstName = this.userForm.value.userFirstName
        this.admin.userLastName = this.userForm.value.userLastName
        this.admin.userPassword = this.userForm.value.userPassword

        this.userService.registerAdmin(this.admin).subscribe({
          next:()=> this.utilsService.openDialog("Opération réussite", "Compte COACH a été créer avec succès", true),
          error: (err)=> this.utilsService.openDialog("Opération échouée", err.message, false),
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
}
