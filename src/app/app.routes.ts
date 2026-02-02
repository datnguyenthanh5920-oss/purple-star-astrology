import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./pages/home/home').then(m => m.Home),
        title: 'Tử Vi Huyền Bí - Lập Lá Số Tử Vi Online'
    },
    {
        path: 'ket-qua',
        loadComponent: () => import('./pages/result/result').then(m => m.Result),
        title: 'Kết Quả Lá Số - Tử Vi Huyền Bí'
    },
    {
        path: '**',
        redirectTo: ''
    }
];
