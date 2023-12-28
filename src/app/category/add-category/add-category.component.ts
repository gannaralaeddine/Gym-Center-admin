import { Component, Inject, Injectable, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CategoryService } from '../../services/category.service';
import { Category } from '../category';
import { NgIf } from '@angular/common';
import { CategoryComponent } from '../category.component';
import { SharedService } from '../../services/shared-service.service';

@Component({
  selector: 'app-add-category',
  standalone: true,
  imports: [ReactiveFormsModule,NgIf],
  templateUrl: './add-category.component.html',
  styleUrl: './add-category.component.css'
})

export class AddCategoryComponent implements OnInit
{
  categoryFormValue !: FormGroup
  isCategoryAdded: Boolean

  constructor(
    private categoryFormBuilder: FormBuilder, 
    private categoryService: CategoryService, 
    private categoryComponent: CategoryComponent)
  {
    this.isCategoryAdded = false
  }

  ngOnInit()
  {
    this.categoryFormValue = this.categoryFormBuilder.group({
      categoryName : '',
      categoryDescription : '',
      categoryImage : ''
    })
  }

  addCategory()
  {
    this.categoryService.addCategory(new Category(
      this.categoryFormValue.value.categoryName,
      this.categoryFormValue.value.categoryDescription,
      this.categoryFormValue.value.categoryImage)).subscribe({
      next:()=> {
        console.log("category added successfully !!!") 
        this.categoryFormValue.reset()
        this.isCategoryAdded = true
        this.categoryComponent.getAllCategories()
    },
      error: (err)=> console.error(err)
    })
  }

  /*updateCategory()
  {
    this.categoryService.updateCategory(this.category.catId,this.category).subscribe({
      next: () => {
        this.isCategoryUpdated = true
      },
      error: (err) => console.error(err)
    })
  }*/
}
