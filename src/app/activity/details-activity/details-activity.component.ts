import {Component, OnInit} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FileHandle } from 'fs/promises';
import { ActivityService } from '../../services/activity.service';
import { NgFor,NgIf,NgOptimizedImage } from '@angular/common';
import { Category } from '../../category/category';
import { MatDialog } from '@angular/material/dialog';
import { AddActivityComponent } from '../add-activity/add-activity.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { AddImagesComponent } from '../../add-images/add-images.component';
import {CardFlipComponent} from "../../card-flip/card-flip.component";
import { User } from '../../user/user';
import {UtilsService} from "../../serviceutils/utils.service";

@Component({
  selector: 'app-details-activity',
  standalone: true,
  imports: [NgOptimizedImage, MatGridListModule, CardFlipComponent, NgFor, NgIf],
  templateUrl: './details-activity.component.html',
  styleUrl: './details-activity.component.css'
})
export class DetailsActivityComponent implements OnInit
{

  deleteTag = "deleteActivityImage"
  activityTitle!: string
  activityDescription!: string
  activityImageUrl!: string
  activityCategory!: Category
  activityCategoryImage!: string
  activityCategoryName!: string
  actImages!: FileHandle[]
  activityImages!: any[]
  activityCoaches!: User[]
  activityCategoryDescription!: string
  activityId!: number

  constructor(
    private router: ActivatedRoute,
    private activityService: ActivityService,
    private utilsService: UtilsService,
    private dialogRef: MatDialog,
    private routerCoach: Router) {}

  ngOnInit()
  {
    this.router.queryParams.subscribe( params => {
      this.activityId = params["actId"]
      this.getActivityById()
    })
  }

  populateActivityData(activity: any)
  {
    this.activityCategory = activity.category
    this.activityTitle = activity.actName
    this.activityDescription = activity.actDescription
    this.activityImageUrl = activity.actImage
    this.actImages = activity.actImages
    this.activityCategoryName = activity.category.catName
    this.activityCategoryImage = activity.category.catImage
    this.activityCategoryDescription = activity.category.catDescription
    this.activityCoaches = activity.actCoaches
    this.activityImages = this.utilsService.deleteItemFromArray(activity.activityImages, activity.actImage)
  }

  updateDialog(activityId: number)
  {
    const popup = this.dialogRef.open(AddActivityComponent, {
      width: "40%",
      enterAnimationDuration: "1000ms",
      exitAnimationDuration: "1000ms",
      data: { activityId: activityId }
    })
    popup.afterClosed().subscribe(() =>{
      if (isNaN(this.activityId) || this.activityId <= 0) {
        console.log("error id isNAN !!!")
        return
      }
      this.activityService.getActivity(this.activityId).subscribe({
        next: (val) => this.populateActivityData(val),
        error: (err) => console.error(err)
      })
    })
  }

  addImages()
  {
    const popup = this.dialogRef.open(AddImagesComponent, {
      width: "50%",
      height: "80%",
      enterAnimationDuration: "1000ms",
      exitAnimationDuration: "1000ms",
      data: { imagesTag: "activity", id: this.activityId }
    })
    popup.afterClosed().subscribe(() =>{
        this.getActivityById()
    })
  }

  getActivityById()
  {
    if (isNaN(this.activityId) || this.activityId <= 0) {
      console.log("error id isNAN !!!")
      return
    }
    this.activityService.getActivity(this.activityId).subscribe(
      {
        next: (val) => this.populateActivityData(val),
        error: (err) => console.error(err)
      }
    )
  }

  getImage(imageName: any)
  {
      return this.utilsService.getImage(imageName)
  }

  detectChanges(isDataChanges: boolean)
  {
      if (isDataChanges)
      {
          if (isNaN(this.activityId) || this.activityId <= 0) {
            console.log("error id isNAN !!!")
            return
          }
          this.activityService.getActivity(this.activityId).subscribe(
            {
              next: (activity) => this.activityImages = this.utilsService.deleteItemFromArray(activity.activityImages, activity.actImage),
              error: (err) => console.error(err)
            }
          )
      }
  }

  goToCoachProfile(user: User)
  {
    const params = { userEmail: user.userEmail }
    void this.routerCoach.navigate(["profile"], { queryParams: params  })
  }

  goToCategoryDetails(category: Category)
  {
    const params = { catId: category.catId }
    void this.routerCoach.navigate(["category-details"], { queryParams: params  })
  }

  displayImages(images: any, isOneImage: boolean)
  {
      this.utilsService.displayImages(images, isOneImage)
  }
}
