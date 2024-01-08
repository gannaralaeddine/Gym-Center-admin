import { Injectable } from '@angular/core';
import { UtilsService } from "../serviceutils/utils.service";
import { HttpClient, HttpHeaders } from "@angular/common/http";


@Injectable({
  providedIn: 'root'
})
export class AuthService
{

    requestHeader = new HttpHeaders(
      { "No-Auth": "True" }
    )

    constructor( private utils: UtilsService, private http: HttpClient) { }


    public login(loginData: any){ return this.http.post(this.utils.API_GYM_CENTER + "/auth/login", loginData) }

    public getEmailLS()
    {
      return localStorage.getItem("email")
    }


    public setEmailLS(email: string)
    {
      localStorage.setItem("email", email)
    }

    public setRolesLS(roles: [])
    {
      localStorage.setItem("roles", JSON.stringify(roles))
    }

    public getRolesLS()
    {
      return JSON.parse( localStorage.getItem("roles") || "{}" )
    }

    public setTokenLS(token: string)
    {
      localStorage.setItem("token", token)
    }

    public getTokenLS()
    {
      return localStorage.getItem("token")
    }

    public clearLocalStorage()
    {
      localStorage.clear()
    }

    public isLoggedIn(): boolean
    {
      return this.getRolesLS() && this.getTokenLS()
    }

    public isRoleMatches(allowedRole: any): boolean
    {
      let isMatch = false;

      const userRoles = this.getRolesLS()


      if (userRoles != null && userRoles)
      {
        for (let i = 0 ; i < userRoles.length ; i++)
        {
            isMatch = userRoles[i].authority === allowedRole;
        }
      }
      return isMatch
    }
}
