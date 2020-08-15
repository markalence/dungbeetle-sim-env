import * as THREE from 'three'
import Beetle from './Beetle'
import Ball from "./Ball";
import {Board, Status} from "./Board";

global.RATIO = 25 / 21; //ratio between screen size and actual size
const HEIGHT = window.innerHeight;
const WIDTH = window.innerWidth;
const scene = new THREE.Scene();
const camera = new THREE.OrthographicCamera(-WIDTH / 2, WIDTH / 2, HEIGHT / 2, -HEIGHT / 2, -1, 100);
const renderer = new THREE.WebGLRenderer({antialias: true});
let initialBearing = document.getElementById('bearing');
let randomBall = document.getElementById('ball');
let experiment = document.getElementById('experiment');
let paused = false;
let PLAY = new Status('RECORDING').text;
let PAUSE = new Status('PAUSED').text;
PAUSE.visible = false;
let shapeA = 'sphere'
let shapeB = 'sphere'
let offset = 0
let beetle = new Beetle()
let board = new Board();


function rotateBoard() {
    offset = (randomBall.value - 1) * 45;
    let bearing = -Math.PI * (initialBearing.value - offset) / 180;
    board.mesh.rotation.z = bearing;
    beetle.balls.forEach(ball => ball.mesh.rotation.z = -bearing);
}

initialBearing.addEventListener("input", _ => rotateBoard());
randomBall.addEventListener("input", _ => rotateBoard())
experiment.addEventListener("input", _ => {
    //change the shape of each ball depending on which experiment is being run
    switch (+experiment.value) {
        case 3:
            shapeA = 'sphere';
            shapeB = 'cyla';
            break;
        case 4:
            shapeA = 'sphere';
            shapeB = 'uwc';
            break;
        case 5:
            shapeA = 'uwc';
            shapeB = 'iwc';
            break;
        case 6:
            shapeA = 'uwc';
            shapeB = 'inc';
            break;
        case 9:
            shapeA = 'cylc';
            shapeB = 'cyle';
            break;
        case 10:
            shapeA = 'cyld';
            shapeB = 'cyle';
            break;
        case 11:
            shapeA = 'cylb';
            shapeB = 'cyld';
            break;
        case 12:
            shapeA = 'cylc';
            shapeB = 'cyld';
            break;
    }
    beetle.balls.forEach(ball => {
        board.mesh.remove(ball.mesh);
        ball.mesh.geometry.dispose();
        ball.mesh.material.dispose();
    });
    ballsInit(shapeA, shapeB);
    rotateBoard();
})

document.addEventListener("keydown", e => beetle.keyHandler[e.key] = true);
document.addEventListener("keyup", e => beetle.keyHandler[e.key] = false);

//if r key is pressed, reset the beetle rotation and position. episode starts afresh
document.addEventListener("keydown", e => {
    if (e.key === 'r') {
        beetle.mesh.position.set(0, 0, 0);
        beetle.mesh.rotation.z = 0;
        beetle.reset();
    } else if (e.key === ' ') {
        paused = !paused
        PLAY.visible = !paused;
        PAUSE.visible = paused;
    }
});

/**
 * Initialise position of dung balls in the scene
 */
function ballsInit(shapeA, shapeB) {
    let r = Math.PI
    let id = 0;
    //initialise ball 0 to be north of the beetle.
    //place each subsequent ball 45 degrees apart from each other.
    //each ball is then offset by the initial bearing of the beetle
    for (let i = r; i > -r; i -= Math.PI / 4) {
        let shape = id % 2 === 0 ? shapeA : shapeB
        beetle.ballShapes[id] = shape;
        beetle.balls[id] = new Ball(shape,
            new THREE.Vector2(
                Math.cos(i - Math.PI / 2) * RATIO * 145,
                Math.sin(i - Math.PI / 2) * RATIO * 145), id);
        id++;
    }
    beetle.balls.forEach(db => board.mesh.add(db.mesh));
}


function sceneInit() {
    camera.zoom = 0.9;
    camera.updateProjectionMatrix();
    scene.add(board.mesh);
    scene.add(beetle.mesh);
    scene.add(PAUSE);
    scene.add(PLAY);
    board.markers.forEach(mark => scene.add(mark));
    renderer.setSize(WIDTH, HEIGHT);
    document.body.appendChild(renderer.domElement);
    renderer.setClearColor('#3f2a14', 1);

    ballsInit(shapeA, shapeB);
}

sceneInit();

function animate() {

    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    if (paused) return;
    beetle.getIntersections();
    beetle.moveBeetle();
}

animate();