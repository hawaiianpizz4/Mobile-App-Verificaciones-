import { Geolocation, GeolocationOptions } from '@ionic-native/geolocation/ngx';
import { ToastController } from '@ionic/angular';

export function getCurrentCoordinates(): Promise<{ latitude: number; longitude: number }> {
  const options: GeolocationOptions = {
    enableHighAccuracy: true,
    timeout: 5000,
    // maximumAge: 0,
  };

  return new Promise((resolve, reject) => {
    new Geolocation()
      .getCurrentPosition()
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

export async function presentToast(message, iconInsert, color) {
  const toast = await new ToastController().create({
    message: message,
    duration: 2500,
    position: 'top',
    icon: iconInsert,
    color: color,
  });

  await toast.present();
}
