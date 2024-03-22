import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DaftarBarangComponent } from './daftar-barang.component';

describe('DaftarBarangComponent', () => {
  let component: DaftarBarangComponent;
  let fixture: ComponentFixture<DaftarBarangComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DaftarBarangComponent]
    });
    fixture = TestBed.createComponent(DaftarBarangComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
