import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {CategoryService} from "../../services/category.service";
import {NgFor} from "@angular/common";
import {FileHandle} from "fs/promises";
import {UtilsService} from "../../serviceutils/utils.service";
import { AddCategoryComponent } from '../add-category/add-category.component';
import { MatDialog } from '@angular/material/dialog';
import { ActivityService } from '../../services/activity.service';
import { Activity } from '../../activity/activity';


@Component({
  selector: 'app-details-category',
  standalone: true,
  imports: [ NgFor ],
  templateUrl: './details-category.component.html',
  styleUrl: './details-category.component.css'
})
export class DetailsCategoryComponent implements OnInit
{

    categoryTitle!: string
    categoryDescription!: string
    categoryImageUrl!: string
    catImages!: FileHandle[]
    categoryId: any
    categoryActivities: any

    constructor(
    private router: ActivatedRoute,
    private categoryService: CategoryService,
    private utilsService: UtilsService,
    private dialogRef: MatDialog,
    private activityService: ActivityService,
    private routerActivity: Router)
    {
      this.router.queryParams.subscribe( params => {
        this.categoryId = params["catId"]
        this.getCategoryById()
      })
    }

    ngOnInit()
    {
      this.router.queryParams.subscribe( params => {

        if (isNaN(params["catId"]) || params["catId"] <= 0) {
          console.log("error id isNAN !!!")
          return
        }
        this.categoryService.getCategory(params["catId"]).subscribe(
          {
            next: (val) => this.populateCategoryData(val),
            error: (err) => console.error(err)
          }
        )
      })

      this.getCategoryActivities()
    }

    populateCategoryData(category: any)
    {
      this.categoryTitle = category.catName
      this.categoryDescription = category.catDescription
      this.categoryImageUrl = this.utilsService.getImage(category.catImage)
      this.catImages = category.catImages
    }

  updateDialog(categoryId: any)
  {
    const popup = this.dialogRef.open(AddCategoryComponent, {
      width: "40%",
      enterAnimationDuration: "1000ms",
      exitAnimationDuration: "1000ms",
      data: { categoryId: categoryId }
    })
    popup.afterClosed().subscribe(() =>{
      if (isNaN(this.categoryId) || this.categoryId <= 0) {
        console.log("error id isNAN !!!")
        return
      }
      this.categoryService.getCategory(this.categoryId).subscribe({
        next: (val) => this.populateCategoryData(val),
        error: (err) => console.error(err)
      })
    })
  }

  getCategoryById()
  {
    if (isNaN(this.categoryId) || this.categoryId <= 0) {
      console.log("error id isNAN !!!")
      return
    }
    this.categoryService.getCategory(this.categoryId).subscribe(
      {
        next: (val) => {this.populateCategoryData(val)},
        error: (err) => console.error(err)
      }
    )
  }

  getCategoryActivities()
  {
    if (isNaN(this.categoryId) || this.categoryId <= 0) {
      console.error('Invalid categoryId provided');
      return; // Or handle the error appropriately
    }
    this.activityService.getAllCategoryActivities(this.categoryId).subscribe({
      next: (activities) => this.categoryActivities = activities,
      error: (err) => console.error(err)
    })
  }

  getActivityImage(imageName: any)
  {
    return this.utilsService.getImage(imageName)
  }

  goToActivityDetails(activity: Activity)
  {
    const params = { actId: activity.actId }
    void this.routerActivity.navigate(["activity-details"], { queryParams: params  })
  }
}
