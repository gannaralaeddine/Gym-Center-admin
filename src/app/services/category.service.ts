import { HttpClient } from '@angular/common/http';
import { Inject, Injectable} from '@angular/core';
import { Category } from '../category/category';
import { AddCategoryComponent } from '../category/add-category/add-category.component';

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

  public addCategory(category:any) 
  {
    return this.http.post(this.API_GYM_CENTER + "/add-category",category)
  }
}
