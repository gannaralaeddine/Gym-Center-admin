import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {UtilsService} from "../serviceutils/utils.service";
import {Offer} from "../offer/offer";

@Injectable({
  providedIn: 'root'
})
export class OfferService
{

  constructor(private http: HttpClient, private utils: UtilsService) { }

  public addOffer(offer: any) { return this.http.post(this.utils.API_GYM_CENTER + "/offer/add-offer", offer ) }

  public getAllOffers() { return this.http.get<any>(this.utils.API_GYM_CENTER + "/offer/retrieve-all-offers") }

  public getOfferMembers(offer: Offer) { return this.http.get<any>(this.utils.API_GYM_CENTER + "/offer/retrieve-offer-members") }

  public getOffer(id: any) { return this.http.get<Offer>(this.utils.API_GYM_CENTER + "/offer/retrieve-offer/" + id) }

  public deleteOffer(id: any) { return this.http.delete(this.utils.API_GYM_CENTER + "/offer/delete-offer/" + id) }

  public updateOffer(id: any, offer:any) { return this.http.put(this.utils.API_GYM_CENTER + "/offer/update-offer/" + id, offer) }

}
