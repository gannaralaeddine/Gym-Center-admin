import { HttpClient } from '@angular/common/http';
import { Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CategoryService
{
  API_GYM_CENTER = "http://localhost:8089/gym-center/category"

  constructor(private http: HttpClient) { }

  public getAllCategories()
  {
    return this.http.get(this.API_GYM_CENTER + "/retrieve-all-categories")
  }

  public getCategory(id: any) 
  {
    return this.http.get(this.API_GYM_CENTER + "/retrieve-category/" + id)
  }

  public deleteCategory(id: any) 
  {
    return this.http.delete(this.API_GYM_CENTER + "/delete-category/" + id)
  }

  public updateCategory(id: any, category:any) 
  {
    return this.http.put(this.API_GYM_CENTER + "/update-category/" + id,category)
  }
}
