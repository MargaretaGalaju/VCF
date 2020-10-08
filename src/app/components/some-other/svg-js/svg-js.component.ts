import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { SVG } from '@svgdotjs/svg.js'

@Component({
  selector: 'app-svg-js',
  templateUrl: './svg-js.component.html',
  styleUrls: ['./svg-js.component.scss']
})
export class SvgJsComponent implements OnInit {
  public canvas: any;
  public mapConfigs;

  public squareSide;

  public tileSide;

  constructor(
    private http: HttpClient,
  ){ }

  ngOnInit() {
    this.getMapConfiguration().then((data)=> {
      this.mapConfigs = data;

      let screenWidth = window.innerWidth;

      let screenHeight = window.innerHeight;
      this.squareSide = Math.sqrt(screenHeight*screenHeight + screenWidth*screenWidth)/2;
      this.tileSide = this.squareSide/this.mapConfigs.Map.XSize;
          
      var draw = SVG().addTo('body').size(screenWidth, screenHeight)
      var rect = draw.rect( this.squareSide, this.squareSide).attr({ fill: '#E8ECF1' });
      rect.rotate(50)
      rect.skew(0, -10)
      // rect.attr({ x: screenWidth*0.01, y: screenHeight*0.6 })
      
      var group = draw.group()
      // var circle = draw.circle(5).translate(10,10)
      
      group.add(rect)

          for(let i = 0; i <= this.mapConfigs.Map.XSize; i++) {
            for(let j = 0; j <= this.mapConfigs.Map.XSize; j++) {
              var circle = draw.circle(5).translate( this.tileSide*(i),  this.tileSide*(j) )
              circle.addTo(group)
              //  draw.point(this.tileSide*(i), this.tileSide*(j));
            }
          }
    });
    

  }

  public getMapConfiguration(): Promise<any> {
    return new Promise((resolve, reject) => {
        this.http.get<any>('assets/resources/map_configuration.json').subscribe(result => {
            resolve(result);
        }, error => {
            reject();
        });
    });
  }
}
