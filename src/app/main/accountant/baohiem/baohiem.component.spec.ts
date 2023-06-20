import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaohiemComponent } from './baohiem.component';

describe('BaohiemComponent', () => {
  let component: BaohiemComponent;
  let fixture: ComponentFixture<BaohiemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BaohiemComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BaohiemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
