import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { SessionService } from '../../services/session.service';
import { AddSessionComponent } from '../add-session/add-session.component';
import { ActivityService } from '../../services/activity.service';

@Component({
  selector: 'app-details-session',
  standalone: true,
  imports: [],
  templateUrl: './details-session.component.html',
  styleUrl: './details-session.component.css'
})
export class DetailsSessionComponent implements OnInit
{
  sessionId!: number
  sessionName: any
  sessionActivity: any
  sessionCoach: any
  sessionActivityImage: any

  constructor(
    private router: ActivatedRoute,
    private sessionService: SessionService,
    private activityService: ActivityService,
    private dialogRef: MatDialog) {}


    ngOnInit()
    {
      this.router.queryParams.subscribe( params => {
        this.sessionId = params["sessionId"]
        this.sessionService.getSession(this.sessionId).subscribe({
            next: (session) => this.populateSessionData(session),
            error: (err) => console.error(err)
        })
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
  }
}
