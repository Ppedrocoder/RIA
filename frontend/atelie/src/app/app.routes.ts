import { Routes } from '@angular/router';
import { Edit } from './edit/edit';
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
    },
    {
        path: 'edit/:id',
        component: Edit,
    }
];
