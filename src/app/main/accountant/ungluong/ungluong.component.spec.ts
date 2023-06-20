import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UngluongComponent } from './ungluong.component';

describe('UngluongComponent', () => {
  let component: UngluongComponent;
  let fixture: ComponentFixture<UngluongComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UngluongComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UngluongComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
