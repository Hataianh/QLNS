import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AfterViewInit, Component, Injector, OnInit } from '@angular/core';
import { BaseComponent } from '../../../core/common/base-component';
import { SweetAlertService } from 'src/app/core/services/SweetAlert.service';
import Swal from 'sweetalert2';
import { AuthenticationService } from 'src/app/core/authentication/authentication.service';
import { catchError, throwError } from 'rxjs';
declare var $: any;
@Component({
  selector: 'app-chucvu',
  templateUrl: './chucvu.component.html',
  styleUrls: ['./chucvu.component.css'],
})
export class ChucvuComponent
  extends BaseComponent
  implements OnInit, AfterViewInit
{
  public list_chucvus: any;
  public isCreate = false;
  public loading = false;
  public error = '';
  public chucvu: any;
  public frmChucvu: FormGroup;
  public frmSearch: FormGroup;
  public showUpdateModal: any;
  public doneSetupForm: any;
  public user: any;
  constructor(
    injector: Injector,
    private sweetAlertService: SweetAlertService,
    private authenticationService: AuthenticationService
  ) {
    super(injector);
    this.frmSearch = new FormGroup({
      txt_search: new FormControl('', []),
    });
  }

  ngOnInit(): void {
    this.user = this.authenticationService.userValue;
    this.LoadData(this.pageSize);
  }
  public LoadPage(page: any) {
    this._api
      .post('/api/chucvu/loadData', {
        page: page,
        pageSize: this.pageSize,
        totalItem: this.totalItem,
      })
      .subscribe((res) => {
        this.list_chucvus = res.data;
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
      .post('/api/chucvu/loadData', {
        page: 1,
        pageSize: pageSize,
        totalItem: this.totalItem,
      })
      .subscribe((res) => {
        this.list_chucvus = res.data;
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
      .post('/api/chucvu/search', {
        page: this.page,
        pageSize: this.pageSize,
        totalItem: this.totalItem,
        tenchucvu: this.frmSearch.value['txt_search'],
      })
      .subscribe((res) => {
        this.list_chucvus = res.data;
        this.pageSize = res.pageSize;
        this.page = res.page;
        this.totalItem = res.totalItem;
        console.log(res);
        setTimeout(() => {
          this.loadScripts('/assets/ckeditor/ckeditor.js');
        });
      });
  }

  get tenchucvu() {
    return this.frmChucvu.get('txt_tenchucvu')!;
  }
  public createModal() {
    this.showUpdateModal = true;
    this.isCreate = true;
    setTimeout(() => {
      $('#modelId').modal('toggle');
      this.frmChucvu = new FormGroup({
        txt_tenchucvu: new FormControl('', [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(250),
        ]),
      });
      this.doneSetupForm = true;
    });
  }

  public openUpdateModal(maChucVu: any) {
    this.showUpdateModal = true;
    this.doneSetupForm = false;
    this.isCreate = false;
    setTimeout(() => {
      $('#modelId').modal('toggle');
      this._api.get('/api/chucvu/get-by-id/' + maChucVu).subscribe((res) => {
        this.chucvu = res.chucvu;
        console.log(res);
        this.frmChucvu = new FormGroup({
          txt_tenchucvu: new FormControl(this.chucvu.tenChucVu, [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(250),
          ]),
        });
        this.doneSetupForm = true;
      });
    });
  }

  public onRemove(MaChucVu: any) {
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
          .delete('/api/chucvu/delete-chucvu', MaChucVu)
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
    const controls = this.frmChucvu.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    return invalid;
  }

  OnSubmit(vl: any) {
    console.log(this.findInvalidControls());
    if (this.frmChucvu.invalid) {
      return;
    }
    let obj: any = {};
    obj.chucvu = {
      TenChucVu: vl.txt_tenchucvu,
    };
    if (this.isCreate) {
      this._api.post('/api/chucvu/create-chucvu', obj).pipe(
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
      obj.chucvu.MaChucVu = this.chucvu.maChucVu;

      this._api.post('/api/chucvu/update-chucvu', obj).pipe(
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
