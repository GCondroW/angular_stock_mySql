import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportNavComponent } from './import-nav.component';

describe('ImportNavComponent', () => {
  let component: ImportNavComponent;
  let fixture: ComponentFixture<ImportNavComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ImportNavComponent]
    });
    fixture = TestBed.createComponent(ImportNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
