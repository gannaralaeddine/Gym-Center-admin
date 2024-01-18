import {Component, OnInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FileHandle } from 'fs/promises';
import { ActivityService } from '../../services/activity.service';
import { NgFor,NgOptimizedImage } from '@angular/common';
import { Category } from '../../category/category';
import { CategoryService } from '../../services/category.service';
import { MatDialog } from '@angular/material/dialog';
import { AddActivityComponent } from '../add-activity/add-activity.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { AddImagesComponent } from '../../add-images/add-images.component';
import {CardFlipComponent} from "../../card-flip/card-flip.component";
import { User } from '../../user/user';

@Component({
  selector: 'app-details-activity',
  standalone: true,
  imports: [NgOptimizedImage, MatGridListModule, CardFlipComponent, NgFor],
  templateUrl: './details-activity.component.html',
  styleUrl: './details-activity.component.css'
})
export class DetailsActivityComponent implements OnInit
{

  activityTitle!: string
  activityDescription!: string
  activityImageUrl!: string
  activityCategory!: Category
  activityCategoryImage!: string
  actImages!: FileHandle[]
  activityImages!: any[]
  activityCoaches!: User[]
  activityCategoryDescription!: string
  activityId!: number

constructor(
  private router: ActivatedRoute,
  private activityService: ActivityService,
  private dialogRef: MatDialog,
  private categoryService: CategoryService) {}

  ngOnInit()
  {
    this.router.queryParams.subscribe( params => {
      this.activityId = params["actId"]
      this.getActivityById()
    })
  }

  populateActivityData(activity: any)
  {
    this.activityTitle = activity.actName
    this.activityDescription = activity.actDescription
    this.activityImageUrl = this.activityService.getActivityImage(activity.actImage)
    this.actImages = activity.actImages
    this.activityImages = activity.activityImages
    this.activityCategoryImage = this.categoryService.getCategoryImage(activity.category.catImage)
    this.activityCategoryDescription = activity.category.catDescription
    this.activityCoaches = activity.actCoaches
    console.log(this.activityCoaches)
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
    this.activityService.getActivity(this.activityId).subscribe(
      {
        next: (val) => {this.populateActivityData(val)},
        error: (err) => console.error(err)
      }
    )
  }

  getActivityImage(imageName: string)
  {
      return this.activityService.getActivityImage(imageName)
  }

  detectChanges(isDataChanges: boolean)
  {
      if (isDataChanges)
      {
          this.activityService.getActivity(this.activityId).subscribe(
            {
              next: (val) => this.activityImages = val.activityImages,
              error: (err) => console.error(err)
            }
          )
      }
  }
}
