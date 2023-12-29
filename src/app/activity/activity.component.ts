import { NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivityService } from '../services/activity.service';

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

  constructor(private activityService: ActivityService) {}

  ngOnInit() { this.getAllActivities() }

  getAllActivities()
  {
    this.activityService.getAllActivities().subscribe({
      next :(val)=> this.activities = val,
      error: (err) => console.error(err)
    })
  }

}
