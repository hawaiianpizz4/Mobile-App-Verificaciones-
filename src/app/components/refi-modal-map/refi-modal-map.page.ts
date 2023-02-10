import { Component, OnInit } from '@angular/core';
import { GoogleMap, Marker, MapType } from '@capacitor/google-maps';
import { ElementRef, ViewChild } from '@angular/core';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-refi-modal-map',
  templateUrl: './refi-modal-map.page.html',
  styleUrls: ['./refi-modal-map.page.scss'],
})
export class RefiModalMapPage implements OnInit {
  markersId: string[] = [];

  latitude = 111.111;
  longitude = 1111.111;

  @ViewChild('map') mapRef: ElementRef;
  map: GoogleMap;

  constructor() {}

  ngOnInit() {}

  ionViewDidEnter() {
    this.createMap();
  }

  async createMap() {
    this.map = await GoogleMap.create({
      id: 'my-map',
      apiKey: environment.mapsKey,
      element: this.mapRef.nativeElement,
      forceCreate: true,

      config: {
        center: {
          lat: this.latitude,
          lng: this.longitude,
        },
        mapTypeControl: false,
        disableDefaultUI: true,
        zoom: 15,
      },
    });
    // await this.map.setMapType(MapType.Satellite);
    await this.map.enableCurrentLocation(true);

    this.map.setOnMapClickListener(async (marker) => {
      this.map.removeMarkers(this.markersId);
      this.map.removeMarker('asdfasdf');
      this.addMarkers(marker.latitude, marker.longitude);
      console.dir(this.map);
    });
  }

  async addMarkers(latitude: number, longitude: number) {
    const marker = {
      coordinate: {
        lat: latitude,
        lng: longitude,
      },
      title: 'Ubicación actual',
      snippet: 'Aquí',
    };

    const result = await this.map.addMarker(marker);
    this.markersId.push(result[0]);
  }
}
