import * as THREE from 'three'
import helvetica from 'three/examples/fonts/helvetiker_regular.typeface.json'
import {Vector3} from "three";

class Board {
    markers;

    constructor() {
        let geometry = new THREE.CircleGeometry(217.5*global.RATIO, 64);
        let material = new THREE.MeshBasicMaterial({color: 0x855E42, transparent: true})
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.renderOrder = 0
        let loader = new THREE.FontLoader();
        this.markers = []
        for (let i = 0; i < 360; i += 10) {
            let textGeometry;
            let font = loader.parse(helvetica);
            let spaces = i === 0 ? '\n|' :
                i > 0 && i < 100 ? '\n |' : '\n  |'
            textGeometry = new THREE.TextGeometry(i.toString() + spaces, {
                font: font,
                size: 10,
                height: 1,
                curveSegments: 1
            });
            let mat = new THREE.MeshBasicMaterial({color: 'white'});
            this.text = new THREE.Mesh(textGeometry, mat);
            this.text.rotation.z = -Math.PI * (i) / 180;
            this.text.position.set(-Math.cos(Math.PI * (i + 90) / 180) * 230 * global.RATIO,
                Math.sin(Math.PI * (i + 90) / 180) * 230 * global.RATIO, 0);
            textGeometry.computeBoundingBox();
            let center = new Vector3();
            textGeometry.boundingBox.getCenter(center);
            this.markers.push(this.text);
        }
    }
}

class Status{
    text;
    constructor(status) {
        let loader = new THREE.FontLoader();
        let textGeometry;
        let font = loader.parse(helvetica);
        textGeometry = new THREE.TextGeometry(status, {
            font: font,
            size: 30,
            height: 1,
            curveSegments: 2
        });
        let mat = new THREE.MeshBasicMaterial({color: 'white'});
        this.text = new THREE.Mesh(textGeometry, mat);
        this.text.position.set(0.35*window.innerWidth, 0.48*window.innerHeight, 0);
    }
}

export {Board, Status};