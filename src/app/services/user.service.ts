import { Injectable } from '@angular/core';
import {HttpClient } from "@angular/common/http";
import {map, Observable} from "rxjs";
import {Role} from "../user/role";
import {UtilsService} from "../serviceutils/utils.service";
import { User } from '../user/user';
import {Coach} from "../user/coach";

@Injectable({
  providedIn: 'root'
})
export class UserService {


    constructor(private http: HttpClient, private utils: UtilsService) { }

    public getAllUsers()  { return this.http.get<any>(this.utils.API_GYM_CENTER + "/user/retrieve-all-users") }

    public getUserById(id:any)  { return this.http.get<User>(this.utils.API_GYM_CENTER + "/user/retrieve-user/"+id) }

    public getNumberOfUsers()  { return this.http.get(this.utils.API_GYM_CENTER + "/user/number-of-users") }

    public registerMember(member: any): Observable<Object>
    {
      member.roles = [ new Role("MEMBER") ]
      return this.http.post<object>(this.utils.API_GYM_CENTER + "/member/register-member", member, {observe: 'response'}).pipe(map((response)=>{
        return response.status
      }))
    }

    public registerCoach(coach: any): Observable<Object>
    {
      coach.roles = [ new Role("COACH") ]
      return this.http.post<object>(this.utils.API_GYM_CENTER + "/coach/register-coach", coach,{observe: 'response'}).pipe(map((response)=>{
        return response.status
      }))
    }

    public registerAdmin(admin: any): Observable<Object>
    {
      admin.roles = [ new Role("ADMIN") ]
      return this.http.post<object>(this.utils.API_GYM_CENTER + "/user/register-user", admin,{observe: 'response'}).pipe(map((response)=>{
        return response.status
      }))
    }

    public getAllRoles()  { return this.http.get(this.utils.API_GYM_CENTER + "/user/retrieve-all-roles") }


    public retrieveUserByEmail(email: any)  { return this.http.get(this.utils.API_GYM_CENTER + "/user/retrieve-user-by-email/"+ email) }

    public updateProfilePicture(user: FormData) { return this.http.put(this.utils.API_GYM_CENTER + "/user/update-profile-picture", user) }


    public updateUserData(user: User) { return this.http.put(this.utils.API_GYM_CENTER + "/user/update-user", user) }

    public getAllCoaches() {return this.http.get(this.utils.API_GYM_CENTER + "/coach/retrieve-all-coaches")}

    public retrieveCoachSpecialities(id: number) {return this.http.get(this.utils.API_GYM_CENTER + "/coach/retrieve-coach-specialities/"+ id)}

    public deleteCoachSpeciality(coachId: number, activityId: number) {return this.http.delete(this.utils.API_GYM_CENTER + "/coach/delete-coach-activities/"+ coachId + "/"+ activityId)}

    public addImagesToUserProfile(formData: FormData) { return this.http.put(this.utils.API_GYM_CENTER + "/user/add-images-to-user", formData ) }

    public deleteUserImage(userId: number, imageName: string){ return this.http.delete(this.utils.API_GYM_CENTER + "/user/delete-user-image/" + userId + "/" + imageName) }

    public updateCoachSpecialities(coachId: any, specialities: []) { return this.http.put(this.utils.API_GYM_CENTER + "/coach/add-coach-to-activity/" + coachId, specialities) }
}
