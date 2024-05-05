import { Component, Inject, Input, OnChanges, OnInit, PLATFORM_ID, SimpleChanges } from '@angular/core';
import { CommonModule, isPlatformBrowser, NgOptimizedImage } from '@angular/common';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { FooterComponent } from "./footer/footer.component";
import { HeaderComponent } from "./header/header.component";
import { SettingsComponent } from "./settings/settings.component";
import { SidebarComponent } from "./sidebar/sidebar.component";
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from "./auth/auth.service";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, FooterComponent, HeaderComponent, SettingsComponent, SidebarComponent, RouterLink, NgOptimizedImage, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent
{

  title = 'Gym-Center-admin';
  isClicked!: boolean | undefined

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
    this.isClicked = false
    this.openOrCloseSideBarMenu()
    this.authService.clearLocalStorage()
    this.router.navigate([""])
  }

  openOrCloseSideBarMenu()
  {
    if (this.isClicked)
    {
      document.getElementById("mySidenav")!.style.width = "230px"
      document.getElementById("main")!.style.marginLeft = "230px"
    }
    else
    {
      document.getElementById("mySidenav")!.style.width = "0"
      document.getElementById("main")!.style.marginLeft = "0"
    }
  }

  sideBarButtonClicked(event: boolean)
  {
    this.isClicked = event
    this.openOrCloseSideBarMenu()
  }
}
