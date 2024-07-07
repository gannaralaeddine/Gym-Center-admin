import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UtilsService } from '../serviceutils/utils.service';
import { Option } from '../option/option';

@Injectable({
  providedIn: 'root'
})

export class OptionService 
{

  constructor(private http: HttpClient, private utils: UtilsService) { }

  public addOption(option: any) { return this.http.post(this.utils.API_GYM_CENTER + "/option/create-option", option ) }

  public getAllOptions() { return this.http.get<any>(this.utils.API_GYM_CENTER + "/option/retrieve-all-options") }

  public getOption(id: any) { return this.http.get<any>(this.utils.API_GYM_CENTER + "/option/retrieve-option/" + id) }

  public deleteOption(id: any) { return this.http.delete(this.utils.API_GYM_CENTER + "/option/delete-option/" + id) }

  public updateOption(id: any, option:any) { return this.http.put(this.utils.API_GYM_CENTER + "/option/update-option/" + id, option) }

  isOptionNameUnique(options: any, optionName: String)
  {
    let isUnique = true

    options.forEach((option: Option) => {
      if (option.optionName === optionName)
      {
        isUnique = false
      }
    })

    return isUnique
  }
}
