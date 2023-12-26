import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  API_GYM_CENTER = "http://localhost:8089/gym-center/user"
  constructor(private http: HttpClient) { }

  public getAllUsers()
  {
    return this.http.get(this.API_GYM_CENTER + "/retrieve-all-users")
  }

  public getNumberOfUsers()
  {
    return this.http.get(this.API_GYM_CENTER + "/number-of-users")
  }
}
