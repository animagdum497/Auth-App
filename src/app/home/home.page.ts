import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { BiometryType, NativeBiometric } from 'capacitor-native-biometric';
import { Device } from '@capacitor/device';
import { ThemeService } from '../services/theme.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  isDarkMode: boolean = false;
  constructor(
    private authService: AuthService,
    private router: Router,
    private alertController: AlertController,
    private themeService: ThemeService
  ) {
    this.getMobileId();
    this.loadDarkMode();
  }

  async performBiometricVerification() {
    try {
      const result = await NativeBiometric.isAvailable();
      if (!result.isAvailable) {
        this.showAlert('Error', 'Biometric authentication is not available');
        return;
      }

      const isFaceID = result.biometryType === BiometryType.FACE_ID;

      const verified = await NativeBiometric.verifyIdentity({
        reason: 'Biometric',
        title: 'Biometric Authentication Required',
        subtitle: 'Please Verify Your Identity to Proceed with Check-In',
        // description: 'Maybe a description too?',
      })
        .then(() => true)
        .catch(() => false);

      if (verified) {
        this.showAlert('Success', 'Biometric verified successfully');
      } else {
        this.showAlert('Error', 'Biometric not verified');
      }
    } catch (error) {
      this.showAlert('Biometric verification error:', error);
      this.showAlert('Error', 'Biometric verification failed');
    }
  }

  async getMobileId() {
    const logDeviceUuid = async () => {
      const uuid = await Device.getId();

      console.log(uuid);
      //this.showAlert('DeviceId', uuid);
    };

    logDeviceUuid();
  }
  // for ios add permission
  //   <key>NSFaceIDUsageDescription</key>
  // <string>For an easier and faster log in.</string>

  async logout() {
    try {
      await this.authService.logout();
      console.log('Logged out successfully');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  }

  async showAlert(header: string, message: any) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK'],
    });

    await alert.present();
  }

  async loadDarkMode() {
    const darkMode = await this.themeService.loadDarkMode();
    this.isDarkMode = darkMode;
  }

  toggleDarkMode() {
    this.themeService.toggleDarkMode();
    this.isDarkMode = !this.isDarkMode;
  }
}
