// src/app/services/theme.service.ts
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private darkMode: boolean = false;

  constructor(private storage: Storage) {
    this.init();
  }

  async init() {
    await this.storage.create();
    const darkMode = await this.storage.get('dark-mode');
    this.darkMode = darkMode ?? false;
    this.applyTheme();
  }

  async loadDarkMode(): Promise<boolean> {
    const darkMode = await this.storage.get('dark-mode');
    return darkMode ?? false;
  }

  toggleDarkMode() {
    this.darkMode = !this.darkMode;
    this.storage.set('dark-mode', this.darkMode);
    this.applyTheme();
  }

  applyTheme() {
    document.body.classList.toggle('dark', this.darkMode);
  }
}
