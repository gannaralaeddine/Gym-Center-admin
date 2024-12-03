import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UtilsService } from '../serviceutils/utils.service';

@Injectable({
  providedIn: 'root'
})

export class TrainingHistoryService
{

  constructor(private http: HttpClient, private utils: UtilsService) { }

  public getAllTrainingHistories() { return this.http.get(this.utils.API_GYM_CENTER + "/training-history/retrieve-all-histories") }

  public getAllDistinctUsers() { return this.http.get(this.utils.API_GYM_CENTER + "/training-history/retrieve-distinct-users") }

}
