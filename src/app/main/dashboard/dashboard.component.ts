import { AfterViewInit, Component, Injector, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/core/authentication/authentication.service';
import { BaseComponent } from 'src/app/core/common/base-component';
import { SweetAlertService } from 'src/app/core/services/SweetAlert.service';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent
  extends BaseComponent
  implements OnInit, AfterViewInit
{
  public user: any;
  public list_nhanviens: any[];
  public dnv: number;
  public dlv: number;
  public date: Date;
  public today: string;
  public list_phongbans: any[];
  tongPb: any;
  constructor(
    injector: Injector,
    private authenticationService: AuthenticationService,
    private sweetAlertService: SweetAlertService
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.user = this.authenticationService.userValue;
    this._api.get('/api/nhanvien/get-nhanvien').subscribe((res: any[]) => {
      this.list_nhanviens = res;
      console.log(res);
      this.tongNv = res.length; // Lấy tổng số bản ghi
      console.log(this.tongNv);

      // Đếm số lượng từng giá trị trangthai
      this.dnv = res.filter((item) => item.trangThai === 0).length;
      this.dlv = res.filter((item) => item.trangThai === 1).length;

      console.log('Số lượng nhân viên đã nghỉ việc:', this.dnv);
      console.log('Số lượng nhân viên đang làm việc:', this.dlv);
    });
    this.date = new Date();
    console.log(this.date);
    this.today = this.date.toLocaleDateString('en-GB'); // 'en-GB' đại diện cho định dạng "dd/MM/yyyy"

    console.log(this.today); // Kết quả: 11/05/2023 (theo định dạng "dd/MM/yyyy")
    this._api.get('/api/phongban/get-phongban').subscribe((res: any[]) => {
      this.list_phongbans = res;
      console.log(res);
      this.tongPb = res.length; // Lấy tổng số bản ghi
      console.log(this.tongPb);
    });
  }

  ngAfterViewInit() {
    this.loadScripts('assets/js/dashboard/dashboard-1.js');
  }
}
