// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  // mapsKey: 'AIzaSyDeA863K9OhDyPSxLacEf-lIF4t9RO4IRg',
  mapsKey: 'AIzaSyBEakA6CDsGp7LlAG-E49gIwE63USgi5qs',

  mapboxgAccessToken: 'pk.eyJ1IjoianF1aWxjaGFtaW4iLCJhIjoiY2xkdzJiaTN4MDM5NjNvbnV4eTI5MmV0MCJ9.xkxeH8IUvBcUTyHOLEORJg',

  apiUrl:
    // 'http://200.7.249.20/vision360ServicioCliente/Api_rest_movil/controller/',
    ' http://200.7.249.21:90/VerificacionesFisicas/Api_Cobranzas/controller/',
  // 'http://172.16.10.78/API_Cobranzas/controller/',
  apiUrlTest:
    // 'http://200.7.249.20/vision360ServicioCliente/Api_rest_movil/controller/',
    'http://171.23.12.43/API_Cobranzas/controller/',
  // 'http://172.16.10.78/API_Cobranzas/controller/',w
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
