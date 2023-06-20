import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AfterViewInit, Component, Injector, OnInit } from '@angular/core';
import { BaseComponent } from '../../../core/common/base-component';
import { SweetAlertService } from 'src/app/core/services/SweetAlert.service';
import Swal from 'sweetalert2';
import { catchError, throwError } from 'rxjs';
declare var $: any;
@Component({
  selector: 'app-hopdong',
  templateUrl: './hopdong.component.html',
  styleUrls: ['./hopdong.component.css'],
})
export class HopdongComponent
  extends BaseComponent
  implements OnInit, AfterViewInit
{
  public list_hopdongs: any;
  public isCreate = false;
  public loading = false;
  public error = '';
  public hopdong: any;
  public frmHopdong: FormGroup;
  public frmSearch: FormGroup;
  public showUpdateModal: any;
  public doneSetupForm: any;
  public maLoaiHopDong: any;
  public list_loaihopdongs: any;
  maNhanVien: any;
  public years: string[] = [];
  public months: { value: string; label: string }[] = [];
  thang: any;
  nam: any;
  constructor(
    injector: Injector,
    private sweetAlertService: SweetAlertService
  ) {
    super(injector);
    this.frmSearch = new FormGroup({
      txt_search: new FormControl('', []),
    });
  }

  ngOnInit(): void {
    this.LoadData(this.pageSize);
    this._api.get('/api/loaihopdong/get-loaihopdong').subscribe((res) => {
      this.list_loaihopdongs = res;
      console.log(res);
    });
    this.loadNhanVienList();
    this.thang = localStorage.getItem('thang') || '';
    this.nam = localStorage.getItem('nam') || '';
    const currentYear = new Date().getFullYear();
    for (let i = currentYear; i >= currentYear - 5; i--) {
      this.years.push(i.toString());
    }
    for (let i = 12; i >= 1; i--) {
      this.months.push({ value: i.toString(), label: 'Tháng ' + i });
    }
  }
  setThang(thang: any) {
    this.thang = thang;
    localStorage.setItem('thang', thang);
    this.LoadData(this.pageSize);
  }
  setNam(nam: any) {
    this.nam = nam;
    localStorage.setItem('nam', nam);
    this.LoadData(this.pageSize);
  }
  public LoadPage(page: any) {
    this._api
      .post('/api/hopdong/loadData', {
        thang: this.thang,
        nam: this.nam,
        page: page,
        pageSize: this.pageSize,
        totalItem: this.totalItem,
      })
      .subscribe((res) => {
        this.list_hopdongs = res.data;
        this.pageSize = res.pageSize;
        this.page = res.page;
        this.totalItem = res.totalItem;
        setTimeout(() => {
          this.loadScripts('/assets/ckeditor/ckeditor.js');
        });
      });
  }

  public LoadData(pageSize: any) {
    this._api
      .post('/api/hopdong/loadData', {
        thang: this.thang,
        nam: this.nam,
        page: 1,
        pageSize: pageSize,
        totalItem: this.totalItem,
      })
      .subscribe((res) => {
        this.list_hopdongs = res.data;
        this.pageSize = res.pageSize;
        this.page = res.page;
        this.totalItem = res.totalItem;
        console.log(res);
        setTimeout(() => {
          this.loadScripts('/assets/ckeditor/ckeditor.js');
        });
      });
  }
  public loadData() {
    this._api
      .post('/api/hopdong/search', {
        page: this.page,
        pageSize: this.pageSize,
        totalItem: this.totalItem,
        hoten: this.frmSearch.value['txt_search'],
        thang: localStorage.getItem('thang') || '',
        nam: localStorage.getItem('nam') || '',
      })
      .subscribe((res) => {
        this.list_hopdongs = res.data;
        this.pageSize = res.pageSize;
        this.page = res.page;
        this.totalItem = res.totalItem;
        console.log(res);
        setTimeout(() => {
          this.loadScripts('/assets/ckeditor/ckeditor.js');
        });
      });
  }

  get maloaihopdong() {
    return this.frmHopdong.get('txt_maloaihopdong')!;
  }
  get manhanvien() {
    return this.frmHopdong.get('txt_manhanvien')!;
  }
  get ngayky() {
    return this.frmHopdong.get('txt_ngayky')!;
  }
  get noidung() {
    return this.frmHopdong.get('txt_noidung')!;
  }
  get lanky() {
    return this.frmHopdong.get('txt_lanky')!;
  }
  public createModal() {
    this.showUpdateModal = true;
    this.isCreate = true;
    setTimeout(() => {
      $('#modelId').modal('toggle');
      this.frmHopdong = new FormGroup({
        txt_maloaihopdong: new FormControl('', [Validators.required]),
        txt_manhanvien: new FormControl('', [Validators.required]),
        txt_ngayky: new FormControl('', []),
        txt_noidung: new FormControl('', [Validators.required]),
        txt_lanky: new FormControl('', [Validators.required]),
      });
      this.doneSetupForm = true;
    });
  }

  public openUpdateModal(maHopDong: any) {
    this.showUpdateModal = true;
    this.doneSetupForm = false;
    this.isCreate = false;
    setTimeout(() => {
      $('#modelId').modal('toggle');
      this._api.get('/api/hopdong/get-by-id/' + maHopDong).subscribe((res) => {
        this.hopdong = res.hopdong;
        console.log(res);
        this.frmHopdong = new FormGroup({
          txt_maloaihopdong: new FormControl(this.hopdong.maLoaiHopDong, [
            Validators.required,
          ]),
          txt_manhanvien: new FormControl(this.hopdong.maNhanVien, [
            Validators.required,
          ]),

          txt_ngayky: new FormControl(this.hopdong.ngayKy, []),
          txt_noidung: new FormControl(this.hopdong.noiDung, [
            Validators.required,
          ]),
          txt_lanky: new FormControl(this.hopdong.lanKy, [Validators.required]),
        });
        this.doneSetupForm = true;
        this.maLoaiHopDong = this.hopdong.maLoaiHopDong;
        this.maNhanVien = this.hopdong.maNhanVien;
        this.frmHopdong
          .get('txt_ngayky')
          ?.patchValue(this.formatDate(new Date(this.hopdong.ngayKy)));
      });
    });
  }

  public onRemove(MaHopDong: any) {
    Swal.fire({
      title: 'Xác nhận',
      text: 'Bạn có chắc chắn muốn xóa?',
      icon: 'question',
      showCancelButton: true,
      cancelButtonText: 'Hủy',
      confirmButtonText: 'Xóa',
    }).then((result) => {
      if (result.isConfirmed) {
        // Người dùng xác nhận xóa
        this._api
          .delete('/api/hopdong/delete-hopdong', MaHopDong)
          .subscribe((res) => {
            // Xử lý kết quả xóa thành công
            this.LoadData(this.pageSize);
          });
      }
    });
  }
  public closeModal() {
    $('#modelId').closest('.modal').modal('hide');
  }

  ngAfterViewInit() {
    this.loadScripts('/assets/ckeditor/ckeditor.js');
  }

  public findInvalidControls() {
    const invalid = [];
    const controls = this.frmHopdong.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    return invalid;
  }

  OnSubmit(vl: any) {
    console.log(this.findInvalidControls());
    if (this.frmHopdong.invalid) {
      return;
    }
    let obj: any = {};
    obj.hopdong = {
      MaLoaiHopDong: vl.txt_maloaihopdong,
      MaNhanVien: this.selectedNhanVien[0].maNhanVien,
      NgayKy: vl.txt_ngayky,
      NoiDung: vl.txt_noidung,
      LanKy: vl.txt_lanky,
    };
    if (this.isCreate) {
      this._api.post('/api/hopdong/create-hopdong', obj).pipe(
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
            'Thêm dữ liệu thành công!'
          );
          this.LoadData(this.pageSize);
          this.closeModal();
        }
      });
    } else {
      obj.hopdong.MaHopDong = this.hopdong.maHopDong;

      this._api.post('/api/hopdong/update-hopdong', obj).pipe(
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
            'Cập nhật dữ liệu thành công!'
          );
          this.LoadData(this.pageSize);
          this.closeModal();
        }
      });
    }
  }
}
