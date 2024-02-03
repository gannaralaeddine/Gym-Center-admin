import { Component, OnInit, ViewChild } from '@angular/core';
import { SubscriptionService } from '../../services/subscription.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from '../subscription';
import { UtilsService } from '../../serviceutils/utils.service';
import { NgFor, NgIf } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-subscription-details',
  standalone: true,
  imports: [NgFor, NgIf, MatFormFieldModule, MatInputModule, MatIconModule, MatPaginatorModule, MatTableModule, MatSortModule],
  templateUrl: './subscription-details.component.html',
  styleUrl: './subscription-details.component.css'
})

export class SubscriptionDetailsComponent implements OnInit
{
  subscription = new Subscription()
  members: any
  subscriptionId: any
  activityImage: any

  constructor(private router: ActivatedRoute,
    private subscriptionService: SubscriptionService,
    private utilsService: UtilsService,
    private routerActivity: Router) 
  {
    this.router.queryParams.subscribe( params => {
      this.subscriptionId = params["subscriptionId"]
    })
  }
  ngOnInit() 
  {
    this.getSubscription()
  }

  getSubscription()
  {
    this.subscriptionService.getSubscription(this.subscriptionId).subscribe({
      next: (subscriptionObject) => {
        this.subscription.subscriptionPrice = subscriptionObject.subscriptionPrice
        this.subscription.subscriptionStartDate = subscriptionObject.subscriptionStartDate.split('T')[0]
        this.subscription.subscriptionEndDate = subscriptionObject.subscriptionEndDate.split('T')[0]
        this.subscription.subscriptionActivity = subscriptionObject.subscriptionActivity
        this.members = subscriptionObject.subscriptionMembers
        this.activityImage = this.utilsService.getImage(subscriptionObject.subscriptionActivity.actImage)
      },
      error: (err) => console.error(err)
    })
  }
  getUserImage(imageName: string): string
  {
      if (imageName)
      {
          return this.utilsService.getImage(imageName)
      }
      else
      {
          return "../assets/img/icons/ic_user_tie.svg"
      }
  }
  
  goToActivityDetails() 
  {
    const params = { actId: this.subscription.subscriptionActivity.actId }
    this.routerActivity.navigate(["activity-details"], { queryParams: params  })
  }

  goToUserProfileDetails(email:any) 
  {
    const params = { userEmail: email }
    this.routerActivity.navigate(["profile"], { queryParams: params  })
  }

}
