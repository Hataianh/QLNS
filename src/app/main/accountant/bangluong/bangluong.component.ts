import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  AfterViewInit,
  Component,
  ElementRef,
  Injector,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { BaseComponent } from '../../../core/common/base-component';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { SweetAlertService } from 'src/app/core/services/SweetAlert.service';
import Swal from 'sweetalert2';
import { catchError, throwError } from 'rxjs';
declare var $: any;
@Component({
  selector: 'app-bangluong',
  templateUrl: './bangluong.component.html',
  styleUrls: ['./bangluong.component.css'],
})
export class BangluongComponent
  extends BaseComponent
  implements OnInit, AfterViewInit
{
  public manhanvien: any;
  public thang: any;
  public nam: any;
  public luong_nhanvien: any;
  public phucap: any;
  public baohiem: any;
  public ktkl: any;
  public ungluong: any;
  public loaiBaoHiem: any;
  public mucDong: any;
  public luongthuclinh: any;
  public frmTinhluong: FormGroup;
  public tongphucap: any;
  public tongmdbaohiem: any;
  public tongktkl: any;
  public tongungluong: any;
  public mucLuong: any;
  public tongbaohiem: number;
  public bangluong: any;
  public frmSearch: FormGroup;
  public years: string[] = [];
  public months: { value: string; label: string }[] = [];
  tongngaycong: any;
  error: any;
  loading: boolean;

  constructor(
    injector: Injector,
    private sweetAlertService: SweetAlertService
  ) {
    super(injector);
    this.frmTinhluong = new FormGroup({
      txt_manhanvien: new FormControl('', []),
      txt_thang: new FormControl('', []),
      txt_nam: new FormControl('', []),
    });
    this.frmSearch = new FormGroup({
      txt_search: new FormControl('', []),
    });
  }
  ngAfterViewInit() {
    this.loadScripts('/assets/ckeditor/ckeditor.js');
  }

  ngOnInit(): void {
    this.loadNhanVienList();
    this.thang = localStorage.getItem('thang') || '';
    this.nam = localStorage.getItem('nam') || '';
    this.LoadData(this.pageSize);
    this.loadData();
    const currentYear = new Date().getFullYear();
    for (let i = currentYear; i >= currentYear - 5; i--) {
      this.years.push(i.toString());
    }
    for (let i = 12; i >= 1; i--) {
      this.months.push({ value: i.toString(), label: 'Tháng ' + i });
    }
    this.TinhLuong();
    this.ChiTiet(this.manhanvien);
  }
  exportToExcel(): void {
    const element = document.getElementById('BangLuongid') as HTMLTableElement;
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
      // Merges cells for the "Các Khoản Khấu Trừ" col
      { s: { r: 0, c: 9 }, e: { r: 0, c: 10 } },
      // Merges cells for the "Họ tên" row
      { s: { r: 0, c: 0 }, e: { r: 1, c: 0 } },
      { s: { r: 0, c: 1 }, e: { r: 1, c: 1 } },
      { s: { r: 0, c: 2 }, e: { r: 1, c: 2 } },
      { s: { r: 0, c: 3 }, e: { r: 1, c: 3 } },
      { s: { r: 0, c: 4 }, e: { r: 1, c: 4 } },
      { s: { r: 0, c: 5 }, e: { r: 1, c: 5 } },
      { s: { r: 0, c: 6 }, e: { r: 1, c: 6 } },
      { s: { r: 0, c: 7 }, e: { r: 1, c: 7 } },
      { s: { r: 0, c: 8 }, e: { r: 1, c: 8 } },
      { s: { r: 0, c: 11 }, e: { r: 1, c: 11 } },
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
    FileSaver.saveAs(data, 'bangluong.xlsx');
  }
  public TinhLuong() {
    this._api
      .post('/api/nhanvien/thongtin-luong', {
        manhanvien: this.selectedNhanVien[0].maNhanVien,
        thang: this.frmTinhluong.value['txt_thang'],
        nam: this.frmTinhluong.value['txt_nam'],
      })
      .subscribe((data) => {
        this.luong_nhanvien = data;
        this.nhanvien = data.nhanvien.value.nhanvien;
        this.baohiem = data.baohiem.value.baohiem;
        this.tongmdbaohiem = data.baohiem.value.tongmdbaohiem;

        this.phucap = data.phucap.value.phucap;
        this.tongphucap = data.phucap.value.tongphucap;
        this.ktkl = data.ktkl.value.khenthuongkyluat;
        this.tongktkl = data.ktkl.value.tongktkl;
        this.ungluong = data.ungluong.value.ungluong;
        this.tongungluong = data.ungluong.value.tongungluong;
        this.tongngaycong = data.bangcong.value.tongngaycong;
        this.mucLuong = this.nhanvien.mucLuong;
        this.tongbaohiem =
          (((this.mucLuong / 20) * this.tongngaycong +
            this.tongphucap +
            this.tongktkl -
            this.tongungluong) *
            this.tongmdbaohiem) /
          100;
        this.luongthuclinh =
          (this.mucLuong / 20) * this.tongngaycong +
          this.tongphucap +
          this.tongktkl -
          this.tongungluong -
          this.tongbaohiem;
        console.log(this.tongngaycong, data);
        setTimeout(() => {
          this.loadScripts('/assets/ckeditor/ckeditor.js');
        });
      });
  }
  public ChiTiet(manhanvien: any) {
    this._api
      .post('/api/nhanvien/thongtin-luong', {
        manhanvien,
        thang: this.thang,
        nam: this.nam,
      })
      .subscribe((data) => {
        this.luong_nhanvien = data;
        this.nhanvien = data.nhanvien.value.nhanvien;
        this.baohiem = data.baohiem.value.baohiem;
        this.tongmdbaohiem = data.baohiem.value.tongmdbaohiem;

        this.phucap = data.phucap.value.phucap;
        this.tongphucap = data.phucap.value.tongphucap;
        this.ktkl = data.ktkl.value.khenthuongkyluat;
        this.tongktkl = data.ktkl.value.tongktkl;
        this.ungluong = data.ungluong.value.ungluong;
        this.tongungluong = data.ungluong.value.tongungluong;
        this.tongngaycong = data.bangcong.value.tongngaycong;
        this.mucLuong = this.nhanvien.mucLuong;
        this.tongbaohiem =
          (((this.mucLuong / 20) * this.tongngaycong +
            this.tongphucap +
            this.tongktkl -
            this.tongungluong) *
            this.tongmdbaohiem) /
          100;
        this.luongthuclinh =
          (this.mucLuong / 20) * this.tongngaycong +
          this.tongphucap +
          this.tongktkl -
          this.tongungluong -
          this.tongbaohiem;
        setTimeout(() => {
          this.loadScripts('/assets/ckeditor/ckeditor.js');
        });
      });
  }
  public LoadPage(page: any) {
    this._api
      .post('/api/bangluong/loadData', {
        thang: this.thang,
        nam: this.nam,
        page: page,
        pageSize: this.pageSize,
        totalItem: this.totalItem,
      })
      .subscribe((res) => {
        this.bangluong = res.data;
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
      .post('/api/bangluong/loadData', {
        thang: this.thang,
        nam: this.nam,
        page: 1,
        pageSize: pageSize,
        totalItem: this.totalItem,
      })
      .subscribe((res) => {
        this.bangluong = res.data;
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
      .post('/api/bangluong/search', {
        page: this.page,
        pageSize: this.pageSize,
        totalItem: this.totalItem,
        hoten: this.frmSearch.value['txt_search'],
        thang: localStorage.getItem('thang') || '',
        nam: localStorage.getItem('nam') || '',
      })
      .subscribe((res) => {
        this.bangluong = res.data;
        this.pageSize = res.pageSize;
        this.page = res.page;
        this.totalItem = res.totalItem;
        setTimeout(() => {
          this.loadScripts('/assets/ckeditor/ckeditor.js');
        });
      });
  }
  public onRemove(MaBangLuong: any) {
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
          .delete('/api/bangluong/delete-bangluong', MaBangLuong)
          .subscribe((res) => {
            // Xử lý kết quả xóa thành công
            this.LoadData(this.pageSize);
          });
      }
    });
  }

  OnSubmit(vl: any) {
    let obj: any = {};
    obj.bangluong = {
      MaNhanVien: this.selectedNhanVien[0].maNhanVien,
      Thang: vl.txt_thang,
      Nam: vl.txt_nam,
      Luong: this.nhanvien.mucLuong,
      TongNgayCong: this.tongngaycong,
      TongPhuCap: this.tongphucap,
      TongKtkl: this.tongktkl,
      TongBaoHiem: this.tongbaohiem,
      TongUngLuong: this.tongungluong,
      LuongThucLinh: this.luongthuclinh,
    };
    console.log(obj);
    this._api.post('/api/bangluong/create-bangluong', obj).pipe(
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
          'Tính lương cho nhân viên ' + this.nhanvien.hoTen + ' thành công!'
        );
        this.LoadData(this.pageSize);
      }
    });
  }
  public onFormSubmit(vl: any) {
    this.TinhLuong();
    setTimeout(() => {
      this.OnSubmit(vl);
    }, 500);
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
