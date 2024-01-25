import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UtilsService } from '../serviceutils/utils.service';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService 
{
  constructor(private http: HttpClient, private utils: UtilsService) { }

  public addSubscription(subscription: any) { return this.http.post(this.utils.API_GYM_CENTER + "/subscription/create-subscription", subscription ) }

  public getAllSubscriptions() { return this.http.get<any>(this.utils.API_GYM_CENTER + "/subscription/retrieve-all-subscriptions") }

  public getSubscription(id: any) { return this.http.get<any>(this.utils.API_GYM_CENTER + "/subscription/retrieve-subscription/" + id) }

  public deleteSubscription(id: any) { return this.http.delete(this.utils.API_GYM_CENTER + "/subscription/delete-subscription/" + id) }

  public updateSubscription(id: any, subscription:any) { return this.http.put(this.utils.API_GYM_CENTER + "/subscription/update-subscription/" + id,subscription) }
}
