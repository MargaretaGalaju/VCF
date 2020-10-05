import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ZimjsComponent } from './zimjs.component';

describe('ZimjsComponent', () => {
  let component: ZimjsComponent;
  let fixture: ComponentFixture<ZimjsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ZimjsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ZimjsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
