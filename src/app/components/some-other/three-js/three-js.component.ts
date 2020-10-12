import { Component, OnInit } from '@angular/core';
import * as THREE from 'three';
import { Vector3 } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { ExtrudeGeometryOptions } from 'three/src/geometries/ExtrudeBufferGeometry';
@Component({
  selector: 'app-three-js',
  templateUrl: './three-js.component.html',
  styleUrls: ['./three-js.component.scss']
})
export class ThreeJsComponent {
  public renderer;
  public scene;
  public camera;
  public controls;

  public controlsKeys = {
    LEFT: 37, //left arrow
    UP: 38, // up arrow
    RIGHT: 39, // right arrow
    BOTTOM: 40 // down arrow
  }
  public  map404 = [
    [0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 0],
    [0, 0, 1, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 1, 0],
    [0, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 1, 0],
    [1, 1, 1, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 1, 1, 1],
    [0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0],
    [0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 0]
  ];

  public roundedBoxGeometry = this.createBoxWithRoundedEdges(1, 1, 1, .25, 3);

  public boxes = [];

  public mapConfig;

  constructor() {
    this.getMapConfigs();
    this.initSceneConfigurations();
    this.buildVcfGround();

    this.render();
  }

  public initSceneConfigurations() {

    let XSize = 10;
    let YSize = 10;

    // this.renderer
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( this.renderer.domElement );
  
    // this.scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color( 0xffffff );
   
    // this.camera
    const aspect = window.innerWidth / window.innerHeight;
    const width = 1024;
    const height = 768;
    const d = XSize/2;
    this.camera = new THREE.OrthographicCamera( -d * aspect, d * aspect, d, -d, 0, 1000 );
    this.camera.position.set( 10, 18.5, 12 );
    
    this.camera.translateX( XSize/3 );
    this.camera.translateY( -YSize*0.8);
  
    this.controls = new OrbitControls( this.camera, this.renderer.domElement );
    this.controls.addEventListener( 'change', ()=> {
      this.render();
    });
    this.controls.enableZoom = false;
    this.controls.enablePan = false;
    this.controls.minPolarAngle = Math.PI / 3;
    this.controls.maxPolarAngle = Math.PI / 4;
  
    // ambient
    this.scene.add( new THREE.AmbientLight( 0xffffff ) );
  
    // axes
    this.scene.add( new THREE.AxesHelper( 40 ) ); 
  }
  
  public render() {
    this.renderer.render( this.scene, this.camera );
  }

  public buildVcfGround() {
    // let cutsOff = [
    //   {
    //     xPosition: 0,
    //     yPosition: 0,
    //   },
    //   {
    //     xPosition: 0,
    //     yPosition: 1,
    //   },
    // ]

    // var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    // const boxMesh = new THREE.Mesh(this.getSquareShape(10,10),material);
    // // boxMesh.position.set(0,0,0);
    // this.scene.add(boxMesh);

    // cutsOff.forEach((cutOff)=> {
    // var material = new THREE.MeshBasicMaterial( { color: 0xffffff } );

    //   const cutOffMesh = new THREE.Mesh(this.getCutsOff(1,1),material);
    //   cutOffMesh.position.set(cutOff.xPosition, cutOff.yPosition, 0);
    //   cutOffMesh.rotation.x = Math.PI / 2;

    //   this.scene.add(cutOffMesh);
    // })
    
    const ground = this.getSquareShape(10,10,0.1);
    this.addBoxToScene('#EDF5FF', ground, 0, 1, 0);

    const groundBorder = this.getSquareShape(10,10,0.1);
    this.addBoxToScene('#C6D8EE', groundBorder, 0, 0.9, 0);

    const groundShade = this.getSquareShape(10,10,0);
    this.addBoxToScene('#E8ECF1', groundShade, 0, 0, 0);

    // for (let y = 0; y < this.map404.length; y++) {
    //   for (let x = 0; x < this.map404[0].length; x++) {
    //     if (this.map404[y][x] === 0) continue;
    //     const roundedBox = new THREE.Mesh(this.roundedBoxGeometry,  new THREE.MeshLambertMaterial({
    //       color: new THREE.Color("#ffffff").clone(),
    //     }));
    //     roundedBox.position.set(x - 8,20, y - 2);
    //     this.scene.add(roundedBox);
    //     this.boxes.push(roundedBox);
    //   }
    // }
  }

  public addBoxToScene(color: string, box, xPosition, yPosition, zPosition) {
    const material = new THREE.MeshLambertMaterial({
      color: new THREE.Color(color).clone(),
    });
    const boxMesh = new THREE.Mesh(box, material);
    boxMesh.rotation.x = Math.PI / 2;

    boxMesh.position.set(xPosition, yPosition, zPosition);
    this.scene.add(boxMesh);
  }

