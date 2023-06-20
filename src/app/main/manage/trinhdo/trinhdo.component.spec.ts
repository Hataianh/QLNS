import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrinhdoComponent } from './trinhdo.component';

describe('TrinhdoComponent', () => {
  let component: TrinhdoComponent;
  let fixture: ComponentFixture<TrinhdoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrinhdoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrinhdoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
