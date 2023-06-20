import { Component, Injector, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from 'src/app/core/authentication/authentication.service';
import { BaseComponent } from 'src/app/core/common/base-component';
import { ApiService } from 'src/app/core/services/api.service';
import MatchValidation from 'src/app/core/helpers/must-match.validator';
import { User } from 'src/app/entities/user';
import { SweetAlertService } from 'src/app/core/services/SweetAlert.service';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import Swal from 'sweetalert2';

declare var $: any;
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent extends BaseComponent implements OnInit {
  public user: User;
  public frmDoimatkhau: any;
  public showUpdateModal: boolean;
  public doneSetupForm: boolean;
  public isCreate: boolean;
  public taikhoan: any;
  public maNhanVien: number;
  public bangcong: any;
  public lscongtac: any;
  public phongban: any;
  public bophan: any;
  public chucvu: any;
  error: any;
  loading: boolean;

  constructor(
    injector: Injector,
    private authenticationService: AuthenticationService,
    private sweetAlertService: SweetAlertService,
    private apiService: ApiService
  ) {
    super(injector);
  }

  ngOnInit() {
    this.user = this.authenticationService.userValue;
    this.maNhanVien = this.user.maNhanVien;
    this.LScongtac();
    this.LoadData(this.pageSize);
  }
  public LScongtac() {
    this._api
      .get('/api/nhanvien/get-LScongtac/' + this.maNhanVien)
      .subscribe((data) => {
        this.lscongtac = data;
        this.nhanvien = data.nhanvien;
        this.phongban = data.phongban.value.phongban;
        this.bophan = data.bophan.value.bophan;
        this.chucvu = data.chucvu.value.chucvu;
        setTimeout(() => {
          this.loadScripts('/assets/ckeditor/ckeditor.js');
        });
      });
  }
  public LoadPage(page: any) {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();
    this._api
      .post('/api/bangcong/bangcongcn', {
        manhanvien: this.maNhanVien,
        thang: currentMonth,
        nam: currentYear,
        page: page,
        pageSize: this.pageSize,
        totalItem: this.totalItem,
      })
      .subscribe((res) => {
        this.bangcong = res.data;
        this.pageSize = res.pageSize;
        this.page = res.page;
        this.totalItem = res.totalItem;
        console.log(res);
        setTimeout(() => {
          this.loadScripts('/assets/ckeditor/ckeditor.js');
        });
      });
  }
  public LoadData(pageSize: any) {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();
    this._api
      .post('/api/bangcong/bangcongcn', {
        manhanvien: this.maNhanVien,
        thang: currentMonth,
        nam: currentYear,
        page: 1,
        pageSize: pageSize,
        totalItem: this.totalItem,
      })
      .subscribe((res) => {
        this.bangcong = res.data;
        this.pageSize = res.pageSize;
        this.page = res.page;
        this.totalItem = res.totalItem;
        console.log(res);
        setTimeout(() => {
          this.loadScripts('/assets/ckeditor/ckeditor.js');
        });
      });
  }

  public chamCongVao() {
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
      this.sweetAlertService.showWarningAlert(
        'Cảnh báo',
        'Không thể chấm công vào ngày nghỉ.'
      );
      return;
    } else {
      // Kiểm tra giờ chấm công vào
      const startOfWorkingHours = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate(),
        8,
        0,
        0
      ).getTime();

      const attendanceData = {
        GioVao: currentDate.toISOString(),
        MaNhanVien: this.maNhanVien,
        TrangThaiVao: null,
      };

      if (currentTime > startOfWorkingHours) {
        return this._api
          .post('/api/bangcong/cham-cong-vao', attendanceData)
          .pipe(
            catchError((error) => {
              console.log(error);
              let errorMessage = 'Đã xảy ra lỗi khi chấm công vào.';

              // Kiểm tra nếu là lỗi đã đăng ký nghỉ hoặc không thể chấm công trong ngày nghỉ
              if (error.status === 400) {
                errorMessage = error.error;
              }
              Swal.fire('Lỗi', errorMessage, 'error');
              return throwError(error);
            })
          )
          .subscribe(() => {
            console.log(attendanceData);
            console.log('Bạn đã bắt đầu công việc muộn hơn giờ quy định');
            this.sweetAlertService.showWarningAlert(
              'Cảnh báo',
              'Bạn đã bắt đầu công việc muộn hơn giờ quy định.'
            );
            this.LoadData(this.pageSize);
          });
      }

      // Gọi API để lưu dữ liệu chấm công

      return this._api
        .post('/api/bangcong/cham-cong-vao', attendanceData)
        .pipe(
          catchError((error) => {
            console.log(error);

            // Kiểm tra nếu là lỗi đã đăng ký nghỉ hoặc không thể chấm công trong ngày nghỉ
            let errorMessage = 'Đã xảy ra lỗi khi chấm công vào.';
            if (error.status === 400) {
              errorMessage = error.error;
            }
            Swal.fire('Lỗi', errorMessage, 'error');
            return throwError(error);
          })
        )
        .subscribe(() => {
          console.log(attendanceData);
          console.log('Chấm công vào thành công');
          this.sweetAlertService.showSuccessAlert(
            'Thành công',
            'Chấm công vào thành công!'
          );
          this.LoadData(this.pageSize);
        });
    }
  }

  public chamCongRa() {
    const currentDate = new Date();
    const currentTime = currentDate.getTime();
    this.user = this.authenticationService.userValue;
    this._api
      .get('/api/Bangcong/get-by-nhanvien/' + this.maNhanVien)
      .subscribe((res) => {
        this.bangcong = res.bangcong;
        console.log(this.bangcong);
      });
    // Kiểm tra ngày nghỉ (thứ 7, chủ nhật, ngày lễ)
    if (
      currentDate.getDay() === 0 ||
      currentDate.getDay() === 6 ||
      this.isHoliday(currentDate)
    ) {
      console.log('Không thể chấm công vào ngày nghỉ');
      this.sweetAlertService.showWarningAlert(
        'Cảnh báo',
        'Không thể chấm công vào ngày nghỉ.'
      );
      return;
    } else {
      // Kiểm tra giờ chấm công ra
      const endOfWorkingHours = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate(),
        17,
        0,
        0
      ).getTime();

      const attendanceData = {
        MaNhanVien: this.maNhanVien,
        GioRa: currentDate.toISOString(),
        TrangThaiRa: null,
      };

      if (currentTime < endOfWorkingHours) {
        return this._api
          .post('/api/bangcong/cham-cong-ra', attendanceData)
          .pipe(
            catchError((error) => {
              console.log(error);
              let errorMessage = 'Đã xảy ra lỗi khi chấm công ra.';

              // Kiểm tra nếu là lỗi đã đăng ký nghỉ hoặc không thể chấm công trong ngày nghỉ
              if (error.status === 400) {
                errorMessage = error.error;
              }
              Swal.fire('Lỗi', errorMessage, 'error');
              return throwError(error);
            })
          )
          .subscribe(() => {
            console.log('Bạn đã kết thúc công việc sớm hơn giờ quy định');
            this.sweetAlertService.showWarningAlert(
              'Cảnh báo',
              'Bạn đã kết thúc công việc sớm hơn giờ quy định.'
            );
            this.LoadData(this.pageSize);
          });
      }

      // Gọi API để lưu dữ liệu chấm công

      return this._api
        .post('/api/bangcong/cham-cong-ra', attendanceData)
        .pipe(
          catchError((error) => {
            console.log(error);
            let errorMessage = 'Đã xảy ra lỗi khi chấm công ra.';

            // Kiểm tra nếu là lỗi đã đăng ký nghỉ hoặc không thể chấm công trong ngày nghỉ
            if (error.status === 400) {
              errorMessage = error.error;
            }
            Swal.fire('Lỗi', errorMessage, 'error');
            return throwError(error);
          })
        )
        .subscribe(() => {
          console.log('Chấm công ra thành công');
          console.log(attendanceData);
          this.sweetAlertService.showSuccessAlert(
            'Thành công',
            'Chấm công ra thành công!'
          );
          this.LoadData(this.pageSize);
        });
    }
  }

  public isHoliday(date: Date): boolean {
    // Kiểm tra xem ngày có phải là ngày lễ không
    const holidays = ['01-01', '30-04', '01-05', '02-09', '03-09']; // Các ngày lễ Việt Nam
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const formattedDate = `${day < 10 ? '0' + day : day}-${
      month < 10 ? '0' + month : month
    }`;

    return holidays.includes(formattedDate);
  }
  get email() {
    return this.frmDoimatkhau.get('txt_email')!;
  }
  get oldpassword() {
    return this.frmDoimatkhau.get('txt_oldpassword')!;
  }
  get password() {
    return this.frmDoimatkhau.get('txt_password')!;
  }
  get repassword() {
    return this.frmDoimatkhau.get('txt_repassword')!;
  }

  public openUpdateModal(maNhanVien: any) {
    this.showUpdateModal = true;
    this.doneSetupForm = false;
    this.isCreate = false;
    setTimeout(() => {
      $('#modelId').modal('toggle');
      this._api
        .get('/api/taikhoan/get-by-id/' + maNhanVien)
        .subscribe((res) => {
          this.taikhoan = res.taikhoan;
          this.frmDoimatkhau = new FormGroup(
            {
              txt_email: new FormControl(this.taikhoan.email, []),
              txt_oldpassword: new FormControl('', [
                this.oldpwdCheck,
                Validators.required,
              ]),
              txt_password: new FormControl('', [this.pwdCheckValidator]),
              txt_repassword: new FormControl('', [Validators.required]),
            },
            {
              validators: [
                MatchValidation.match('txt_password', 'txt_repassword'),
              ],
            }
          );
          this.doneSetupForm = true;
        });
    });
  }

  public closeModal() {
    $('#modelId').closest('.modal').modal('hide');
  }
  public pwdCheckValidator(control: any) {
    var filteredStrings = { search: control.value, select: '@#!$%&*.' };
    var result = (
      filteredStrings.select.match(
        new RegExp('[' + filteredStrings.search + ']', 'g')
      ) || []
    ).join('');
    if (control.value.length < 8 || !result) {
      return { password: true };
    } else {
      return null;
    }
  }

  public oldpwdCheck = (control: any) => {
    var oldpassword = this.taikhoan.password;
    if (control.value != oldpassword) {
      return { samepassword: true };
    } else {
      return null;
    }
  };

  ngAfterViewInit() {
    this.loadScripts('/assets/ckeditor/ckeditor.js');
  }

  public findInvalidControls() {
    const invalid = [];
    const controls = this.frmDoimatkhau.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    return invalid;
  }

  OnSubmit(vl: any) {
    console.log(this.findInvalidControls());
    if (this.frmDoimatkhau.invalid) {
      return;
    }
    let obj: any = {};
    obj.taikhoan = {
      Email: vl.txt_email,
      Password: vl.txt_password,
    };

    obj.taikhoan.MaNhanVien = this.taikhoan.maNhanVien;

    this._api.post('/api/taikhoan/update-taikhoan', obj).pipe(
      catchError((error) => {
        this.error = error;
        this.loading = false;
        console.log(error);

        let errorMessage = 'Đã xảy ra lỗi.';
        if (error.status === 400) {
          errorMessage = error.error;
        }
        Swal.fire('Lỗi', errorMessage, 'error');
        return throwError(error);
      })
    ).subscribe((res) => {
      if (res && res.data) {
        this.sweetAlertService.showSuccessAlert(
          'Thành công',
          'Thay đổi thông tin đăng nhập thành công!'
        );
        this.closeModal();
      }
    });
  }
}
