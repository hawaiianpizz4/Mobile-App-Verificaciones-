import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'detail/:id',
    loadChildren: () => import('./screens/detail/detail.module').then( m => m.DetailPageModule)
  },
  {
    path: 'modal-manual',
    loadChildren: () => import('./screens/modal-manual/modal-manual.module').then( m => m.ModalManualPageModule)
  },
  {
    path: 'historial',
    loadChildren: () => import('./screens/historial/historial.module').then( m => m.HistorialPageModule)
  },
  {
    path: 'map',
    loadChildren: () => import('./screens/map/map.module').then( m => m.MapPageModule)
  },
  {
    path: 'verificaciones',
    loadChildren: () => import('./screens/verificaciones/verificaciones.module').then( m => m.VerificacionesPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
