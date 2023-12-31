import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AddCategoryComponent } from '../../category/add-category/add-category.component';
import { UtilsService } from '../../serviceutils/utils.service';
import { ActivityService } from '../../services/activity.service';
import { Activity } from '../activity';
import { NgFor, NgIf } from '@angular/common';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../category/category';

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
  category!: Category

  constructor(
    private activityFormBuilder: FormBuilder,
    private activityService: ActivityService,
    private categoryService: CategoryService,
    private utilsService: UtilsService,
    private dialogRef: MatDialogRef<AddCategoryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { this.activityId = data.activityId }

  ngOnInit()
  {
    if ( this.activityId )
    {
      this.isAddOperation = false;
      this.getActivityById(this.activityId)
    }

    this.activityFormValue = this.activityFormBuilder.group({
      activityName : '',
      activityDescription : '',
      activityImage : ''
    })

    this.getAllCategories()
  }

  addActivity()
  {
    this.activityService.addActivity(new Activity(
      this.activityFormValue.value.activityName,
      this.activityFormValue.value.activityDescription,
      this.activityFormValue.value.activityImage,
      this.category)).subscribe({
      next:()=> {
        this.dialogRef.close()
        this.utilsService.openDialog("Opération réussite", "Activité ajoutée avec succès", true)
    },
      error: (err)=> this.utilsService.openDialog("Opération échouée", err.message, false)
    })
  }

  updateActivity(id:any)
  {
    this.activityService.updateActivity(id,new Activity(
      this.activityFormValue.value.activityName,
      this.activityFormValue.value.activityDescription,
      this.activityFormValue.value.activityImage,
      this.category)).subscribe({
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
    this.activityFormValue.controls['activityImage'].setValue(activity.actImage)
  }

  getAllCategories()
  {
    this.categoryService.getAllCategories().subscribe({
      next: (category) => this.categories = category,
      error: (err) => console.error(err)
    })
  }

  getCategory(id:any)
  {
    this.categoryService.getCategory(id).subscribe({
      next: (categoryObject) => this.category = categoryObject as Category,
      error: (err) => console.log(err)
    })
  }
}
