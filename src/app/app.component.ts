import {Component} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {Router, RouterLink, RouterOutlet} from '@angular/router';
import {FooterComponent} from "./footer/footer.component";
import {HeaderComponent} from "./header/header.component";
import {SettingsComponent} from "./settings/settings.component";
import {SidebarComponent} from "./sidebar/sidebar.component";
import { HttpClientModule} from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, FooterComponent, HeaderComponent, SettingsComponent, SidebarComponent, RouterLink, NgOptimizedImage, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Gym-Center-admin';
  welcomeLogo = "assets/img/logo-ct.png"
  static gymCenterEntryPoint = "http://localhost:8089/gym-center"

  isAuthenticated = true



  public constructor(private router: Router)
  {
      if (this.isAuthenticated)
      {
        this.router.navigate(["home"])
      }
      else
      {
        this.router.navigate([""])
      }

      // this.http.get("http://localhost:8089/gym-center/category/retrieve-all-categories").subscribe((res) => {
      //   console.log(res)
      // })
  }

}
