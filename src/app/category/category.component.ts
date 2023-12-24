import {Component, Injector, OnInit, inject} from '@angular/core';
import { CategoryService } from '../services/category.service';
import { NgFor } from '@angular/common';
import { AddCategoryComponent } from "./add-category/add-category.component";

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

  public constructor(private categoryService: CategoryService) {}

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
}
