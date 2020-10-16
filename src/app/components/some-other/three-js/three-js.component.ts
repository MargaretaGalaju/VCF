import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Color } from '@svgdotjs/svg.js';
import * as THREE from 'three';
import { Vector3 } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { ExtrudeGeometryOptions } from 'three/src/geometries/ExtrudeBufferGeometry';

enum InitialColorsEnum {
  darkRed  = '#ff897d',
  lightRed = '#ffadae',
  veryLightRed = '',
}

@Component({
  selector: 'app-three-js',
  templateUrl: './three-js.component.html',
  styleUrls: ['./three-js.component.scss']
})
export class ThreeJsComponent implements OnInit, AfterViewInit {
  public renderer: THREE.WebGLRenderer;

  public scene: THREE.Scene;

  public camera: THREE.OrthographicCamera;

  public controls: OrbitControls;

  public animatedElements = [];

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

  public boothGroupArray = [];

  public mouse;
  
  public raycaster: THREE.Raycaster;

  constructor(
    private http: HttpClient,
  ) {
    this.getMapConfiguration().then((data)=> {
      this.mapConfig = data;
      this.initSceneConfigurations();
      this.buildVcfGround();

      this.buildBooths()
      
      this.render();
      this.animate();
    });
  }

  
  public ngOnInit() {
    this.mouse = new THREE.Vector2();
    this.raycaster = new THREE.Raycaster();
  }

  public buildBooths() {
    this.mapConfig.Map.Booths.forEach((booth) => {
      const booth3DObject = this.getBoothObject(booth);
      const isBoothAlignedOnY = booth.Align === "YAxis";
      booth3DObject.position.set(booth.XPosition, 0, booth.YPosition);
      
      if(isBoothAlignedOnY) {
        booth3DObject.rotateY(Math.PI / 2);
        booth3DObject.position.set(booth.XPosition, 0, booth.YPosition+1);
        this.scene.add(booth3DObject);
        return;
      }

      this.scene.add(booth3DObject);
    });
  }

  public ngAfterViewInit() {
    window.addEventListener( 'mousemove', this.onMouseMove.bind(this) ); 
    window.addEventListener( 'click', this.onMouseDown.bind(this)  );
    // window.addEventListener('resize', this.onWindowResize.bind(this));		
  }

//   public onWindowResize() {
//     let windowHalfX = window.innerWidth / 2;
//     let windowHalfY = window.innerHeight / 2;
//     const aspect = window.innerWidth / window.innerHeight;
//     const d = this.mapConfig.Map.XSize*0.6;
    
//     // this.camera = new THREE.OrthographicCamera( -d * aspect, d * aspect, d, -d, 0, 1000 );
//     this.camera.updateProjectionMatrix();

//     this.renderer.setSize(window.innerWidth, window.innerHeight);					
// }

  public initSceneConfigurations() {
    let XSize = this.mapConfig.Map.XSize;
    let YSize = this.mapConfig.Map.YSize;

    // this.renderer
    this.renderer = new THREE.WebGLRenderer({antialias:true});
    this.renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( this.renderer.domElement );
  
    // this.scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color( 0xffffff );

    // this.camera
    const aspect = window.innerWidth / window.innerHeight;
    const d = XSize*0.6;
    
    this.camera = new THREE.OrthographicCamera( -d * aspect, d * aspect, d, -d, 0, 1000 );
    this.camera.position.set( XSize, XSize, XSize );

    // camera.lookAt(scene.position);

    this.controls = new OrbitControls( this.camera, this.renderer.domElement );

    this.controls.enableZoom = true;
    this.controls.enablePan = false;
    this.controls.minPolarAngle = Math.PI / 3.25;
    this.controls.maxPolarAngle = Math.PI / 3.25;

    this.controls.enableRotate = false;
    this.scene.translateY(XSize/1.75)
    // ambient
    this.scene.add( new THREE.AmbientLight( 0xffffff ) );
  
    // axes
    // this.scene.add( new THREE.AxesHelper( 40 ) ); 
  }
  
  public render() {
    this.renderer.render( this.scene, this.camera );
  } 

  public onMouseMove( event ) { 
    this.mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1; 
    this.mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1; 
  } 

