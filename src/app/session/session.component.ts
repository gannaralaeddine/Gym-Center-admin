import { NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { SessionService } from '../services/session.service';
import { Session } from './session';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AddActivityComponent } from '../activity/add-activity/add-activity.component';
import { AddSessionComponent } from './add-session/add-session.component';

@Component({
  selector: 'app-session',
  standalone: true,
  imports: [NgFor],
  templateUrl: './session.component.html',
  styleUrl: './session.component.css'
})

export class SessionComponent implements OnInit
{
  sessions: any

  constructor(
    private sessionService: SessionService,
    private dialogRef: MatDialog,
    private router: Router) {}

  ngOnInit() { this.getAllSessions() }

  getAllSessions()
  {
    this.sessionService.getAllSessions().subscribe({
      next :(session)=> this.sessions = session,
      error: (err) => console.error(err)
    })
  }

  goToSessionDetails(session: Session)
  {
    const params = { sessionId: session.sessionId }

    this.router.navigate(["session-details"], { queryParams: params  })
  }

  addOrUpdateDialog(sessionId?: number)
  {
      const popup = this.dialogRef.open(AddSessionComponent, {
        width: "40%",
        enterAnimationDuration: "1000ms",
        exitAnimationDuration: "1000ms",
        data: { sessionId: sessionId }
      })
      popup.afterClosed().subscribe(() =>{
        this.getAllSessions()
      })
  }

}
