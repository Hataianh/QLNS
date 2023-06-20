import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NghiphepComponent } from './nghiphep.component';

describe('NghiphepComponent', () => {
  let component: NghiphepComponent;
  let fixture: ComponentFixture<NghiphepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NghiphepComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NghiphepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
