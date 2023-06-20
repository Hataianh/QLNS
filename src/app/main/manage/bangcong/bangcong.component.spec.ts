import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BangcongComponent } from './bangcong.component';

describe('BangcongComponent', () => {
  let component: BangcongComponent;
  let fixture: ComponentFixture<BangcongComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BangcongComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BangcongComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
