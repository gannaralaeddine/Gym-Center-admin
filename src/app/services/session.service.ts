import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UtilsService } from '../serviceutils/utils.service';

@Injectable({
  providedIn: 'root'
})
export class SessionService
{

  constructor(private http: HttpClient, private utils: UtilsService) { }

  public addSessionWithOneImage(session: FormData) { return this.http.post(this.utils.API_GYM_CENTER + "/session/create-session", session ) }

  public addImagesToSession(session: FormData) { return this.http.put(this.utils.API_GYM_CENTER + "/session/add-images-to-session", session ) }

  public getAllSessions() { return this.http.get<any>(this.utils.API_GYM_CENTER + "/session/retrieve-all-sessions") }

  public getSession(id: any) { return this.http.get<any>(this.utils.API_GYM_CENTER + "/session/retrieve-session/" + id) }

  public getSessionImage(imageName: string): string { return this.utils.API_GYM_CENTER + "/image/get-image/" + imageName }

  public deleteSession(id: any) { return this.http.delete(this.utils.API_GYM_CENTER + "/session/delete-session/" + id) }

  public updateSession(id: any, session:any) { return this.http.put(this.utils.API_GYM_CENTER + "/session/update-session/" + id,session) }

  public updateSessionWithImage(session:FormData) { return this.http.put(this.utils.API_GYM_CENTER + "/session/update-session-with-image", session) }


  public deleteSessionImage(SessionId: number, imageName: string){ return this.http.delete(this.utils.API_GYM_CENTER + "/session/delete-session-image/" + SessionId + "/" + imageName) }

}
