import * as THREE from 'three';

class Beetle {
    mesh;
    keyHandler = {}
    static AOV = Math.PI / 4; // angle of view
    static LOV = 450; // length of view

    constructor() {
        let geometry = new THREE.CircleGeometry(25, 64);
        let material = new THREE.MeshBasicMaterial({color: 'red', transparent: true});
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.renderOrder = 999;
        this.mesh.add(this.setFov())
    }


    setFov() {
        let fov = new THREE.Shape();
        let x = Beetle.LOV * Math.sin(Beetle.AOV);
        let y = Beetle.LOV * Math.cos(Beetle.AOV)
        fov.moveTo(0, 0);
        fov.lineTo(-x, y);
        fov.lineTo(x, y);
        fov.lineTo(0, 0)
        let geometry = new THREE.ShapeGeometry(fov);
        let material = new THREE.MeshBasicMaterial({color: 'grey', transparent: true, opacity: 0.3});
        return new THREE.Mesh(geometry, material);
    }

    keyDown = () => {

        if (this.keyHandler[37]) this.mesh.rotation.z += 0.05;
        if (this.keyHandler[38]) this.mesh.translateY(3);
        if (this.keyHandler[39]) this.mesh.rotation.z -= 0.05;

        if (this.mesh.rotation.z < 0 && this.mesh.rotation.z < -Math.PI) {
            this.mesh.rotation.set(0, 0, this.mesh.rotation.z + 2 * Math.PI)
        } else if (this.mesh.rotation.z > 0 && this.mesh.rotation.z > Math.PI) {
            this.mesh.rotation.set(0, 0, this.mesh.rotation.z - 2 * Math.PI)
        }
    }


}

export default Beetle;