import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public mapDefaultSideSizes = {
    Width: 0.77265,
    Height: 0.71165,
  }

  public configuredMapSize;

  public booths = [];

  constructor(
    private http: HttpClient,
  ){
    this.getMapConfiguration().then((data)=> {
      this.configuredMapSize = data.Map.XSize;
      
      const squareSize = {
        Height: this.mapDefaultSideSizes.Height/this.configuredMapSize,
        Width: this.mapDefaultSideSizes.Width/this.configuredMapSize,
      }

      // const singleSquareIpotenuza = Math.sqrt(squareSize.Height*squareSize.Height + squareSize.Width*squareSize.Width);;
      // const distanceHeightBetweenTwoSquares = squareSize.Height/Math.sqrt(3);
      
      data.Map.Booths.forEach((booth) => {
        const bigSquareSize = {
          Height: booth.XPosition * squareSize.Height,
          Width: booth.YPosition * squareSize.Width,
        }
        
        const newXPosition = Math.asin(30) * bigSquareSize.Width;
        console.log(Math.asin(30));
        const newYPosition = Math.sqrt(bigSquareSize.Height*bigSquareSize.Height + bigSquareSize.Width*bigSquareSize.Width);
        
        this.booths.push({
          Alignment: booth.Align,
          XPosition: booth.XPosition,
          YPosition: booth.YPosition,
          Height: booth.Height,
          Width: booth.Width,
          NewXPosition: newXPosition,
          NewYPosition: newYPosition,
        })
      });
      
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
