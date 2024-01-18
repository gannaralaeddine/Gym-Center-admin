import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { SessionService } from '../../services/session.service';
import { AddSessionComponent } from '../add-session/add-session.component';
import { ActivityService } from '../../services/activity.service';
import {CardFlipComponent} from "../../card-flip/card-flip.component";
import {MatGridListModule} from "@angular/material/grid-list";
import {NgForOf} from "@angular/common";
import {AddImagesComponent} from "../../add-images/add-images.component";

@Component({
  selector: 'app-details-session',
  standalone: true,
  imports: [
    CardFlipComponent,
    MatGridListModule,
    NgForOf
  ],
  templateUrl: './details-session.component.html',
  styleUrl: './details-session.component.css'
})
export class DetailsSessionComponent implements OnInit
{
  deleteTag = "deleteSessionImage"
  sessionId!: number
  sessionName: any
  sessionActivity: any
  sessionCoach: any
  sessionImage: any
  sessionActivityImage: any
  sessionImages!: [any]

  constructor(
    private router: ActivatedRoute,
    private sessionService: SessionService,
    private activityService: ActivityService,
    private dialogRef: MatDialog) {}


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
    this.sessionActivity = session.sessionActivity
    this.sessionCoach = session.sessionCoach
    this.sessionActivityImage = this.activityService.getActivityImage(session.sessionActivity.actImage)
    this.sessionImage = this.activityService.getActivityImage(session.sessionImage)
    this.sessionImages = session.sessionImages
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
          next: (session) => this.sessionImages = session.sessionImages,
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
}
