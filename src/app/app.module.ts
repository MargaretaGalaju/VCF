import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './components/layout/app.component';
import { VcfViewerLayoutComponent } from './feature/vcf-viewer/components/vcf-viewer-layout/vcf-viewer-layout.component';
import {  HttpClientModule  } from '@angular/common/http';
import { CanvasComponent } from './components/some-other/canvas/canvas.component';
import { ZimjsComponent } from './components/some-other/zimjs/zimjs.component';

@NgModule({
  declarations: [
    AppComponent,
    VcfViewerLayoutComponent,
    CanvasComponent,
    ZimjsComponent, 
  ],
  imports: [
    BrowserModule,
    HttpClientModule,

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
