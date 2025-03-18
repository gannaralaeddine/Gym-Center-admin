import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SubscriptionService } from '../../services/subscription.service';
import { Subscription } from '../../subscription/subscription';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UtilsService } from '../../serviceutils/utils.service';

@Component({
  selector: 'app-renew-subscription',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './renew-subscription.component.html',
  styleUrl: './renew-subscription.component.css'
})
export class RenewSubscriptionComponent implements OnInit
{
  subscription = new Subscription()
  renewSubscriptionFormValue!: FormGroup
  
  constructor(
    private dialogRef: MatDialogRef<RenewSubscriptionComponent>,
    private subscriptionService: SubscriptionService,
    private utilsService: UtilsService,
    private renewSubscriptionFormBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any){}
  ngOnInit()
  {
    this.subscriptionService.getSubscription(this.data.subscriptionId).subscribe({
      next: (subscription) => this.subscription = subscription,
      error: (err) => console.error(err)
    })

    this.renewSubscriptionFormValue = this.renewSubscriptionFormBuilder.group({
      renewSubscriptionPeriod : ['',Validators.required]
    })
  }
  closeDialog() 
  {
    this.dialogRef.close()
  }
  renewSubscription() 
  {
    this.subscription.subscriptionEndDate = new Date(
      new Date(
        new Date(this.subscription.subscriptionEndDate).setMonth(
          new Date(this.subscription.subscriptionEndDate).getMonth()
          + Number(this.renewSubscriptionFormValue.controls['renewSubscriptionPeriod'].value)
        )
      ).setDate(new Date(this.subscription.subscriptionEndDate).getDate())
    ).toISOString().split('Z')[0]

    this.subscriptionService.updateSubscription(this.subscription.subscriptionId, this.subscription, (this.subscription as any).member.userId).subscribe({
      next: () => {
        this.closeDialog()
        this.utilsService.successDialog("Opération réussite", "Abonnement renouvelé avec succès", true)
      },
      error: (err) => this.utilsService.successDialog("Opération échouée", err.message, false)
    })
  }
  checkValidityForm() 
  {
    
  }

}
