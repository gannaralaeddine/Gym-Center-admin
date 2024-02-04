import {NgFor, NgIf} from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { SessionService } from '../services/session.service';
import { Session } from './session';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AddSessionComponent } from './add-session/add-session.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import {MatSort, MatSortModule} from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import {UtilsService} from "../serviceutils/utils.service";

@Component({
  selector: 'app-session',
  standalone: true,
  imports: [NgFor, MatFormFieldModule, MatInputModule, MatIconModule, MatPaginatorModule, MatTableModule, NgIf, MatSortModule],
  templateUrl: './session.component.html',
  styleUrl: './session.component.css'
})

export class SessionComponent implements OnInit
{
  sessions: any
  dataSource!: MatTableDataSource<any>;
  displayedColumns = ['Image', 'Titre', 'Activité', 'Coach', 'Places Réservées', 'Gestion']

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private sessionService: SessionService,
    private utilsService: UtilsService,
    private dialogRef: MatDialog,
    private router: Router) {}

  ngOnInit() { this.getAllSessions() }

  getAllSessions()
  {
    this.sessionService.getAllSessions().subscribe({
      next: (res) => {
        this.dataSource = new MatTableDataSource(res as any)
        this.dataSource.sort = this.sort
        this.dataSource.paginator = this.paginator
      },
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

  getSessionImage(imageName: string): string
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

  applyFilter(event: Event)
  {
    const filterValue = (event.target as HTMLInputElement).value
    this.dataSource.filter = filterValue.trim().toLowerCase()
    if (this.dataSource.paginator) { this.dataSource.paginator.firstPage() }
  }
}
