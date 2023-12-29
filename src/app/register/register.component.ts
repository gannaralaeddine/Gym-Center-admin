import { Component } from '@angular/core';
import { RouterLink } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { UserService } from "../services/user.service";
import { User } from "../user/user";
import { UtilsService } from "../serviceutils/utils.service";


@Component({
  selector: 'app-register',
  standalone: true,
    imports: [
        RouterLink,
        FormsModule,
        ReactiveFormsModule,
    ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent
{

    member = new User();

    public constructor( private userService: UserService, private utilsService: UtilsService ) {

    }

    addMember()
    {
      this.userService.addMember(this.member).subscribe({
        next:()=> this.utilsService.openDialog("Opération réussite", "Compte MEMBRE a été créer avec succès", true),
        error: (err)=> this.utilsService.openDialog("Opération échouée", err.message, false),
      })
    }


}
