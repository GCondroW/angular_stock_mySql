import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DaftarComponent } from './daftar.component';

describe('DaftarComponent', () => {
  let component: DaftarComponent;
  let fixture: ComponentFixture<DaftarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DaftarComponent]
    });
    fixture = TestBed.createComponent(DaftarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
