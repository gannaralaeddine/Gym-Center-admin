import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {CategoryService} from "../../services/category.service";
import {NgOptimizedImage} from "@angular/common";
import {FileHandle} from "fs/promises";
import {UtilsService} from "../../serviceutils/utils.service";
import { AddCategoryComponent } from '../add-category/add-category.component';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-details-category',
  standalone: true,
  imports: [
    NgOptimizedImage
  ],
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

    constructor(private router: ActivatedRoute, private categoryService: CategoryService, private utilsService: UtilsService, private dialogRef: MatDialog) 
    {
      this.router.queryParams.subscribe( params => {
        this.categoryId = params["catId"]
        this.getCategoryById()
      })
    }

    ngOnInit() 
    {
      this.router.queryParams.subscribe( params => {

        this.categoryService.getCategory(params["catId"]).subscribe(
          {
            next: (val) => this.populateCategoryData(val),
            error: (err) => console.error(err)
          }
        )
      })
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
      this.categoryService.getCategory(this.categoryId).subscribe({
        next: (val) => this.populateCategoryData(val),
        error: (err) => console.error(err)
      })
    })
  }

  getCategoryById()
  {
    this.categoryService.getCategory(this.categoryId).subscribe(
      {
        next: (val) => {this.populateCategoryData(val)},
        error: (err) => console.error(err)
      }
    )
  }
}
