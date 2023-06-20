import { MainComponent } from './main.component';
import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RoleGuard } from '../core/guards/role.guard';
import { RoleBP, RolePB, RoleCV } from '../entities/role';
import { ProfileComponent } from './profile/profile.component';
export const MainRoutes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      { path: '', component: DashboardComponent },
      { path: 'profile', component: ProfileComponent },

      {
        path: '',
        loadChildren: () =>
          import('./accountant/accountant.module').then(
            (m) => m.AccountantModule
          ),
        canActivate: [RoleGuard],
        data: {
          roles: [
            [RoleCV.Giamdoc],
            [RolePB.Taichinhvaquanly, RoleBP.Ketoan],
            [RolePB.Taichinhvaquanly, RoleCV.Truongphong],
          ],
        },
      },
      {
        path: '',
        loadChildren: () =>
          import('./manage/manage.module').then((m) => m.ManageModule),
      },
    ],
  },
];
