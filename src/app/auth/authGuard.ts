import {ActivatedRouteSnapshot, CanActivate, CanActivateFn, Router, RouterStateSnapshot} from '@angular/router';
import {inject} from "@angular/core";
import {AuthService} from "./auth.service";


export const AuthGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot
) => {

  const authService = inject(AuthService)
  const router = inject(Router)

  if (authService.getTokenLS() !== null) {
    const role = route.data["roles"] as string

    if (role) {
      if (authService.isRoleMatches(role)) {
        return true
      } else {
        console.log("forbidden")
        return false
      }
    }
  }

  router.navigate([""]).then()
  return false;
};
