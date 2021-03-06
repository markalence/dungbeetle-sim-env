import * as THREE from 'three';
import * as fs from 'file-saver'
import {Vector3} from "three";

let demonstrationId = document.getElementById('filename');

class Beetle {
    mesh;
    keyHandler = {};
    visibleBalls = [];
    ballShapes = [];
    balls = [];
    stateActionPairs;
    groundTruth;
    static AOV = Math.PI / 4; // angle of view
    static LOV = 450; // length of view

    /**
     * This class manages the beetle, records its keystrokes, states, and actions.
     */
    constructor() {
        this.reset();
        let geometry = new THREE.CircleGeometry(20, 64);
        let material = new THREE.MeshBasicMaterial({color: 'red', transparent: true});
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.add(this.setFov())
        this.mesh.renderOrder = 999;
    }

    /**
     * Restart the episode. Clear all recorded states and actions
     */
    reset() {
        if(this.mesh !== undefined) {
            this.mesh.rotation.z = 0;
            this.mesh.position.set(0, 0, 0);
        }
        this.keyHandler = {'ArrowUp': false, 'ArrowLeft': false, 'ArrowRight': false, 'ArrowDown': false};
        this.stateActionPairs = [];
        this.groundTruth = [];
        this.ballShapes = [];
        this.frame = 0;
        this.episodeOver = false;
        this.episodeStarted = false;
        this.fileWritten = false;
        this.visibleBalls = [];
    }

    /**
     * Initialize beetle field of view. This is a triangle
     * originating at the center of the beetle and extending outwards
     * at an angle of AOV with the sides of length LOV
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

    /**
     * Write the ground truth at each frame as well as states/actions at each frame to downloadable files
     */
    writeFile() {
        this.stateActionPairs.unshift(JSON.stringify({shapes: this.ballShapes}) + '\n');
        this.balls.forEach(ball => {
            this.groundTruth.unshift(JSON.stringify({
                position: ball.mesh.getWorldPosition(new Vector3()),
                shape: ball.shape,
                id: ball.id
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
            if (this.keyHandler['ArrowLeft']) this.mesh.rotation.z += 0.03;
            if (this.keyHandler['ArrowRight']) this.mesh.rotation.z -= 0.03;
            if (this.keyHandler['ArrowUp']) this.mesh.translateY(1.67);
            if (this.keyHandler['ArrowDown']) this.mesh.translateY(-1.67);

            //delete all key entries in keyHandler that are not left, right, or up
            Object.keys(this.keyHandler).forEach(key => {
                if (key !== 'ArrowLeft'
                    && key !== 'ArrowRight'
                    && key !== 'ArrowUp'
                    && key !== 'ArrowDown') delete this.keyHandler[key];
                else {
                    //start episode on first key press
                    if (!this.episodeStarted && this.keyHandler[key]) {
                        this.episodeStarted = true;
                    }
                }
            })

            if (this.episodeStarted) {
                //save truths
                this.groundTruth.push(JSON.stringify({
                    position: this.mesh.getWorldPosition(new Vector3()),
                    rotation: this.mesh.rotation.z,
                    frame: this.frame++,
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
        if (this.keyHandler['d']) {
            this.writeFile();
        }
    }

    /**
     * Get the balls that are visible to the beetle
     */
    getVisibleBalls(balls) {
        balls.forEach(ball => {
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
                (this.visibleBalls)[ball.id] = {visible: true, distance: dist, angle: angle};
            } else {
                ball.mesh.material.color.setHex(0x000);
                this.visibleBalls[ball.id] = {visible: false, distance: dist, angle: angle};
            }

            //if beetle touches ball, the episode is over
            if (dist < 20 + ball.radius) {
                this.episodeOver = true
                this.balls = balls;
                this.ballShapes = [];
                this.balls.forEach(ball => this.ballShapes.push(ball.shape));
            }
        })
    }


}

export default Beetle;