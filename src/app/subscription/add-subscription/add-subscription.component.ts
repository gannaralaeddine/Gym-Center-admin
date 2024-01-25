import { NgIf, NgFor } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivityService } from '../../services/activity.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { Subscription } from '../subscription';
import { SubscriptionService } from '../../services/subscription.service';
import { UtilsService } from '../../serviceutils/utils.service';

@Component({
  selector: 'app-add-subscription',
  standalone: true,
  imports: [ReactiveFormsModule,NgIf,NgFor],
  templateUrl: './add-subscription.component.html',
  styleUrl: './add-subscription.component.css'
})
export class AddSubscriptionComponent 
{
  subscriptionFormValue !: FormGroup
  isAddOperation = true
  activities: any
  subscriptionObject = new Subscription()

  constructor(private activityService: ActivityService,
    private subscriptionService: SubscriptionService,
    private utilsService: UtilsService,
    private subscriptionFormBuilder: FormBuilder,
    private dialogRef: MatDialogRef<AddSubscriptionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private sanitizer: DomSanitizer)
  {
    if (this.data.subscriptionId)
    {
      this.isAddOperation = false;
      this.getSubscrption(this.data.subscriptionId)
    }

    this.subscriptionFormValue = this.subscriptionFormBuilder.group({
      subscriptionPrice : ['',Validators.required],
      subscriptionStartDate : ['',Validators.required],
      subscriptionEndDate : ['',Validators.required],
      subscriptionActivity:['',Validators.required]
    })

    this.getAllActivities()
  }
 
  checkValidityForm() 
  {
    if (this.subscriptionFormValue.controls['subscriptionPrice'].invalid && this.subscriptionFormValue.controls['subscriptionPrice'].touched)
    {
      document.getElementById('subscriptionNameInput')!.className = "form-control border border-danger pl-2 round"
    }
    else
    {
      document.getElementById('subscriptionNameInput')!.className = "form-control border border-dark pl-2 round"
    }

    if (this.subscriptionFormValue.controls['subscriptionStartDate'].invalid && this.subscriptionFormValue.controls['subscriptionStartDate'].touched)
    {
      document.getElementById('subscriptionStartDateInput')!.className = "form-control border border-danger pl-2 round"
    }
    else
    {
      document.getElementById('subscriptionStartDateInput')!.className = "form-control border border-dark pl-2 round"
    }

    if (this.subscriptionFormValue.controls['subscriptionEndDate'].invalid && this.subscriptionFormValue.controls['subscriptionEndDate'].touched)
    {
      document.getElementById('subscriptionEndDateInput')!.className = "form-control border border-danger pl-2 round"
    }
    else
    {
      document.getElementById('subscriptionEndDateInput')!.className = "form-control border border-dark pl-2 round"
    }

    if (this.subscriptionFormValue.controls['subscriptionActivity'].invalid && this.subscriptionFormValue.controls['subscriptionActivity'].touched)
    {
      document.getElementById('activitySelectList')!.className = "form-control border border-danger pl-2 round"
    }
    else
    {
      document.getElementById('activitySelectList')!.className = "form-control border border-dark pl-2 round"
    }

    if (this.data.subscriptionId)
    {
      if (this.subscriptionFormValue.controls['subscriptionPrice'].invalid || this.subscriptionFormValue.controls['subscriptionStartDate'].invalid || this.subscriptionFormValue.controls['subscriptionEndDate'].invalid || this.subscriptionFormValue.controls['subscriptionActivity'].invalid)
      {
        document.getElementById("addButton")?.setAttribute("disabled","")
      }
      else
      {
        document.getElementById("addButton")?.removeAttribute("disabled")
      }
    }
    else
    { 
      if (this.subscriptionFormValue.controls['subscriptionPrice'].valid && this.subscriptionFormValue.controls['subscriptionStartDate'].valid && this.subscriptionFormValue.controls['subscriptionEndDate'].valid && this.subscriptionFormValue.controls['subscriptionActivity'].valid)
      {
        document.getElementById("addButton")?.removeAttribute("disabled")
      }
      else
      {
        document.getElementById("addButton")?.setAttribute("disabled","")
      } 
    }
  }

  closeDialog() 
  {
    this.dialogRef.close()
  }
  getActivity() 
  {
    this.activityService.getActivity(this.subscriptionFormValue.value.subscriptionActivity).subscribe({
      next: (activity) => this.subscriptionObject.subscriptionActivity = activity,
      error: (err) => console.log(err)
    })
  }

  getAllActivities() 
  {
    this.activityService.getAllActivities().subscribe({
      next: (activities) => this.activities = activities,
      error: (err) => console.error(err)
    })
  }

  addSubscription() 
  {
    this.subscriptionObject.subscriptionPrice = this.subscriptionFormValue.value.subscriptionPrice
    this.subscriptionObject.subscriptionStartDate = this.subscriptionFormValue.value.subscriptionStartDate.toISOString().split('T')[0]
    this.subscriptionObject.subscriptionEndDate = this.subscriptionFormValue.value.subscriptionEndDate.toISOString().split('T')[0]

    this.subscriptionService.addSubscription(this.subscriptionObject).subscribe({
      next:(val)=> {
        console.log("Opération réussite: " + val)
        this.dialogRef.close()
        this.utilsService.successDialog("Opération réussite", "Abonnement ajouté avec succès", true)

      },
      error: (err)=> this.utilsService.successDialog("Opération échouée", err.message, false)
    })
  }

  updateSubscription(arg0: any) 
  {
    
  }

  getSubscrption(subscriptionId: any) 
  {
    
  }
}
