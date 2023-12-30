import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CategoryService } from '../../services/category.service';
import { Category } from '../category';
import { NgIf } from '@angular/common';
import { UtilsService } from "../../serviceutils/utils.service";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: 'app-add-category',
  standalone: true,
  imports: [ ReactiveFormsModule, NgIf ],
  templateUrl: './add-category.component.html',
  styleUrl: './add-category.component.css'
})
export class AddCategoryComponent implements OnInit
{
  categoryFormValue !: FormGroup

  isAddOperation = true
  categoryId: number

  constructor(
    private categoryFormBuilder: FormBuilder,
    private categoryService: CategoryService,
    private utilsService: UtilsService,
    private dialogRef: MatDialogRef<AddCategoryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { this.categoryId = data.categoryId }

  ngOnInit()
  {
    if ( this.categoryId != 0 )
    {
      this.isAddOperation = false;
      this.getCategoryById(this.categoryId)
    }

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
        this.dialogRef.close()
        this.utilsService.openDialog("Opération réussite", "Catégorie ajoutée avec succès", true)

    },
      error: (err)=> this.utilsService.openDialog("Opération échouée", err.message, false)
    })
  }

  updateCategory(id:any)
  {
    this.categoryService.updateCategory(id,new Category(
      this.categoryFormValue.value.categoryName,
      this.categoryFormValue.value.categoryDescription,
      this.categoryFormValue.value.categoryImage)).subscribe({
      complete: () => {
        this.dialogRef.close()
        this.utilsService.openDialog("Opération réussite", "Catégorie éditée avec succès", true)
      },
      error:(err)=> this.utilsService.openDialog("Opération échouée", err.message, false)
    })
  }

  closeDialog() 
  {
    this.dialogRef.close()
  }

  getCategoryById(id: number)
  {
    this.categoryService.getCategory(id).subscribe({
      next: (val) => this.populateUpdateForm(val),
      error: (err) => console.error(err)
    })
  }

  populateUpdateForm(category: any)
  {
    this.categoryFormValue.controls['categoryName'].setValue(category.catName)
    this.categoryFormValue.controls['categoryDescription'].setValue(category.catDescription)
    this.categoryFormValue.controls['categoryImage'].setValue(category.catImage)
  }
}
