import { NgIf, NgFor, AsyncPipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivityService } from '../../services/activity.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
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
    AsyncPipe
  ],
  templateUrl: './add-subscription.component.html',
  styleUrl: './add-subscription.component.css'
})
export class AddSubscriptionComponent implements OnInit
{
  subscriptionFormValue !: FormGroup
  isAddOperation = true
  activities: any
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
  SubscriptionEndDate = new Date(new Date().getTime() + 86400000)
  
  constructor(private activityService: ActivityService,
    private subscriptionService: SubscriptionService,
    private userService: UserService,
    private utilsService: UtilsService,
    private subscriptionFormBuilder: FormBuilder,
    private dialogRef: MatDialogRef<AddSubscriptionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private sanitizer: DomSanitizer)
  {
    if (this.data.subscriptionId)
    {
      this.isAddOperation = false;
      this.getSubscription(this.data.subscriptionId)
    }

    this.subscriptionFormValue = this.subscriptionFormBuilder.group({
      subscriptionPrice : ['',Validators.required],
      subscriptionStartDate : ['',Validators.required],
      subscriptionEndDate : ['',Validators.required],
      subscriptionActivity:['',Validators.required],
      privateSessionsNumber:['',Validators.required]
    })

    this.getAllActivities()
  }
  ngOnInit()
  {
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
      if (this.subscriptionFormValue.controls['subscriptionPrice'].invalid || this.subscriptionFormValue.controls['subscriptionStartDate'].invalid || this.subscriptionFormValue.controls['subscriptionEndDate'].invalid)
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
      if (this.subscriptionFormValue.controls['subscriptionPrice'].valid && this.subscriptionFormValue.controls['subscriptionStartDate'].valid && this.subscriptionFormValue.controls['subscriptionEndDate'].valid && this.subscriptionFormValue.controls['subscriptionActivity'].valid && this.subscriptionFormValue.controls['privateSessionsNumber'].valid)
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

  getActivity(id?: any)
  {

    if (id)
    {
      this.options = []
      this.userService.retrieveAllMembers().subscribe({
        next: (members) => {
          (members as User[]).forEach((user: User) => {
            this.options.push(user.userId + "-" +user.userFirstName + "-" + user.userLastName)
          })
          this.filteredOptions = this.myControl.valueChanges.pipe(startWith(''),map(value => this._filter(value || '')))
        },
        error: (err) => console.error(err)
      })
      // this.activityService.getActivity(id).subscribe({
      //   next: (activity) => {
      //     this.subscriptionObject.subscriptionActivity = activity as Activity
      //   },
      //   error: (err) => console.error(err)
      // })
    }
    else
    {
      this.activityService.getActivity(this.subscriptionFormValue.value.subscriptionActivity).subscribe({
        next: (activity) => {
          this.subscriptionObject.subscriptionActivity = activity as Activity
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
    this.subscriptionObject.subscriptionStartDate = new Date(this.subscriptionFormValue.value.subscriptionStartDate).toISOString().split('T')[0]
    this.subscriptionObject.subscriptionEndDate = new Date(this.subscriptionFormValue.value.subscriptionEndDate).toISOString().split('T')[0]

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
    this.subscriptionObject.subscriptionId = this.data.subscriptionId
    this.subscriptionObject.subscriptionPrice = this.subscriptionFormValue.value.subscriptionPrice
    this.subscriptionObject.subscriptionStartDate = new Date(this.subscriptionFormValue.value.subscriptionStartDate).toISOString().split('T')[0]
    this.subscriptionObject.subscriptionEndDate = new Date(this.subscriptionFormValue.value.subscriptionEndDate).toISOString().split('T')[0]

    this.subscriptionService.updateSubscription(this.data.subscriptionId, this.subscriptionObject, this.userId).subscribe({
      next: () => {
        this.userService.replaceOldPrivateSessionsNumber(this.userId, this.subscriptionFormValue.controls['privateSessionsNumber'].value).subscribe({
          error: (err) => console.error(err)
        })
        // if (this.privateSessionsNumber !== this.subscriptionFormValue.controls['privateSessionsNumber'].getRawValue())
        // {
          
          
        //   this.userService.updateMember(this.selectedUser.userId!.toString(),this.selectedUser).subscribe({
        //     next: (member) => console.log(member),
        //     error: (err) => console.error(err)
        //   })
        // }
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
}
