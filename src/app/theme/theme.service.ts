import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly root: HTMLElement = document.documentElement;

  setPrimaryColor(hex: string): void {
    this.root.style.setProperty('--app-primary', hex);
    // derive a stronger shade for gradients; fallback to same if not computed
    const strong = this.shadeColor(hex, -10);
    this.root.style.setProperty('--app-primary-strong', strong);
  }

  // Simple shade function for hex colors (percentage -100..100)
  private shadeColor(hex: string, percent: number): string {
    const f = hex.startsWith('#') ? hex.substring(1) : hex;
    const num = parseInt(f, 16);
    let r = (num >> 16) & 0xff;
    let g = (num >> 8) & 0xff;
    let b = num & 0xff;
    r = Math.min(255, Math.max(0, Math.round(r + (percent / 100) * 255)));
    g = Math.min(255, Math.max(0, Math.round(g + (percent / 100) * 255)));
    b = Math.min(255, Math.max(0, Math.round(b + (percent / 100) * 255)));
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
  }
}


