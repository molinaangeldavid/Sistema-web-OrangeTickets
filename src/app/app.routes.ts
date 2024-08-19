import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { loginGuard } from './core/guards/login.guard';
import {adminGuard} from './core/guards/admin.guard'
import { LoginComponent } from './auth/login/login.component';
import { HomeAdminComponent } from './pages/home-admin/home-admin.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { AdminComponent } from './auth/admin/admin.component';


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
        path: 'login/admin',
        component: AdminComponent
    },
    {
        path: 'estudiante',
        component: HomeComponent,
        canActivate: [loginGuard],
    },
    {
        path: 'admin',
        component: HomeAdminComponent,
        canActivate:[adminGuard],
    },
    {
        path: '**',
        component: NotFoundComponent
    }
];
