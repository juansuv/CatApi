import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/breeds',
    pathMatch: 'full'
  },
  {
    path: 'breeds',
    loadComponent: () => import('./views/cat-breeds/cat-breeds.component').then(m => m.CatBreedsComponent)
  },
  {
    path: '**',
    redirectTo: '/breeds'
  }
];
