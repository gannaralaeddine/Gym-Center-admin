import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {UtilsService} from "../serviceutils/utils.service";

@Injectable({
  providedIn: 'root'
})
export class ActivityService
{

  constructor(private http: HttpClient, private utils: UtilsService) { }


  public addActivityWithOneImage(activity: FormData) { return this.http.post(this.utils.API_GYM_CENTER + "/activity/create-activity", activity ) }

  public addImagesToActivity(activity: FormData) { return this.http.put(this.utils.API_GYM_CENTER + "/activity/add-images-to-activity", activity ) }

  public getAllActivities() { return this.http.get(this.utils.API_GYM_CENTER + "/activity/retrieve-all-activities") }

  public getActivity(id: any) { return this.http.get(this.utils.API_GYM_CENTER + "/activity/retrieve-activity/" + id) }

  public getActivityImage(imageName: string): string { return this.utils.API_GYM_CENTER + "/activity/get-image/" + imageName }

  public deleteActivity(id: any) { return this.http.delete(this.utils.API_GYM_CENTER + "/activity/delete-activity/" + id) }

  public updateActivity(id: any, activity:any) { return this.http.put(this.utils.API_GYM_CENTER + "/activity/update-activity/" + id,activity) }
}
