import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivityService } from '../services/activity.service';
import { MatDialog } from '@angular/material/dialog';
import { AddActivityComponent } from './add-activity/add-activity.component';

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

  constructor(private activityService: ActivityService,private dialogRef: MatDialog) {}

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
}
