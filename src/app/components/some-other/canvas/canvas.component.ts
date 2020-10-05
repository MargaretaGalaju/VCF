import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss']
})
export class CanvasComponent implements OnInit {
  public canvas;

  public context;

  public width;

  public height;
  
  public tileHeight = 50;
  public tileWidth = 50;

  constructor() { }

  ngOnInit() {
    this.canvas = document.getElementById('canvas')
    this.context = this.canvas.getContext("2d");
    this.width = this.canvas.width = window.innerWidth;
    this.height = this.canvas.height = window.innerHeight;
    
    this.context.translate(this.width / 2, 50, 20);

    this.drawTile(0, 0, 'red');
  }

  public drawTile(x,y, color) {
    this.context.save();
    this.context.translate(x,y);
    
    this.context.beginPath();
    this.context.moveTo(0,0);
    this.context.lineTo(this.tileWidth / 2, this.tileHeight/2)
    this.context.lineTo(0, this.tileHeight)
    this.context.lineTo(-this.tileHeight/2, this.tileHeight/2)
    this.context.closePath();
    this.context.fillStyle = color;
    this.context.fill()
    this.context.restore();
  }
}
