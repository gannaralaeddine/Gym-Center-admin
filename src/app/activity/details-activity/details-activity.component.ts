import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FileHandle } from 'fs/promises';
import { ActivityService } from '../../services/activity.service';
import { NgOptimizedImage } from '@angular/common';
import { Category } from '../../category/category';
import { CategoryService } from '../../services/category.service';
import { MatDialog } from '@angular/material/dialog';
import { AddActivityComponent } from '../add-activity/add-activity.component';

@Component({
  selector: 'app-details-activity',
  standalone: true,
  imports: [NgOptimizedImage],
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
      this.activityService.getActivity(this.activityId).subscribe(
        {
          next: (val) => this.populateActivityData(val),
          error: (err) => console.error(err)
        }
      )
    })
  }

  populateActivityData(activity: any)
  {
    this.activityTitle = activity.actName
    this.activityDescription = activity.actDescription
    this.activityImageUrl = this.activityService.getActivityImage(activity.actImage)
    this.actImages = activity.actImage
    this.activityCategoryImage = this.categoryService.getCategoryImage(activity.category.catImage)
    this.activityCategoryDescription = activity.category.catDescription
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
}
