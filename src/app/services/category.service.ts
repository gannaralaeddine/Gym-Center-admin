import { HttpClient } from '@angular/common/http';
import { Injectable} from '@angular/core';
import { Category } from '../category/category';

@Injectable({
  providedIn: 'root'
})

export class CategoryService
{
  //API_GYM_CENTER = "http://localhost:8089/gym-center/category"
  API_GYM_CENTER = "http://localhost:3000/categories/"

  constructor(private http: HttpClient) { }

  public getAllCategories()
  {
    //return this.http.get(this.API_GYM_CENTER + "/retrieve-all-categories")
    return this.http.get(this.API_GYM_CENTER)
  }

  public getCategory(id: any)
  {
    //return this.http.get(this.API_GYM_CENTER + "/retrieve-category/" + id)
    return this.http.get<any>(this.API_GYM_CENTER + id)
  }

  public deleteCategory(id: any)
  {
    //return this.http.delete(this.API_GYM_CENTER + "/delete-category/" + id)
    return this.http.delete(this.API_GYM_CENTER + id)
  }

  public updateCategory(id: any, category:any)
  {
    //return this.http.put(this.API_GYM_CENTER + "/update-category/" + id,category)
    return this.http.put(this.API_GYM_CENTER + id, category)
  }

  public addCategory(category:any)
  {
    //return this.http.post(this.API_GYM_CENTER + "/add-category",category)
    return this.http.post(this.API_GYM_CENTER, category)
  }
}
