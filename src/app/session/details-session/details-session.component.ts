import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { SessionService } from '../../services/session.service';
import { AddSessionComponent } from '../add-session/add-session.component';
import {CardFlipComponent} from "../../card-flip/card-flip.component";
import {MatGridListModule} from "@angular/material/grid-list";
import {NgForOf, NgIf} from "@angular/common";
import {AddImagesComponent} from "../../add-images/add-images.component";
import {UtilsService} from "../../serviceutils/utils.service";

@Component({
  selector: 'app-details-session',
  standalone: true,
  imports: [
    CardFlipComponent,
    MatGridListModule,
    NgForOf,
    NgIf
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
    this.sessionActivityImage = this.utilsService.getImage(session.sessionActivity.actImage)
    this.sessionImage = this.utilsService.getImage(session.sessionImage)
    this.sessionImages = this.utilsService.deleteItemFromArray(session.sessionImages, session.sessionImage)
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
    this.routerActivity.navigate(["activity-details"], { queryParams: params  })
  }

  goToCoachProfile()
  {
    const params = { userEmail: this.sessionCoach.userEmail}
    this.routerActivity.navigate(["profile"], { queryParams: params  })
  }

  displayImages(images: any, isOneImage: boolean)
  {
    this.utilsService.displayImages(images, isOneImage)
  }
}
