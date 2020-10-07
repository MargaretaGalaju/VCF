import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { userInfo } from 'os';
import { Subject } from 'rxjs';

export interface VcfInputModel {
  Id: number;
  VcfNumber: number;
  Name:  BoothSizeEnum;
  BoothsCount: BoothCountModel;
  VisitorsNumber: number;
  GenderDistribution: number;
  RacialDistributionWhite: number;
  RacialDistributionBrown: number;
  RacialDistributionBlack: number;
}

export interface VcfOutputModel {
  XSize: number,
  YSize: number,
  Booths: VcfBoothModel[]
}

export interface VcfBoothModel {
  Size: BoothSizeEnum,
  Width: number,
  Height: number,
  Align: BoothAlignmentEnum,
  XPosition: number,
  YPosition: number
}

export enum BoothSizeEnum {
  Small,
  Large
}

export enum BoothAlignmentEnum {
  XAxis,
  YAxis,
}

export interface BoothCountModel {
  Small: number;
  Large: number;
};

@Component({
  selector: 'app-vcf-generator',
  templateUrl: './vcf-generator.component.html',
  styleUrls: ['./vcf-generator.component.scss']
})
export class VcfGeneratorComponent implements OnInit {

  public vcfOutput: VcfOutputModel = {
    XSize: 5,
    YSize: 5,
    Booths: [{
        Size: BoothSizeEnum.Small,
        Width: 1,
        Height: 1,
        Align: BoothAlignmentEnum.XAxis,
        XPosition: 0.5,
        YPosition: 0.5
    }, 
    {
      Size: BoothSizeEnum.Large,
      Width: 2,
      Height: 1,
      Align: BoothAlignmentEnum.XAxis,
      XPosition: 1,
      YPosition: 2
    }],
  };

  public vcfSubject = new Subject();
  public vcfObservable = this.vcfSubject.asObservable();

  public booths = {
    small: {
      width: 1,
      height: 1,
    },
    large: {
      width: 2,
      height: 1,
    },
  }

  public final = [];

  public mapSideLength;

  public vcfSettingsForm: FormGroup;

  public ngOnInit() {

    this.vcfObservable.subscribe(()=> {
      console.log(this.final);
        
      this.vcfOutput = {
        Booths: this.final,
        XSize: this.mapSideLength,
        YSize: this.mapSideLength,
      }
    })

    this.vcfSettingsForm = new FormGroup({
      small: new FormControl(''),
      large: new FormControl(''),
    });
  }

