import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { SessionService } from '../../services/session.service';
import { AddSessionComponent } from '../add-session/add-session.component';
import {CardFlipComponent} from "../../card-flip/card-flip.component";
import {MatGridListModule} from "@angular/material/grid-list";
import {DatePipe, NgForOf, NgIf} from "@angular/common";
import {AddImagesComponent} from "../../add-images/add-images.component";
import {UtilsService} from "../../serviceutils/utils.service";

@Component({
  selector: 'app-details-session',
  standalone: true,
  imports: [
    CardFlipComponent,
    MatGridListModule,
    NgForOf,
    NgIf,
    DatePipe
  ],
  templateUrl: './details-session.component.html',
  styleUrl: './details-session.component.css'
})
export class DetailsSessionComponent implements OnInit
{
  deleteTag = "deleteSessionImage"
  sessionId!: number
  sessionName: any
  sessionDescription: any
  sessionActivity: any
  sessionCoach: any
  sessionImage: any
  sessionActivityImage: any
  sessionImages!: any
  sessionTotalPlaces: any
  sessionDate: any
  sessionMembers: any
  sessionReservedPlaces: any
  sessionPrice: any

  constructor(
    private router: ActivatedRoute,
    private sessionService: SessionService,
    private utilsService: UtilsService,
    private dialogRef: MatDialog,
    private routerActivity: Router) {}


    ngOnInit()
    {
      this.router.queryParams.subscribe( params => {
        this.sessionId = params["sessionId"]
        this.getSessionById()
      })
    }

  updateDialog(sessionId: number)
  {
    const popup = this.dialogRef.open(AddSessionComponent, {
      width: "40%",
      enterAnimationDuration: "1000ms",
      exitAnimationDuration: "1000ms",
      data: { sessionId: sessionId }
    })

    popup.afterClosed().subscribe(() => {
      if (isNaN(this.sessionId) || this.sessionId <= 0) {
        console.error('Invalid sessionId provided');
        return; // Or handle the error appropriately
      }
      this.sessionService.getSession(this.sessionId).subscribe({
        next: (session) => this.populateSessionData(session),
        error: (err) => console.error(err)
      })
    })
  }

  populateSessionData(session: any)
  {
    this.sessionName = session.sessionName
    this.sessionDescription = session.sessionDescription
    this.sessionActivity = session.sessionActivity
    this.sessionCoach = session.sessionCoach
    this.sessionTotalPlaces = session.sessionTotalPlaces
    this.sessionReservedPlaces = session.sessionReservedPlaces
    this.sessionDate = session.sessionDate
    this.sessionActivityImage = this.utilsService.getImage(session.sessionActivity.actImage)
    this.sessionImage = this.utilsService.getImage(session.sessionImage)
    this.sessionImages = this.utilsService.deleteItemFromArray(session.sessionImages, session.sessionImage)
    this.sessionMembers = session.sessionMembers
    this.sessionPrice = session.sessionPrice
    console.log(session)
  }

  addImages()
  {
    const popup = this.dialogRef.open(AddImagesComponent, {
      width: "50%",
      height: "80%",
      enterAnimationDuration: "1000ms",
      exitAnimationDuration: "1000ms",
      data: { imagesTag: "session", id: this.sessionId }
    })
    popup.afterClosed().subscribe(() =>{
      this.getSessionById()
    })
  }

  detectChanges(isDataChanges: boolean)
  {
    if (isDataChanges)
    {
      if (isNaN(this.sessionId) || this.sessionId <= 0) {
        console.error('Invalid sessionId provided');
        return; // Or handle the error appropriately
      }
      this.sessionService.getSession(this.sessionId).subscribe(
        {
          next: (session) => this.sessionImages = this.utilsService.deleteItemFromArray(session.sessionImages, session.sessionImage),
          error: (err) => console.error(err)
        }
      )
    }
  }

  getSessionById()
  {
    if (isNaN(this.sessionId) || this.sessionId <= 0) {
      console.error('Invalid sessionId provided');
      return; // Or handle the error appropriately
    }
    this.sessionService.getSession(this.sessionId).subscribe({
      next: (session) => this.populateSessionData(session),
      error: (err) => console.error(err)
    })
  }

  getCoachImage()
  {
    return this.utilsService.getImage(this.sessionCoach.userPicture)
  }

  goToActivityDetails()
  {
    const params = { actId: this.sessionActivity.actId}
    void this.routerActivity.navigate(["activity-details"], { queryParams: params  })
  }

  goToCoachProfile()
  {
    const params = { userEmail: this.sessionCoach.userEmail}
    void this.routerActivity.navigate(["profile"], { queryParams: params  })
  }

  displayImages(images: any, isOneImage: boolean)
  {
    this.utilsService.displayImages(images, isOneImage)
  }

  getUserImage(imageName: string): string
  {
      if (imageName)
      {
          return this.utilsService.getImage(imageName)
      }
      else
      {
          return "../assets/img/icons/ic_user_tie.svg"
      }
  }

  goToUserProfileDetails(email:any)
  {
    const params = { userEmail: email }
    void this.routerActivity.navigate(["profile"], { queryParams: params  })
  }

  removeMemberFromSession(memberEmail: string, sessionId: number)
  {
    this.utilsService.deletePopup("Retirer participation", "Êtes-vous sûr de retirer sa participation ?", "removeOperation").afterClosed().subscribe((isDeleteOperation)=>{
      if (isDeleteOperation)
      {
        this.sessionService.removeMemberFromSession(memberEmail, sessionId).subscribe({
          error: (err) => console.error(err),
          complete: () => {
            this.utilsService.successDialog("Opéation réussite", "participation retirée avec succès", true)
            this.ngOnInit()
          }
        })
      }
    })
  }
}
