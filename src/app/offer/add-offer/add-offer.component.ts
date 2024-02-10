import { NgIf, NgFor } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivityService } from '../../services/activity.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { UtilsService } from '../../serviceutils/utils.service';
import { OfferService } from '../../services/offer.service.';
import { Offer } from '../offer';
import { Activity } from '../../activity/activity';

@Component({
  selector: 'app-add-offer',
  standalone: true,
  imports: [ReactiveFormsModule,NgIf,NgFor],
  templateUrl: './add-offer.component.html',
  styleUrl: './add-offer.component.css'
})
export class AddOfferComponent implements OnInit
{
  offerFormValue!: FormGroup
  offers: any
  activities: any
  offerId!: any
  offer = new Offer()
  activityId: any
  isAddOperation = true
  minDate = new Date(new Date().getTime() + new Date(1209600000).getTime()).toISOString().split('T')[0]

  constructor(
    private offerFormBuilder: FormBuilder,
    private activityService: ActivityService,
    private offerService: OfferService,
    private utilsService: UtilsService,
    private dialogRef: MatDialogRef<AddOfferComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private sanitizer: DomSanitizer) {this.offerId = this.data.offerId}

  ngOnInit()
  {
     if (this.offerId)
    {
      this.isAddOperation = false;
      this.getOffer(this.offerId)
      this.getAllActivities()
    }

    this.offerFormValue = this.offerFormBuilder.group({
      offerTitle : ['',Validators.required],
      offerPeriod : ['',Validators.required],
      offerPrice : ['',Validators.required],
      offerActivity: ['',Validators.required]
    })

    this.getAllActivities()
  }

  getOffer(offerId: any) 
  {
    this.offerService.getOffer(offerId).subscribe({
      next: (offer) => {

        this.offerFormValue.controls['offerTitle'].setValue(offer.offerTitle)
        this.offerFormValue.controls['offerPeriod'].setValue(offer.offerPeriod)
        this.offerFormValue.controls['offerPrice'].setValue(offer.offerPrice)
        this.populateActivitiesList(offer)
  
        this.offer = offer as Offer
      },
      error: (err) => console.error(err)
    })
  }

  getActivity(id?: any)
  {
    if (!id)
    {
      this.activityService.getActivity(this.offerFormValue.value.offerActivity).subscribe({
        next: (activityObject) => this.offer.offerActivity = activityObject as Activity,
        error: (err) => console.log(err)
      })
    }
    else
    {
      this.activityService.getActivity(id).subscribe({
        next: (activityObject) => this.offer.offerActivity = activityObject as Activity,
        error: (err) => console.log(err)
      })
    }
  }

  getAllActivities() 
  {
    this.activityService.getAllActivities().subscribe({
      next: (activitiesList) => this.activities = activitiesList,
      error: (err) => console.error(err)
    })
  }

  checkValidityForm() 
  {
    if (this.offerFormValue.controls['offerTitle'].invalid && this.offerFormValue.controls['offerTitle'].touched)
    {
      document.getElementById('offerTitleInput')!.className = "form-control border border-danger pl-2 round"
    }
    else
    {
      document.getElementById('offerTitleInput')!.className = "form-control border border-dark pl-2 round"
    }

    if (this.offerFormValue.controls['offerPeriod'].invalid && this.offerFormValue.controls['offerPeriod'].touched)
    {
      document.getElementById('periodSelectList')!.className = "form-control border border-danger pl-2 round"
    }
    else
    {
      document.getElementById('periodSelectList')!.className = "form-control border border-dark pl-2 round"
    }

    if (this.offerFormValue.controls['offerPrice'].invalid && this.offerFormValue.controls['offerPrice'].touched)
    {
      document.getElementById('offerPriceInput')!.className = "form-control border border-danger pl-2 round"
    }
    else
    {
      document.getElementById('offerPriceInput')!.className = "form-control border border-dark pl-2 round"
    }

    if (this.offerFormValue.controls['offerActivity'].invalid && this.offerFormValue.controls['offerActivity'].touched)
    {
      document.getElementById('activitySelectList')!.className = "form-control border border-danger pl-2 round"
    }
    else
    {
      document.getElementById('activitySelectList')!.className = "form-control border border-dark pl-2 round"
    }

    if (this.offerId)
    {
      if (this.offerFormValue.controls['offerTitle'].invalid || this.offerFormValue.controls['offerPrice'].invalid)
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
      if (this.offerFormValue.controls['offerTitle'].valid && this.offerFormValue.controls['offerPeriod'].valid && this.offerFormValue.controls['offerPrice'].valid && this.offerFormValue.controls['offerActivity'].valid)
      {
        document.getElementById("addButton")?.removeAttribute("disabled")
      }
      else
      {
        document.getElementById("addButton")?.setAttribute("disabled","")
      }
    }
  }

  updateOffer() 
  {
    this.offer.offerTitle = this.offerFormValue.controls['offerTitle'].value
    this.offer.offerPrice = this.offerFormValue.controls['offerPrice'].value
    this.offer.offerPeriod = this.offerFormValue.controls['offerPeriod'].value

    this.offerService.updateOffer(this.offerId,this.offer).subscribe({
      next:() => {
        this.closeDialog()
        this.utilsService.successDialog("Opération réussite", "Offre mise à jour avec succès", true)
      },
      error: (err)=> this.utilsService.successDialog("Opération échouée", err.message, false) 
    })
  }

  addOffer() 
  {
    this.offer.offerTitle = this.offerFormValue.controls['offerTitle'].value
    this.offer.offerPrice = this.offerFormValue.controls['offerPrice'].value
    this.offer.offerPeriod = this.offerFormValue.controls['offerPeriod'].value
    
    this.offerService.addOffer(this.offer).subscribe({
      next:() => {
        this.closeDialog()
        this.utilsService.successDialog("Opération réussite", "Offre ajouté avec succès", true)
      },
      error: (err)=> this.utilsService.successDialog("Opération échouée", err.message, false) 
    })
  }

  closeDialog() 
  {
    this.dialogRef.close()
  }

  populateActivitiesList(offer: any)
  {
    let optionTag!: HTMLOptionElement
    let selectTag!: HTMLSelectElement

    let formGroupActivitySelectList = document.getElementById("activitySelectList")?.parentElement
    document.getElementById("activitySelectList")?.remove()

    selectTag = document.createElement("select") 
    selectTag.setAttribute("formcontrolname","offerActivity")
    selectTag.setAttribute("class","form-control border border-dark pl-2 round")
    selectTag.setAttribute("id","activitySelectList")
    selectTag.addEventListener('change',()=>{
      this.getActivity(selectTag[selectTag.selectedIndex].getAttribute("value"))
    })
    formGroupActivitySelectList?.appendChild(selectTag)

    let activitySelectList = document.getElementById("activitySelectList")
    optionTag = document.createElement("option")
    optionTag.setAttribute("value",offer.offerActivity.actId.toString())
    optionTag.textContent = offer.offerActivity.actName
    activitySelectList?.appendChild(optionTag)

    this.activityService.getAllActivities().subscribe({
      next: (activities) => {
        for (let i = 0; i < activities.length; i++)
        {
          if (activities[i].actId != offer.offerActivity.actId)
          {
            optionTag = document.createElement("option")
            optionTag.setAttribute("value",this.activities[i].actId.toString())
            optionTag.textContent = this.activities[i].actName
            activitySelectList?.appendChild(optionTag)
          }
        }
      },
      error: (err) => console.error(err)
    })

   
  }
}
