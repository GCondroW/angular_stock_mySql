import { ComponentFixture, TestBed } from '@angular/core/testing';

import { XtComponent } from './xt.component';

describe('XtComponent', () => {
  let component: XtComponent;
  let fixture: ComponentFixture<XtComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [XtComponent]
    });
    fixture = TestBed.createComponent(XtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
