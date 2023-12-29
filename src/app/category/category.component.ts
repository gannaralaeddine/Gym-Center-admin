import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../services/category.service';
import { NgFor, NgIf } from '@angular/common';
import { AddCategoryComponent } from "./add-category/add-category.component";
import { Category } from './category';
import { MatDialog } from '@angular/material/dialog';

@Component({
    selector: 'app-category',
    standalone: true,
    templateUrl: './category.component.html',
    styleUrl: './category.component.css',
    imports: [ NgFor, AddCategoryComponent, NgIf ]
})
export class CategoryComponent implements OnInit
{
  categories: any
  isCategoryUpdated!: Boolean
  category!: Category

  public constructor(
    private categoryService: CategoryService,
    private dialogRef: MatDialog
    )
    {
      this.isCategoryUpdated = false
    }


  ngOnInit()
  {
    this.getAllCategories()
  }

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


  getCategoryImage(imageName: string): string
  {
    return this.categoryService.getCategoryImage(imageName)
  }


  addOrUpdateDialog(categoryId: number){

    const popup = this.dialogRef.open(AddCategoryComponent, {
      width: "40%",
      enterAnimationDuration: "1000ms",
      exitAnimationDuration: "1000ms",
      data: { categoryId: categoryId }
    })
    popup.afterClosed().subscribe(item =>{
      this.getAllCategories()
    })
  }
}
