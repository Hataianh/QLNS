import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoaihopdongComponent } from './loaihopdong.component';

describe('LoaihopdongComponent', () => {
  let component: LoaihopdongComponent;
  let fixture: ComponentFixture<LoaihopdongComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoaihopdongComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoaihopdongComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
