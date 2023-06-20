import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhucapComponent } from './phucap.component';

describe('PhucapComponent', () => {
  let component: PhucapComponent;
  let fixture: ComponentFixture<PhucapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PhucapComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PhucapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
