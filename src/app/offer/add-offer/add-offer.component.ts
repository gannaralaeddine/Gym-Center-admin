import { NgIf, NgFor } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
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
  selectedOptions = new FormControl('')
  allOptionsList!: any
  selectedCategoryOption: any
  selectedActivityOption: any

  constructor(
    private activityService: ActivityService,
    private categoryService: CategoryService,
    private offerService: OfferService,
    private optionService: OptionService,
    private utilsService: UtilsService,
    private dialogRef: MatDialogRef<AddOfferComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {

    this.offerFormValue = new FormGroup({
      offerTitle: new FormControl('', Validators.required),
      offerPeriod: new FormControl('', Validators.required),
      offerPrice: new FormControl('', Validators.required),
      offerCategory: new FormControl('', Validators.required),
      offerActivity: new FormControl('', Validators.required)
    })

    this.offerId = this.data.offerId
  }

  async ngOnInit()
  {
    if (this.offerId)
    {
      this.isAddOperation = false;
      await this.getOffer(this.offerId)
    }
    else
    {
      this.selectedCategoryOption = new FormControl('')
      this.selectedActivityOption = new FormControl('')
    }

    this.getAllCategories()
    this.getAllOptions()
  }

  async getOffer(offerId: any)
  {
    this.offerService.getOffer(offerId).subscribe({
      next: (offerObject) => {
        this.offerFormValue.patchValue({
          offerTitle: offerObject.offerTitle,
          offerPeriod: offerObject.offerPeriod,
          offerPrice: offerObject.offerPrice,
          offerCategory: offerObject.offerActivity.category.catId,
          offerActivity: offerObject.offerActivity.actId
        })
        this.offer = offerObject as Offer

        this.selectedCategoryOption = new FormControl(this.offer.offerActivity.category.catId)
        this.getActivitiesByCategory(this.offer.offerActivity.category.catId)
      },
      complete:() => this.selectedActivityOption = new FormControl(this.offer.offerActivity.actId),
      error: (err) => console.error(err)
    })
  }

  async getCategoryActivities()
  {
    this.selectedActivityOption = new FormControl('')
    await this.getActivitiesByCategory(this.selectedCategoryOption.value)
  }

  async getActivity(id?: any): Promise<Activity>
  {
    return await lastValueFrom(this.activityService.getActivity(id));
  }

  getAllCategories()
  {
    this.categoryService.getAllCategories().subscribe({
      next: (categories) => this.categories = categories,
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

    // offerTitle
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
      if (this.offerFormValue.controls['offerTitle'].valid && this.offerFormValue.controls['offerPeriod'].valid && this.offerFormValue.controls['offerPrice'].valid && this.offerFormValue.controls['offerCategory'].valid && this.offerFormValue.controls['offerActivity'].valid )
      {
        document.getElementById("addButton")?.removeAttribute("disabled")
      }
      else
      {
        document.getElementById("addButton")?.setAttribute("disabled","")
      }
    }

    /* selectedActivityOption */
    if (this.selectedActivityOption.value != '')
    {
      document.getElementById("addButton")?.removeAttribute("disabled")
      document.getElementById("updateButton")?.removeAttribute("disabled")
    }
    else
    {
      document.getElementById("addButton")?.setAttribute("disabled","")
      document.getElementById("updateButton")?.setAttribute("disabled","")
    }
  }

  async updateOffer()
  {
    this.offer.offerTitle = this.offerFormValue.controls['offerTitle'].value
    this.offer.offerPrice = this.offerFormValue.controls['offerPrice'].value
    this.offer.offerPeriod = this.offerFormValue.controls['offerPeriod'].value
    this.offer.offerActivity = await this.getActivity(this.offerFormValue.get("offerActivity")?.value)

    this.offerService.updateOffer(this.offerId, this.offer).subscribe({
      next:() => {
        this.closeDialog()
        this.utilsService.successDialog("Opération réussite", "Offre mise à jour avec succès", true)
      },
      error: (err)=> this.utilsService.successDialog("Opération échouée", err.message, false)
    })
  }

  async addOffer()
  {
    this.offer.offerTitle = this.offerFormValue.controls['offerTitle'].value
    this.offer.offerPrice = this.offerFormValue.controls['offerPrice'].value
    this.offer.offerPeriod = this.offerFormValue.controls['offerPeriod'].value
    this.offer.offerActivity = await this.getActivity(this.offerFormValue.get("offerActivity")!.value)

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

  getActivitiesByCategory(categoryId: any)
  {
    this.activityService.getAllCategoryActivities(categoryId).subscribe({
      next: (activities) => {
        this.activities = activities
      },
      error: (err) => console.error(err)
    })
  }

}
