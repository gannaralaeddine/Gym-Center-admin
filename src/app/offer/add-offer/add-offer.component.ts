import { NgIf, NgFor } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivityService } from '../../services/activity.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { UtilsService } from '../../serviceutils/utils.service';
import { OfferService } from '../../services/offer.service.';
import { Offer } from '../offer';
import { Activity } from '../../activity/activity';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { OptionService } from '../../services/option.service';

@Component({
  selector: 'app-add-offer',
  standalone: true,
  imports: [ReactiveFormsModule,NgIf,NgFor,MatFormFieldModule, MatSelectModule, FormsModule],
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
  selectedOptions = new FormControl('');
  allOptionsList: any

  constructor(
    private offerFormBuilder: FormBuilder,
    private activityService: ActivityService,
    private offerService: OfferService,
    private optionService: OptionService,
    private utilsService: UtilsService,
    private dialogRef: MatDialogRef<AddOfferComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {this.offerId = this.data.offerId}

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
    this.getAllOptions()
  }

  getOffer(offerId: any)
  {
    if (isNaN(offerId) || offerId <= 0) {
      console.error('Invalid sessionId provided');
      return; // Or handle the error appropriately
    }
    this.offerService.getOffer(offerId).subscribe({
      next: (offerObject) => {

        this.offerFormValue.controls['offerTitle'].setValue(offerObject.offerTitle)
        this.offerFormValue.controls['offerPeriod'].setValue(offerObject.offerPeriod)
        this.offerFormValue.controls['offerPrice'].setValue(offerObject.offerPrice)
        this.populateActivitiesList(offerObject)

        this.offer = offerObject as Offer
      },
      error: (err) => console.error(err)
    })
  }

  getActivity(id?: any)
  {
    if (!id)
    {
      if (isNaN(this.offerFormValue.value.offerActivity) || this.offerFormValue.value.offerActivity <= 0) {
        console.log("error id isNAN !!!")
        return
      }
      this.activityService.getActivity(this.offerFormValue.value.offerActivity).subscribe({
        next: (activityObject) => this.offer.offerActivity = activityObject as Activity,
        error: (err) => console.error(err)
      })
    }
    else
    {
      if (isNaN(id) || id <= 0) {
        console.log("error id isNAN !!!")
        return
      }
      this.activityService.getActivity(id).subscribe({
        next: (activityObject) => this.offer.offerActivity = activityObject as Activity,
        error: (err) => console.error(err)
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

  getAllOptions()
  {
    this.optionService.getAllOptions().subscribe({
      next: (options) =>{ this.allOptionsList = options
      },
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
    console.log(this.offer)
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

  showOptions()
  {
    this.offer.offerOption = []
    if (this.selectedOptions.value)
    {
      for (let i = 0; i < this.selectedOptions.value?.length; i++)
      {
          this.optionService.getOption(this.selectedOptions.value[i]).subscribe({
            next: (optionObject) => this.offer.offerOption.push(optionObject),
            error: (err) => console.error(err)
          })
      }
    }
  }
}
