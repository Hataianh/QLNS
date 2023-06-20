import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AfterViewInit, Component, Injector, OnInit } from '@angular/core';
import { BaseComponent } from '../../../core/common/base-component';
import { SweetAlertService } from 'src/app/core/services/SweetAlert.service';
import Swal from 'sweetalert2';
import { catchError, throwError } from 'rxjs';
declare var $: any;
@Component({
  selector: 'app-loaihopdong',
  templateUrl: './loaihopdong.component.html',
  styleUrls: ['./loaihopdong.component.css'],
})
export class LoaihopdongComponent
  extends BaseComponent
  implements OnInit, AfterViewInit
{
  public list_loaihopdongs: any;
  public isCreate = false;
  public loading = false;
  public error = '';
  public loaihopdong: any;
  public frmLoaihopdong: FormGroup;
  public frmSearch: FormGroup;
  public showUpdateModal: any;
  public doneSetupForm: any;
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
  }
  public LoadPage(page: any) {
    this._api
      .post('/api/loaihopdong/loadData', {
        page: page,
        pageSize: this.pageSize,
        totalItem: this.totalItem,
      })
      .subscribe((res) => {
        this.list_loaihopdongs = res.data;
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
      .post('/api/loaihopdong/loadData', {
        page: 1,
        pageSize: pageSize,
        totalItem: this.totalItem,
      })
      .subscribe((res) => {
        this.list_loaihopdongs = res.data;
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
      .post('/api/loaihopdong/search', {
        page: this.page,
        pageSize: this.pageSize,
        totalItem: this.totalItem,
        tenloaihopdong: this.frmSearch.value['txt_search'],
      })
      .subscribe((res) => {
        this.list_loaihopdongs = res.data;
        this.pageSize = res.pageSize;
        this.page = res.page;
        this.totalItem = res.totalItem;
        console.log(res);
        setTimeout(() => {
          this.loadScripts('/assets/ckeditor/ckeditor.js');
        });
      });
  }

  get tenloaihopdong() {
    return this.frmLoaihopdong.get('txt_tenloaihopdong')!;
  }
  get mauhopdong() {
    return this.frmLoaihopdong.get('txt_mauhopdong')!;
  }
  public createModal() {
    this.showUpdateModal = true;
    this.isCreate = true;
    setTimeout(() => {
      $('#modelId').modal('toggle');
      this.frmLoaihopdong = new FormGroup({
        txt_tenloaihopdong: new FormControl('', [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(250),
        ]),
        txt_mauhopdong: new FormControl('', []),
      });
      this.doneSetupForm = true;
    });
  }

  public openUpdateModal(maLoaiHopDong: any) {
    this.showUpdateModal = true;
    this.doneSetupForm = false;
    this.isCreate = false;
    setTimeout(() => {
      $('#modelId').modal('toggle');
      this._api
        .get('/api/loaihopdong/get-by-id/' + maLoaiHopDong)
        .subscribe((res) => {
          this.loaihopdong = res.loaihopdong;
          console.log(res);
          this.frmLoaihopdong = new FormGroup({
            txt_tenloaihopdong: new FormControl(
              this.loaihopdong.tenLoaiHopDong,
              [
                Validators.required,
                Validators.minLength(3),
                Validators.maxLength(250),
              ]
            ),
            txt_mauhopdong: new FormControl(this.loaihopdong.mauHopDong, []),
          });
          this.doneSetupForm = true;
        });
    });
  }

  public onRemove(MaLoaiHopDong: any) {
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
          .delete('/api/loaihopdong/delete-loaihopdong', MaLoaiHopDong)
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
    const controls = this.frmLoaihopdong.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    return invalid;
  }

  OnSubmit(vl: any) {
    console.log(this.findInvalidControls());
    if (this.frmLoaihopdong.invalid) {
      return;
    }
    let obj: any = {};
    obj.loaihopdong = {
      TenLoaiHopDong: vl.txt_tenloaihopdong,
      MauHopDong: vl.txt_mauhopdong,
    };
    if (this.isCreate) {
      this._api
        .post('/api/loaihopdong/create-loaihopdong', obj)
        .pipe(
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
      obj.loaihopdong.MaLoaiHopDong = this.loaihopdong.maLoaiHopDong;

      this._api
        .post('/api/loaihopdong/update-loaihopdong', obj)
        .pipe(
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
