import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AuthenticationService } from '../authentication/authentication.service';
import { ApiService } from './api.service';
import { User } from '../../entities/user';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChamcongService {
  public host = environment.BASE_API;

  user: User;
  constructor(
    private _http: HttpClient,
    public _api: ApiService,
    public router: Router,
    private authenticationService: AuthenticationService
  ) {}

  chamCongVao(): Observable<any> {
    const currentDate = new Date();
    const currentTime = currentDate.getTime();
    this.user = this.authenticationService.userValue;
    // Kiểm tra ngày nghỉ (thứ 7, chủ nhật, ngày lễ)
    if (
      currentDate.getDay() === 0 ||
      currentDate.getDay() === 6 ||
      this.isHoliday(currentDate)
    ) {
      console.log('Không thể chấm công vào ngày nghỉ');
    }

    // Kiểm tra giờ chấm công vào
    const startOfWorkingHours = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate(),
      8,
      0,
      0
    ).getTime();

    if (currentTime > startOfWorkingHours) {
      console.log('Bạn đã bắt đầu công việc muộn hơn giờ quy định');
      TrangThai: 'Đi muộn';
    }

    // Gọi API để lưu dữ liệu chấm công
    const attendanceData = {
      GioVao: currentDate.toISOString(),
      MaNhanVien: this.user.maNhanVien,
      TrangThai: '',
    };

    return this._api.post('/api/bangcong/cham-cong-vao', attendanceData);
  }
  chamCongRa(): Observable<any> {
    const currentDate = new Date();
    const currentTime = currentDate.getTime();
    this.user = this.authenticationService.userValue;
    // Kiểm tra ngày nghỉ (thứ 7, chủ nhật, ngày lễ)
    if (
      currentDate.getDay() === 0 ||
      currentDate.getDay() === 6 ||
      this.isHoliday(currentDate)
    ) {
      console.log('Không thể chấm công vào ngày nghỉ');
    }

    // Kiểm tra giờ chấm công ra
    const endOfWorkingHours = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate(),
      17,
      0,
      0
    ).getTime();
    if (currentTime < endOfWorkingHours) {
      console.log('Bạn đã kết thúc công việc sớm hơn giờ quy định');
      // Xử lý khi chưa đến giờ chấm công ra
    }

    // Gọi API để lưu dữ liệu chấm công
    const attendanceData: { GioRa?: string; MaNhanVien: number } = {
      MaNhanVien: this.user.maNhanVien,
    };
    if (currentTime >= endOfWorkingHours) {
      attendanceData.GioRa = currentDate.toISOString();
    }
    return this._api.post('/api/bangcong/cham-cong-ra', attendanceData);
  }

  private isHoliday(date: Date): boolean {
    // Kiểm tra xem ngày có phải là ngày lễ không
    const holidays = ['01-01', '30-04', '01-05', '02-09', '03-09']; // Các ngày lễ Việt Nam
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const formattedDate = `${day < 10 ? '0' + day : day}-${
      month < 10 ? '0' + month : month
    }`;

    return holidays.includes(formattedDate);
  }
}
