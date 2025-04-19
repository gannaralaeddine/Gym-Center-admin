import { NgIf, NgFor, AsyncPipe, DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivityService } from '../../services/activity.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from '../subscription';
import { SubscriptionService } from '../../services/subscription.service';
import { UtilsService } from '../../serviceutils/utils.service';
import { Activity } from '../../activity/activity';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { map, Observable, startWith } from 'rxjs';
import { UserService } from '../../services/user.service';
import {User} from "../../user/user";
import { CategoryService } from '../../services/category.service';
import { Offer } from '../../offer/offer';
import { OfferService } from '../../services/offer.service.';


@Component({
  selector: 'app-add-subscription',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf,
    NgFor,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    AsyncPipe,
    DatePipe
  ],
  templateUrl: './add-subscription.component.html',
  styleUrl: './add-subscription.component.css'
})
export class AddSubscriptionComponent implements OnInit
{
  subscriptionFormValue !: FormGroup
  isAddOperation = true
  activities: any
  categories: any
  activitySubscriptions!: Subscription[]
  subscriptionObject = new Subscription()
  subscriptionActivity!: Activity
  myControl = new FormControl('')
  options: string[] = []
  filteredOptions!: Observable<string[]>
  userId!: string
  selectedUser!: User
  privateSessionsNumber!: number
  membersList: any
  IsEndDateGreater = true
  isNotEmpty!: boolean
  isCategorySelected = false
  offers: Offer[] = []
  subscriptionPeriod!: number

  constructor(private activityService: ActivityService,
    private subscriptionService: SubscriptionService,
    private categoryService: CategoryService,
    private userService: UserService,
    private utilsService: UtilsService,
    private subscriptionFormBuilder: FormBuilder,
    private dialogRef: MatDialogRef<AddSubscriptionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any)
  {
    if (this.data.subscriptionId)
    {
      this.isAddOperation = false;
      this.getSubscription(this.data.subscriptionId)
    }

    this.getAllCategories()
  }

 
  ngOnInit()

  { this.subscriptionFormValue = this.subscriptionFormBuilder.group({
    subscriptionActivity:['',Validators.required],
    subscriptionOffer:['',Validators.required],
    subscriptionCategory:['',Validators.required],
    privateSessionsNumber:['',Validators.required]
  })


    this.userService.retrieveAllMembers().subscribe({
      next: (members:any) => this.membersList = members,
      error: (err) => console.error(err)
    })

  }

  private _filter(value: string): string[]
  {
    const filterValue = value.toLowerCase()
    return this.options.filter(option => option.toLowerCase().includes(filterValue))
  }

