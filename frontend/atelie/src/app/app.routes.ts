import { Routes } from '@angular/router';
import { Edit } from './edit/edit';
import { ArteView } from './arte-view/arte-view';
import { Home } from './home/home';
import { LoginComponent } from './auth/login.component';
import { CadastroComponent } from './auth/cadastro.component';
import { authGuard } from './auth/auth.guard';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'cadastro', component: CadastroComponent },
    {
        path: '',
        canActivate: [authGuard],
        children: [
            { path: '', component: Home }, 
            { path: ':id', component: ArteView },
            { path: 'edit/:id', component: Edit },
        ]
    },
    { path: '**', redirectTo: 'login' } 
];
