import { NgIf, NgFor } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivityService } from '../../services/activity.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UtilsService } from '../../serviceutils/utils.service';
import { OfferService } from '../../services/offer.service.';
import { Offer } from '../offer';
import { Activity } from '../../activity/activity';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { OptionService } from '../../services/option.service';
import { CategoryService } from '../../services/category.service';
import {lastValueFrom} from "rxjs";

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
  activities!: any
  categories!: any
  offerId!: any
  offer = new Offer()
  isAddOperation = true
  // minDate = new Date(new Date().getTime() + new Date(1209600000).getTime()).toISOString().split('T')[0]
  selectedOptions = new FormControl('');
  allOptionsList!: any
  isCategorySelected = false
  selectedActivityOption =  new FormControl(-1)
  selectedCategoryOption: any

  constructor(
    private offerFormBuilder: FormBuilder,
    private activityService: ActivityService,
    private categoryService: CategoryService,
    private offerService: OfferService,
    private optionService: OptionService,
    private utilsService: UtilsService,
    private dialogRef: MatDialogRef<AddOfferComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {this.offerId = this.data.offerId}

  async ngOnInit()
  {
    if (this.offerId)
    {
      this.isAddOperation = false;
      await this.getOffer(this.offerId)
    }

    this.offerFormValue = this.offerFormBuilder.group({
      offerTitle : ['',Validators.required],
      offerPeriod : ['',Validators.required],
      offerPrice : ['',Validators.required],
      offerCategory: ['',Validators.required],
      offerActivity: ['',Validators.required]
    })

    this.getAllCategories()
    this.getAllOptions()
  }

  async getOffer(offerId: any)
  {
    this.offerService.getOffer(offerId).subscribe({
      next: (offerObject) => {
        this.offerFormValue.controls['offerTitle'].setValue(offerObject.offerTitle)
        this.offerFormValue.controls['offerPeriod'].setValue(offerObject.offerPeriod)
        this.offerFormValue.controls['offerPrice'].setValue(offerObject.offerPrice)
        this.offer = offerObject as Offer
        this.selectedCategoryOption = new FormControl(this.offer.offerActivity.category.catId)
        this.getActivitiesByCategory(this.offer)
      },
      error: (err) => console.error(err)
    })
  }

  getCategory(id?: any)
  {
    if (!id)
    {
      this.categoryService.getActivitiesOfCategory(this.offerFormValue.value.offerCategory).subscribe({
        next: (activitiesList) => this.activities = activitiesList,
        error: (err) => console.error(err)
      })
      document.getElementById("activitySelectList")?.addEventListener("change", async () => {
        this.offer.offerActivity = await this.getActivity(this.selectedActivityOption.value)
      })
      
    }
    else
    {
      // this.activityService.getActivity(id).subscribe({
      //   next: (activityObject) => {
      //     this.offer.offerActivity = activityObject as Activity
      //   },
      //   error: (err) => console.error(err)
      // })
    
      this.categoryService.getActivitiesOfCategory(id).subscribe({
        next: (activitiesList) => this.activities = activitiesList as Activity[],
        error: (err) => console.error(err)
      })
    }
  }

  async getActivity(id?: any): Promise<Activity>
  {
    return await lastValueFrom(this.activityService.getActivity(id));
  }

  getAllCategories()
  {
    this.categoryService.getAllCategories().subscribe({
      next: (categories) => {
        this.categories = categories
      },
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

    if (this.offerFormValue.controls['offerCategory'].invalid && this.offerFormValue.controls['offerCategory'].touched)
    {
      document.getElementById('categorySelectList')!.className = "form-control border border-danger pl-2 round"
    }
    else
    {
      document.getElementById('categorySelectList')!.className = "form-control border border-dark pl-2 round"
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
      if (this.selectedActivityOption.value != -1)
      {
        console.log("selectedActivityOption enabled")
        console.log(this.selectedActivityOption.value)
        document.getElementById("addButton")?.removeAttribute("disabled")
      }
      else
      {
        console.log("selectedActivityOption disabled")
        console.log(this.selectedActivityOption.value)
        document.getElementById("addButton")?.setAttribute("disabled","")
      }
    }
    else
    {
      if (this.offerFormValue.controls['offerTitle'].valid && this.offerFormValue.controls['offerPeriod'].valid && this.offerFormValue.controls['offerPrice'].valid && this.offerFormValue.controls['offerCategory'].valid) //&& this.offerFormValue.controls['offerActivity'].valid 
      {
        document.getElementById("addButton")?.removeAttribute("disabled")
      }
      else
      {
        document.getElementById("addButton")?.setAttribute("disabled","")
      }
    }

  }

  async updateOffer()
  {
    this.offer.offerTitle = this.offerFormValue.controls['offerTitle'].value
    this.offer.offerPrice = this.offerFormValue.controls['offerPrice'].value
    this.offer.offerPeriod = this.offerFormValue.controls['offerPeriod'].value
    this.offer.offerActivity = await this.getActivity(this.selectedActivityOption.value)

    this.offerService.updateOffer(this.offerId, this.offer).subscribe({
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

  getActivitiesByCategory(offer: any)
  {
    this.activityService.getAllCategoryActivities(offer.offerActivity.category.catId).subscribe({
      next: (activities) => {
        this.activities = activities
        this.selectedActivityOption = new FormControl(offer.offerActivity.actId)
      },
      error: (err) => console.error(err)
    })
  }

}
