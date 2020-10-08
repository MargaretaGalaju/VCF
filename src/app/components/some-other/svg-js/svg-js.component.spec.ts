import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SvgJsComponent } from './svg-js.component';

describe('SvgJsComponent', () => {
  let component: SvgJsComponent;
  let fixture: ComponentFixture<SvgJsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SvgJsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SvgJsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
