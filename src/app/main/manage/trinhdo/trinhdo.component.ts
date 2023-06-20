import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AfterViewInit, Component, Injector, OnInit } from '@angular/core';
import { BaseComponent } from '../../../core/common/base-component';
import { SweetAlertService } from 'src/app/core/services/SweetAlert.service';
import Swal from 'sweetalert2';
import { catchError, throwError } from 'rxjs';
declare var $: any;
@Component({
  selector: 'app-trinhdo',
  templateUrl: './trinhdo.component.html',
  styleUrls: ['./trinhdo.component.css'],
})
export class TrinhdoComponent
  extends BaseComponent
  implements OnInit, AfterViewInit
{
  public list_trinhdos: any;
  public isCreate = false;
  public loading = false;
  public error = '';
  public trinhdo: any;
  public frmTrinhdo: FormGroup;
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
      .post('/api/trinhdo/loadData', {
        page: page,
        pageSize: this.pageSize,
        totalItem: this.totalItem,
      })
      .subscribe((res) => {
        this.list_trinhdos = res.data;
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
      .post('/api/trinhdo/loadData', {
        page: 1,
        pageSize: pageSize,
        totalItem: this.totalItem,
      })
      .subscribe((res) => {
        this.list_trinhdos = res.data;
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
      .post('/api/trinhdo/search', {
        page: this.page,
        pageSize: this.pageSize,
        totalItem: this.totalItem,
        tentrinhdo: this.frmSearch.value['txt_search'],
      })
      .subscribe((res) => {
        this.list_trinhdos = res.data;
        this.pageSize = res.pageSize;
        this.page = res.page;
        this.totalItem = res.totalItem;
        console.log(res);
        setTimeout(() => {
          this.loadScripts('/assets/ckeditor/ckeditor.js');
        });
      });
  }

  get tentrinhdo() {
    return this.frmTrinhdo.get('txt_tentrinhdo')!;
  }
  public createModal() {
    this.showUpdateModal = true;
    this.isCreate = true;
    setTimeout(() => {
      $('#modelId').modal('toggle');
      this.frmTrinhdo = new FormGroup({
        txt_tentrinhdo: new FormControl('', [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(250),
        ]),
      });
      this.doneSetupForm = true;
    });
  }

  public openUpdateModal(maTrinhDo: any) {
    this.showUpdateModal = true;
    this.doneSetupForm = false;
    this.isCreate = false;
    setTimeout(() => {
      $('#modelId').modal('toggle');
      this._api.get('/api/trinhdo/get-by-id/' + maTrinhDo).subscribe((res) => {
        this.trinhdo = res.trinhdo;
        console.log(res);
        this.frmTrinhdo = new FormGroup({
          txt_tentrinhdo: new FormControl(this.trinhdo.tenTrinhDo, [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(250),
          ]),
        });
        this.doneSetupForm = true;
      });
    });
  }

  public onRemove(MaTrinhDo: any) {
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
          .delete('/api/trinhdo/delete-trinhdo', MaTrinhDo)
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
    const controls = this.frmTrinhdo.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    return invalid;
  }

  OnSubmit(vl: any) {
    console.log(this.findInvalidControls());
    if (this.frmTrinhdo.invalid) {
      return;
    }
    let obj: any = {};
    obj.trinhdo = {
      TenTrinhDo: vl.txt_tentrinhdo,
    };
    if (this.isCreate) {
      this._api.post('/api/trinhdo/create-trinhdo', obj).pipe(
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
      obj.trinhdo.MaTrinhDo = this.trinhdo.maTrinhDo;

      this._api.post('/api/trinhdo/update-trinhdo', obj).pipe(
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
