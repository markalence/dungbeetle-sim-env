import * as THREE from 'three';
import * as fs from 'file-saver'

let demonstrationId = document.getElementById('filename');
let initialBearing = document.getElementById('bearing');


class Beetle {
    mesh;
    keyHandler = {'ArrowUp': false, 'ArrowLeft': false, 'ArrowRight': false}
    keyStrokes = []
    static AOV = Math.PI / 4; // angle of view
    static LOV = 450; // length of view

    constructor() {
        let geometry = new THREE.CircleGeometry(25, 64);
        let material = new THREE.MeshBasicMaterial({color: 'red', transparent: true});
        this.episodeOver = false;
        this.episodeStarted = false;
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.renderOrder = 999;
        this.mesh.add(this.setFov())
        this.startTime = null;
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

    writeFile() {
        let misc = {initialBearing: initialBearing.value};
        this.keyStrokes.unshift(JSON.stringify(misc) + '\n');
        let blob = new Blob(this.keyStrokes, {type: 'application/json'});
        fs.saveAs(blob, demonstrationId.value + '.txt');
    }

    keyDown = () => {

        if (this.keyHandler['ArrowLeft']) this.mesh.rotation.z += 0.05;
        if (this.keyHandler['ArrowUp']) this.mesh.translateY(3);
        if (this.keyHandler['ArrowRight']) this.mesh.rotation.z -= 0.05;
        if (this.keyHandler[' ']) this.episodeOver = true;

        Object.keys(this.keyHandler).forEach(key => {
            if (key !== 'ArrowLeft' && key !== 'ArrowUp' && key !== 'ArrowRight') delete this.keyHandler[key];
            else {
                if (!this.episodeStarted && this.keyHandler[key]) {
                    this.episodeStarted = true;
                    this.startTime = Date.now();
                }
            }
        })
        this.keyHandler['Time'] = Date.now() - this.startTime;
        this.episodeStarted && this.keyStrokes.push(JSON.stringify(this.keyHandler) + '\n');
        this.episodeOver && this.writeFile();

        if (this.mesh.rotation.z < 0 && this.mesh.rotation.z < -Math.PI) {
            this.mesh.rotation.set(0, 0, this.mesh.rotation.z + 2 * Math.PI)
        } else if (this.mesh.rotation.z > 0 && this.mesh.rotation.z > Math.PI) {
            this.mesh.rotation.set(0, 0, this.mesh.rotation.z - 2 * Math.PI)
        }
    }


}

export default Beetle;