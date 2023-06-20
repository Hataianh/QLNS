import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AfterViewInit, Component, Injector, OnInit } from '@angular/core';
import { BaseComponent } from '../../../core/common/base-component';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { SweetAlertService } from 'src/app/core/services/SweetAlert.service';
import Swal from 'sweetalert2';
import { catchError, throwError } from 'rxjs';
declare var $: any;
@Component({
  selector: 'app-ungluong',
  templateUrl: './ungluong.component.html',
  styleUrls: ['./ungluong.component.css'],
})
export class UngluongComponent
  extends BaseComponent
  implements OnInit, AfterViewInit
{
  public list_ungluongs: any;
  public isCreate = false;
  public loading = false;
  public error = '';
  public ungluong: any;
  public frmUngluong: FormGroup;
  public frmSearch: FormGroup;
  public showUpdateModal: any;
  public doneSetupForm: any;
  public maNhanVien: any;
  public list_nhanviens: any;
  public trangThai: any;
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
      .post('/api/ungluong/search', {
        thang: this.thang,
        nam: this.nam,
        page: page,
        pageSize: this.pageSize,
        totalItem: this.totalItem,
      })
      .subscribe((res) => {
        this.list_ungluongs = res.data;
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
      .post('/api/ungluong/loadData', {
        thang: this.thang,
        nam: this.nam,
        page: 1,
        pageSize: pageSize,
        totalItem: this.totalItem,
      })
      .subscribe((res) => {
        this.list_ungluongs = res.data;
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
      .post('/api/ungluong/search', {
        page: this.page,
        pageSize: this.pageSize,
        totalItem: this.totalItem,
        hoten: this.frmSearch.value['txt_search'],
        thang: localStorage.getItem('thang') || '',
        nam: localStorage.getItem('nam') || '',
      })
      .subscribe((res) => {
        this.list_ungluongs = res.data;
        this.pageSize = res.pageSize;
        this.page = res.page;
        this.totalItem = res.totalItem;
        console.log(res);
        setTimeout(() => {
          this.loadScripts('/assets/ckeditor/ckeditor.js');
        });
      });
  }

  get manhanvien() {
    return this.frmUngluong.get('txt_manhanvien')!;
  }
  get noidung() {
    return this.frmUngluong.get('txt_noidung')!;
  }
  get ngay() {
    return this.frmUngluong.get('txt_ngay')!;
  }
  get trangthai() {
    return this.frmUngluong.get('txt_trangthai')!;
  }
  get sotien() {
    return this.frmUngluong.get('txt_sotien')!;
  }
  public createModal() {
    this.showUpdateModal = true;
    this.isCreate = true;
    setTimeout(() => {
      $('#modelId').modal('toggle');
      this.frmUngluong = new FormGroup({
        txt_manhanvien: new FormControl('', [Validators.required]),
        txt_noidung: new FormControl('', []),
        txt_ngay: new FormControl('', [Validators.required]),
        txt_trangthai: new FormControl('', [Validators.required]),
        txt_sotien: new FormControl('', [Validators.required]),
      });
      this.doneSetupForm = true;
    });
  }

  public openUpdateModal(id: any) {
    this.showUpdateModal = true;
    this.doneSetupForm = false;
    this.isCreate = false;
    setTimeout(() => {
      $('#modelId').modal('toggle');
      this._api.get('/api/ungluong/get-by-id/' + id).subscribe((res) => {
        this.ungluong = res.ungluong;
        console.log(res);
        this.frmUngluong = new FormGroup({
          txt_manhanvien: new FormControl(this.ungluong.maNhanVien, [
            Validators.required,
          ]),
          txt_noidung: new FormControl(this.ungluong.noiDung, []),
          txt_ngay: new FormControl(this.ungluong.ngay, [Validators.required]),
          txt_trangthai: new FormControl(this.ungluong.trangThai, [
            Validators.required,
          ]),
          txt_sotien: new FormControl(this.ungluong.soTien, [
            Validators.required,
          ]),
        });
        this.doneSetupForm = true;
        this.maNhanVien = this.ungluong.maNhanVien;
        this.trangThai = this.ungluong.trangThai;
        this.frmUngluong
          .get('txt_ngay')
          ?.patchValue(this.formatDate(new Date(this.ungluong.ngay)));
      });
    });
  }

  public onRemove(Id: any) {
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
          .delete('/api/ungluong/delete-ungluong', Id)
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
    const controls = this.frmUngluong.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    return invalid;
  }

  OnSubmit(vl: any) {
    console.log(this.findInvalidControls());
    if (this.frmUngluong.invalid) {
      return;
    }
    let obj: any = {};
    obj.ungluong = {
      MaNhanVien: this.selectedNhanVien[0].maNhanVien,
      NoiDung: vl.txt_noidung,
      Ngay: vl.txt_ngay,
      TrangThai: vl.txt_trangthai,
      SoTien: vl.txt_sotien,
    };
    if (this.isCreate) {
      this._api.post('/api/ungluong/create-ungluong', obj).pipe(
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
      obj.ungluong.Id = this.ungluong.id;

      this._api.post('/api/ungluong/update-ungluong', obj).pipe(
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
