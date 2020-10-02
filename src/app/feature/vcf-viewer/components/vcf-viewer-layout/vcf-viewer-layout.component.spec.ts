import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VcfViewerLayoutComponent } from './vcf-viewer-layout.component';

describe('VcfViewerLayoutComponent', () => {
  let component: VcfViewerLayoutComponent;
  let fixture: ComponentFixture<VcfViewerLayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VcfViewerLayoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VcfViewerLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
