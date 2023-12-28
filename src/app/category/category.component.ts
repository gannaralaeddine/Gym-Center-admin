import {Component, Injector, OnInit, inject} from '@angular/core';
import { CategoryService } from '../services/category.service';
import { NgFor, NgIf } from '@angular/common';
import { AddCategoryComponent } from "./add-category/add-category.component";
import { SharedService } from '../services/shared-service.service';
import { Category } from './category';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
    selector: 'app-category',
    standalone: true,
    templateUrl: './category.component.html',
    styleUrl: './category.component.css',
    imports: [NgFor, AddCategoryComponent,ReactiveFormsModule,NgIf]
})
export class CategoryComponent implements OnInit
{
  categories: any
  categoryFormValue !: FormGroup
  isCategoryUpdated!: Boolean
  categoryId!: number
  category!: Category

  public constructor(
    private categoryService: CategoryService,
    private categoryFormBuilder: FormBuilder,
    private sharedService: SharedService) 
    {
      this.isCategoryUpdated = false
    }
  

  ngOnInit() 
  { 
    this.getAllCategories()
    this.categoryFormValue = this.categoryFormBuilder.group({
      categoryName : '',
      categoryDescription : '',
      categoryImage : ''
    })
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

  updateCategory(id:any)
  {
    this.categoryService.updateCategory(id,new Category(
      this.categoryFormValue.value.categoryName,
      this.categoryFormValue.value.categoryDescription,
      this.categoryFormValue.value.categoryImage)).subscribe({
      complete: () => {
        this.isCategoryUpdated = true,
        this.getAllCategories()
      },
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

  sendCategoryData(categoryName: any, categoryDescription: any, categoryImage: any)
  {
    this.sharedService.setCategory(categoryName,categoryDescription,categoryImage)
    console.log(this.sharedService.categoryObject)
  }

 populateUpdateForm(category:any)
  {
    this.categoryId = category.id
    this.categoryFormValue.controls['categoryName'].setValue(category.catName)
    this.categoryFormValue.controls['categoryDescription'].setValue(category.catDescription)
    this.categoryFormValue.controls['categoryImage'].setValue(category.catImage)
  }
}
