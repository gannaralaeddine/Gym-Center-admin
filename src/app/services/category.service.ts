import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UtilsService } from "../serviceutils/utils.service";
import {Category} from "../category/category";

@Injectable({
  providedIn: 'root'
})

export class CategoryService
{

  constructor(private http: HttpClient, private utils: UtilsService) { }

  public addCategoryWithOneImage(category: FormData) { return this.http.post(this.utils.API_GYM_CENTER + "/category/create-category", category ) }

  public addImagesToCategory(category: FormData) { return this.http.put(this.utils.API_GYM_CENTER + "/category/add-images-to-category", category ) }

  public getAllCategories()  { return this.http.get<any>(this.utils.API_GYM_CENTER + "/category/retrieve-all-categories") }

  public getCategory(id: any)  { return this.http.get(this.utils.API_GYM_CENTER + "/category/retrieve-category/" + id) }

  public getCategoryImage(imageName: string): string { return this.utils.API_GYM_CENTER + "/category/get-image/" + imageName }

  public updateCategory(id: number, category: Category) { return this.http.put(this.utils.API_GYM_CENTER + "/category/update-category/"+id, category) }

  public deleteCategory(id: number)  { return this.http.delete(this.utils.API_GYM_CENTER + "/category/delete-category/" + id) }

}
