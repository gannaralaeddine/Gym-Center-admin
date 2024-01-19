import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivityService } from '../services/activity.service';
import { MatDialog } from '@angular/material/dialog';
import { AddActivityComponent } from './add-activity/add-activity.component';
import { Activity } from './activity';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {UtilsService} from "../serviceutils/utils.service";

@Component({
  selector: 'app-activity',
  standalone: true,
  imports: [NgFor, NgIf, MatFormFieldModule, MatInputModule, MatIconModule, MatPaginatorModule, MatTableModule, MatSortModule],
  templateUrl: './activity.component.html',
  styleUrl: './activity.component.css'
})

export class ActivityComponent implements OnInit
{
  activities: any
  dataSource!: MatTableDataSource<any>;
  displayedColumns = ['Image','Titre', 'Description', 'Catégorie','Gestion']

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private activityService: ActivityService,
    private utilsService: UtilsService,
    private dialogRef: MatDialog,
    private router: Router) {}

  ngOnInit() { this.getAllActivities() }

  getAllActivities()
  {
    this.activityService.getAllActivities().subscribe({
      next :(res) => {
        this.dataSource = new MatTableDataSource(res as any)
        this.dataSource.sort = this.sort
        this.dataSource.paginator = this.paginator
      },
      error: (err) => console.error(err)
    })
  }

  deleteActivity(id:any)
  {
    this.activityService.deleteActivity(id).subscribe({
      complete: () => this.getAllActivities(),
      error:(err)=> console.error(err)
    })
  }

  addOrUpdateDialog(activityId: number)
  {
    const popup = this.dialogRef.open(AddActivityComponent, {
      width: "40%",
      enterAnimationDuration: "1000ms",
      exitAnimationDuration: "1000ms",
      data: { activityId: activityId }
    })
    popup.afterClosed().subscribe(() =>{
      this.getAllActivities()
    })
  }

  goToActivityDetails(activity: Activity)
  {
    const params = { actId: activity.actId }

    this.router.navigate(["activity-details"], { queryParams: params  })
  }

  getActivityImage(imageName: string): string
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
