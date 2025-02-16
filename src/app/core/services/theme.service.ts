import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

const THEME_STORAGE_KEY = 'theme';

export const enum Themes {
  Light = 'light-theme',
  Dark = 'dark-theme',
}

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private themeSubject = new BehaviorSubject<string>(this.getSavedOrDefaultTheme());
  theme$ = this.themeSubject.asObservable();

  constructor() {
    this.initTheme();
  }

  getTheme(): string {
    return document.documentElement.className;
  }

  setTheme(isDarkMode?: boolean): void {
    const theme = isDarkMode === undefined ? this.getSavedOrDefaultTheme() : isDarkMode ? Themes.Dark : Themes.Light;

    document.documentElement.className = theme;
    localStorage.setItem(THEME_STORAGE_KEY, theme);
    this.themeSubject.next(theme);
  }

  private initTheme(): void {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    const defaultTheme = savedTheme || this.getDefaultTheme();
    document.documentElement.className = defaultTheme;
    this.themeSubject.next(defaultTheme);
  }

  private getDefaultTheme(): string {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? Themes.Dark : Themes.Light;
  }

  private getSavedOrDefaultTheme(): string {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    return savedTheme || this.getDefaultTheme();
  }
}