  public createBoxWithRoundedEdges(width, height, depth, radius0, smoothness) {
    const shape = new THREE.Shape();
    const eps = 0.00001;
    const radius = radius0 - eps;
    shape.absarc(eps, eps, eps, -Math.PI / 2, -Math.PI, true);
    shape.absarc(eps, height - radius * 2, eps, Math.PI, Math.PI / 2, true);
    shape.absarc(width - radius * 2, height - radius * 2, eps, Math.PI / 2, 0, true);
    shape.absarc(width - radius * 2, eps, eps, 0, -Math.PI / 2, true);

    const geometry = new THREE.ExtrudeBufferGeometry(shape, {
      amount: depth-radius0*2,
      bevelEnabled: true,
      bevelSegments: smoothness * 2,
      steps: 1,
      bevelSize: radius,
      bevelThickness: radius0,
      curveSegments: smoothness
    } as ExtrudeGeometryOptions );

    geometry.center();
    
    return geometry;
  }

  public getSquareShape(XSize, YSize, depth) {
    let startXPosition = -XSize/2;
    let startYPosition = -YSize/2;
    let radius = 0.01;
    var shape = new THREE.Shape();
    shape.moveTo(startXPosition, YSize*radius+startYPosition);
    shape.lineTo(startXPosition, YSize - YSize*radius+startYPosition);
    shape.bezierCurveTo(startXPosition, YSize - YSize*radius+startYPosition, startXPosition, YSize+startYPosition, XSize*radius+startXPosition, YSize+startYPosition);
    shape.lineTo(XSize - XSize*radius+startXPosition, YSize+startYPosition);
    shape.bezierCurveTo(XSize - XSize*radius +startXPosition, YSize+startYPosition, XSize+startXPosition, YSize+startYPosition, XSize+startXPosition, YSize - YSize*radius+startYPosition);
    shape.lineTo(XSize+startXPosition, YSize*radius+startYPosition);
    shape.bezierCurveTo(XSize+startXPosition, YSize*radius+startYPosition, XSize+startXPosition, startYPosition, XSize - XSize*radius+startXPosition, startYPosition);
    shape.lineTo(XSize*radius+startXPosition, startYPosition);
    shape.bezierCurveTo(XSize*radius+startXPosition, startYPosition, startXPosition, startYPosition, startXPosition, YSize*radius+startYPosition);

    var extrudeSettings = {
        steps: 1, 
        depth: depth,
        bevelEnabled: true,
        bevelThickness: 0.1, 
        bevelSize: 0.5,
        bevelSegments: 2,
        curveSegments: 0,
    };
    var geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    
    return geometry;
  }

  // public getCutsOff(XSize, YSize) {
  
  //   let radius = 0.01;
  //   var shape = new THREE.Shape();
  //   shape.moveTo(0, YSize*radius);
  //   shape.lineTo(0, YSize - YSize*radius);
  //   shape.bezierCurveTo(0, YSize - YSize*radius, 0,YSize, XSize*radius, YSize);
  //   shape.lineTo(XSize - XSize*radius, YSize);
  //   shape.bezierCurveTo(XSize - XSize*radius, YSize, XSize, YSize, XSize, YSize - YSize*radius);
  //   shape.lineTo(XSize, YSize*radius);
  //   shape.bezierCurveTo(XSize, YSize*radius, XSize, 0, XSize - XSize*radius, 0);
  //   shape.lineTo(XSize*radius, 0);
  //   shape.bezierCurveTo(XSize*radius, 0, 0, 0, 0, YSize*radius);

  //   // shape.rotate
  //   // shape.lineTo(0, -2.5);
  //   // shape.lineTo(-2, -0.5); 
  //   // shape.bezierCurveTo(-4, 1.5, -2, 3.5, 0, 1.5);

  //   var extrudeSettings = {
  //       steps: 1, //用于沿着挤出样条的深度细分的点的数量，默认值为1
  //       depth: 0.2, //挤出的形状的深度，默认值为100
  //       bevelEnabled: true, //对挤出的形状应用是否斜角，默认值为true
  //       bevelThickness: 0.3, //设置原始形状上斜角的厚度。默认值为6
  //       bevelSize: 0.5, //斜角与原始形状轮廓之间的延伸距离
  //       bevelSegments: 2, //斜角的分段层数，默认值为3
  //       curveSegments: 0, //曲线上点的数量，默认值是12
  //   };
  //   var grometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
  //   return grometry;
  // }

  public getMapConfigs() {
    this.mapConfig = {
      XSize: 8,
      YSize: 8,
      Booths: [
        {
          Size: 'Large',
          xPosition: 0,
          yPosition: 0,
        },
        {
          Size: 'Small',
          xPosition: 0,
          yPosition: 3,
        },
        {
          Size: 'Small',
          xPosition: 2,
          yPosition: 1,
        }
      ],
      CutsOff: [
        {
          xPosition: 0,
          yPosition: 3,
        }
      ]
    }
  }
}
