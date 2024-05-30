import {Component, Inject, PLATFORM_ID, ViewChild} from '@angular/core';
import {UserService} from "../services/user.service";
import {AuthService} from "../auth/auth.service";
import {DatePipe, isPlatformBrowser, NgFor, NgIf} from "@angular/common";
import {User} from "../user/user";
import {FileHandleModule} from "../file-handle/file-handle.module";
import {UtilsService} from "../serviceutils/utils.service";
import {DomSanitizer} from "@angular/platform-browser";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {EditProfileComponent} from "./edit-profile/edit-profile.component";
import {CardFlipComponent} from "../card-flip/card-flip.component";
import {MatGridListModule} from "@angular/material/grid-list";
import {AddImagesComponent} from "../add-images/add-images.component";
import {AddCoachSpecialitiesComponent} from "./add-coach-specialities/add-coach-specialities.component";
import { AlertDeleteComponent } from '../alert-delete/alert-delete.component';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';


@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    RouterLink,
    CardFlipComponent,
    MatGridListModule,
    NgFor,
    NgIf,
    DatePipe,
    MatPaginatorModule,
    MatTableModule
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent
{

  deleteTag = "deleteProfileImage"
  user = new User()
  accountType!: string
  userImages: any
  coachSpecialities: any
  privateSessions: any
  dataSource!: MatTableDataSource<any>
  displayedColumns: any
  @ViewChild(MatPaginator) paginator!: MatPaginator

    constructor(
      private userService: UserService,
      private authService: AuthService,
      @Inject(PLATFORM_ID)
      private platformId: Object,
      private utilsService: UtilsService,
      private sanitizer: DomSanitizer,
      private dialogRef: MatDialog,
      private activityRouter: Router,
      private router: ActivatedRoute
      ) {}

    ngOnInit()
    {
      this.router.queryParams.subscribe( params => {

        if(params["userEmail"])
        {
            this.user.userEmail = params["userEmail"]
        }
        else
        {
            if (isPlatformBrowser(this.platformId))
            {
              // @ts-ignore
              this.user.userEmail = this.authService.getEmailLS()
            }
        }
        this.getUserByEmail()
      })
    }

    populateUserData(user: any)
    {
      this.accountType = user.roles[0].roleName

      this.user.userId = user.userId
      this.user.userFirstName = user.userFirstName
      this.user.userLastName = user.userLastName
      this.user.userDescription = user.userDescription
      this.user.userPhoneNumber = user.userPhoneNumber
      this.user.userCountry = user.userCountry
      this.user.userState = user.userState
      this.user.userCity = user.userCity
      this.user.userGender = user.userGender
      this.user.userHeight = user.userHeight
      this.user.userWeight = user.userWeight
      this.user.userZipCode = user.userZipCode
      this.user.userBirthDate = user.userBirthDate
      this.user.userPicture = user.userPicture
      this.userImages = this.utilsService.deleteItemFromArray(user.userImages, user.userPicture)

      if (this.accountType === "COACH")
      {
        this.displayedColumns = ['Titre','Date Début','Date Fin','Nom Membre','Gestion']
      }  
      else if (this.accountType === "MEMBER")
      {
        this.displayedColumns = ['Titre','Date Début','Date Fin','Nom Coach','Gestion']
      }  

      this.userService.retrieveCoachSpecialities(user.userId).subscribe({
        next: (specialities) => this.coachSpecialities = specialities,
        error: (err) => console.error(err)
      })

      this.userService.retrievePrivateSessions(this.accountType, this.user.userEmail!).subscribe({
        next :(res) => {
          this.dataSource = new MatTableDataSource(res as any)
          this.dataSource.paginator = this.paginator
          console.log(this.dataSource.data)
        },
        error: (err) => console.error(err)
      })
    }


    updateProfileImage()
    {
      const formData = this.prepareFormData(this.user)

      this.userService.updateProfilePicture(formData).subscribe({
        complete: () => {
          this.getUserByEmail()
          this.utilsService.successDialog("Opération réussite", "Votre image a été éditer avec succès", true)
        },
        error:(err)=> this.utilsService.successDialog("Opération échouée", err.message, false)
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

    getUserByEmail()
    {
      this.userService.retrieveUserByEmail(this.user.userEmail).subscribe(
          {
            next: (val) => this.populateUserData(val),
            error: (err) => console.error(err)
          }
      )
    }

    onFileSelected(event: any)
    {
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

      this.updateProfileImage()
    }

    editProfile()
    {
        const popup = this.dialogRef.open(EditProfileComponent, {
          width: "60%",
          height: "80%",
          enterAnimationDuration: "1000ms",
          exitAnimationDuration: "1000ms",
          data: { userEmail: this.user.userEmail }
        })
        popup.afterClosed().subscribe(() =>{
          this.getUserByEmail()
        })
    }

    addImages()
    {
      const popup = this.dialogRef.open(AddImagesComponent, {
        width: "50%",
        height: "80%",
        enterAnimationDuration: "1000ms",
        exitAnimationDuration: "1000ms",
        data: { imagesTag: "userProfile", id: this.user.userId }
      })
      popup.afterClosed().subscribe(() =>{
        this.getUserByEmail()
      })
    }

    detectChanges(isDataChanges: boolean)
    {
      if (isDataChanges)
      {
        this.userService.getUserById(this.user.userId).subscribe(
          {
            next: (user) => this.userImages = this.utilsService.deleteItemFromArray(user.userImages, user.userPicture),
            error: (err) => console.error(err)
          }
        )
      }
    }

    getProfilePicture(userPicture: any)
    {
      if (userPicture)
      {
        return this.utilsService.getImage(userPicture)
      }
      else
      {
          return "../assets/img/icons/ic_user_tie.svg"
      }
    }

    displayImages(images: any, isOneImage: boolean)
    {
      this.utilsService.displayImages(images, isOneImage)
    }

    previewProfileImage(imageName: any, isOneImage: boolean)
    {
      this.utilsService.displayImages(imageName, isOneImage)
    }

    addSpecialities(user: any)
    {
      this.dialogRef.open(AddCoachSpecialitiesComponent, {
        width: "40%",
        height: "80%",
        enterAnimationDuration: "1000ms",
        exitAnimationDuration: "1000ms",
        data: { user: user }
      }).afterClosed().subscribe(()=>{
        this.getUserByEmail()
      })
    }

    getImage(imageName: string): string
    {
      if (imageName)
      {
        return this.utilsService.getImage(imageName)
      }
      else
      {
        return "../assets/img/icons/ic_activity.png"
      }
    }

    goToActivityDetails(activity: any)
    {
      this.activityRouter.navigate(["activity-details"], { queryParams: { actId: activity.actId }  })
    }

    goToUserDetails(privateSession: any)
    {
      switch (this.accountType) 
      {
        case "COACH":
          this.activityRouter.navigate(["profile"], { queryParams: { userEmail: privateSession.privateSessionMember.userEmail}  })
          break
        
          case "MEMBER":
            this.activityRouter.navigate(["profile"], { queryParams: { userEmail: privateSession.privateSessionCoach.userEmail}  })
            break
      }
    }

    deleteSpeciality(activityId: any)
    {
      const popup = this.dialogRef.open(AlertDeleteComponent, {
        width: "50%",
        height: "40%",
        enterAnimationDuration: "1000ms",
        exitAnimationDuration: "1000ms",
        data: { message: "Êtes-vous sûr de supprimer cette spécialité ?"}
      })
      popup.afterClosed().subscribe((isDeleteOperation) =>{
        if (isDeleteOperation)
        {
          this.userService.deleteCoachSpeciality(this.user.userId!,activityId).subscribe({
            error: (err) => console.error(err),
            complete: () => {
              this.utilsService.successDialog("Opération réussite", "Activité supprimée avec succès", true)
              this.getUserByEmail()
            }
          })
        }
      })
    }
}
