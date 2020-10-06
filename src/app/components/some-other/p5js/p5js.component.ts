import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import p5 from 'p5';

@Component({
  selector: 'app-p5js',
  templateUrl: './p5js.component.html',
  styleUrls: ['./p5js.component.scss']
})
export class P5jsComponent implements OnInit {
  public canvas: any;
  public mapConfigs;

  constructor(
    private http: HttpClient,
  ){ }

  ngOnInit() {
    this.getMapConfiguration().then((data)=> {
      this.mapConfigs = data;

      let screenWidth = window.innerWidth;
      let screenHeight = window.innerHeight;
      const sketch = s => {
        s.setup = () => {
          let canvas2 = s.createCanvas(screenWidth, screenHeight, s.WEBGL);
  
          const squareSide = Math.sqrt(screenHeight*screenHeight + screenWidth*screenWidth)/2;
          const tileSide = squareSide/this.mapConfigs.Map.XSize;
          
          canvas2.parent('sketch-holder');
  
          s.translate(-screenWidth/2+30, 20);
  
          //draw shadow
          let c = s.color('#E8ECF1');
          s.fill(c);
          s.smooth();
          s.scale(1.25, 0.5);
          s.translate(0, 0);
          s.rotate(s.radians(-50));
          s.noStroke();
          s.square(0, 0, squareSide, 25);
          
          //draw border
  
          let c2 = s.color('#C6D8EE');
          s.fill(c2);
          s.smooth();
          s.translate(50, -50);
          s.noStroke();
          s.square(0, 0, squareSide, 25);
  
          //draw background
  
          let c1 = s.color('#EDF5FF');
          s.noStroke();
          s.fill(c1);
          s.smooth();
          s.translate(20,-20);
          s.square(0, 0, squareSide, 25);
  
          for(let i = 0; i <= this.mapConfigs.Map.XSize; i++) {
            for(let j = 0; j <= this.mapConfigs.Map.XSize; j++) {
              s.stroke('purple'); // Change the color
              s.strokeWeight(10); // Make the points 10 pixels in size
              s.point(tileSide*(i), tileSide*(j));
            }
          }
        

          // BOOTH DRAW
          let xPosition = 2;
          let yPosition = 1;

          let boothWidth = 2;
          let boothHeight = 1;

          // let boothDirection = 'y';
          
          let boothShadow = s.color('#89b2f1');
          s.noStroke();
          s.fill(boothShadow);
          s.smooth();
          s.translate(xPosition*tileSide, yPosition*tileSide);
          s.rect(0, 0, boothWidth*tileSide, boothHeight*tileSide, 5);

          let boothGround = s.color('#D3E4FA');
          s.noStroke();
          s.fill(boothGround);
          s.smooth();
          s.translate(5,-5);
          s.rect(0, 0, boothWidth*tileSide, boothHeight*tileSide, 5);
          // s.drawingContext.drawImage(document.getElementById("small-x") ,0,0);
          // s.createElement('p', 'halo!');

          let imageKeeperBorder = s.color('#8ab2f1');
          s.noStroke();
          s.fill(imageKeeperBorder);
          s.smooth();
          s.translate(boothWidth*tileSide*0.1,boothWidth*tileSide*0.05);
          s.rect(0, 0, boothWidth*tileSide*0.8, boothHeight*tileSide/4, 5);

          let imageKeeper = s.color('#D3E4FA');
          s.noStroke();
          s.fill(imageKeeper);
          s.smooth();
          s.translate(5,-5);
          s.rect(0, 0, boothWidth*tileSide*0.8, boothHeight*tileSide/4, 5);

          // s.translate(-50,-50)
          // s.rotateX(s.radians(20));
          // s.rotateY(s.radians(90))
          // s.rotateZ(s.radians(-90));;
          // s.stroke('black');
          // s.plane(50,50);
          // let imageWrapper = s.color('#D0D8E2');
          // s.noStroke();
          // s.fill(imageWrapper);
          // s.smooth();
          // s.translate(5,-5);
          // s.rect(0, -100, 100, 100);


          // s.rect(0, 0, boothWidth*tileSide*0.8, boothHeight*tileSide/4, 5);
          s.loadImage('https://cdn.jpegmini.com/user/images/slider_puffin_before_mobile.jpg', img => {
            console.log(img);
            s.rotateX(s.radians(10));
            // s.rotateY(s.radians(40))
            // s.rotateZ(s.radians(20));
            // s.scale(1, 1.5);
            // s.imageMode(s.CENTER);
            s.scale(2, 1);
         
            s.image(img, -100, 0, 100, 100);
          });
        };
  //  
      };
  
      this.canvas = new p5(sketch);
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
