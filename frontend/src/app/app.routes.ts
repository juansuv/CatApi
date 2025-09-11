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
    path: 'search',
    loadComponent: () => import('./views/search/search.component').then(m => m.SearchComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./views/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./views/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: '**',
    redirectTo: '/breeds'
  }
];
