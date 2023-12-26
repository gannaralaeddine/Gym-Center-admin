import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Category } from '../category/category';
import { AddCategoryComponent } from '../category/add-category/add-category.component';
import { CategoryComponent } from '../category/category.component';

@Injectable({
  providedIn: 'root'
})

export class SharedService
{
  isButtonUpdateClicked!: Boolean
  categoryObject!: Category

  private category = new BehaviorSubject(this.categoryObject)
  selectedCategory = this.category.asObservable()
  
  constructor() {}

  setCategory(categoryName: string,categoryDescription: string,categoryImage: string) 
  { 
    this.categoryObject = new Category(categoryName,categoryDescription,categoryImage)
    this.category.next(this.categoryObject) 
  }
}
