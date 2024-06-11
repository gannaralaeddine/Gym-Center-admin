import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UtilsService } from '../serviceutils/utils.service';
import { Subscription } from '../subscription/subscription';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService
{
  constructor(private http: HttpClient, private utils: UtilsService) { }

  public addSubscription(subscription: Subscription, memberId: string) { return this.http.post(this.utils.API_GYM_CENTER + "/subscription/create-subscription/" + memberId, subscription) }

  public getAllSubscriptions() { return this.http.get<any>(this.utils.API_GYM_CENTER + "/subscription/retrieve-all-subscriptions") }

  public retrieveActivitySubscriptions(activityId: any) { return this.http.get<Subscription[]>(this.utils.API_GYM_CENTER + "/subscription/retrieve-activity-subscriptions/" + activityId) }

  public getSubscription(id: any) { return this.http.get<any>(this.utils.API_GYM_CENTER + "/subscription/retrieve-subscription/" + id) }

  public deleteSubscription(id: any) { return this.http.delete(this.utils.API_GYM_CENTER + "/subscription/delete-subscription/" + id) }

  public updateSubscription(id: any, subscription:any, memberId: any) { return this.http.put(this.utils.API_GYM_CENTER + "/subscription/update-subscription/" + id + "/" + memberId, subscription) }
}
