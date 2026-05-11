import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { catchError, Observable, throwError } from "rxjs";
import { AuthService } from "./auth.service";
import { Router } from "@angular/router";

import { Injectable } from '@angular/core';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService, private router: Router) {
  }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.url.includes('/auth/login')) {
      return next.handle(req.clone())
    }


    const token = this.authService.getTokenLS()

    req = this.addToken(req, token)

    return next.handle(req).pipe(
      catchError(
        (err: HttpErrorResponse) => {
          console.log(err.status)
          if (err.status === 401) {
            this.authService.clearLocalStorage();
            this.router.navigate([""]).then()
          }
          else if (err.status === 403) {
            console.log("status code is: 403")
          }
          return throwError("Something is wrong")
        }
      )
    )
  }

  private addToken(request: HttpRequest<any>, token: any) {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}` // Alt+96 back tick

      }
    })
  }

}

