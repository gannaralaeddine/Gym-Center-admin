import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ActivityService } from '../../services/activity.service';
import { UtilsService } from '../../serviceutils/utils.service';
import { Offer } from '../offer';
import { OfferService } from '../../services/offer.service.';
import { AddOfferComponent } from '../add-offer/add-offer.component';
import { NgFor } from '@angular/common';
import {MatListModule} from '@angular/material/list';

@Component({
  selector: 'app-offer-details',
  standalone: true,
  imports: [NgFor, MatListModule],
  templateUrl: './offer-details.component.html',
  styleUrl: './offer-details.component.css'
})

export class OfferDetailsComponent implements OnInit
{

  offerId: any
  activityImageUrl: any
  activityTitle: any
  offer = new Offer()
  period = ""

  constructor(
    private router: ActivatedRoute,
    private activityService: ActivityService,
    private offerService: OfferService,
    private utilsService: UtilsService,
    private dialogRef: MatDialog,
    private routerActivity: Router) {}

  ngOnInit()
  {
    this.router.queryParams.subscribe( params => {
      this.offerId = params["offerId"]
      this.offerService.getOffer(this.offerId).subscribe({
        next: (offerObject) => {
          this.offer = offerObject as Offer
          console.log('offer.offerOption: ' + this.offer.offerOption.length)
          switch(this.offer.offerPeriod)
          {
            case 1:
              this.period = "1 jour";
              break;

            case 2:
              this.period = "1 mois";
              break;

            case 3:
              this.period = "3 mois";
              break;

            case 4:
              this.period = "6 mois";
              break;

            case 5:
              this.period = "1 an";
              break;

            case 6:
              this.period = "2 ans";
              break;
          }
        },
        error: (err) => console.error(err)
      })
    })
  }

  updateDialog()
  {
    const popup = this.dialogRef.open(AddOfferComponent, {
      width: "40%",
      enterAnimationDuration: "1000ms",
      exitAnimationDuration: "1000ms",
      data: { offerId: this.offerId }
    })

    popup.afterClosed().subscribe(() =>{
      this.activityService.getActivity(this.offerId).subscribe({
        next: (offerObject) => {
          this.offer = offerObject as Offer
          this.ngOnInit()
        },
        error: (err) => console.error(err)
      })
    })
  }

  getImage(imageName: any)
  {
    return this.utilsService.getImage(imageName)
  }

  goToCategoryDetails()
  {
    this.routerActivity.navigate(["activity-details"], { queryParams: { actId: this.offer.offerActivity.actId }  })
  }
}
