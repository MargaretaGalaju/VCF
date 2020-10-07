import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VcfGeneratorComponent } from './vcf-generator.component';

describe('VcfGeneratorComponent', () => {
  let component: VcfGeneratorComponent;
  let fixture: ComponentFixture<VcfGeneratorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VcfGeneratorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VcfGeneratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
