import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AfterViewInit, Component, Injector, OnInit } from '@angular/core';
import { BaseComponent } from '../../../core/common/base-component';
import { SweetAlertService } from 'src/app/core/services/SweetAlert.service';
import Swal from 'sweetalert2';
import { catchError, throwError } from 'rxjs';
declare var $: any;
@Component({
  selector: 'app-phucap',
  templateUrl: './phucap.component.html',
  styleUrls: ['./phucap.component.css'],
})
export class PhucapComponent
  extends BaseComponent
  implements OnInit, AfterViewInit
{
  public list_phucaps: any;
  public isCreate = false;
  public loading = false;
  public error = '';
  public phucap: any;
  public frmPhucap: FormGroup;
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
      .post('/api/phucap/loadData', {
        page: page,
        pageSize: this.pageSize,
        totalItem: this.totalItem,
      })
      .subscribe((res) => {
        this.list_phucaps = res.data;
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
      .post('/api/phucap/loadData', {
        page: 1,
        pageSize: pageSize,
        totalItem: this.totalItem,
      })
      .subscribe((res) => {
        this.list_phucaps = res.data;
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
      .post('/api/phucap/search', {
        page: this.page,
        pageSize: this.pageSize,
        totalItem: this.totalItem,
        tenphucap: this.frmSearch.value['txt_search'],
      })
      .subscribe((res) => {
        this.list_phucaps = res.data;
        this.pageSize = res.pageSize;
        this.page = res.page;
        this.totalItem = res.totalItem;
        console.log(res);
        setTimeout(() => {
          this.loadScripts('/assets/ckeditor/ckeditor.js');
        });
      });
  }

  get tenphucap() {
    return this.frmPhucap.get('txt_tenphucap')!;
  }
  get sotien() {
    return this.frmPhucap.get('txt_sotien')!;
  }
  public createModal() {
    this.showUpdateModal = true;
    this.isCreate = true;
    setTimeout(() => {
      $('#modelId').modal('toggle');
      this.frmPhucap = new FormGroup({
        txt_tenphucap: new FormControl('', [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(250),
        ]),
        txt_sotien: new FormControl('', [Validators.required]),
      });
      this.doneSetupForm = true;
    });
  }

  public openUpdateModal(maPhuCap: any) {
    this.showUpdateModal = true;
    this.doneSetupForm = false;
    this.isCreate = false;
    setTimeout(() => {
      $('#modelId').modal('toggle');
      this._api.get('/api/phucap/get-by-id/' + maPhuCap).subscribe((res) => {
        this.phucap = res.phucap;
        console.log(res);
        this.frmPhucap = new FormGroup({
          txt_tenphucap: new FormControl(this.phucap.tenPhuCap, [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(250),
          ]),
          txt_sotien: new FormControl(this.phucap.soTien, [
            Validators.required,
          ]),
        });
        this.doneSetupForm = true;
      });
    });
  }

  public onRemove(MaPhuCap: any) {
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
          .delete('/api/phucap/delete-phucap', MaPhuCap)
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
    const controls = this.frmPhucap.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    return invalid;
  }

  OnSubmit(vl: any) {
    console.log(this.findInvalidControls());
    if (this.frmPhucap.invalid) {
      return;
    }
    let obj: any = {};
    obj.phucap = {
      TenPhuCap: vl.txt_tenphucap,
      SoTien: vl.txt_sotien,
    };
    if (this.isCreate) {
      this._api.post('/api/phucap/create-phucap', obj).pipe(
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
      obj.phucap.MaPhuCap = this.phucap.maPhuCap;

      this._api.post('/api/phucap/update-phucap', obj).pipe(
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
