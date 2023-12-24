import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CategoryService } from '../../services/category.service';
import { Category } from '../category';

@Component({
  selector: 'app-add-category',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './add-category.component.html',
  styleUrl: './add-category.component.css'
})
export class AddCategoryComponent implements OnInit
{
    categoryFormValue !: FormGroup

    constructor(private categoryFormBuilder: FormBuilder, private categoryService: CategoryService){}

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
    this.categoryService.addCategory(new Category(this.categoryFormValue.value.categoryName,this.categoryFormValue.value.categoryDescription,this.categoryFormValue.value.categoryImage)).subscribe({
      next:()=> console.log("category added successfully !!!"),
      error: (err)=> console.error(err)
    })
  }
}
