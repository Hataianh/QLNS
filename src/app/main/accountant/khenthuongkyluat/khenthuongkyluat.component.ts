import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AfterViewInit, Component, Injector, OnInit } from '@angular/core';
import { BaseComponent } from '../../../core/common/base-component';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { SweetAlertService } from 'src/app/core/services/SweetAlert.service';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { catchError, throwError } from 'rxjs';
declare var $: any;
@Component({
  selector: 'app-khenthuongkyluat',
  templateUrl: './khenthuongkyluat.component.html',
  styleUrls: ['./khenthuongkyluat.component.css'],
})
export class KhenthuongkyluatComponent
  extends BaseComponent
  implements OnInit, AfterViewInit
{
  public list_ktkls: any;
  public isCreate = false;
  public loading = false;
  public error = '';
  public khenthuongkyluat: any;
  public frmKtkl: FormGroup;
  public frmSearch: FormGroup;
  public showUpdateModal: any;
  public doneSetupForm: any;
  public maNhanVien: any;
  public list_nhanviens: any;
  public Loai: any;
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
  exportToExcel(): void {
    const element = document.getElementById('Ktklid') as HTMLTableElement;
    if (!element) return;

    const worksheet: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    // Áp dụng font chữ Times New Roman cho toàn bộ bảng
    const font = { name: 'Times New Roman', bold: true };
    const alignment = { vertical: 'center', horizontal: 'center' };
    const range = worksheet['!ref']
      ? XLSX.utils.decode_range(worksheet['!ref'])
      : null;
    if (range) {
      for (let rowNum = range.s.r; rowNum <= range.e.r; rowNum++) {
        for (let colNum = range.s.c; colNum <= range.e.c; colNum++) {
          const cellAddress = XLSX.utils.encode_cell({ r: rowNum, c: colNum });
          const cell = worksheet[cellAddress];
          if (!cell) continue;

          cell.s = { ...cell.s, font, alignment };

          // Apply yellow background for the first two rows
          if (rowNum <= 1) {
            cell.s.fill = { fgColor: { rgb: 'FFFF00' } };
          }
        }
      }
    }

    // Thiết lập các thuộc tính rowspan và colspan
    worksheet['!merges'] = [
      // Các cells được merge cho hàng "Họ tên"
      { s: { r: 1, c: 0 }, e: { r: 1, c: 0 } },
      { s: { r: 1, c: 1 }, e: { r: 1, c: 1 } },
      { s: { r: 1, c: 2 }, e: { r: 1, c: 2 } },
      { s: { r: 1, c: 3 }, e: { r: 1, c: 3 } },
      { s: { r: 1, c: 4 }, e: { r: 1, c: 4 } },
      { s: { r: 1, c: 5 }, e: { r: 1, c: 5 } },
    ];

    const workbook: XLSX.WorkBook = {
      Sheets: { data: worksheet },
      SheetNames: ['data'],
    };

    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });
    const data: Blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8',
    });
    FileSaver.saveAs(data, 'ktkl.xlsx');
  }
  onFileSelected(event: any) {
    const file: File = event.target.files[0];

    if (file) {
      const reader: FileReader = new FileReader();

      reader.onload = (e: any) => {
        const workbook: XLSX.WorkBook = XLSX.read(e.target.result, {
          type: 'binary',
        });
        const worksheet: XLSX.WorkSheet =
          workbook.Sheets[workbook.SheetNames[0]];
        const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet, {
          raw: false,
        });

        // Gửi yêu cầu import dữ liệu
        this.importKtkl(jsonData).subscribe(
          () => {
            console.log('Import success');
          },
          (error) => {
            console.error('Import error', error);
          }
        );
      };

      reader.readAsBinaryString(file);
    }
  }
  importKtkl(data: any[]) {
    return this._api.post(
      '/api/khenthuongkyluat/import-khenthuongkyluat',
      data
    );
  }
  public LoadPage(page: any) {
    this._api
      .post('/api/khenthuongkyluat/loadData', {
        thang: this.thang,
        nam: this.nam,
        page: page,
        pageSize: this.pageSize,
        totalItem: this.totalItem,
      })
      .subscribe((res) => {
        this.list_ktkls = res.data;
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
      .post('/api/khenthuongkyluat/loadData', {
        thang: this.thang,
        nam: this.nam,
        page: 1,
        pageSize: pageSize,
        totalItem: this.totalItem,
      })
      .subscribe((res) => {
        this.list_ktkls = res.data;
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
      .post('/api/khenthuongkyluat/search', {
        page: this.page,
        pageSize: this.pageSize,
        totalItem: this.totalItem,
        hoten: this.frmSearch.value['txt_search'],
        thang: localStorage.getItem('thang') || '',
        nam: localStorage.getItem('nam') || '',
      })
      .subscribe((res) => {
        this.list_ktkls = res.data;
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
    return this.frmKtkl.get('txt_manhanvien')!;
  }
  get noidung() {
    return this.frmKtkl.get('txt_noidung')!;
  }
  get ngayquyetdinh() {
    return this.frmKtkl.get('txt_ngayquyetdinh')!;
  }
  get loai() {
    return this.frmKtkl.get('txt_loai')!;
  }
  get sotien() {
    return this.frmKtkl.get('txt_sotien')!;
  }
  public createModal() {
    this.showUpdateModal = true;
    this.isCreate = true;
    setTimeout(() => {
      $('#modelId').modal('toggle');
      this.frmKtkl = new FormGroup({
        txt_manhanvien: new FormControl('', [Validators.required]),
        txt_noidung: new FormControl('', [Validators.required]),
        txt_ngayquyetdinh: new FormControl('', []),
        txt_loai: new FormControl('', [Validators.required]),
        txt_sotien: new FormControl('', []),
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
      this._api
        .get('/api/khenthuongkyluat/get-by-id/' + id)
        .subscribe((res) => {
          this.khenthuongkyluat = res.khenthuongkyluat;
          console.log(res);
          this.frmKtkl = new FormGroup({
            txt_manhanvien: new FormControl(this.khenthuongkyluat.maNhanVien, [
              Validators.required,
            ]),
            txt_noidung: new FormControl(this.khenthuongkyluat.noiDung, [
              Validators.required,
            ]),
            txt_ngayquyetdinh: new FormControl(
              this.khenthuongkyluat.ngayQuyetDinh,
              []
            ),
            txt_loai: new FormControl(this.khenthuongkyluat.loai, [
              Validators.required,
            ]),
            txt_sotien: new FormControl(this.khenthuongkyluat.soTien, []),
          });
          this.doneSetupForm = true;
          this.maNhanVien = this.khenthuongkyluat.maNhanVien;
          this.Loai = this.khenthuongkyluat.loai;

          this.frmKtkl
            .get('txt_ngayquyetdinh')
            ?.patchValue(
              this.formatDate(new Date(this.khenthuongkyluat.ngayQuyetDinh))
            );
          console.log(this.selectedNhanVien);
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
          .delete('/api/khenthuongkyluat/delete-khenthuongkyluat', Id)
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
    const controls = this.frmKtkl.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    return invalid;
  }

  OnSubmit(vl: any) {
    console.log(this.findInvalidControls());
    if (this.frmKtkl.invalid) {
      return;
    }
    let obj: any = {};
    obj.khenthuongkyluat = {
      MaNhanVien: this.selectedNhanVien[0].maNhanVien,
      NoiDung: vl.txt_noidung,
      NgayQuyetDinh: vl.txt_ngayquyetdinh,
      Loai: vl.txt_loai,
      SoTien: vl.txt_sotien,
    };
    if (this.isCreate) {
      this._api
        .post('/api/khenthuongkyluat/create-khenthuongkyluat', obj)
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
      obj.khenthuongkyluat.Id = this.khenthuongkyluat.id;

      this._api
        .post('/api/khenthuongkyluat/update-khenthuongkyluat', obj)
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
}
