import { Routes } from '@angular/router';
import { App } from './app';
import { ArteView } from './arte-view/arte-view';
import { Home } from './home/home';
export const routes: Routes = [
    {
        path: '',
        component: Home,
    },
    {
        path: ':id',
        component: ArteView,
    }
];
