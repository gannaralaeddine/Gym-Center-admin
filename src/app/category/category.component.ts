import {Component, Injector, OnInit, inject} from '@angular/core';
import { CategoryService } from '../services/category.service';
import { NgFor } from '@angular/common';
import { AddCategoryComponent } from "./add-category/add-category.component";
import { SharedService } from '../services/shared-service.service';
import { Category } from './category';

@Component({
    selector: 'app-category',
    standalone: true,
    templateUrl: './category.component.html',
    styleUrl: './category.component.css',
    imports: [NgFor, AddCategoryComponent]
})
export class CategoryComponent implements OnInit
{
  categories: any
  addComponent!: AddCategoryComponent

  public constructor(
    private categoryService: CategoryService, 
    private sharedService: SharedService) {}

  ngOnInit() { this.getAllCategories() }

  getAllCategories()
  {
    this.categoryService.getAllCategories().subscribe({
      next :(val)=> this.categories = val,
      error: (err) => console.error(err)
    })

  }

  deleteCategory(id:any)
  {
    this.categoryService.deleteCategory(id).subscribe({
      complete: () => this.getAllCategories(),
      error:(err)=> console.error(err)
    })
  }

  updateCategory(id:any,category:any)
  {
    this.categoryService.updateCategory(id,category).subscribe({
      complete: () => this.getAllCategories(),
      error:(err)=> console.error(err)
    })
  }

  getCategory(id:number)
  {
    this.categoryService.getCategory(id).subscribe({
      next: (val) => console.log(val),
      error: (err) => console.error(err)
    })
  }

  sendCategoryData(categoryName: string, categoryDescription: string, categoryImage: string)
  {
    this.sharedService.setCategory(categoryName,categoryDescription,categoryImage)
  }

  getUpdateFormPopulated(category: Category)
  {
    /*this.getSelectedCategory(category.catName,category.catDescription,category.catImage)
    this.sharedService.populateUpdateForm()*/
   
  }
}
