import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () =>
      import('./home/home.module').then((m) => m.HomePageModule),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'detail/:id',
    loadChildren: () =>
      import('./screens/detail/detail.module').then((m) => m.DetailPageModule),
  },

  {
    path: 'refi-detail/:id/:operacion',
    loadChildren: () =>
      import('./screens/refi-detail/refi-detail.module').then(
        (m) => m.RefiDetailPageModule
      ),
  },
  {
    path: 'refi-modal-map',
    loadChildren: () =>
      import('./components/refi-modal-map/refi-modal-map.module').then(
        (m) => m.RefiModalMapPageModule
      ),
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
    path: 'verificacion',
    loadChildren: () => import('./screens/verificacion/verificacion.module').then( m => m.VerificacionPageModule)
  },


  {
    path: 'map',
    loadChildren: () => import('./screens/map/map.module').then( m => m.MapPageModule)
  },
  {
    path: 'verificaciones',
    loadChildren: () => import('./screens/verificaciones/verificaciones.module').then( m => m.VerificacionesPageModule)
  },
  {
    path: 'verificaciones2',
    loadChildren: () => import('./screens/verificaciones2/verificaciones2.module').then( m => m.Verificaciones2PageModule)
  },  {
    path: 'veri-detail',
    loadChildren: () => import('./screens/veri-detail/veri-detail.module').then( m => m.VeriDetailPageModule)
  },
  {
    path: 'verificados',
    loadChildren: () => import('./screens/verificados/verificados.module').then( m => m.VerificadosPageModule)
  },


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
