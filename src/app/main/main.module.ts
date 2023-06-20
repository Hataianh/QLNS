import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { MainRoutes } from './main.route';
import { MainComponent } from './main.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ProfileComponent } from './profile/profile.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PaginationModule } from 'ngx-bootstrap/pagination';

import { DashboardComponent } from './dashboard/dashboard.component';
@NgModule({
  declarations: [MainComponent, ProfileComponent, DashboardComponent],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
    PaginationModule,
    RouterModule.forChild(MainRoutes),
  ],
})
export class MainModule {}
