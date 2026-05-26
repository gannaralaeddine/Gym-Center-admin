import {NgIf, NgFor, AsyncPipe, DatePipe} from '@angular/common';
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
import {LoadingSpinnerComponent} from "../../loading-spinner/loading-spinner.component";
import {Member} from "../../user/Member";


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
    LoadingSpinnerComponent,
    DatePipe
  ],
  templateUrl: './add-subscription.component.html',
  styleUrl: './add-subscription.component.css'
})
export class AddSubscriptionComponent implements OnInit
{
  isLoading = false
  subscriptionFormValue !: FormGroup
  isAddOperation = true
  activities: any
  categories: any
  offerMembers: Member[] = []
  subscriptionObject = new Subscription()
  subscriptionActivity!: Activity
  myControl = new FormControl('')
  options: string[] = []
  filteredOptions!: Observable<string[]>
  userId!: string
  selectedUser!: User
  privateSessionsNumber!: number
  membersList: any
  isNotEmpty!: boolean
  offers!: Offer[]
  subscriptionPeriod!: number
  availableMembers: any[] = [];


  constructor(private activityService: ActivityService,
    private subscriptionService: SubscriptionService,
    private categoryService: CategoryService,
    private userService: UserService,
    private offerService: OfferService,
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

    this.offerService.getAllOffers().subscribe({
      next: (offers) => this.offers = offers,
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
    //Add Case
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


    // Update Case
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
  }

  closeDialog()
  {
    this.dialogRef.close()
  }

  /**
   * subscriptionOffer
   *
   * @param id
   */
  getActivity(id?: any)
  {
    const offerId = Number(id ?? this.subscriptionFormValue.value.subscriptionOffer)
    if (isNaN(offerId) || offerId <= 0) {
      return
    }

    this.options = []
    this.offerService.getOffer(offerId).subscribe({
      next: (offer) => {
        this.subscriptionObject.subscriptionOffer = offer as Offer
        this.offerService.getOfferMembers(offer).subscribe({
          next: (offerMembers) => {
            this.offerMembers = offerMembers
            this.filterUnsubscribedMembersInActivity(this.membersList).forEach((user: User) => {
              this.options.push(user.userId + "-" + user.userFirstName + "-" + user.userLastName)
            })
            this.filteredOptions = this.myControl.valueChanges.pipe(startWith(''), map(value => this._filter(value || '')))
          },
          error: (err) => console.error(err)
        })
      },
      error: (err) => console.error(err)
    })
  }

  getAllCategories()
  {
    this.categoryService.getAllCategories().subscribe({
      next: (categories) => this.categories = categories,
      error: (err) => console.error(err)
    })
  }

  updateSubscription()
  {
    this.subscriptionObject.subscriptionId = this.data.subscriptionId
    this.subscriptionObject.subscriptionPrice = this.subscriptionFormValue.value.subscriptionPrice
    this.subscriptionObject.subscriptionStartDate = new Date(this.subscriptionFormValue.value.subscriptionStartDate).toISOString().split('T')[0]
    this.subscriptionObject.subscriptionEndDate = new Date(this.subscriptionFormValue.value.subscriptionEndDate).toISOString().split('T')[0]

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
    if (isNaN(subscriptionId) || subscriptionId <= 0) {
      console.error('Invalid subscriptionId provided');
      return; // Or handle the error appropriately
    }
    this.subscriptionService.getSubscription(subscriptionId).subscribe({
      next: (subscription) => {
        this.subscriptionObject.subscriptionActivity = subscription.subscriptionActivity
        this.subscriptionFormValue.controls['subscriptionPrice'].setValue(subscription.subscriptionPrice)
        this.subscriptionFormValue.controls['subscriptionStartDate'].setValue(subscription.subscriptionStartDate.split('T')[0])
        this.subscriptionFormValue.controls['subscriptionEndDate'].setValue(subscription.subscriptionEndDate.split('T')[0])
        this.subscriptionFormValue.controls['privateSessionsNumber'].setValue(subscription.member.privateSessionsNumber)
        this.populateActivitySelectList(subscription)
        this.myControl.setValue(subscription.member.userFirstName + " " + subscription.member.userLastName)
        this.selectedUser = subscription.member
        this.userId = subscription.member.userId
        this.privateSessionsNumber = subscription.member.privateSessionsNumber
        this.subscriptionPeriod = this.subscriptionObject.subscriptionOffer.offerPeriod

      },
      error: (err) => console.error(err)
    })
  }

  populateActivitySelectList(subscription: any)
  {
    let optionTag!: HTMLOptionElement
    let selectTag!: HTMLSelectElement

    // get the div tag containing select list of categories
    let formGroupActivitySelectList = document.getElementById("activitySelectList")?.parentElement

    //remove actual select HTML tag
    document.getElementById("activitySelectList")?.remove()

    // create new select HTML tag for replace the removed one
    selectTag = document.createElement("select")
    selectTag.setAttribute("formcontrolname","subscriptionActivity")
    selectTag.setAttribute("class","form-control border border-dark pl-2 round ng-pristine ng-valid ng-touched")
    selectTag.setAttribute("id","activitySelectList")
    selectTag.addEventListener('change',()=>{
      this.getActivity(selectTag[selectTag.selectedIndex].getAttribute("value"))
    })
    formGroupActivitySelectList?.appendChild(selectTag)

    //add option HTML tag to select tag that will be selected by default
    let activitySelectList = document.getElementById("activitySelectList")
    optionTag = document.createElement("option") //<option _ngcontent-ng-c1135787114="" value="4" ng-reflect-value="4">ala</option>
    optionTag.setAttribute("value",subscription.subscriptionActivity.actId.toString())
    //optionTag.setAttribute("selected","")
    optionTag.textContent = subscription.subscriptionActivity.actName
    activitySelectList?.appendChild(optionTag)

    //add other options under the first element in the list
    this.activityService.getAllActivities().subscribe({
      next:(activity)=>{
      for (let i = 0; i < activity.length; i++)
      {
        if (activity[i].actId != subscription.subscriptionActivity.actId)
        {
          // add the other options for categories
          optionTag = document.createElement("option")
          optionTag.setAttribute("value",activity[i].actId.toString())
          optionTag.setAttribute("ng-reflect-value",activity[i].actId.toString())
          optionTag.textContent = activity[i].actName
          activitySelectList?.appendChild(optionTag)
        }
      }
    },
      error: (err)=>console.error(err)
    })

    this.getActivity(selectTag[selectTag.selectedIndex].getAttribute("value"))
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

      this.offerMembers.forEach((offerMember: any) => {
        if (members[i].userId == offerMember.userId)
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


  onOfferChange(): void {
    this.subscriptionService.getAvailableMembers(this.subscriptionFormValue.value.subscriptionOffer).subscribe({

        next: (members: any[]) => {
          this.availableMembers = members;
          this.filterUnsubscribedMembersInActivity(this.availableMembers).forEach((user: User) => {
            this.options.push(user.userId + "-" + user.userFirstName + "-" + user.userLastName)
          })
          this.filteredOptions = this.myControl.valueChanges.pipe(startWith(''), map(value => this._filter(value || '')))

        },

        error: (err: any) => {
          console.log(err);
        }
      });
  }


  createSubscription(): void {
    this.isLoading = true;

    this.subscriptionService.createSubscription( Number(this.userId), this.subscriptionFormValue.value.subscriptionOffer ).subscribe(
      {

        next: (response) => {

          console.log(response);


          console.log('Subscription created successfully');

          // refresh members list
          this.onOfferChange();
        },

        error: (err) => {

          console.log(err);
        },
        complete: () => {
          this.isLoading = false;
          this.dialogRef.close()
          this.utilsService.successDialog("Opération réussite", "Abonnement ajouté avec succès", true)
        }
      });
  }
}
