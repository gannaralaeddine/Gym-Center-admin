import {Component, Inject} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgForOf, NgIf} from "@angular/common";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {UtilsService} from "../../serviceutils/utils.service";
import {DomSanitizer} from "@angular/platform-browser";
import {UserService} from "../../services/user.service";
import {User} from "../../user/user";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [
    FormsModule,
    NgForOf,
    NgIf,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.css'
})
export class EditProfileComponent
{
  profileFormValue !: FormGroup
  user = new User()
  userEmail!: string
  constructor(private userService: UserService, private utilsService: UtilsService, private dialogRef: MatDialogRef<EditProfileComponent>,private sanitizer: DomSanitizer,
               @Inject(MAT_DIALOG_DATA) public data: any, private activityFormBuilder: FormBuilder, ) {
      this.userEmail = data.userEmail
      this.getUserByEmail()
  }

  ngOnInit()
  {
      this.profileFormValue = this.activityFormBuilder.group({
        userFirstName : ['',Validators.required],
        userLastName : ['',Validators.required],
        userDescription : ['',Validators.required],
        userPhoneNumber:['',Validators.required],
        userCountry:['',Validators.required],
        userCity:['',Validators.required],
        userState:['',Validators.required],
        userZipCode:['',Validators.required],
        userHeight:['',Validators.required],
        userWeight:['',Validators.required],
        userGender: "",
        userBirthDate: "",
        userPicture: ""
      })
  }
  populateForm(user: any)
  {
      if (user.userGender == "Homme")
      {
        this.profileFormValue.controls['userGender'].setValue("Homme")
      }
      if (user.userGender == "Femme")
      {
        this.profileFormValue.controls['userGender'].setValue("Femme")
      }
      this.profileFormValue.controls['userFirstName'].setValue(user.userFirstName)
      this.profileFormValue.controls['userLastName'].setValue(user.userLastName)
      this.profileFormValue.controls['userDescription'].setValue(user.userDescription)
      this.profileFormValue.controls['userPhoneNumber'].setValue(user.userPhoneNumber)
      this.profileFormValue.controls['userCountry'].setValue(user.userCountry)
      this.profileFormValue.controls['userCity'].setValue(user.userCity)
      this.profileFormValue.controls['userState'].setValue(user.userState)
      this.profileFormValue.controls['userZipCode'].setValue(user.userZipCode)
      this.profileFormValue.controls['userHeight'].setValue(user.userHeight)
      this.profileFormValue.controls['userWeight'].setValue(user.userWeight)
      if (user.userBirthDate)
      {
          this.profileFormValue.controls['userBirthDate'].setValue(this.parseDateString(user.userBirthDate))
      }
  }
  updateProfile()
  {
      this.user.userEmail = this.userEmail
      this.user.userFirstName =  this.profileFormValue.controls['userFirstName'].value
      this.user.userLastName =  this.profileFormValue.controls['userLastName'].value
      this.user.userDescription =  this.profileFormValue.controls['userDescription'].value
      this.user.userPhoneNumber =  this.profileFormValue.controls['userPhoneNumber'].value
      this.user.userCountry =  this.profileFormValue.controls['userCountry'].value
      this.user.userCity =  this.profileFormValue.controls['userCity'].value
      this.user.userState =  this.profileFormValue.controls['userState'].value
      this.user.userZipCode =  this.profileFormValue.controls['userZipCode'].value
      this.user.userHeight =  this.profileFormValue.controls['userHeight'].value
      this.user.userWeight =  this.profileFormValue.controls['userWeight'].value
      this.user.userBirthDate =  this.profileFormValue.controls['userBirthDate'].value
      this.user.userGender = this.profileFormValue.controls['userGender'].value

    console.log("type of: " + typeof this.profileFormValue.controls['userBirthDate'].value)

      this.userService.updateUserData(this.user).subscribe({
        complete: () => {
          this.dialogRef.close()
          this.utilsService.successDialog("Opération réussite", "Vos informations ont été modifié avec succès", true)
        },
        error: (err) => this.utilsService.successDialog("Opération échoué", err, false)
      })

  }

  getUserByEmail()
  {
    console.log(this.userEmail)
    this.userService.retrieveUserByEmail(this.userEmail).subscribe(
      {
        next: (val) => this.populateForm(val),
        error: (err) => console.error(err)
      }
    )
  }

  closeDialog()
  {
      this.dialogRef.close()
  }


  parseDateString(dateString: string): string {
    // Extract the date part in 'yyyy-MM-dd' format
    return  dateString.split('T')[0];
  }
}

