import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { NhanvienComponent } from './nhanvien/nhanvien.component';
import { PhongbanComponent } from './phongban/phongban.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgSelectModule } from '@ng-select/ng-select';
import { BophanComponent } from './bophan/bophan.component';
import { ChucvuComponent } from './chucvu/chucvu.component';
import { TrinhdoComponent } from './trinhdo/trinhdo.component';
import { LoaihopdongComponent } from './loaihopdong/loaihopdong.component';
import { HopdongComponent } from './hopdong/hopdong.component';
import { RoleGuard } from 'src/app/core/guards/role.guard';
import { RolePB, RoleBP, RoleCV } from 'src/app/entities/role';
import { NghiphepComponent } from './nghiphep/nghiphep.component';
import { BangcongComponent } from './bangcong/bangcong.component';
@NgModule({
  declarations: [
    NhanvienComponent,
    PhongbanComponent,
    BophanComponent,
    ChucvuComponent,
    TrinhdoComponent,
    LoaihopdongComponent,
    HopdongComponent,
    NghiphepComponent,
    BangcongComponent,
  ],
  imports: [
    ReactiveFormsModule,
    FormsModule,
    NgSelectModule,
    CommonModule,
    SharedModule,
    NgbModule,
    PaginationModule,
    NgMultiSelectDropDownModule,
    RouterModule.forChild([
      { path: 'nhan-vien', component: NhanvienComponent },
      {
        path: 'phong-ban',
        component: PhongbanComponent,
      },
      {
        path: 'bo-phan',
        component: BophanComponent,
      },
      {
        path: 'nghi-phep',
        component: NghiphepComponent,
        canActivate: [RoleGuard],
        data: {
          roles: [[RoleCV.Giamdoc], [RoleCV.Truongphong]],
        },
      },
      {
        path: 'bang-cong',
        component: BangcongComponent,
        canActivate: [RoleGuard],
        data: {
          roles: [[RoleCV.Giamdoc], [RolePB.Taichinhvaquanly]],
        },
      },
      {
        path: 'chuc-vu',
        component: ChucvuComponent,
      },
      {
        path: 'loai-hopdong',
        component: LoaihopdongComponent,
        canActivate: [RoleGuard],
        data: {
          roles: [
            [RoleCV.Giamdoc],
            [RolePB.Taichinhvaquanly, RoleBP.Nhansu],
            [RolePB.Taichinhvaquanly, RoleCV.Truongphong],
          ],
        },
      },
      {
        path: 'hop-dong',
        component: HopdongComponent,
        canActivate: [RoleGuard],
        data: {
          roles: [
            [RoleCV.Giamdoc],
            [RolePB.Taichinhvaquanly, RoleBP.Nhansu],
            [RolePB.Taichinhvaquanly, RoleCV.Truongphong],
          ],
        },
      },
      {
        path: 'trinh-do',
        component: TrinhdoComponent,
        canActivate: [RoleGuard],
        data: {
          roles: [
            [RoleCV.Giamdoc],
            [RolePB.Taichinhvaquanly, RoleBP.Nhansu],
            [RolePB.Taichinhvaquanly, RoleCV.Truongphong],
          ],
        },
      },
    ]),
  ],
})
export class ManageModule {}
