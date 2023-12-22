import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CategoryService 
{
  API_GYM_CENTER = "http://localhost:8089/gym-center/category"

  constructor(private httpClient: HttpClient) { }

  public getAllCategories()
  {
    return this.httpClient.get(this.API_GYM_CENTER + "/retrieve-all-categories")
  }
}