  public createSvg() {
    const smallBoothsCount = this.vcfSettingsForm.controls.small.value;
    const largeBoothsCount = this.vcfSettingsForm.controls.large.value;

    const totalMapSize = smallBoothsCount * 1 + largeBoothsCount * 2;
    const mapSideLength = Math.floor(Math.sqrt(totalMapSize) + 1);
    
    this.mapSideLength = mapSideLength;

    const usedCoordinates = [];
    let spaceIsOverOnX = false;

    let spaceIsOverOnY = false;

    if(largeBoothsCount) {
      for (let index = 0; index < largeBoothsCount; index++) {
        if( index % 2 === 0 && !spaceIsOverOnX) {
          let x;
          let y;
         
          if(index === 0) {
            x = 0;
            y = 0;
          }
          else if (!spaceIsOverOnX && usedCoordinates[index-2].YPosition+2 < mapSideLength) {
            x = usedCoordinates[index-2].XPosition;
            y = usedCoordinates[index-2].YPosition + 1;
          }
          else if (!spaceIsOverOnX && usedCoordinates[index-2].YPosition+2 > mapSideLength) {
            x = usedCoordinates[index-1].XPosition+4>mapSideLength ? alert('3') :  usedCoordinates[index-1].XPosition+2;
            y = usedCoordinates[index-1].YPosition;
          } 

          x = index > 0 ? usedCoordinates[index-2].XPosition : index;
          y = index > 0 ? usedCoordinates[index-2].YPosition+2 > mapSideLength ? alert('2') : usedCoordinates[index-2].YPosition + 1 : index;

          this.final.push({
            Size: BoothSizeEnum.Large,
            Width: 2,
            Height: 1,
            Align: BoothAlignmentEnum.XAxis,
            XPosition: x,
            YPosition: y,
          });  
        } 
        else if (!spaceIsOverOnX) {
          let x;
          let y;

          if (index === 1) {
            x = usedCoordinates[index-1].XPosition+2;
            y = usedCoordinates[index-1].YPosition;

            if(usedCoordinates[index-1].XPosition+4>mapSideLength) {
              spaceIsOverOnX = true;

              x = usedCoordinates[index-1].XPosition;
              y = usedCoordinates[index-1].YPosition+2>mapSideLength?alert('5') : usedCoordinates[index-1].YPosition+1;
            }
          } 
          else {
            x =  usedCoordinates[index-2].XPosition+4>mapSideLength ? alert('1') :
            usedCoordinates[index-2].XPosition+2;
            y = usedCoordinates[index-2].YPosition;
          } 

          this.final.push({
              Size: BoothSizeEnum.Large,
              Width: 2,
              Height: 1,
              Align: BoothAlignmentEnum.XAxis,
              XPosition: x,
              YPosition: y,
            }); 
            return;
        } else if (spaceIsOverOnX) {
          let x;
          let y;

          if (usedCoordinates[index-1].YPosition+2<mapSideLength) {
            x = usedCoordinates[index-1].XPosition;
            y = usedCoordinates[index-1].YPosition+1;
            this.final.push({
              Size: BoothSizeEnum.Large,
              Width: 2,
              Height: 1,
              Align: BoothAlignmentEnum.XAxis,
              XPosition: x,
              YPosition: y,
            }); 
          }
          else if(usedCoordinates[index-1].YPosition+2>mapSideLength) {
            spaceIsOverOnY = true;
            console.log('spaceIsOverOnY');
            
            let remainingPositions = [];
            //GIant for
            for (let i = 0; i < mapSideLength; i ++) {
              for (let j = 0; j < mapSideLength; j ++) {
                usedCoordinates.forEach((coord)=> {
                  if(coord.XPosition !== i && coord.YPosition !== j &&
                    (coord.Align === BoothAlignmentEnum.XAxis && coord.Width-1 + coord.XPosition !== i && coord.Height-1 + coord.YPosition !== j) ||
                    (coord.Align === BoothAlignmentEnum.YAxis && coord.Height-1 + coord.XPosition !== i && coord.Width-1 + coord.YPosition !== j) 
                    ) {
                    remainingPositions.push({
                      x: i,
                      y: j,
                    })
                  }
                  
                })
              }
            }
            //-----
            x = remainingPositions[0].x;
            y = remainingPositions[0].y;

            console.log(usedCoordinates);
            console.log(remainingPositions);
            
            this.final.push({
              Size: BoothSizeEnum.Large,
              Width: 2,
              Height: 1,
              Align: BoothAlignmentEnum.YAxis,
              XPosition: remainingPositions[0].x,
              YPosition: remainingPositions[0].y,
            }); 

            usedCoordinates.push({
              XPosition: this.final[index].XPosition,
              YPosition: this.final[index].YPosition,
              Align: BoothAlignmentEnum.YAxis,
              Width: 2,
              Height: 1,
            })

            this.vcfSubject.next({
              XPosition: this.final[index].XPosition,
              YPosition: this.final[index].YPosition,
              Align: BoothAlignmentEnum.YAxis,
              Width: 2,
              Height: 1,
            })
            return;
          }         
        }
          
        usedCoordinates.push({
          XPosition: this.final[index].XPosition,
          YPosition: this.final[index].YPosition,
          Align:  this.final[index].Align,
          Width: 2,
          Height: 1,
        })
        this.vcfSubject.next({
          XPosition: this.final[index].XPosition,
          YPosition: this.final[index].YPosition,
          Align:  this.final[index].Align,
          Width: 2,
          Height: 1,
        })

      }       
    }
   
    // for (let i = 1; i < smallBoothsCount+1; i ++) {
      //   final.push({
        //     Size: BoothSizeEnum.Small,
        //     Width: 1,
        //     Height: 1,
    //     Align: BoothAlignmentEnum.XAxis,
    //     XPosition: i*2-1,
    //     YPosition: i
    //   })
    // }

    // this.vcfOutput = {
    //   XSize: 7,
    //   YSize: 7,
    //   Booths: [
    //     {
    //       Size: BoothSizeEnum.Large,
    //       Width: 1,
    //       Height: 3,
    //       XPosition: 5,
    //       YPosition: 2,
    //       Align: BoothAlignmentEnum.YAxis
    //     },
    //     {
    //       Size: BoothSizeEnum.Large,
    //       Width: 1,
    //       Height: 3,
    //       XPosition: 5,
    //       YPosition: 2,
    //       Align: BoothAlignmentEnum.YAxis
    //     },
    //     {
    //       Size:  BoothSizeEnum.Large,
    //       Width: 1,
    //       Height: 3,
    //       XPosition: 5,
    //       YPosition: 2,
    //       Align: BoothAlignmentEnum.YAxis
    //     },
    //     {
    //       Size:  BoothSizeEnum.Large,
    //       Width: 1,
    //       Height: 3,
    //       XPosition: 6,
    //       YPosition: 2,
    //       Align: BoothAlignmentEnum.YAxis
    //     },
    //     {
    //       Size:  BoothSizeEnum.Large,
    //       Width: 1,
    //       Height: 3,
    //       XPosition: 6,
    //       YPosition: 2,
    //       Align: BoothAlignmentEnum.YAxis
    //     },
    //     {
    //       Size:  BoothSizeEnum.Large,
    //       Width: 1,
    //       Height: 3,
    //       XPosition: 6,
    //       YPosition: 2,
    //       Align: BoothAlignmentEnum.YAxis
    //     },
    //     {
    //       Size:  BoothSizeEnum.Large,
    //       Width: 1,
    //       Height: 3,
    //       XPosition: 4,
    //       YPosition: 5,
    //       Align: BoothAlignmentEnum.YAxis
    //     },
    //     {
    //       Size:  BoothSizeEnum.Large,
    //       Width: 1,
    //       Height: 3,
    //       XPosition: 4,
    //       YPosition: 5,
    //       Align: BoothAlignmentEnum.YAxis
    //     },
    //     {
    //       Size:  BoothSizeEnum.Large,
    //       Width: 1,
    //       Height: 3,
    //       XPosition: 4,
    //       YPosition: 5,
    //       Align: BoothAlignmentEnum.YAxis
    //     },
    //     {
    //       Size:  BoothSizeEnum.Large,
    //       Width: 1,
    //       Height: 3,
    //       XPosition: 3,
    //       YPosition: 5,
    //       Align: BoothAlignmentEnum.YAxis
    //     },
    //     {
    //       Size:  BoothSizeEnum.Large,
    //       Width: 1,
    //       Height: 3,
    //       XPosition: 3,
    //       YPosition: 5,
    //       Align: BoothAlignmentEnum.YAxis
    //     },
    //     {
    //       Size:  BoothSizeEnum.Large,
    //       Width: 1,
    //       Height: 3,
    //       XPosition: 3,
    //       YPosition: 5,
    //       Align: BoothAlignmentEnum.YAxis
    //     },
    //     {
    //       Size:  BoothSizeEnum.Large,
    //       Width: 1,
    //       Height: 3,
    //       XPosition: 3,
    //       YPosition: 2,
    //       Align: BoothAlignmentEnum.YAxis
    //     },
    //     {
    //       Size:  BoothSizeEnum.Large,
    //       Width: 1,
    //       Height: 3,
    //       XPosition: 3,
    //       YPosition: 2,
    //       Align: BoothAlignmentEnum.YAxis
    //     },
    //     {
    //       Size:  BoothSizeEnum.Large,
    //       Width: 1,
    //       Height: 3,
    //       XPosition: 3,
    //       YPosition: 2,
    //       Align: BoothAlignmentEnum.YAxis
    //     },
    //     {
    //       Size:  BoothSizeEnum.Large,
    //       Width: 1,
    //       Height: 3,
    //       XPosition: 4,
    //       YPosition: 2,
    //       Align: BoothAlignmentEnum.YAxis
    //     },
    //     {
    //       Size:  BoothSizeEnum.Large,
    //       Width: 1,
    //       Height: 3,
    //       XPosition: 4,
    //       YPosition: 2,
    //       Align: BoothAlignmentEnum.YAxis
    //     },
    //     {
    //       Size:  BoothSizeEnum.Large,
    //       Width: 1,
    //       Height: 3,
    //       XPosition: 4,
    //       YPosition: 2,
    //       Align: BoothAlignmentEnum.YAxis
    //     },
    //     {
    //       Size:  BoothSizeEnum.Large,
    //       Width: 1,
    //       Height: 3,
    //       XPosition: 2,
    //       YPosition: 6,
    //       Align: BoothAlignmentEnum.YAxis
    //     },
    //     {
    //       Size:  BoothSizeEnum.Large,
    //       Width: 1,
    //       Height: 3,
    //       XPosition: 2,
    //       YPosition: 6,
    //       Align: BoothAlignmentEnum.YAxis
    //     },
    //     {
    //       Size:  BoothSizeEnum.Large,
    //       Width: 1,
    //       Height: 3,
    //       XPosition: 2,
    //       YPosition: 6,
    //       Align: BoothAlignmentEnum.YAxis
    //     },
    //     {
    //       Size:  BoothSizeEnum.Small,
    //       Width: 1,
    //       Height: 2,
    //       XPosition: 2,
    //       YPosition: 2,
    //       Align: BoothAlignmentEnum.YAxis
    //     },
    //     {
    //       Size:  BoothSizeEnum.Small,
    //       Width: 1,
    //       Height: 2,
    //       XPosition: 2,
    //       YPosition: 2,
    //       Align: BoothAlignmentEnum.YAxis
    //     },
    //     {
    //       Size:  BoothSizeEnum.Small,
    //       Width: 2,
    //       Height: 1,
    //       XPosition: 4,
    //       YPosition: 6,
    //       Align: BoothAlignmentEnum.YAxis
    //     },
    //     {
    //       Size:  BoothSizeEnum.Small,
    //       Width: 2,
    //       Height: 1,
    //       XPosition: 4,
    //       YPosition: 6,
    //       Align: BoothAlignmentEnum.YAxis
    //     },
    //     {
    //       Size:  BoothSizeEnum.Small,
    //       Width: 2,
    //       Height: 1,
    //       XPosition: 6,
    //       YPosition: 3,
    //       Align: BoothAlignmentEnum.XAxis
    //     },
    //     {
    //       Size:  BoothSizeEnum.Small,
    //       Width: 2,
    //       Height: 1,
    //       XPosition: 6,
    //       YPosition: 3,
    //       Align: BoothAlignmentEnum.XAxis
    //     },
    //     {
    //       Size:  BoothSizeEnum.Small,
    //       Width: 1,
    //       Height: 2,
    //       XPosition: 1,
    //       YPosition: 4,
    //       Align: BoothAlignmentEnum.YAxis
    //     },
    //     {
    //       Size:  BoothSizeEnum.Small,
    //       Width: 1,
    //       Height: 2,
    //       XPosition: 1,
    //       YPosition: 4,
    //       Align: BoothAlignmentEnum.YAxis
    //     },
    //     {
    //       Size:  BoothSizeEnum.Small,
    //       Width: 1,
    //       Height: 2,
    //       XPosition: 1,
    //       YPosition: 2,
    //       Align: BoothAlignmentEnum.YAxis
    //     },
    //     {
    //       Size:  BoothSizeEnum.Small,
    //       Width: 1,
    //       Height: 2,
    //       XPosition: 1,
    //       YPosition: 2,
    //       Align: BoothAlignmentEnum.YAxis
    //     },
    //     {
    //       Size:  BoothSizeEnum.Small,
    //       Width: 1,
    //       Height: 2,
    //       XPosition: 1,
    //       YPosition: 6,
    //       Align: BoothAlignmentEnum.YAxis
    //     },
    //     {
    //       Size:  BoothSizeEnum.Small,
    //       Width: 1,
    //       Height: 2,
    //       XPosition: 1,
    //       YPosition: 6,
    //       Align: BoothAlignmentEnum.YAxis
    //     },
    //     {
    //       Size:  BoothSizeEnum.Small,
    //       Width: 1,
    //       Height: 2,
    //       XPosition: 0,
    //       YPosition: 6,
    //       Align: BoothAlignmentEnum.YAxis
    //     },
    //     {
    //       Size:  BoothSizeEnum.Small,
    //       Width: 1,
    //       Height: 2,
    //       XPosition: 0,
    //       YPosition: 6,
    //       Align: BoothAlignmentEnum.YAxis
    //     },
    //     {
    //       Size:  BoothSizeEnum.Small,
    //       Width: 1,
    //       Height: 2,
    //       XPosition: 0,
    //       YPosition: 4,
    //       Align: BoothAlignmentEnum.YAxis
    //     },
    //     {
    //       Size:  BoothSizeEnum.Small,
    //       Width: 1,
    //       Height: 2,
    //       XPosition: 0,
    //       YPosition: 4,
    //       Align: BoothAlignmentEnum.YAxis
    //     },
    //     {
    //       Size:  BoothSizeEnum.Small,
    //       Width: 2,
    //       Height: 1,
    //       XPosition: 2,
    //       YPosition: 0,
    //       Align: BoothAlignmentEnum.YAxis
    //     },
    //     {
    //       Size:  BoothSizeEnum.Small,
    //       Width: 2,
    //       Height: 1,
    //       XPosition: 2,
    //       YPosition: 0,
    //       Align: BoothAlignmentEnum.YAxis
    //     },
    //     {
    //       Size:  BoothSizeEnum.Small,
    //       Width: 1,
    //       Height: 2,
    //       XPosition: 0,
    //       YPosition: 1,
    //       Align: BoothAlignmentEnum.YAxis
    //     },
    //     {
    //       Size:  BoothSizeEnum.Small,
    //       Width: 1,
    //       Height: 2,
    //       XPosition: 0,
    //       YPosition: 1,
    //       Align: BoothAlignmentEnum.YAxis
    //     }
    //   ],
    // }
    
    
  }
    public getNewCoordinates() {
      	return
    }
}
