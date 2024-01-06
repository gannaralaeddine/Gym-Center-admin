import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser, NgOptimizedImage } from '@angular/common';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { FooterComponent } from "./footer/footer.component";
import { HeaderComponent } from "./header/header.component";
import { SettingsComponent } from "./settings/settings.component";
import { SidebarComponent } from "./sidebar/sidebar.component";
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from "./services/auth.service";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, FooterComponent, HeaderComponent, SettingsComponent, SidebarComponent, RouterLink, NgOptimizedImage, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit
{

  title = 'Gym-Center-admin';

  public constructor(private router: Router, private actRouter: ActivatedRoute, private authService: AuthService, @Inject(PLATFORM_ID) private platformId: Object)
  {
      if (isPlatformBrowser(this.platformId))
      {
        authService.isRoleMatches("")

        if (this.isLoggedIn())
        {
          this.router.navigate(["home"])
        }
        else
        {
          this.router.navigate([""])
        }
      }
  }

  ngOnInit()
  {
      // this.actRouter.queryParams.subscribe( params => {
      //   this.isAuthenticated = params["isAuthenticated"]
      //   this.router.navigate(["home"])
      // })

  }

  isLoggedIn(): boolean
  {
    if (isPlatformBrowser(this.platformId))
    {
      return this.authService.isLoggedIn()
    }
    return false
  }

  logout()
  {
      this.authService.clearLocalStorage()
      this.router.navigate([""])
  }
}
