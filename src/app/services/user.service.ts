import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Role} from "../user/role";
import {UtilsService} from "../serviceutils/utils.service";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient, private utils: UtilsService) { }

  public getAllUsers()
  {
    return this.http.get(this.utils.API_GYM_CENTER + "/user/retrieve-all-users")
  }

  public getNumberOfUsers()
  {
    return this.http.get(this.utils.API_GYM_CENTER + "/user/number-of-users")
  }

  public addMember(member: any): Observable<Object>
  {
    member.roles = [ new Role("MEMBER") ]
    return this.http.post<object>(this.utils.API_GYM_CENTER + "/member/add-member", member)
  }
}
