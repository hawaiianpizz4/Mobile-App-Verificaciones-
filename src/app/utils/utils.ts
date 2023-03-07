import { Geolocation, GeolocationOptions } from '@ionic-native/geolocation/ngx';
import { ToastController } from '@ionic/angular';
import { AbstractControl, ValidatorFn } from '@angular/forms';

export function getCurrentCoordinates(): Promise<{ latitude: number; longitude: number }> {
  const options: GeolocationOptions = {
    enableHighAccuracy: true,
    timeout: 5000,
    // maximumAge: 0,
  };

  return new Promise((resolve, reject) => {
    new Geolocation()
      .getCurrentPosition(options)
      .then((resp) => {
        const latitude = resp.coords.latitude;
        const longitude = resp.coords.longitude;
        console.log(latitude, longitude);
        resolve({ latitude, longitude });
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export async function presentToast(message, iconInsert, color, duration: number = 3000) {
  const toast = await new ToastController().create({
    message: message,
    duration: 2500,
    position: 'bottom',
    icon: iconInsert,
    color: color,
  });

  await toast.present();
}

export function selectValidator(options: any[]): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const selectedOption = options.find((option) => option == control.value);
    return selectedOption ? null : { invalidOption: true };
  };
}

export function isValidDate(control: AbstractControl): { [key: string]: any } | null {
  const dateString = control.value;
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? { invalidDate: true } : null;
}
