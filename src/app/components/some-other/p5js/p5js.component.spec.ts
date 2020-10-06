import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { P5jsComponent } from './p5js.component';

describe('P5jsComponent', () => {
  let component: P5jsComponent;
  let fixture: ComponentFixture<P5jsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ P5jsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(P5jsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
