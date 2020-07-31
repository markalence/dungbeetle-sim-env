import * as THREE from 'three';
import {Vector3} from "three";

class Beetle {
    constructor() {
        let geometry = new THREE.CircleGeometry(25, 64);
        let material = new THREE.MeshBasicMaterial({color: 'red', transparent: true});
        this.beetle = new THREE.Mesh(geometry, material);
        this.beetle.renderOrder = 999;
        this.beetle.add(this.setFov())
    }

    setRays() {
        let material = new THREE.LineBasicMaterial({color: 'white', transparent: true, opacity: 0.3});
        let rays = []
        for (let i = -5; i <= 5; i+=1) {
            let points = []
            points.push(new THREE.Vector3(Math.sin(i * Math.PI / 24)*300, Math.cos(i*Math.PI/24)*300));
            points.push(new THREE.Vector3(0, 0, 0));
            let geometry = new THREE.BufferGeometry().setFromPoints(points);
            rays.push(new THREE.Line(geometry, material));
        }
        return rays
    }

    getIntersections(){

    }

    setFov() {
        let fov = new THREE.Shape();
        let l = 300*Math.sin(Math.PI/4)
        fov.moveTo(-12.5, 0);
        fov.lineTo(-l,l);
        fov.lineTo(l, l);
        fov.lineTo(12.5, 0)
        let geometry = new THREE.ShapeGeometry(fov);
        let material = new THREE.MeshBasicMaterial({color: 'white', transparent: true, opacity: 0.3});
        return new THREE.Mesh(geometry, material);
    }

    setDungBalls(dungBalls) {
        this.dungBalls = dungBalls;
    }

    moveBeetle = (event) => {
        let keyCode = event.which;
        switch (keyCode) {
            case 37:
                this.beetle.rotation.z += 0.3;
                break;
            case 38:
                this.beetle.translateY(5)
                break;
            case 39:
                this.beetle.rotation.z -= 0.3;
                break;
        }
    }

    getBeetleObject() {
        return this.beetle;
    }
}

export default Beetle;