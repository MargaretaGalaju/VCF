import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import * as p5 from 'p5';

@Component({
  selector: 'app-p5js',
  templateUrl: './p5js.component.html',
  styleUrls: ['./p5js.component.scss']
})
export class P5jsComponent implements OnInit {
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
      const map = s => {
        s.setup = () => {
          let canvas2 = s.createCanvas(screenWidth, screenHeight);
          this.squareSide = Math.sqrt(screenHeight*screenHeight + screenWidth*screenWidth)/2;
          this.tileSide = this.squareSide/this.mapConfigs.Map.XSize;
            // this.squareSide = this.squareSide + + this.tileSide*0.2;
          canvas2.parent('sketch-holder');
    
          s.translate(screenWidth*0.01, screenHeight*0.6);
    
          s.background('#ffffff');
          //draw shadow
          let c = s.color('#E8ECF1');
          s.fill(c);
          s.smooth();
          s.scale(1.25, 0.5);
          s.translate(0, 0);
          s.rotate(s.radians(-50));
          s.noStroke();
          s.square(0, 0, this.squareSide, 25);
          
          //draw border

          let c2 = s.color('#C6D8EE');
          s.fill(c2);
          s.smooth();
          s.translate(50, -50);
          s.noStroke();
          s.square(0, 0, this.squareSide, 25);

          //draw background

          let c1 = s.color('#EDF5FF');
          s.noStroke();
          s.fill(c1);
          s.smooth();
          s.translate(20,-20);
          let boothGround = s.square(0, 0, this.squareSide, 25);
          
          let boothGround1 = s.createElement('div', `lalal`).position(0,0);
          boothGround1.style('color', 'red');
           console.log(boothGround1);
           
          // canvas2.mouseOver(() => {
          //   console.log(boothGround);
          // });
            s.mouseMoved = (e) => {
              // console.log(e);
            }
            // for(let i = 0; i <= this.mapConfigs.Map.XSize; i++) {
            //   for(let j = 0; j <= this.mapConfigs.Map.XSize; j++) {
            //     s.stroke('purple'); 
            //     s.strokeWeight(5); 
            //     s.point(this.tileSide*(i), this.tileSide*(j));
            //     s.noStroke();
            //   }
            // }
          
          s.translate(this.tileSide*0.2, this.tileSide*0.2);
          this.mapConfigs.Map.Booths.forEach((booth)=> {
            s.loadImage(booth.Logo, image => {   
              let boothHeight;
              let boothWidth;
              
              if (booth.Align === 'XAxis') {
                boothHeight =  booth.Height*0.6;
                boothWidth = booth.Width*0.8;
              } else {
                boothHeight = booth.Width*0.8;
                boothWidth = booth.Height*0.6 ;
              }
              this.drawBooth(s, image, booth.XPosition, booth.YPosition, boothWidth, boothHeight, booth.Align);
            });
          })
      }};
  
