import {Component, Inject, PLATFORM_ID} from '@angular/core';
import {UserService} from "../services/user.service";
import {AuthService} from "../auth/auth.service";
import {isPlatformBrowser} from "@angular/common";
import {User} from "../user/user";
import {FileHandleModule} from "../file-handle/file-handle.module";
import {UtilsService} from "../serviceutils/utils.service";
import {DomSanitizer} from "@angular/platform-browser";

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent
{
    user = new User()
    email!: string
    fullname!: string
    accountType!: string
    phoneNumber!: string
    country!: string

    constructor(private userService: UserService, private authService: AuthService, @Inject(PLATFORM_ID) private platformId: Object,
                private utilsService: UtilsService, private sanitizer: DomSanitizer) {

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


  updateProfileImage(id: number)
  {

    this.user.userId = id

    const formData = this.prepareFormData(this.user)

    this.userService.updateProfilePicture(formData).subscribe({
      complete: () => {
        this.utilsService.openDialog("Opération réussite", "Votre image a été éditer avec succès", true)
      },
      error:(err)=> this.utilsService.openDialog("Opération échouée", err.message, false)
    })

  }

  prepareFormData(user: User): FormData
  {
    const formData = new FormData()

    formData.append(
      "user", new Blob( [ JSON.stringify(user) ], { type: "application/json" } )
    )

    for ( let i = 0 ; i < user.userImages.length ; i++ )
    {
      formData.append(
        "imageFile",
        user.userImages[i].file,
        user.userImages[i].file.name
      )
    }

    return formData
  }



  onFileSelected(event: any)
  {
    console.log(event.target.files)

    this.user.userImages = []


    if (event.target.files)
    {

      for (let i= 0 ; i < event.target.files.length ; i++)
      {
        const file = event.target.files[i]

        const fileHandle: FileHandleModule = {
          file: file,
          url: this.sanitizer.bypassSecurityTrustUrl(
            window.URL.createObjectURL(file)
          )
        }

        this.user.userImages.push(fileHandle)

      }
    }
  }

  openFileSelect()
  {

  }
}
