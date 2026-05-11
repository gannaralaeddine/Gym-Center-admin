import { Component } from '@angular/core';

declare var sidebarColor: any;
declare var sidebarType: any;
declare var navbarFixed: any;
declare var darkMode: any;

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent {
  isOpen = false;

  toggle() {
    this.isOpen = !this.isOpen;
  }

  setSidebarColor(target: any) {
    if (typeof sidebarColor === 'function') sidebarColor(target);
  }

  setSidebarType(target: any) {
    if (typeof sidebarType === 'function') sidebarType(target);
  }

  setNavbarFixed(target: any) {
    if (typeof navbarFixed === 'function') navbarFixed(target);
  }

  setDarkMode(target: any) {
    if (typeof darkMode === 'function') darkMode(target);
  }
}

