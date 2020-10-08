import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SnapSvgComponent } from './snap-svg.component';

describe('SnapSvgComponent', () => {
  let component: SnapSvgComponent;
  let fixture: ComponentFixture<SnapSvgComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SnapSvgComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SnapSvgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
