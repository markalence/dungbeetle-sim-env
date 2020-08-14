import * as THREE from 'three'
import Beetle from './Beetle'
import Ball from "./Ball";
import {Vector3} from "three";
import Board from "./Board";

const HEIGHT = window.innerHeight;
const WIDTH = window.innerWidth;
const scene = new THREE.Scene();
const camera = new THREE.OrthographicCamera(-WIDTH / 2, WIDTH / 2, HEIGHT / 2, -HEIGHT / 2, -1, 100);
const renderer = new THREE.WebGLRenderer({antialias: true});

let initialBearing = document.getElementById('bearing');
let randomBall = document.getElementById('ball');
let bearing = 0;
let offset = 0
let beetle = new Beetle()
let balls = []
let ballMeshes = []
let ballShapes = []
let visibleBalls = new Array(8).fill(0);
let board = new Board();


function rotateBoard() {
    bearing = -Math.PI * (initialBearing.value - offset) / 180;
    board.mesh.rotation.z = bearing;
    balls.forEach(ball => ball.mesh.rotation.z = -bearing);
}

initialBearing.addEventListener("input", _ => rotateBoard());

randomBall.addEventListener("input", ballNum => {
    offset = (ballNum.target.value - 1) * 45;
    bearing = initialBearing.value;
    rotateBoard();
})

/**
 * Initialise position of dung balls in the scene
 */
function ballsInit() {
    let r = Math.PI
    let id = 0;

    //initialise ball 0 to be north of the beetle.
    //place each subsequent ball 45 degrees apart from each other.
    //each ball is then offset by the initial bearing of the beetle
    for (let i = r; i > -r; i -= Math.PI / 4) {
        let shape;
        shape = id % 2 === 0 ? 'sphere' : 'inc'
        ballShapes.push(shape);
        balls.push(new Ball(shape,
            new THREE.Vector2(
                Math.cos(i - Math.PI / 2 - bearing) * 300,
                Math.sin(i - Math.PI / 2 - bearing) * 300), id));
        id++;
    }
    beetle.setBallShapes(ballShapes);
    balls.forEach(db => {
        board.mesh.add(db.mesh)
        ballMeshes.push(db.mesh);
    })
}

function getIntersections() {
    balls.forEach(ball => {
        let dist = beetle.mesh.getWorldPosition(new Vector3()).distanceTo(ball.mesh.getWorldPosition(new Vector3()))
        let angle;

        //get angle between beetle and ball by getting the angle of their difference vector
        let H = ball.mesh.getWorldPosition(new Vector3()).sub(beetle.mesh.clone(false).position);

        //if the ball and the beetle have similar x values,
        //set the angle between them to be 90 (if ball above beetle) or -90 (if ball below beetle)
        if (Math.abs(H.x) < 0.01) angle = H.y > 0 ? Math.PI / 2 : -Math.PI / 2;

            //if ball and beetle have similar y values,
        //set the angle between them to be 0 (if ball left of beetle) or 180 (if ball right of beetle)
        else if (Math.abs(H.y) < 0.01) angle = H.x > 0 ? 0 : Math.PI;
        else angle = Math.atan2(H.y, H.x);

        //correct the angle by adjusting for initial offset of balls (90 deg)
        //and by rotation of beetle
        angle -= Math.PI / 2 + beetle.mesh.rotation.z

        //ensure angle is between {0 and PI} or {-PI and 0}
        if (angle < -Math.PI) angle += 2 * Math.PI;
        else if (angle > 0 && angle > Math.PI) angle -= 2 * Math.PI;

        //if the ball lies in the field of view triangle, it is visible to the beetle
        if ((Math.abs(angle) < Beetle.AOV + 0.01) && dist <= 25 + Beetle.LOV * Math.cos(Beetle.AOV) / Math.cos(angle)) {
            ball.mesh.material.color.setHex(0xA9A9A9);
            visibleBalls[ball.id] = {visible: true, distance: dist};
        } else {
            ball.mesh.material.color.setHex(0x000);
            visibleBalls[ball.id] = {visible: false, distance: dist};
        }

        //if beetle touches ball, the episode is over
        if (dist < 50.05) {
            beetle.episodeOver = true
        }
    })
}

function sceneInit() {
    camera.zoom = 0.65;
    camera.updateProjectionMatrix();
    scene.add(board.mesh);
    scene.add(beetle.mesh);
    board.markers.forEach(mark => scene.add(mark));
    renderer.setSize(WIDTH, HEIGHT);
    document.body.appendChild(renderer.domElement);
    renderer.setClearColor('#3f2a14', 1);
    document.addEventListener("keydown", e => beetle.keyHandler[e.key] = true);
    document.addEventListener("keyup", e => beetle.keyHandler[e.key] = false);

    //if r key is pressed, reset the beetle rotation and position. episode starts afresh
    document.addEventListener("keydown", e => {
        if (e.key === 'r') {
            beetle.mesh.position.set(0, 0, 0);
            beetle.mesh.rotation.z = 0;
            beetle.reset();
        }
    });
    ballsInit();
}

sceneInit();

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    beetle.moveBeetle(visibleBalls);
    getIntersections();
}

animate();