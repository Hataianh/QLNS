import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AfterViewInit, Component, Injector, OnInit } from '@angular/core';
import { BaseComponent } from '../../../core/common/base-component';
import { SweetAlertService } from 'src/app/core/services/SweetAlert.service';
import Swal from 'sweetalert2';
import { AuthenticationService } from 'src/app/core/authentication/authentication.service';
import { catchError, throwError } from 'rxjs';
declare var $: any;
@Component({
  selector: 'app-bophan',
  templateUrl: './bophan.component.html',
  styleUrls: ['./bophan.component.css'],
})
export class BophanComponent
  extends BaseComponent
  implements OnInit, AfterViewInit
{
  public list_bophans: any;
  public isCreate = false;
  public loading = false;
  public error = '';
  public bophan: any;
  public frmBophan: FormGroup;
  public frmSearch: FormGroup;
  public showUpdateModal: any;
  public doneSetupForm: any;
  public list_phongbans: any;
  public maPhongBan: any;
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
    this._api.get('/api/phongban/get-phongban').subscribe((res) => {
      this.list_phongbans = res;
      console.log(res);
    });
  }
  public LoadPage(page: any) {
    this._api
      .post('/api/bophan/loadData', {
        page: page,
        pageSize: this.pageSize,
        totalItem: this.totalItem,
      })
      .subscribe((res) => {
        this.list_bophans = res.data;
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
      .post('/api/bophan/loadData', {
        page: 1,
        pageSize: pageSize,
        totalItem: this.totalItem,
      })
      .subscribe((res) => {
        this.list_bophans = res.data;
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
      .post('/api/bophan/search', {
        page: this.page,
        pageSize: this.pageSize,
        totalItem: this.totalItem,
        tenbophan: this.frmSearch.value['txt_search'],
      })
      .subscribe((res) => {
        this.list_bophans = res.data;
        this.pageSize = res.pageSize;
        this.page = res.page;
        this.totalItem = res.totalItem;
        console.log(res);
        setTimeout(() => {
          this.loadScripts('/assets/ckeditor/ckeditor.js');
        });
      });
  }
  get tenbophan() {
    return this.frmBophan.get('txt_tenbophan')!;
  }
  get maphongban() {
    return this.frmBophan.get('txt_maphongban')!;
  }
  public createModal() {
    this.showUpdateModal = true;
    this.isCreate = true;
    setTimeout(() => {
      $('#modelId').modal('toggle');
      this.frmBophan = new FormGroup({
        txt_tenbophan: new FormControl('', [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(250),
        ]),
        txt_maphongban: new FormControl('', []),
      });
      this.doneSetupForm = true;
    });
  }

  public openUpdateModal(maBoPhan: any) {
    this.showUpdateModal = true;
    this.doneSetupForm = false;
    this.isCreate = false;
    setTimeout(() => {
      $('#modelId').modal('toggle');
      this._api.get('/api/bophan/get-by-id/' + maBoPhan).subscribe((res) => {
        this.bophan = res.bophan;
        console.log(res);
        this.frmBophan = new FormGroup({
          txt_tenbophan: new FormControl(this.bophan.tenBoPhan, [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(250),
          ]),
          txt_maphongban: new FormControl(this.bophan.maPhongBan, []),
        });
        this.doneSetupForm = true;
        this.maPhongBan = this.bophan.maPhongBan;
      });
    });
  }

  public onRemove(MaBoPhan: any) {
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
          .delete('/api/bophan/delete-bophan', MaBoPhan)
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
    const controls = this.frmBophan.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    return invalid;
  }

  OnSubmit(vl: any) {
    console.log(this.findInvalidControls());
    if (this.frmBophan.invalid) {
      return;
    }
    let obj: any = {};
    obj.bophan = {
      TenBoPhan: vl.txt_tenbophan,
      MaPhongBan: vl.txt_maphongban,
    };
    if (this.isCreate) {
      this._api.post('/api/bophan/create-bophan', obj).pipe(
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
      obj.bophan.MaBoPhan = this.bophan.maBoPhan;

      this._api.post('/api/bophan/update-bophan', obj).pipe(
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
