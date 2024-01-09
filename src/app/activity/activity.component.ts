import { NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivityService } from '../services/activity.service';
import { MatDialog } from '@angular/material/dialog';
import { AddActivityComponent } from './add-activity/add-activity.component';
import { Activity } from './activity';
import { Router } from '@angular/router';

@Component({
  selector: 'app-activity',
  standalone: true,
  imports: [NgFor],
  templateUrl: './activity.component.html',
  styleUrl: './activity.component.css'
})

export class ActivityComponent implements OnInit
{
  activities: any

  constructor(
    private activityService: ActivityService,
    private dialogRef: MatDialog,
    private router: Router) {}

  ngOnInit() { this.getAllActivities() }

  getAllActivities()
  {
    this.activityService.getAllActivities().subscribe({
      next :(val)=> this.activities = val,
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

  getCategoryImage(imageName: string): string
  {
    if (imageName)
    {
      return this.activityService.getActivityImage(imageName)
    }
    else
    {
      return "../assets/img/icons/ic_activity.png"
    }



  }
}
