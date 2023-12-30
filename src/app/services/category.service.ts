import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {UtilsService} from "../serviceutils/utils.service";

@Injectable({
  providedIn: 'root'
})

export class CategoryService
{

  constructor(private http: HttpClient, private utils: UtilsService) { }

  public getAllCategories()  { return this.http.get(this.utils.API_GYM_CENTER + "/category/retrieve-all-categories") }

  public getCategory(id: any)  { return this.http.get(this.utils.API_GYM_CENTER + "/category/retrieve-category/" + id) }

  public deleteCategory(id: any)  { return this.http.delete(this.utils.API_GYM_CENTER + "/category/delete-category/" + id) }

  public updateCategory(id: any, category:any) {return this.http.put(this.utils.API_GYM_CENTER + "/category/update-category/" + id,category) }

  public addCategory(category:any)  { return this.http.post(this.utils.API_GYM_CENTER + "/category/add-category",category) }

  public getCategoryImage(imageName: string): string { return this.utils.API_GYM_CENTER + "/category/get-image/" + imageName }
}
