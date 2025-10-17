import { Component, Inject, AfterViewInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ThemeService } from '../theme/theme.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent implements AfterViewInit {
  constructor(@Inject(PLATFORM_ID) private platformId: Object, private theme: ThemeService) {}

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const fixedPlugin = document.querySelector('.fixed-plugin');
    if (!fixedPlugin) return;

    const toggle = () => fixedPlugin.classList.toggle('show');
    const close = () => fixedPlugin.classList.remove('show');

    const button = document.querySelector('.fixed-plugin-button');
    const buttonNav = document.querySelector('.fixed-plugin-button-nav');
    const closeButtons = document.querySelectorAll('.fixed-plugin-close-button');
    const colorBadges = document.querySelectorAll('.fixed-plugin .badge.filter');

    if (button) {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        toggle();
      });
    }

    if (buttonNav) {
      buttonNav.addEventListener('click', (e) => {
        e.preventDefault();
        toggle();
      });
    }

    closeButtons.forEach((el) => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        close();
      });
    });

    colorBadges.forEach((el) => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        const target = e.currentTarget as HTMLElement;
        // Try data-color first to map to known palette, otherwise read computed bg color
        const data = target.getAttribute('data-color');
        let hex = this.colorFromData(data) || this.hexFromComputedStyle(target);
        if (hex) {
          this.theme.setPrimaryColor(hex);
        }

        // Also update left sidenav background class to match selected color
        if (data) {
          const sidenav = document.getElementById('mySidenav');
          if (sidenav) {
            const gradientClasses = [
              'bg-gradient-primary',
              'bg-gradient-dark',
              'bg-gradient-info',
              'bg-gradient-success',
              'bg-gradient-warning',
              'bg-gradient-danger',
              'bg-white',
              'bg-transparent'
            ];
            gradientClasses.forEach(cls => sidenav.classList.remove(cls));
            const clsToAdd = `bg-gradient-${data}`;
            sidenav.classList.add(clsToAdd);
          }
        }
      });
    });

    document.body.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      const card = document.querySelector('.fixed-plugin .card');
      const clickedInsideCard = !!target.closest('.fixed-plugin .card');
      const clickedToggle = target === button || target === buttonNav;
      if (!clickedInsideCard && !clickedToggle) {
        close();
      }
    });
  }

  private colorFromData(data: string | null): string | null {
    if (!data) return null;
    // Map known keys to pink and variants; extend as needed
    const map: Record<string, string> = {
      primary: '#e91e63',
      dark: '#1f2937',
      info: '#1A73E8',
      success: '#4caf50',
      warning: '#fb8c00',
      danger: '#ef5350',
    };
    return map[data] || null;
  }

  private hexFromComputedStyle(el: Element): string | null {
    const bg = getComputedStyle(el).backgroundColor; // rgb(a)
    const match = /rgba?\((\d+),\s*(\d+),\s*(\d+)/.exec(bg);
    if (!match) return null;
    const r = Number(match[1]), g = Number(match[2]), b = Number(match[3]);
    const hex = `#${((1<<24) + (r<<16) + (g<<8) + b).toString(16).slice(1)}`;
    return hex;
  }
}
