import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BangluongComponent } from './BangluongComponent';

describe('BangluongComponent', () => {
  let component: BangluongComponent;
  let fixture: ComponentFixture<BangluongComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BangluongComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BangluongComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