  public onMouseDown( event ) { 
    this.mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1; 
    this.mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1; 

    this.raycaster.setFromCamera( this.mouse, this.camera );

    let intersects = this.raycaster.intersectObjects( this.scene.children , true );
    
    for ( let i = 0; i < intersects.length; i++ ) {
      const intersectedGroup = this.boothGroupArray.find((array)=> intersects[i].object.parent.uuid === array.uuid);

      if(intersectedGroup) {
        // console.log(intersectedGroup);
        intersectedGroup.children.forEach((child)=> {
          if(child.colorToChangeOnHover) {
            // child.material.color = child.colorToChangeOnHover;
          }
        })
        window.open(intersectedGroup.userData.url, '_blank');
      }
    }
  } 

  public animate() {
    requestAnimationFrame(this.animate.bind(this));
    console.log(this.camera);
    
    this.animatedElements.forEach((element)=> {
      element.rotation.y +=0.01;
    });

    this.raycaster.setFromCamera( this.mouse, this.camera );

    let intersects = this.raycaster.intersectObjects( this.scene.children , true );
    
    for ( let i = 0; i < intersects.length; i++ ) {
      const intersectedGroup = this.boothGroupArray.find((array)=> intersects[i].object.parent.uuid === array.uuid);

      if(intersectedGroup) {
        // console.log(intersectedGroup);
      }
    }
      
    this.renderer.render( this.scene, this.camera );
  }

  public buildVcfGround() {
    let groundSquareSize = this.mapConfig.Map.XSize + this.mapPadding;
    
    const ground = this.getPlaneSquareShape(groundSquareSize, groundSquareSize, 0.1, 0.1);
    this.addBoxToScene('#EDF5FF', ground, 0, -0.1, 0);

    const groundBorder = this.getPlaneSquareShape(groundSquareSize, groundSquareSize, 0.1, 0.1);
    this.addBoxToScene('#C6D8EE', groundBorder, 0, -0.15, 0);

    const groundShade = this.getPlaneSquareShape(groundSquareSize, groundSquareSize, 0, 0.1);
    this.addBoxToScene('#E8ECF1', groundShade, 0, -0.5, 0);
  }

  public addBoxToScene(color: string, box, xPosition, yPosition, zPosition, rotateX = true, groupToAdd = null){
    const material = new THREE.MeshLambertMaterial({
      color: new THREE.Color(color).clone(),
    });
    const boxMesh = new THREE.Mesh(box, material);
    boxMesh.rotation.x = rotateX ? Math.PI / 2 : 0;

    boxMesh.position.set(xPosition, yPosition, zPosition);
    this.scene.add(boxMesh);
  }

  public createMesh(color: string, box, xPosition, yPosition, zPosition, rotateX = true): THREE.Mesh<any, THREE.MeshLambertMaterial> {
    const material = new THREE.MeshLambertMaterial({
      color: new THREE.Color(color).clone(),
    });
    const boxMesh = new THREE.Mesh(box, material);
    boxMesh.rotation.x = rotateX ? Math.PI / 2 : 0;

    boxMesh.position.set(xPosition, yPosition, zPosition);
    return boxMesh;
  }

