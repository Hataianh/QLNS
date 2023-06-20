import { ComponentFixture, TestBed } from '@angular/core/testing';

import { XacminhEmailComponent } from './xacminh-email.component';

describe('XacminhEmailComponent', () => {
  let component: XacminhEmailComponent;
  let fixture: ComponentFixture<XacminhEmailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ XacminhEmailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(XacminhEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
