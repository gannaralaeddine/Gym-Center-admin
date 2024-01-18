import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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

  category = new Category()

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
    this.category.catImages = []
    if ( this.categoryId )
    {
      this.isAddOperation = false;
      this.getCategoryById(this.categoryId)
    }

    this.categoryFormValue = this.categoryFormBuilder.group({
      categoryName : ['',Validators.required],
      categoryDescription :['',Validators.required],
      categoryImage : ''
    })
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

  updateCategoryDetails(id: number)
  {
      this.category.catId = id
      this.category.catName = this.categoryFormValue.value.categoryName
      this.category.catDescription = this.categoryFormValue.value.categoryDescription

      if ((this.category.catImages) && (this.category.catImages.length > 0))
      {
          const formData = this.prepareFormData(this.category)

          this.categoryService.updateCategory(formData).subscribe({
            complete: () => {
              this.dialogRef.close()
              this.utilsService.successDialog("Opération réussite", "Catégorie éditée avec succès", true)
            },
            error:(err)=> this.utilsService.successDialog("Opération échouée", err.message, false)
          })
      }
      else
      {
        this.categoryService.updateCategoryData(id, this.category).subscribe({
          complete: () => {
            this.dialogRef.close()
            this.utilsService.successDialog("Opération réussite", "Catégorie éditée avec succès", true)
          },
          error:(err)=> this.utilsService.successDialog("Opération échouée", err.message, false)
        })
      }

  }

  addCategoryWithOneImage()
  {
      this.category.catName = this.categoryFormValue.value.categoryName
      this.category.catDescription = this.categoryFormValue.value.categoryDescription

      const categoryFormData =  this.prepareFormData( this.category )

      this.categoryService.addCategoryWithOneImage(categoryFormData).subscribe({
        next:()=> {
          this.dialogRef.close()
          this.utilsService.successDialog("Opération réussite", "Catégorie ajoutée avec succès", true)

        },
        error: (err)=> this.utilsService.successDialog("Opération échouée", err.message, false)
      })



  }

  prepareFormData(category: Category): FormData
  {
    const formData = new FormData()

    formData.append(
      "category", new Blob( [ JSON.stringify(category) ], { type: "application/json" } )
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

  onFileSelected(event: any)
  {
    console.log(event.target.files)

    this.category.catImages = []



    if (event.target.files)
    {

      for (let i= 0 ; i < event.target.files.length ; i++)
      {
        const file = event.target.files[i]

        const fileHandle: FileHandleModule = {
          file: file,
          url: this.sanitizer.bypassSecurityTrustUrl(
            window.URL.createObjectURL(file)
          )
        }

        this.category.catImages.push(fileHandle)

        this.checkValidityForm()
        this.onTouched()
      }
    }
  }

  closeDialog() {
  this.dialogRef.close();
}


  addImagesToCategory(catId: any)
  {

    this.category.catId = catId

    const categoryFormData =  this.prepareFormData(this.category)

    this.categoryService.addImagesToCategory(categoryFormData).subscribe({
      next:()=> {
        this.dialogRef.close()
        this.utilsService.successDialog("Opération réussite", "Catégorie éditée avec succès", true)

      },
      error: (err)=> this.utilsService.successDialog("Opération échouée", err.message, false)
    })
  }

  checkValidityForm()
  {
    // check category name and change borer color based on validity of input
    if (this.categoryFormValue.controls['categoryName'].invalid && this.categoryFormValue.controls['categoryName'].touched)
    {
      document.getElementById('categoryNameInput')!.className = "form-control border border-danger pl-2 round"
    }
    else
    {
      document.getElementById('categoryNameInput')!.className = "form-control border border-dark pl-2 round"
    }

    // check category description and change borer color based on validity of input
    if (this.categoryFormValue.controls['categoryDescription'].invalid && this.categoryFormValue.controls['categoryDescription'].touched)
    {
      document.getElementById('categoryDescriptionInput')!.className = "form-control border border-danger pl-2 round"
    }
    else
    {
      document.getElementById('categoryDescriptionInput')!.className = "form-control border border-dark pl-2 round"
    }

    if (this.categoryId)
    {
      // enable or disable the update button
      if (this.categoryFormValue.controls['categoryName'].invalid || this.categoryFormValue.controls['categoryDescription'].invalid)
      {
        document.getElementById("updateButton")?.setAttribute("disabled","")
      }
      else
      {
        document.getElementById("updateButton")?.removeAttribute("disabled")
      }
    }
    else
    {
      // enable or disable the add button
      if (this.categoryFormValue.controls['categoryName'].valid && this.categoryFormValue.controls['categoryDescription'].valid && this.category.catImages.length > 0 )
      {
        document.getElementById("addButton")?.removeAttribute("disabled")
      }
      else
      {
        document.getElementById("addButton")?.setAttribute("disabled","")
      }

    }
  }

  onTouched()
  {
      if (this.category.catImages.length == 0)
      {
          if (document.getElementById("formFile"))
          {
            document.getElementById("formFile")!.className = "form-control border border-danger pl-2 round"
          }
          if (document.getElementById("formMultipleFiles"))
          {
            document.getElementById("formMultipleFiles")!.className = "form-control border border-danger pl-2 round"
          }
      }
      else
      {
          if (document.getElementById("formFile"))
          {
            document.getElementById("formFile")!.className = "form-control border border-dark pl-2 round"
          }
          if (document.getElementById("formMultipleFiles"))
          {
            document.getElementById("formMultipleFiles")!.className = "form-control border border-dark pl-2 round"
          }
      }


    }
}