      this.canvas = new p5(map);
    });
  }

  public drawBooth(canvas, image, xPosition, yPosition, boothWidth, boothHeight, boothAlign) {
    //Save current coordinates
    canvas.push()

    //boothShadow
    canvas.fill('#89b2f1');
    canvas.translate(xPosition*this.tileSide, yPosition*this.tileSide);
    let ps =canvas.rect(0, 0, boothWidth*this.tileSide, boothHeight*this.tileSide, 5);
    console.log(ps);
    
    //boothGround
    canvas.fill('#D3E4FA');
    canvas.translate(5,-5);
    canvas.rect(0, 0, boothWidth*this.tileSide, boothHeight*this.tileSide, 5);

    if (boothAlign === 'XAxis') {
      //imageKeeperBorder
      canvas.fill('#8ab2f1');
      canvas.translate(boothWidth*this.tileSide*0.1, boothWidth*this.tileSide*0.05);
      canvas.rect(0, 0, boothWidth*this.tileSide*0.8, boothHeight*this.tileSide/4, 5);

      //imageKeeper
      canvas.fill('#D3E4FA');
      canvas.translate(5,-5);
      canvas.rect(0, 0, boothWidth*this.tileSide*0.8, boothHeight*this.tileSide/4, 5);

      //imageWrapper
      canvas.fill('#D0D8E2');
      canvas.shearX(canvas.radians(130))
      canvas.translate(boothWidth*this.tileSide*0.1, -boothHeight*this.tileSide+(boothHeight*this.tileSide*0.1), 5)
      canvas.rect(0, 0, boothWidth*this.tileSide*0.75, boothHeight*this.tileSide, 5);
      
      //logo itself
      const outputImageAspectRatio = boothWidth*this.tileSide*0.75 /  boothHeight*this.tileSide;
      
      canvas.image(image, 10, 7, boothWidth*this.tileSide*0.75, boothHeight*this.tileSide, 5);
    }
     else {
      //imageKeeperBorder
      canvas.fill('#8ab2f1');
      canvas.translate(boothWidth*this.tileSide*0.6, boothWidth*this.tileSide*0.1);
      canvas.rect(0, 0, boothWidth*this.tileSide*0.3, boothHeight*this.tileSide*0.9, 5); 
     
      //imageKeeper
      canvas.fill('#D3E4FA');
      canvas.translate(5,-5);
      canvas.rect(0, 0, boothWidth*this.tileSide*0.3, boothHeight*this.tileSide*0.9, 5); 

      //imageWrapper
      canvas.fill('#D0D8E2');
      canvas.shearY(canvas.radians(-40))
      canvas.translate(boothWidth*this.tileSide*0.08, boothHeight*this.tileSide*0.1)
      canvas.rect(0, 0, boothWidth*this.tileSide*1.15, boothHeight*this.tileSide*0.81, 5);
      
      //logo itself
      
      canvas.rotate(canvas.radians(90))
      canvas.image(image, -boothWidth*this.tileSide*0.03, -boothWidth*this.tileSide*1.1, boothHeight*this.tileSide*0.8, boothWidth*this.tileSide*1.1, 5);
    }

    //Reset to previous saved positions
    canvas.pop();

    //Remember new positions
    canvas.push();
    

    if (boothAlign === 'XAxis') {
      canvas.translate(xPosition*this.tileSide+(this.tileSide*boothWidth)/2-this.tileSide*0.125, yPosition*this.tileSide+this.tileSide*boothHeight*0.75);
    } else {
      canvas.translate(xPosition*this.tileSide +(this.tileSide*boothWidth)/4, yPosition*this.tileSide+this.tileSide*boothHeight*0.5);
    } 
             //Draw cube on the booth
    canvas.fill('#7faaef');
    canvas.rect(-this.tileSide*0.01,-this.tileSide*0.21,this.tileSide*0.18,this.tileSide*0.18, 2);
    
    canvas.fill('#f4f8ff');
    canvas.rect(this.tileSide*0.295,-this.tileSide*0.46,this.tileSide*0.18,this.tileSide*0.18);

    canvas.fill('#d3e3f9');
    canvas.rect(this.tileSide*0.34,-this.tileSide*0.43,this.tileSide*0.1,this.tileSide*0.1);


    let redBoxStandColor = canvas.color('#ff7578');
    
    canvas.fill(redBoxStandColor);
    canvas.rect(this.tileSide*0.35,-this.tileSide*0.43,this.tileSide*0.085,this.tileSide*0.085);
    
    redBoxStandColor.setAlpha(200);
    canvas.fill(redBoxStandColor);
    
    canvas.fill('#b1cbf0');
    canvas.shearX(canvas.radians(130))
    canvas.rect(-this.tileSide*0.05, -this.tileSide*0.3, this.tileSide*0.18, this.tileSide*0.26);

    canvas.fill('#e9f0fc');
    canvas.shearY(canvas.radians(40))
    canvas.rect(-this.tileSide*0.25, -this.tileSide*0.25, this.tileSide*0.2, this.tileSide*0.25); 
    
    canvas.fill(redBoxStandColor);
    canvas.shearY(canvas.radians(-20))

    canvas.translate(this.tileSide*0.01, -this.tileSide*0.05)
    canvas.rect(-this.tileSide*0.17, -this.tileSide*0.5, this.tileSide*0.175, this.tileSide*0.2);

    canvas.triangle(-this.tileSide*0.17, -this.tileSide*0.499, this.tileSide*0.005, -this.tileSide*0.5, -this.tileSide*0.08, -this.tileSide*0.551)
    canvas.pop();
  }

  public lala() {
    console.log('llaa;;a');
    
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
