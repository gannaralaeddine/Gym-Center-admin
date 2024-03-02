import {Component, Inject} from '@angular/core';
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatSelectModule} from "@angular/material/select";
import {ActivityService} from "../../services/activity.service";
import {NgForOf, NgIf} from "@angular/common";
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {Coach} from "../../user/coach";
import {Activity} from "../../activity/activity";
import {UserService} from "../../services/user.service";
import { error } from 'console';

@Component({
  selector: 'app-add-coach-specialities',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatSelectModule,
    NgForOf,
    ReactiveFormsModule,
    NgIf
  ],
  templateUrl: './add-coach-specialities.component.html',
  styleUrl: './add-coach-specialities.component.css'
})
export class AddCoachSpecialitiesComponent
{
  optionsList = new FormControl([]);
  activities!: Activity[]
  coachSpecialities!: Activity []
  coach = new Coach()

  constructor(
    private activityService: ActivityService, 
    private userService: UserService, 
    @Inject(MAT_DIALOG_DATA) public data: any
    ) {}

  ngOnInit()
  {
    this.coach = this.data.user
    this.getAllActivities()
    this.userService.retrieveCoachSpecialities(this.coach.userId!).subscribe({
      next: (specialities) => {
        this.coachSpecialities = specialities as Array<Activity>
        let different!: boolean
        let specialitiesList = new Array<Activity>()
        if (this.activities)
        {
          this.activities.forEach((activity: Activity) => {
            different = true
  
            for (let i = 0; i < this.coachSpecialities.length; i++) 
            {
              if (activity.actId === this.coachSpecialities[i].actId)
              {
                different = false
                break
              }
            }
  
            if (different)
            {
              specialitiesList.push(activity)
            }
          })
          this.activities = specialitiesList
        }
      },
      error: (err) => console.error(err)
    })
    console.log(this.coachSpecialities)
  }

  getAllActivities()
  {
    this.activityService.getAllActivities().subscribe({
      next :(activities) => this.activities = activities,
      error: (err) => console.error(err)
    })
    console.log("user: " + this.coach.userEmail)
  }


    getSpecialitiesFromSelectList()
    {
        if (this.optionsList.value)
        {
          // @ts-ignore
          this.coach.coachSpecialities = this.optionsList.value
        }
    }

  addSpecialities()
  {
      // @ts-ignore
      this.userService.updateCoachSpecialities(this.coach.userId, this.optionsList.value).subscribe({
        next: () => console.log("specialities updated successfully !"),
        error: (err) => console.log("Error: " + err)
      })
  }
}
