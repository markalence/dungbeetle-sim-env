import * as THREE from 'three';

class Beetle {
    mesh;

    constructor() {
        let geometry = new THREE.CircleGeometry(25, 64);
        let material = new THREE.MeshBasicMaterial({color: 'red', transparent: true});
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.renderOrder = 999;
        this.mesh.add(this.setFov())
    }


    setFov() {
        let fov = new THREE.Shape();
        let l = 300 * Math.sin(Math.PI / 4)
        console.log(l)
        fov.moveTo(0, 0);
        fov.lineTo(-l, l);
        fov.lineTo(l, l);
        fov.lineTo(0, 0)
        let geometry = new THREE.ShapeGeometry(fov);
        let material = new THREE.MeshBasicMaterial({color: 'grey', transparent: true, opacity: 0.3});
        return new THREE.Mesh(geometry, material);
    }

    moveBeetle = (event) => {
        let keyCode = event.which;
        switch (keyCode) {
            case 37:
                this.mesh.rotation.z += 0.1;
                break;
            case 38:
                this.mesh.translateY(5)
                break;
            case 39:
                this.mesh.rotation.z -= 0.1;
                break;
        }


        if (this.mesh.rotation.z < 0 && this.mesh.rotation.z < -Math.PI) {
            this.mesh.rotation.set(0, 0, this.mesh.rotation.z + 2 * Math.PI)
        } else if (this.mesh.rotation.z > 0 && this.mesh.rotation.z > Math.PI) {
            this.mesh.rotation.set(0, 0, this.mesh.rotation.z - 2 * Math.PI)
        }
    }

}

export default Beetle;