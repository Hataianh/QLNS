import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KhenthuongkyluatComponent } from './khenthuongkyluat.component';

describe('KhenthuongkyluatComponent', () => {
  let component: KhenthuongkyluatComponent;
  let fixture: ComponentFixture<KhenthuongkyluatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KhenthuongkyluatComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KhenthuongkyluatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
