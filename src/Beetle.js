import * as THREE from 'three';
import * as fs from 'file-saver'
import {Vector3} from "three";

let demonstrationId = document.getElementById('filename');

class Beetle {
    mesh;
    keyHandler;
    balls = [];
    visibleBalls = [];
    ballShapes = [];
    stateActionPairs;
    groundTruth;
    static AOV = Math.PI / 4; // angle of view
    static LOV = 450; // length of view

    reset() {
        this.keyHandler = {'ArrowUp': false, 'ArrowLeft': false, 'ArrowRight': false};
        this.stateActionPairs = [];
        this.groundTruth = [];
        this.episodeOver = false;
        this.episodeStarted = false;
        this.startTime = null;
        this.fileWritten = false;
    }

    constructor() {
        this.reset();
        let geometry = new THREE.CircleGeometry(20, 64);
        let material = new THREE.MeshBasicMaterial({color: 'red', transparent: true});
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.add(this.setFov())
        this.mesh.renderOrder = 999;
    }


    /**
     * initialize beetle field of view. This is a triangle
     * originating at the center of the beetle and extending outwards
     * at an angle of AOV. With the sides of length LOV
     * @returns {Mesh<ShapeGeometry, MeshBasicMaterial>}
     */
    setFov() {
        let fov = new THREE.Shape();
        let x = Beetle.LOV * Math.sin(Beetle.AOV);
        let y = Beetle.LOV * Math.cos(Beetle.AOV)
        fov.moveTo(0, 0);
        fov.lineTo(-x, y);
        fov.lineTo(x, y);
        fov.lineTo(0, 0)
        let geometry = new THREE.ShapeGeometry(fov);
        let material = new THREE.MeshBasicMaterial({color: 'grey', transparent: true, opacity: 0.5});
        let mesh = new THREE.Mesh(geometry, material);
        mesh.renderOrder = 998;
        return mesh;
    }

    writeFile() {
        this.stateActionPairs.unshift(JSON.stringify({shapes: this.ballShapes}) + '\n');
        this.balls.forEach(ball => {
            this.groundTruth.unshift(JSON.stringify({
                position: ball.mesh.position,
                shape: ball.shape
            }) + '\n');
        })
        let stateActionBlob = new Blob(this.stateActionPairs, {type: 'application/json'});
        let groundTruthBlob = new Blob(this.groundTruth, {type: 'application/json'});
        fs.saveAs(stateActionBlob, demonstrationId.value + '_sa' + '.txt');
        fs.saveAs(groundTruthBlob, demonstrationId.value + '_truth' + '.txt');
        this.fileWritten = true;
    }

    /**
     * Moves beetle according to the keys that are currently down
     */
    moveBeetle() {
        if (this.fileWritten) return;
        if (!this.episodeOver) {
            if (this.keyHandler['ArrowLeft']) this.mesh.rotation.z += 0.05;
            if (this.keyHandler['ArrowUp']) this.mesh.translateY(3);
            if (this.keyHandler['ArrowRight']) this.mesh.rotation.z -= 0.05;

            //delete all key entries in keyHandler that are not left, right, or up
            Object.keys(this.keyHandler).forEach(key => {
                if (key !== 'ArrowLeft' && key !== 'ArrowUp' && key !== 'ArrowRight') delete this.keyHandler[key];
                else {
                    //start episode on first key press
                    if (!this.episodeStarted && this.keyHandler[key]) {
                        this.episodeStarted = true;
                        this.startTime = Date.now();
                    }
                }
            })

            if (this.episodeStarted) {
                //save truths
                this.groundTruth.push(JSON.stringify({
                    position: this.mesh.getWorldPosition(new Vector3()),
                    rotation: this.mesh.rotation.z,
                    time: Date.now() - this.startTime,
                }) + '\n');

                //save state and action
                this.stateActionPairs.push(JSON.stringify({
                    action: this.keyHandler,
                    state: this.visibleBalls,
                }) + '\n');
            }
            //make sure that the magnitude of the rotation never exceeds PI
            //i.e if rotation is -(3/2)*PI, change it to (1/2)*PI by adding 2*PI
            //therefore rotation is always between {0 and PI} or {-PI and 0}
            if (this.mesh.rotation.z < -Math.PI) this.mesh.rotation.z += 2 * Math.PI;
            else if (this.mesh.rotation.z > Math.PI) this.mesh.rotation.z -= 2 * Math.PI;
        }
        if (this.keyHandler[' ']) {
            this.writeFile();
        }
    }

    /**
     * get the balls that are visible to the beetle
     */
    getIntersections() {
        this.balls.forEach(ball => {
            let dist = this.mesh.getWorldPosition(new Vector3()).distanceTo(ball.mesh.getWorldPosition(new Vector3()))
            let angle;

            //get angle between beetle and ball by getting the angle of their difference vector
            let H = ball.mesh.getWorldPosition(new Vector3()).sub(this.mesh.clone(false).position);

            //if the ball and the beetle have similar x values,
            //set the angle between them to be 90 (if ball above beetle) or -90 (if ball below beetle)
            if (Math.abs(H.x) < 0.01) angle = H.y > 0 ? Math.PI / 2 : -Math.PI / 2;

                //if ball and beetle have similar y values,
            //set the angle between them to be 0 (if ball left of beetle) or 180 (if ball right of beetle)
            else if (Math.abs(H.y) < 0.01) angle = H.x > 0 ? 0 : Math.PI;
            else angle = Math.atan2(H.y, H.x);

            //correct the angle by adjusting for initial offset of balls (90 deg)
            //and by rotation of beetle
            angle -= Math.PI / 2 + this.mesh.rotation.z

            //ensure angle is between {0 and PI} or {-PI and 0}
            if (angle < -Math.PI) angle += 2 * Math.PI;
            else if (angle > 0 && angle > Math.PI) angle -= 2 * Math.PI;

            //if the ball lies in the field of view triangle, it is visible to the beetle
            if ((Math.abs(angle) < Beetle.AOV + 0.01) && dist <= 25 + Beetle.LOV * Math.cos(Beetle.AOV) / Math.cos(angle)) {
                ball.mesh.material.color.setHex(0xA9A9A9);
                (this.visibleBalls)[ball.id] = {visible: true, distance: dist};
            } else {
                ball.mesh.material.color.setHex(0x000);
                this.visibleBalls[ball.id] = {visible: false, distance: dist};
            }

            //if beetle touches ball, the episode is over
            if (dist < 20 + ball.radius) {
                this.episodeOver = true
            }
        })
    }


}

export default Beetle;