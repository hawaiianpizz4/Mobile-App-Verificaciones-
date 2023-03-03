import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  constructor(private loadingController: LoadingController) {}

  async createLoading(message: string, duration: number = 10000) {
    const loading = await this.loadingController.create({
      message,
      spinner: 'bubbles',
    });

    // Set a timeout to dismiss the loading controller
    let timeoutId;
    const timeoutPromise = new Promise((_, reject) => {
      timeoutId = setTimeout(() => {
        loading.dismiss();
        reject(new Error(`Loading took too long (${duration} ms)`));
      }, duration);
    });

    // Wait for either the loading or timeout to finish
    await Promise.race([loading.present(), timeoutPromise]);

    // Clear the timeout
    clearTimeout(timeoutId);

    return loading;
  }
}
