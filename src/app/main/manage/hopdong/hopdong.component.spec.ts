import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HopdongComponent } from './hopdong.component';

describe('HopdongComponent', () => {
  let component: HopdongComponent;
  let fixture: ComponentFixture<HopdongComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HopdongComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HopdongComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
