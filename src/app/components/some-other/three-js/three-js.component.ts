import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Color } from '@svgdotjs/svg.js';
import * as THREE from 'three';
import { Vector3 } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { ExtrudeGeometryOptions } from 'three/src/geometries/ExtrudeBufferGeometry';
import * as TWEEN from 'tween.js/src/Tween.js'
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

  public boxes = [];

  public mapConfig;

  public mapPadding = 0.5;

  public boothGroupArray: THREE.Object3D[] = [];

  public mouse: THREE.Vector2;
  
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

    this.camera.lookAt(XSize, 0, XSize);

    this.controls = new OrbitControls( this.camera, this.renderer.domElement );

    this.controls.enableZoom = true;
    this.controls.enablePan = false;
    // this.controls.minPolarAngle = Math.PI / 3.25;
    // this.controls.maxPolarAngle = Math.PI / 3.25;

    // this.controls.enableRotate = false;
    this.scene.translateY(XSize/1.75);
    const ambientLight = new THREE.AmbientLight( 0xffffff );
    this.scene.add( ambientLight );
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
      const intersectedGroup = this.boothGroupArray.find((array) => intersects[i].object.parent.uuid === array.uuid);

      if(intersectedGroup) {
        
        window.open(intersectedGroup.userData.url, '_blank');
      }
    }
  } 

  public animate() {
    requestAnimationFrame(this.animate.bind(this));

    this.animatedElements.forEach((element)=> {
      element.rotation.y +=0.01;
    });

    this.raycaster.setFromCamera( this.mouse, this.camera );

    let intersects = this.raycaster.intersectObjects( this.boothGroupArray , true );
    
    let lastIntersected: THREE.Object3D;

    if (intersects.length > 0) {
      const intersectedGroup: THREE.Object3D = this.boothGroupArray.find((array) => intersects[0].object.parent.uuid === array.uuid);
      if(intersectedGroup && intersectedGroup.uuid) {
        if (lastIntersected && intersectedGroup.uuid !== lastIntersected.uuid ) {
          console.log('////'+lastIntersected.uuid,'/////'+ intersectedGroup.uuid);
          lastIntersected.userData.scaleDown(lastIntersected);
        }

        lastIntersected = intersectedGroup;
        lastIntersected.userData.scaleUp(lastIntersected);
      } else {
        lastIntersected = null;
      }
    }  else {
      if (lastIntersected) {
        lastIntersected.userData.scaleDown(lastIntersected);
      }
      lastIntersected = null;
    }

    this.renderer.render( this.scene, this.camera );
  }

  public buildVcfGround() {
    const groundObject = new THREE.Object3D();

    const ground = this.getGroundUnregularGeometry();
    groundObject.add(this.createMesh('#EDF5FF', ground, 0, -0.1, 0));

    const groundBorder = this.getGroundUnregularGeometry();
    groundObject.add(this.createMesh('#C6D8EE', groundBorder, 0, -0.15, 0));

    const groundShade = this.getGroundUnregularGeometry();
    groundObject.add(this.createMesh('#E8ECF1', groundShade, 0, -0.5, 0));

    groundObject.scale.set(1.15, 1, 1.15);
    groundObject.translateX(-0.4);
    groundObject.translateZ(-0.2);
    this.scene.add(groundObject);
  }

  public addBoxToScene(color: string, box, xPosition, yPosition, zPosition, rotateX = true){
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

    const boothGroundBorder = this.getPlaneSquareShape(boothWidth, boothHeight, 0.1, 0.1);
    boothGroup.add(this.createMesh('#89b2f1', boothGroundBorder, 0, 0, 0));

    const boothGround = this.getPlaneSquareShape(boothWidth, boothHeight, 0.1, 0.1);
    boothGroup.add(this.createMesh('#D3E4FA', boothGround, 0, 0.025, 0));

    const imageStandBorder = this.getPlaneSquareShape(boothWidth*0.8, boothHeight*0.3, 0.1, 0.1);
    boothGroup.add(this.createMesh('#89b2f1', imageStandBorder, boothWidth*0.1, 0.050, 0));

    const imageStandGround = this.getPlaneSquareShape(boothWidth*0.8, boothHeight*0.3, 0.1, 0.1);
    boothGroup.add(this.createMesh('#D3E4FA', imageStandGround, boothWidth*0.1, 0.075, 0));

    const imageShade = this.getPlaneSquareShape(boothWidth*0.76, boothHeight*0.8, 0.1, 0.1);
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

    const boxGroundBorder = new THREE.BoxGeometry( boothHeight*0.26, boothHeight*0.05, boothHeight*0.26 );
    const boxGroundBorderMesh = this.createMesh('#89b2f1', boxGroundBorder, 0, 0, 0, false);
    boxGroundBorderMesh.position.set(boothWidth*0.5, 0.02, boothHeight*0.55);
    boothGroup.add(boxGroundBorderMesh);
    
    const box = new THREE.BoxGeometry( boothHeight*0.25, boothHeight*0.4, boothHeight*0.25 );
    box.faces[0].color.set('#d3e3f9');
    box.faces[1].color.set('#d3e3f9');
    box.faces[2].color.set('#f4f8ff');
    box.faces[3].color.set('#f4f8ff');
    box.faces[8].color.set('#e7eefb');
    box.faces[9].color.set('#e7eefb');
    box.colorsNeedUpdate = true;
    const mesh = new THREE.Mesh(box,  new THREE.MeshBasicMaterial( { color: '#f4f8ff', vertexColors: true } ));
    mesh.position.set(boothWidth*0.5, 0.05, boothHeight*0.55);
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
      scaleUp:(bth:THREE.Object3D) =>{
        // console.log("scaleUp"+bth);
        bth.scale.set(1.1,1,1.1)
        // if (h.userData.scaleDownTween) h.userData.scaleDownTween.stop();
        // let initScale = h.scale.clone();
        // let finalScale = new THREE.Vector3().setScalar(2);
        // h.userData.scaleUpTween = new TWEEN.Tween(initScale).to(finalScale, 500).onUpdate(function(obj) {
        //   h.scale.copy(obj)
        // }).start();
      },

      scaleDown: (bth) => {
        // console.log("scaleDown"+bth);
        bth.scale.set(0.9,1,0.9)

        // if (h.userData.scaleUpTween) h.userData.scaleUpTween.stop();
        // let initScale = h.scale.clone();
        // let finalScale = new THREE.Vector3().setScalar(1);
        // h.userData.scaleUpTween = new TWEEN.Tween(initScale).to(finalScale, 500).onUpdate(function(obj) {
        //   h.scale.copy(obj)
        // }).start();
      },
    } 

    this.boothGroupArray.push(boothGroup);

    return boothGroup;
  }

  public getPlaneSquareShape(XSize, YSize, depth, radius) {
    const shape = new THREE.Shape();

    shape.lineTo(0, YSize - YSize*radius);
    shape.bezierCurveTo(0, YSize - YSize*radius, 0, YSize, XSize*radius, YSize);
    
    shape.lineTo(XSize - XSize*radius, YSize);
    shape.bezierCurveTo(XSize - XSize*radius , YSize, XSize, YSize, XSize, YSize - YSize*radius);
    
    shape.lineTo(XSize, YSize*radius);
    shape.bezierCurveTo(XSize, YSize*radius, XSize, 0, XSize - XSize*radius, 0);
    
    shape.lineTo(XSize*radius, 0);
    shape.bezierCurveTo(XSize*radius, 0, 0, 0, 0, YSize*radius);

    const extrudeSettings = {
       steps: 0, 
        depth: depth,
        bevelEnabled: false,
        bevelThickness: 0.9, 
        bevelSize: 0.9,
        bevelSegments: 20,
        curveSegments: 10,    };

    const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    return geometry;
  }
  
  public getGroundUnregularGeometry() {
    let XSize = this.mapConfig.Map.XSize;
    let YSize = this.mapConfig.Map.YSize;

    let cutsOff = this.mapConfig.CutsOff;
    let radius = 0.2;

    const shape = new THREE.Shape();
    let matrix = new Array(XSize);
    
    let positionX = 0;
    let positionY = 0;

    const shapeCoordinates = [[positionX, positionY]];
    const vectorsArray = [];

    for (let i = 0; i < matrix.length; i++) { 
      matrix[i] = new Array(YSize); 
    }

    for (let i = 0; i < XSize; i++) {
      for (let j = 0; j < YSize; j++) {
        let isCutOff = cutsOff.some((cutOff)=> cutOff.x === i && cutOff.y === j);
        matrix[i][j] = isCutOff ? 0 : 1;
      }
    }

    for (let i = positionX; i < XSize; i++) {
      positionX = i;
      if (matrix[positionX][positionY]) {
        shapeCoordinates.push([positionX + 1, positionY]);
      } else {
        positionY++;
        positionX--;
        i--;
        shapeCoordinates.push([positionX + 1, positionY]);
      }
    }

    for (let i = positionY; i < YSize; i++) {
      positionY = i;
      
      if (matrix[positionX][positionY]) {
        shapeCoordinates.push([positionX + 1, positionY + 1]);
      } else {
        positionX--;
        positionY--;
        i--;

        shapeCoordinates.push([positionX + 1, positionY + 1]);
      }
    }

    for (let i = positionX; i >= 0; i--) {
      positionX = i;
      
      if(matrix[positionX][positionY]) {
        shapeCoordinates.push([positionX, positionY + 1]);
      } else {
        positionX++;
        positionY--;
        i++;
        
        shapeCoordinates.push([positionX, positionY + 1]);
      }
    }

    for (let i = positionY; i >= 0; i--) {
      positionY = i;

      if(matrix[positionX][positionY]) {
        shapeCoordinates.push([positionX, positionY]);
      } else {
        positionX++;
        positionY++;
        i++;
        shapeCoordinates.push([positionX, positionY]);
      }
    }
    
    shapeCoordinates.forEach((value, index) => {
      if (index === shapeCoordinates.length-1) {
        return;
      }

      const v1 = new THREE.Vector3(value[0], value[1], 0);
      const v2 = new THREE.Vector3(shapeCoordinates[index+1][0], shapeCoordinates[index+1][1], 0);
      const dir = new THREE.Vector3()
      vectorsArray.push(dir.subVectors(v2,v1).normalize());
    });
    
    let xPos = 0;
    let yPos = 0;
    
    vectorsArray.forEach((vector: THREE.Vector3, index)=> {
      xPos = xPos + vector.x;
      yPos = yPos + vector.y;
      if (index === vectorsArray.length - 1) {
        shape.lineTo(xPos, yPos+radius);
        shape.bezierCurveTo(xPos, yPos+radius, xPos, yPos, xPos+radius, yPos);
        return;
      }

      if (vector.equals(vectorsArray[index + 1])) {
        shape.lineTo(xPos, yPos);
      } else {
        if(vectorsArray[index].x === 1 && vectorsArray[index + 1].y  === 1) {
          shape.lineTo(xPos-radius, yPos);
          shape.bezierCurveTo(xPos-radius, yPos, xPos, yPos, xPos, yPos+ radius);
        }

        if(vectorsArray[index].x === -1 && vectorsArray[index + 1].y  === 1) {
          shape.lineTo(xPos+radius, yPos);
          shape.bezierCurveTo(xPos+radius, yPos, xPos, yPos, xPos, yPos+ radius);
        }

        if(vectorsArray[index + 1].x === -1) {
          shape.lineTo(xPos,  yPos - radius);
          shape.bezierCurveTo(xPos,  yPos - radius, xPos, yPos, xPos-radius, yPos);
        }

        if(vectorsArray[index].x === -1  && vectorsArray[index + 1].y === -1) {
          shape.lineTo(xPos+radius,  yPos);
          shape.bezierCurveTo(xPos+radius,  yPos, xPos, yPos, xPos, yPos-radius);
        }
      }
    })
      
    const extrudeSettings = {
      steps: 0, 
      depth: 0,
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
