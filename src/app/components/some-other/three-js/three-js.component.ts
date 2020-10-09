import { Component, OnInit } from '@angular/core';
import * as THREE from 'three';
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

  public  map404 = [
    [0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 0],
    [0, 0, 1, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 1, 0],
    [0, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 1, 0],
    [1, 1, 1, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 1, 1, 1],
    [0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0],
    [0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 0]
  ];

  public roundedBoxGeometry = this.createBoxWithRoundedEdges(1, 1, 1, .25, 3);
  public colorNormal = new THREE.Color("#C6D8EE");
  public colorBad = new THREE.Color("red");
  public colorGood = new THREE.Color("blue");
  public roundedBoxMaterial = new THREE.MeshLambertMaterial({
    color: this.colorNormal.clone()
  });
  

  public boxes = [];

  constructor() {
    this.init();
    this.render();
    
  }

  public init() {
    // this.renderer
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( this.renderer.domElement );
  
    // this.scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color( 0xffffff );
   
   
    // this.camera
    var aspect = window.innerWidth / window.innerHeight;
    var width = 1024;
    var height = 768;
    var d = 30;
    // this.camera = new THREE.OrthographicCamera( width / - 2,  width / 2,  height / 2, height / - 2, 1, 1000 );
    this.camera = new THREE.OrthographicCamera( - d * aspect, d * aspect, d, - d, 0, 1000 );
    


    this.camera.position.set( 30, 30, 30 );
     this.camera.lookAt( this.scene.position );
  

    this.controls = new OrbitControls( this.camera, this.renderer.domElement );

    this.controls.addEventListener( 'change', ()=> {
      this.render();
    });
    
    
    this.controls.enableZoom = false;
    this.controls.enablePan = false;
    this.controls.maxPolarAngle = Math.PI / 2;
  
    // ambient
    this.scene.add( new THREE.AmbientLight( 0xffffff ) );
  
    // light
    // var light = new THREE.PointLight( 0xffffff, 0.8 );
    // light.position.set( 0, 50, 50 );
    // this.scene.add( light );
  
    // axes
  	this.scene.add( new THREE.AxesHelper( 40 ) ); 
  
    // grid
    // var plane1 = new THREE.PlaneBufferGeometry( 50, 50, 10, 10 );
    // var material = new THREE.MeshBasicMaterial( { color: '#E8ECF1' } );
    // var grid = new THREE.Mesh( plane1, material );
     // grid.rotation.order = 'YXZ';
    // grid.rotation.y = - Math.PI / 2;
    // grid.rotation.x = - Math.PI / 2;
    // this.scene.add( grid );

    // var plane2 = new THREE.PlaneBufferGeometry( 50, 50, 10, 10 );
    // var material2 = new THREE.MeshBasicMaterial( { color: '#' } );
    // var grid2 = new THREE.Mesh( plane2, material2 );
    // grid2.position.y +=12;
    //    grid2.rotation.order = 'YXZ';
    // grid2.rotation.y = - Math.PI / 2;
    // grid2.rotation.x = - Math.PI / 2;
    // this.scene.add( grid2 );

    let colorNormal1 = new THREE.Color("#EDF5FF");
    let roundedBoxMaterial1 = new THREE.MeshLambertMaterial({
      color: colorNormal1.clone()
    });
    
    const ground1 = this.createBoxWithRoundedEdges(50, 1, 50, 0.5, 50)
    let roundedBox1 = new THREE.Mesh(ground1, roundedBoxMaterial1.clone());
    roundedBox1.position.set(0, 11, 0);
    this.scene.add(roundedBox1);
    this.boxes.push(roundedBox1);


    


    const ground = this.createBoxWithRoundedEdges(50,2, 50, .5, 50)
    let roundedBox = new THREE.Mesh(ground, this.roundedBoxMaterial.clone());
    roundedBox.position.set(0, 10, 0);
    this.scene.add(roundedBox);
    this.boxes.push(roundedBox);

    var plane3 = new THREE.PlaneBufferGeometry( 50, 50, 1, 1 );
    var material3 = new THREE.MeshBasicMaterial( { color: '#E8ECF1' } );
    var grid3 = new THREE.Mesh( plane3, material3 );
       grid3.rotation.order = 'YXZ';
    grid3.position.y +=3;
    grid3.rotation.y = - Math.PI / 2;
    grid3.rotation.x = - Math.PI / 2;
    this.scene.add( grid3 );


    //-------------
    for (let y = 0; y < this.map404.length; y++) {
      for (let x = 0; x < this.map404[0].length; x++) {
        if (this.map404[y][x] === 0) continue;
        let roundedBox = new THREE.Mesh(this.roundedBoxGeometry, this.roundedBoxMaterial.clone());
        roundedBox.position.set(x - 8,20, y - 2);
        this.scene.add(roundedBox);
        this.boxes.push(roundedBox);
      }
    }
  
  
  
  }
  
  public render() {
    this.renderer.render( this.scene, this.camera );
  
  }

  public createBoxWithRoundedEdges(width, height, depth, radius0, smoothness) {
    let shape = new THREE.Shape();
    let eps = 0.00001;
    let radius = radius0 - eps;
    shape.absarc(eps, eps, eps, -Math.PI / 2, -Math.PI, true);
    shape.absarc(eps, height - radius * 2, eps, Math.PI, Math.PI / 2, true);
    shape.absarc(width - radius * 2, height - radius * 2, eps, Math.PI / 2, 0, true);
    shape.absarc(width - radius * 2, eps, eps, 0, -Math.PI / 2, true);
    let geometry = new THREE.ExtrudeBufferGeometry(shape, {
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
  

  // public btnSVGExportClick(){
  //   var rendererSVG = new THREE.SVGRenderer();
  //   rendererSVG.setSize(window.innerWidth, window.innerHeight);			
  //   rendererSVG.render( this.scene, this.camera );		
  //   this.ExportToSVG(rendererSVG, "test.svg");
  // }

  // public ExportToSVG(rendererSVG, filename){
  //   var XMLS = new XMLSerializer(); 
  //   var svgfile = XMLS.serializeToString(rendererSVG.domElement); 

  //   var svgData = svgfile;
  //   var preface = '<?xml version="1.0" standalone="no"?>\r\n';
  //   var svgBlob = new Blob([preface, svgData], {type:"image/svg+xml;charset=utf-8"});
  //   var svgUrl = URL.createObjectURL(svgBlob);
  //   var downloadLink = document.createElement("a");
  //   downloadLink.href = svgUrl;
  //   downloadLink.download = filename;
  //   document.body.appendChild(downloadLink);
  //   downloadLink.click();
  //   document.body.removeChild(downloadLink);	
  // }
}
