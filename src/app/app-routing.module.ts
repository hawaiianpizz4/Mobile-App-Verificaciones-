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
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
