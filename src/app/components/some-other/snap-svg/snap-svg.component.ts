import { Component, OnInit } from '@angular/core';
import * as Snap from 'snapsvg';
// declare var Snap: any;
// declare var mina: any;
@Component({
  selector: 'app-snap-svg',
  templateUrl: './snap-svg.component.html',
  styleUrls: ['./snap-svg.component.scss']
})
export class SnapSvgComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    const s = Snap('#test');
    const c = s.circle(50, 50, 100);
  }

}
