import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AddCategoryComponent } from '../../category/add-category/add-category.component';
import { UtilsService } from '../../serviceutils/utils.service';
import { ActivityService } from '../../services/activity.service';
import { Activity } from '../activity';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-add-activity',
  standalone: true,
  imports: [ReactiveFormsModule,NgIf],
  templateUrl: './add-activity.component.html',
  styleUrl: './add-activity.component.css'
})
export class AddActivityComponent 
{
  activityFormValue !: FormGroup
  isAddOperation = true
  activityId: number

  constructor(
    private activityFormBuilder: FormBuilder,
    private activityService: ActivityService,
    private utilsService: UtilsService,
    private dialogRef: MatDialogRef<AddCategoryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { this.activityId = data.activityId }

  ngOnInit()
  {
    if ( this.activityId != 0 )
    {
      this.isAddOperation = false;
      this.getActivityById(this.activityId)
    }

    this.activityFormValue = this.activityFormBuilder.group({
      activityName : '',
      activityDescription : '',
      activityImage : ''
    })
  }

  addActivity()
  {
    this.activityService.addActivity(new Activity(
      this.activityFormValue.value.activityName,
      this.activityFormValue.value.activityDescription,
      this.activityFormValue.value.activityImage)).subscribe({
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
      this.activityFormValue.value.activityImage)).subscribe({
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
}
