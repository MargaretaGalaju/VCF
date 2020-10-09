import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './components/layout/app.component';
import { VcfViewerLayoutComponent } from './feature/vcf-viewer/components/vcf-viewer-layout/vcf-viewer-layout.component';
import {  HttpClientModule  } from '@angular/common/http';
import { CanvasComponent } from './components/some-other/canvas/canvas.component';
import { ZimjsComponent } from './components/some-other/zimjs/zimjs.component';
import { P5jsComponent } from './components/some-other/p5js/p5js.component';
import { VcfGeneratorComponent } from './components/some-other/vcf-generator/vcf-generator.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SnapSvgComponent } from './components/some-other/snap-svg/snap-svg.component';
import { SvgJsComponent } from './components/some-other/svg-js/svg-js.component';
import { ThreeJsComponent } from './components/some-other/three-js/three-js.component';

@NgModule({
  declarations: [
    AppComponent,
    VcfViewerLayoutComponent,
    CanvasComponent,
    ZimjsComponent,
    P5jsComponent,
    VcfGeneratorComponent,
    SnapSvgComponent,
    SvgJsComponent,
    ThreeJsComponent, 
  ],
  imports: [
    ReactiveFormsModule,
    BrowserModule,
    HttpClientModule,

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
