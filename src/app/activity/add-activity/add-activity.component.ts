import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AddCategoryComponent } from '../../category/add-category/add-category.component';
import { UtilsService } from '../../serviceutils/utils.service';
import { ActivityService } from '../../services/activity.service';
import { Activity } from '../activity';
import { NgFor, NgIf } from '@angular/common';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../category/category';
import {FileHandleModule} from "../../file-handle/file-handle.module";
import {DomSanitizer} from "@angular/platform-browser";

@Component({
  selector: 'app-add-activity',
  standalone: true,
  imports: [ReactiveFormsModule,NgIf,NgFor],
  templateUrl: './add-activity.component.html',
  styleUrl: './add-activity.component.css'
})

export class AddActivityComponent
{
  activityFormValue !: FormGroup
  isAddOperation = true
  activityId: number
  categories : any
  categoryObject!: Category
  isValidForm = true


  activity = new Activity(
    "",
    "",
    "",
    new Category("", "", "", []),
    []
  )


  constructor(
    private activityFormBuilder: FormBuilder,
    private activityService: ActivityService,
    private categoryService: CategoryService,
    private utilsService: UtilsService,
    private dialogRef: MatDialogRef<AddCategoryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private sanitizer: DomSanitizer) { this.activityId = data.activityId }

  ngOnInit()
  {
    if ( this.activityId )
    {
      this.isAddOperation = false;
      this.getActivityById(this.activityId)
    }

    this.activityFormValue = this.activityFormBuilder.group({
      activityName : ['',Validators.required],
      activityDescription : ['',Validators.required],
      activityImage : ['',Validators.required],
      activityCategory:undefined
    })

    this.getAllCategories()

  }

  updateActivity(id:any)
  {

    this.activityService.updateActivity(id,new Activity(
      this.activityFormValue.value.activityName,
      this.activityFormValue.value.activityDescription,
      this.activityFormValue.value.activityImage,
      this.categoryObject,
      [])).subscribe({
      complete: () => {
        this.dialogRef.close()
        this.utilsService.openDialog("Opération réussite", "Activité éditée avec succès", true)
      },
      error:(err)=> this.utilsService.openDialog("Opération échouée", err.message, false)
    })
  }

  closeDialog()
  {
    this.dialogRef.close()
  }

  getActivityById(id: number)
  {
    this.activityService.getActivity(id).subscribe({
      next: (activity) => this.populateUpdateForm(activity),
      error: (err) => console.error(err)
    })
  }

  populateUpdateForm(activity: any)
  {
    this.activityFormValue.controls['activityName'].setValue(activity.actName)
    this.activityFormValue.controls['activityDescription'].setValue(activity.actDescription)
    //this.activityFormValue.controls['activityImage'].setValue(activity.actImage)
  }

  getAllCategories()
  {
    this.categoryService.getAllCategories().subscribe({
      next: (category) => this.categories = category,
      error: (err) => console.error(err)
    })
  }

  getCategory()
  {
    let id = this.activityFormValue.value.activityCategory
    this.categoryService.getCategory(id).subscribe({
      next: (cat) => this.categoryObject = cat as Category,
      error: (err) => console.log(err)
    })
  }

  changeClassName(elementId:string,className: string)
  {
    document.getElementById(elementId)!.className = className
  }

  checkValidityForm()
  {
    // check activity name and change borer color based on validity of input
    if (this.activityFormValue.controls['activityName'].invalid && this.activityFormValue.controls['activityName'].touched)
    {
      document.getElementById('activityNameInput')!.className = "form-control border border-danger pl-2 round"
    }
    else
    {
      document.getElementById('activityNameInput')!.className = "form-control border border-dark pl-2 round"
    }
    
    // check activity description and change borer color based on validity of input
    if (this.activityFormValue.controls['activityDescription'].invalid && this.activityFormValue.controls['activityDescription'].touched)
    {
      document.getElementById('activityDescriptionInput')!.className = "form-control border border-danger pl-2 round"
    }
    else
    {
      document.getElementById('activityDescriptionInput')!.className = "form-control border border-dark pl-2 round"
    }
  }


  addActivityWithOneImage()
  {
    this.activity.actName = this.activityFormValue.value.activityName
    this.activity.actDescription = this.activityFormValue.value.activityDescription
    this.activity.category = this.categoryObject

    const activityFormData =  this.prepareFormData( this.activity )

    this.activityService.addActivityWithOneImage(activityFormData).subscribe({
      next:()=> {
        this.dialogRef.close()
        this.utilsService.openDialog("Opération réussite", "Activity ajoutée avec succès", true)

      },
      error: (err)=> this.utilsService.openDialog("Opération échouée", err.message, false)
    })
  }

  prepareFormData(activity: Activity): FormData
  {
    const formData = new FormData()

    formData.append(
      "activity", new Blob( [ JSON.stringify(activity) ], { type: "application/json" } )
    )
    console.log("imageFile: "  + activity.actImages.length)
    for ( let i = 0 ; i < activity.actImages.length ; i++ )
    {
      formData.append(
        "imageFile",
        activity.actImages[i].file,
        activity.actImages[i].file.name
      )
    }
    return formData
  }

  onFileSelected(event: any)
  {
    console.log(event.target.files)

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
        this.activity.actImages.push(fileHandle)
      }
    }
  } 
  
}
  

