import { HttpClient } from '@angular/common/http';
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
    LEFT: 37, 
    UP: 38, 
    RIGHT: 39, 
    BOTTOM: 40,
  }

  public  map404 = [
    [0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 0],
    [0, 0, 1, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 1, 0],
    [0, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 1, 0],
    [1, 1, 1, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 1, 1, 1],
    [0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0],
    [0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 0]
  ];

  public boxes = [];

  public mapConfig;

  public mapPadding = 0.5;

  constructor(
    private http: HttpClient,
  ) {
    this.getMapConfiguration().then((data)=> {
      this.mapConfig = data;
      this.initSceneConfigurations();
      this.buildVcfGround();

      this.drawBooth();
      
      this.render();
    });
  }

  public initSceneConfigurations() {
    let XSize = this.mapConfig.Map.XSize;
    let YSize = this.mapConfig.Map.YSize;

    // this.renderer
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( this.renderer.domElement );
  
    // this.scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color( 0xffffff );
    // this.camera
    const aspect = window.innerWidth / window.innerHeight;
    const d = XSize*0.6;
    
    this.camera = new THREE.OrthographicCamera( -d * aspect, d * aspect, d, -d, 0, 1000 );
    this.camera.position.set( 12, 12, 12 );
    
    this.camera.translateX( XSize/3 );
    this.camera.translateY( -YSize*0.8 );
  
    this.controls = new OrbitControls( this.camera, this.renderer.domElement );
    this.controls.addEventListener( 'change', ()=> {
      this.render();
    });

    this.controls.enableZoom = false;
    this.controls.enablePan = false;
    this.controls.minPolarAngle = Math.PI / 3.25;
    this.controls.maxPolarAngle = Math.PI / 2.25;

    // ambient
    this.scene.add( new THREE.AmbientLight( 0xffffff ) );
  
    // axes
    this.scene.add( new THREE.AxesHelper( 40 ) ); 
  }
  
  public render() {
    this.renderer.render( this.scene, this.camera );
  }

  public buildVcfGround() {
    let groundSquareSize = this.mapConfig.Map.XSize + this.mapPadding;
    
    const ground = this.getPlaneSquareShape(groundSquareSize, groundSquareSize, 0.1, 0.1);
    this.addBoxToScene('#EDF5FF', ground, 0, -0.1, 0);

    const groundBorder = this.getPlaneSquareShape(groundSquareSize, groundSquareSize, 0.1, 0.1);
    this.addBoxToScene('#C6D8EE', groundBorder, 0, -0.15, 0);

    const groundShade = this.getPlaneSquareShape(groundSquareSize, groundSquareSize, 0, 0.1);
    this.addBoxToScene('#E8ECF1', groundShade, 0, -1, 0);

  }

  public addBoxToScene(color: string, box, xPosition, yPosition, zPosition, rotateX = true) {
    const material = new THREE.MeshLambertMaterial({
      color: new THREE.Color(color).clone(),
    });
    const boxMesh = new THREE.Mesh(box, material);
    boxMesh.rotation.x = rotateX ? Math.PI / 2 : 0;

    boxMesh.position.set(xPosition, yPosition, zPosition);
    this.scene.add(boxMesh);
  }

  public drawBooth() {
    let boothWidth = this.mapConfig.Map.Booths[0].Width;
    let boothHeight = this.mapConfig.Map.Booths[0].Height*0.8;
    // let boothXPosition = this.mapConfig.Map.Booths[0].XPosition;
    // let boothYPosition = this.mapConfig.Map.Booths[0].YPosition;

    let boothXPosition = this.mapConfig.Map.Booths[0].XPosition + this.mapPadding/2;
    let boothYPosition = this.mapConfig.Map.Booths[0].YPosition + this.mapPadding/2;
    

    let boothAlignemnt = this.mapConfig.Map.Booths[0].Align;

    const boothGroundBorder = this.getPlaneSquareShape(boothWidth, boothHeight, 0, 0.1);
    this.addBoxToScene('#89b2f1', boothGroundBorder, boothXPosition, 0, boothYPosition);

    const boothGround = this.getPlaneSquareShape(boothWidth, boothHeight, 0, 0.1);
    this.addBoxToScene('#D3E4FA', boothGround, boothXPosition, 0.025, boothYPosition);

    const imageStandBorder = this.getPlaneSquareShape(boothWidth*0.8, boothHeight*0.3, 0, 0.1);
    this.addBoxToScene('#89b2f1', imageStandBorder, boothXPosition+boothWidth*0.1, 0.050, boothYPosition);

    const imageStandGround = this.getPlaneSquareShape(boothWidth*0.8, boothHeight*0.3, 0, 0.1);
    this.addBoxToScene('#D3E4FA', imageStandGround, boothXPosition+boothWidth*0.1, 0.075, boothYPosition);

    const imageShade = this.getPlaneSquareShape(boothWidth*0.76, boothHeight*0.8, 0, 0.1);
    this.addBoxToScene('#D0D8E2', imageShade, boothXPosition+boothWidth*0.12, 0.075, boothYPosition+0.1, false);
    this.addBoxToScene('#D0D8E2', imageShade, boothXPosition+boothWidth*0.12, 0.06, boothYPosition+0.11, false);

    new THREE.TextureLoader().load('https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTi4pVNK8iiO4td_J27vL--njgZC-KkyYUOKw&usqp=CAU', (texture) => {
        const material = new THREE.MeshBasicMaterial({ 
          map: texture
        });
        material.map.needsUpdate = true; 

        const imageBox = new THREE.Mesh(imageShade, material);
        imageBox.position.set(boothXPosition+boothWidth*0.125, 0.07, boothYPosition+0.13);
        this.scene.add(imageBox);
    });

    const boxGroundBorder = this.getPlaneSquareShape(boothWidth*0.25, boothWidth*0.25, 0, 0);
    this.addBoxToScene('#89b2f1', boxGroundBorder, boothXPosition+boothWidth*0.375, 0.05, boothYPosition+boothHeight*0.4);
    
    const box = new THREE.BoxGeometry( boothWidth*0.25, boothWidth*0.25, boothWidth*0.25 );
    box.faces[0].color.set('#d3e3f9');
    box.faces[1].color.set('#d3e3f9');
    box.faces[2].color.set('#f4f8ff');
    box.faces[3].color.set('#f4f8ff');
    box.faces[8].color.set('#e7eefb');
    box.faces[9].color.set('#e7eefb');
    box.colorsNeedUpdate = true;
    const mesh = new THREE.Mesh(box,  new THREE.MeshBasicMaterial( { color: '#f4f8ff', vertexColors: true } ));
    mesh.position.set(boothXPosition+boothWidth*0.5, 0.18, boothYPosition+boothHeight*0.55)
    this.scene.add(mesh);

    const redSmallBox = new THREE.BoxGeometry( boothWidth*0.07, boothWidth*0.07, boothWidth*0.07 );
    redSmallBox.faces[0].color.set('#ff2a47');
    redSmallBox.faces[1].color.set('#ff2a47');
    redSmallBox.faces[4].color.set('#ffadae');
    redSmallBox.faces[5].color.set('#ffadae');
    redSmallBox.faces[2].color.set('#ff897d');
    redSmallBox.faces[3].color.set('#ff897d');
    redSmallBox.faces[8].color.set('#ff5a73');
    redSmallBox.faces[9].color.set('#ff5a73');
    redSmallBox.colorsNeedUpdate = true;
    const redSmallBoxMesh = new THREE.Mesh(redSmallBox,  new THREE.MeshBasicMaterial( { color: '#ffadae', vertexColors: true } ));
    redSmallBoxMesh.position.set(boothXPosition+boothWidth*0.5, 0.6, boothYPosition+boothHeight*0.55)
    this.scene.add(redSmallBoxMesh);
    
    const redSmallBoxMesh2 = redSmallBoxMesh.clone();
    redSmallBoxMesh2.position.set(boothXPosition+boothWidth*0.5, 0.4, boothYPosition+boothHeight*0.55)
    this.scene.add(redSmallBoxMesh2);

    const redBoxTransparent = new THREE.BoxGeometry( boothWidth*0.15, boothWidth*0.5, boothWidth*0.15 );
    const redBoxTransparentMesh = new THREE.Mesh(redBoxTransparent,  new THREE.MeshBasicMaterial( { color: '#ff8e7d', vertexColors: true, opacity: 0.5, transparent: true } ));
    redBoxTransparentMesh.position.set(boothXPosition+boothWidth*0.5, 0.18+boothWidth*0.25, boothYPosition+boothHeight*0.55)
    this.scene.add(redBoxTransparentMesh);

  }

  public getSquareShape(XSize, YSize, depth, radius) {
    let startXPosition = XSize;
    let startYPosition = YSize;
    const shape = new THREE.Shape();
    shape.moveTo(startXPosition, YSize*radius+startYPosition);
    shape.lineTo(startXPosition, YSize - YSize*radius+startYPosition);
    shape.bezierCurveTo(startXPosition, YSize - YSize*radius+startYPosition, startXPosition, YSize+startYPosition, XSize*radius+startXPosition, YSize+startYPosition);
    shape.lineTo(XSize - XSize*radius+startXPosition, YSize+startYPosition);
    shape.bezierCurveTo(XSize - XSize*radius +startXPosition, YSize+startYPosition, XSize+startXPosition, YSize+startYPosition, XSize+startXPosition, YSize - YSize*radius+startYPosition);
    shape.lineTo(XSize+startXPosition, YSize*radius+startYPosition);
    shape.bezierCurveTo(XSize+startXPosition, YSize*radius+startYPosition, XSize+startXPosition, startYPosition, XSize - XSize*radius+startXPosition, startYPosition);
    shape.lineTo(XSize*radius+startXPosition, startYPosition);
    shape.bezierCurveTo(XSize*radius+startXPosition, startYPosition, startXPosition, startYPosition, startXPosition, YSize*radius+startYPosition);

    const extrudeSettings = {
        steps: 0, 
        depth: depth,
        bevelEnabled: true,
        bevelThickness: 0.1, 
        bevelSize: 0.05,
        bevelSegments: 20,
        curveSegments: 100,
    };

    const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    return geometry;
  }

  public getPlaneSquareShape(XSize, YSize, depth, radius) {
    let startXPosition = 0;
    let startYPosition = 0;
    const shape = new THREE.Shape();
    shape.moveTo(startXPosition, YSize*radius+startYPosition);
    shape.lineTo(startXPosition, YSize - YSize*radius+startYPosition);
    shape.bezierCurveTo(startXPosition, YSize - YSize*radius+startYPosition, startXPosition, YSize+startYPosition, XSize*radius+startXPosition, YSize+startYPosition);
    shape.lineTo(XSize - XSize*radius+startXPosition, YSize+startYPosition);
    shape.bezierCurveTo(XSize - XSize*radius +startXPosition, YSize+startYPosition, XSize+startXPosition, YSize+startYPosition, XSize+startXPosition, YSize - YSize*radius+startYPosition);
    shape.lineTo(XSize+startXPosition, YSize*radius+startYPosition);
    shape.bezierCurveTo(XSize+startXPosition, YSize*radius+startYPosition, XSize+startXPosition, startYPosition, XSize - XSize*radius+startXPosition, startYPosition);
    shape.lineTo(XSize*radius+startXPosition, startYPosition);
    shape.bezierCurveTo(XSize*radius+startXPosition, startYPosition, startXPosition, startYPosition, startXPosition, YSize*radius+startYPosition);

    const extrudeSettings = {
        steps: 0, 
        depth: depth,
        bevelEnabled: false,
        bevelThickness: 0.9, 
        bevelSize: 0.9,
        bevelSegments: 20,
        curveSegments: 10,
    };

    const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    return geometry;
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