  checkValidityForm()
  {
    if ((this.subscriptionFormValue.controls['privateSessionsNumber'].value.length === 0 && this.subscriptionFormValue.controls['privateSessionsNumber'].invalid && this.subscriptionFormValue.controls['privateSessionsNumber'].touched) ||
    (this.subscriptionFormValue.controls['privateSessionsNumber'].value.length === 1 && this.subscriptionFormValue.controls['privateSessionsNumber'].value === '0' && this.subscriptionFormValue.controls['privateSessionsNumber'].touched) ||
    (this.subscriptionFormValue.controls['privateSessionsNumber'].value.length > 1 && this.subscriptionFormValue.controls['privateSessionsNumber'].getRawValue()[0] === '0' && this.subscriptionFormValue.controls['privateSessionsNumber'].touched))
    {
      document.getElementById('privateSessionsNumber')!.className = "form-control border border-danger pl-2 round"
    }
    else
    {
      document.getElementById('privateSessionsNumber')!.className = "form-control border border-dark pl-2 round"
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

      if (this.subscriptionFormValue.controls['privateSessionsNumber'].invalid || !this.userId)
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
      if (
        
        this.subscriptionFormValue.controls['subscriptionActivity'].valid && this.subscriptionFormValue.controls['privateSessionsNumber'].valid && this.subscriptionFormValue.controls['subscriptionCategory'].valid
      )
      {
        if (this.IsEndDateGreater)
        {
          document.getElementById("addButton")?.removeAttribute("disabled")
        }
        else
        {
          document.getElementById("addButton")?.setAttribute("disabled","")
        }
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

  getActivity(id?: any)
  {
    // update operation
    if (id)
    {
      this.activityService.getActivity(this.subscriptionFormValue.value.subscriptionActivity).subscribe({
        next: (activity: Activity) => {

          this.subscriptionObject.subscriptionActivity = activity

          this.activityService.getActivityOffers(activity.actId).subscribe({
            next: (offers) => this.offers = offers,
            error: (err) => console.error(err)
          })
        },
        error: (err) => console.error(err)
      })
    }
    else
    {
      //add operation
      this.activityService.getActivity(this.subscriptionFormValue.value.subscriptionActivity).subscribe({
        next: (activity) => {
          this.subscriptionObject.subscriptionActivity = activity as Activity

          this.activityService.getActivityOffers(activity.actId).subscribe({
            next: (offers) => this.offers = offers,
            error: (err) => console.error(err)
          })

          this.subscriptionService.retrieveActivitySubscriptions(this.subscriptionFormValue.value.subscriptionActivity).subscribe({
            next: (activitySubscriptions) => {
              this.activitySubscriptions = activitySubscriptions
              this.filterUnsubscribedMembersInActivity(this.membersList).forEach((user: User) => {
                this.options.push(user.userId + "-" +user.userFirstName + "-" + user.userLastName)
              })
              this.filteredOptions = this.myControl.valueChanges.pipe(startWith(''),map(value => this._filter(value || '')))
            },
            error: (err) => console.error(err)
          })
        },
        error: (err) => console.log(err)
      })
    }
  }

  getAllCategories() 
  {
    this.categoryService.getAllCategories().subscribe({
      next: (categories) => this.categories = categories,
      error: (err) => console.error(err)
    })
  }

  addSubscription()
  {
    this.getActivity(this.subscriptionFormValue.value.subscriptionActivity)
    this.subscriptionService.addSubscription(this.subscriptionObject, this.userId).subscribe({
      next:() => {
        this.userService.updatePrivateSessionsNumber(this.selectedUser.userEmail,this.subscriptionFormValue.value.privateSessionsNumber).subscribe({
          error: (err) => this.utilsService.successDialog("Opération échouée", err.message, false),
          complete: () => {
            this.dialogRef.close()
            this.utilsService.successDialog("Opération réussite", "Abonnement ajouté avec succès", true)
          }
        })
      },
      error: (err)=> this.utilsService.successDialog("Opération échouée", err.message, false)
    })
  }

  updateSubscription()
  {
    let offer = new Offer()
    

    this.getMemberById(this.myControl.value!)
    this.subscriptionObject.subscriptionMember = this.selectedUser
    this.getActivity(this.subscriptionFormValue.get("subscriptionActivity")!.value)
    offer = this.getOffer(this.subscriptionFormValue.get("subscriptionOffer")?.value)!
    //this.subscriptionObject.subscriptionOffer = this.getOffer(this.subscriptionFormValue.get("subscriptionOffer")?.value)!


    this.subscriptionService.updateSubscription(this.data.subscriptionId, this.subscriptionObject, this.userId).subscribe({
      next: () => {
        this.userService.replaceOldPrivateSessionsNumber(this.userId, this.subscriptionFormValue.controls['privateSessionsNumber'].value).subscribe({
          error: (err) => console.error(err)
        })
      },
      error: (err) => this.utilsService.successDialog("Opération échouée", err.message, false),
      complete: () => {
        this.dialogRef.close()
        this.utilsService.successDialog("Opération réussite", "Abonnement édité avec succès", true)
      }
    })
  }

  getSubscription(subscriptionId: any)
  {
  
    this.subscriptionService.getSubscription(subscriptionId).subscribe({
      next: (subscription) => {

        this.categoryService.getActivitiesOfCategory(subscription.subscriptionActivity.category.catId).subscribe({
          next: (categoriesList) => this.activities = categoriesList,
          error: (err) => console.error(err)
        })

        this.activityService.getActivityOffers(subscription.subscriptionActivity.actId).subscribe({
            next: (offers) => this.offers = offers,
            error: (err) => console.error(err)
        })

        this.subscriptionFormValue.patchValue({
          subscriptionCategory: subscription.subscriptionActivity.category.catId,
          subscriptionActivity: subscription.subscriptionActivity.actId,
          subscriptionOffer: subscription.subscriptionOffer.offerId,
          privateSessionsNumber: subscription.member.privateSessionsNumber
        })

        this.myControl.setValue(subscription.member.userFirstName + " " + subscription.member.userLastName)
        this.selectedUser = subscription.member
        this.userId = subscription.member.userId
        this.privateSessionsNumber = subscription.member.privateSessionsNumber
        this.subscriptionObject = subscription
    },
      error: (err) => console.error(err)
    })
  }

  getCategory(id?: any)
  {
    if (!id)
    {
      this.categoryService.getActivitiesOfCategory(this.subscriptionFormValue.value.subscriptionCategory).subscribe({
        next: (categoriesList) => this.activities = categoriesList,
        error: (err) => console.error(err)
      })
    }
  }

  getMemberById(memberId: string)
  {

    this.userService.retrieveMemberById(memberId).subscribe(
      {
        next: (user) => {
          this.selectedUser = user as User
        },
        error: (err) => console.error(err)
      }
    )

  }

  filterUnsubscribedMembersInActivity(members: any)
  {
    let unsubscribedMembersList: User[] = []
    let isUnsubscribed

    for (let i = 0; i < members.length; i++)
    {
      isUnsubscribed = true

      this.activitySubscriptions.forEach((subscription: any) => {
        if (members[i].userId == subscription.member.userId)
        {
          isUnsubscribed = false
        }
      })

      if (isUnsubscribed)
      {
        unsubscribedMembersList.push(members[i])
      }
    }

    this.options = []

    return unsubscribedMembersList



  }


  isMemberInputFieldNotEmpty()
  {
    if (this.myControl.value!.length == 0)
    {
      this.isNotEmpty = false
      this.userId = ""
    }
    else
    {
      this.isNotEmpty = true 
    }
  }

  getOffer(id?: any): Offer | void
  {
    let o = new Offer()
    // update operation
    if (id)
    {
      this.offers.forEach((offer) => {
        if(offer.offerId == id)
        {
          o = offer
        }
      })

      return o
    }
    // add operation
    else if (this.isAddOperation)
    {
      this.offers.forEach((offer) => {
        if(offer.offerId == this.subscriptionFormValue.value.subscriptionOffer)
        {
          this.subscriptionObject.subscriptionPrice = offer.offerPrice
          this.subscriptionObject.subscriptionStartDate = new Date().toISOString().split('T')[0]
          this.subscriptionObject.subscriptionEndDate = new Date(
            new Date(this.subscriptionObject.subscriptionStartDate).getFullYear(),
            new Date(this.subscriptionObject.subscriptionStartDate).getMonth() + offer.offerPeriod,
            new Date(this.subscriptionObject.subscriptionStartDate).getDate()
          ).toISOString().split('T')[0]
          this.subscriptionObject.subscriptionOffer = offer
          this.subscriptionPeriod = offer.offerPeriod
          return
        }
      })
    }

  }
}