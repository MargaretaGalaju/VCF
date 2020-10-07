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

@NgModule({
  declarations: [
    AppComponent,
    VcfViewerLayoutComponent,
    CanvasComponent,
    ZimjsComponent,
    P5jsComponent,
    VcfGeneratorComponent, 
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