  public getBoothObject(booth): THREE.Object3D {
    const boothGroup = new THREE.Object3D();

    let boothWidth = booth.Width*0.9;
    let boothHeight = booth.Height*0.8;

    // let 0 = booth.XPosition + this.mapPadding/2;
    // let 0 = booth.YPosition + this.mapPadding/2;
    
    let boothAlignment = booth.Align;

    const boothGroundBorder = this.getPlaneSquareShape(boothWidth, boothHeight, 0, 0.1);
    boothGroup.add(this.createMesh('#89b2f1', boothGroundBorder, 0, 0, 0));

    const boothGround = this.getPlaneSquareShape(boothWidth, boothHeight, 0, 0.1);
    boothGroup.add(this.createMesh('#D3E4FA', boothGround, 0, 0.025, 0));

    const imageStandBorder = this.getPlaneSquareShape(boothWidth*0.8, boothHeight*0.3, 0, 0.1);
    boothGroup.add(this.createMesh('#89b2f1', imageStandBorder, boothWidth*0.1, 0.050, 0));

    const imageStandGround = this.getPlaneSquareShape(boothWidth*0.8, boothHeight*0.3, 0, 0.1);
    boothGroup.add(this.createMesh('#D3E4FA', imageStandGround, boothWidth*0.1, 0.075, 0));

    const imageShade = this.getPlaneSquareShape(boothWidth*0.76, boothHeight*0.8, 0, 0.1);
    boothGroup.add(this.createMesh('#D0D8E2', imageShade, boothWidth*0.12, 0.075, 0.1, false));
    boothGroup.add(this.createMesh('#D0D8E2', imageShade, boothWidth*0.12, 0.06, 0.11, false));

    new THREE.TextureLoader().load('https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTtMx1J4N4I0KXMVKvO9dSxK8ydQG4_SvFUpQ&usqp=CAU', (texture) => {
        const material = new THREE.MeshBasicMaterial({ 
          map: texture,
        });
        material.map.needsUpdate = true; 

        const imageBox = new THREE.Mesh(imageShade, material);
        imageBox.position.set(boothWidth*0.125, 0.07, 0.13);
        
        boothGroup.add(imageBox);
    });

    const boxGroundBorder = this.getPlaneSquareShape(boothHeight*0.25, boothHeight*0.25, 0, 0);
    boothGroup.add(this.createMesh('#89b2f1', boxGroundBorder, boothWidth*0.5-boothHeight*0.122, 0.05, boothHeight*0.4));
    
    
    const box = new THREE.BoxGeometry( boothHeight*0.25, boothHeight*0.25, boothHeight*0.25 );
      box.faces[0].color.set('#d3e3f9');
      box.faces[1].color.set('#d3e3f9');
      box.faces[2].color.set('#f4f8ff');
      box.faces[3].color.set('#f4f8ff');
      box.faces[8].color.set('#e7eefb');
      box.faces[9].color.set('#e7eefb');
      box.colorsNeedUpdate = true;
    const mesh = new THREE.Mesh(box,  new THREE.MeshBasicMaterial( { color: '#f4f8ff', vertexColors: true } ));
    mesh.position.set(boothWidth*0.5, 0.18, boothHeight*0.55);
    boothGroup.add(mesh);

    const redSmallBox = new THREE.BoxGeometry( boothHeight*0.08, boothHeight*0.08, boothHeight*0.08 );
    redSmallBox.faces.forEach((face, id) => {
      if(id<6) {
        let smallBoxColor = new THREE.Color(InitialColorsEnum.darkRed);
        face.color.set( smallBoxColor );
      }
    });
    redSmallBox.colorsNeedUpdate = true;
    const redSmallBoxMesh = new THREE.Mesh(redSmallBox,  new THREE.MeshBasicMaterial( { color: InitialColorsEnum.lightRed, vertexColors: true } ));
    //be able to change color

    redSmallBoxMesh.position.set(boothWidth*0.5, 0.50, boothHeight*0.55);
    this.animatedElements.push(redSmallBoxMesh);
    boothGroup.add(redSmallBoxMesh);

    
    const redSmallBoxMesh2 = redSmallBoxMesh.clone();
    redSmallBoxMesh2.position.set(boothWidth*0.5, 0.35, boothHeight*0.55);
    this.animatedElements.push(redSmallBoxMesh2)
    boothGroup.add(redSmallBoxMesh2);

    const redBoxTransparent = new THREE.BoxGeometry( boothHeight*0.17, boothHeight*0.5, boothHeight*0.17 );
    const redBoxTransparentMesh = new THREE.Mesh(redBoxTransparent,  new THREE.MeshBasicMaterial( { color: InitialColorsEnum.lightRed, vertexColors: true, opacity: 0.5, transparent: true } ));
    redBoxTransparentMesh.position.set(boothWidth*0.5, 0.18+boothHeight*0.25, boothHeight*0.55)
    redBoxTransparentMesh.userData = {
      colorToChangeOnHover: '#95ffcc',
    }
    
    boothGroup.add(redBoxTransparentMesh);
    boothGroup.userData = {
      url: booth.url,
    } 

    this.boothGroupArray.push(boothGroup);

    return boothGroup;
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
