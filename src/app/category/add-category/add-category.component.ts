import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CategoryService } from '../../services/category.service';
import { Category } from '../category';
import { NgIf } from '@angular/common';
import { UtilsService } from "../../serviceutils/utils.service";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import {FileHandleModule} from "../../file-handle/file-handle.module";
import {DomSanitizer} from "@angular/platform-browser";

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

  category = new Category(
    "",
    "",
    "",
    []
  )

  constructor(
    private categoryFormBuilder: FormBuilder,
    private categoryService: CategoryService,
    private utilsService: UtilsService,
    private dialogRef: MatDialogRef<AddCategoryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private sanitizer: DomSanitizer)
  {
    this.categoryId = data.categoryId
  }

  ngOnInit()
  {
    if ( this.categoryId )
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
      this.categoryFormValue.value.categoryImage,
      [])).subscribe({
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
      this.categoryFormValue.value.categoryImage,
      [])).subscribe({
      complete: () => {
        this.dialogRef.close()
        this.utilsService.openDialog("Opération réussite", "Catégorie éditée avec succès", true)
      },
      error:(err)=> this.utilsService.openDialog("Opération échouée", err.message, false)
    })
  }

  closeDialog() {
    this.dialogRef.close();
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





  onFileSelected(event: any)
  {
    if (event.target.files)
    {
      const file = event.target.files[0]


      const fileHandle: FileHandleModule = {
        file: file,
        url: this.sanitizer.bypassSecurityTrustUrl(
          window.URL.createObjectURL(file)
        )
      }

      console.log("file handler: " + fileHandle.file.name + " " + fileHandle.url)

      this.category.catImages.push(fileHandle)

    }

  }

  addCategoryWithOneImage()
  {
    this.category.catName = this.categoryFormValue.value.categoryName
    this.category.catDescription = this.categoryFormValue.value.categoryDescription

    const categoryFormData =  this.prepareFormData(this.category)

    this.categoryService.addCategoryWithOneImage(categoryFormData).subscribe({
      next:()=> {
        this.dialogRef.close()
        this.utilsService.openDialog("Opération réussite", "Catégorie ajoutée avec succès", true)

      },
      error: (err)=> this.utilsService.openDialog("Opération échouée", err.message, false)
    })
  }

  prepareFormData(category: Category): FormData
  {
    const formData = new FormData()

    formData.append(
      "catName", new Blob( [ JSON.stringify(category.catName) ], { type: "application/json" } )
    )

    formData.append(
      "catDescription", new Blob( [ JSON.stringify(category.catDescription) ], { type: "application/json" } )
    )

    for ( let i = 0 ; i < category.catImages.length ; i++ )
    {
      formData.append(
        "imageFile",
        category.catImages[i].file,
        category.catImages[i].file.name
      )
    }
    return formData
  }

}
