import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Category} from "../category";
import {CategoryService} from "../../services/category.service";
import {NgOptimizedImage} from "@angular/common";
import {FileHandle} from "fs/promises";


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

  constructor(private router: ActivatedRoute, private categoryService: CategoryService) {
  }

    ngOnInit() {
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
      this.categoryImageUrl = this.categoryService.getCategoryImage(category.catImage)
      this.catImages = category.catImages
    }

}
