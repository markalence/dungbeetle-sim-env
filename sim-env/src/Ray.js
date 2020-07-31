import * as THREE from "three";

class Ray{
    constructor(start, end) {
        let material = new THREE.LineBasicMaterial({color: 'white', transparent: true, opacity: 0.3});
        this.points = [start, end];
        let geometry = new THREE.BufferGeometry().setFromPoints(this.points);
        this.ray = new THREE.Line(geometry, material);
    }
    getRay(){
        return this.ray;
    }
}

export default Ray;