import { Component, OnInit } from '@angular/core';
import * as Zim from 'zimjs'
require('@danzen/createjs');

@Component({
  selector: 'app-zimjs',
  templateUrl: './zimjs.component.html',
  styleUrls: ['./zimjs.component.scss']
})
export class ZimjsComponent implements OnInit {
  public ngOnInit() {
    const zim = Zim.makeZIM(); // pass in true to use zim namespace **
    const [zog,zid,zss,zgo,zum,zot,zop,zil,zet,zob,zik,zta] = zim.getGlobals();

    const scaling = "fit"; // this will resize to fit inside the screen dimensions
    const width = 1024;
    const height = 768;
    const color = 'blue';
    const outerColor = 'yellow';

    const frame = new Zim.Frame(scaling, width, height, color, outerColor);
    frame.on("ready", function() {
        zog("ready from ZIM Frame"); // logs in console (F12 - choose console)

        const stage = frame.stage;
        const stageW = frame.width;
        const stageH = frame.height;

        new Zim.Circle(100, 'blue').center().drag();


        stage.update(); 

    }); 
  }

}
