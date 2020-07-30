import * as THREE from 'three';
const ThreeBSP = require('three-js-csg/index')(THREE)
class Beetle {
    constructor() {
        let geometry = new THREE.CircleGeometry(25, 64);
        let material = new THREE.MeshBasicMaterial({color: 'red', transparent: true});
        this.circle = new THREE.Mesh(geometry, material);
        this.circle.renderOrder = 999;
        this.circle.add(this.setFov())
    }

    setFov() {
        let fov = new THREE.Shape();
        fov.moveTo(-12.5, 0);
        fov.lineTo(-200, 300);
        fov.lineTo(200, 300);
        fov.lineTo(12.5, 0)
        let geometry = new THREE.ShapeGeometry(fov);
        let material = new THREE.MeshBasicMaterial({color: 'white', transparent:true, opacity: 0.3});
        return new THREE.Mesh(geometry, material);
    }

    setDungBalls(dungBalls){
        this.dungBalls = dungBalls;
    }

    moveBeetle = (event) => {
        let keyCode = event.which;
        console.log(this.circle)
        switch (keyCode) {
            case 37:
                this.circle.rotation.z += 0.3;
                break;
            case 38:
                this.circle.translateY(5)
                break;
            case 39:
                this.circle.rotation.z -= 0.3;
                break;
        }
    }

    getBeetleObject() {
        return this.circle;
    }
}

export default Beetle;