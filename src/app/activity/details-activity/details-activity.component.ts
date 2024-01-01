import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FileHandle } from 'fs/promises';
import { ActivityService } from '../../services/activity.service';
import { NgOptimizedImage } from '@angular/common';
import { Category } from '../../category/category';
import { CategoryService } from '../../services/category.service';

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

constructor(
  private router: ActivatedRoute,
  private activityService: ActivityService,
  private categoryService: CategoryService) {}

  ngOnInit()
  {
    this.router.queryParams.subscribe( params => {

      this.activityService.getActivity(params["actId"]).subscribe(
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


}
