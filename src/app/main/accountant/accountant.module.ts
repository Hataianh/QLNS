import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { BaohiemComponent } from './baohiem/baohiem.component';
import { UngluongComponent } from './ungluong/ungluong.component';
import { PhucapComponent } from './phucap/phucap.component';
import { KhenthuongkyluatComponent } from './khenthuongkyluat/khenthuongkyluat.component';
import { BangluongComponent } from './bangluong/bangluong.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { LuongComponent } from './luong/luong.component';
@NgModule({
  declarations: [
    BaohiemComponent,
    KhenthuongkyluatComponent,
    PhucapComponent,
    UngluongComponent,
    BangluongComponent,
    LuongComponent,
  ],
  imports: [
    NgSelectModule,
    NgbModule,
    ReactiveFormsModule,
    CommonModule,
    SharedModule,
    FormsModule,
    PaginationModule,
    PaginationModule,
    NgMultiSelectDropDownModule,
    RouterModule.forChild([
      { path: 'bao-hiem', component: BaohiemComponent },
      { path: 'ung-luong', component: UngluongComponent },
      { path: 'phu-cap', component: PhucapComponent },
      { path: 'khenthuong-kyluat', component: KhenthuongkyluatComponent },
      { path: 'bang-luong', component: BangluongComponent },
      { path: 'luong', component: LuongComponent },
    ]),
  ],
})
export class AccountantModule {}
