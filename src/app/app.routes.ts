import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { loginGuard } from './core/guards/login.guard';
import {adminGuard} from './core/guards/admin.guard'
import { LoginComponent } from './auth/login/login.component';
import { HomeAdminComponent } from './pages/home-admin/home-admin.component';


export const routes: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'home',
        component: HomeComponent,
        canActivate: [loginGuard]
    },
    {
        path: 'admin',
        component: HomeAdminComponent,
        canActivate:[adminGuard]
    }
];
