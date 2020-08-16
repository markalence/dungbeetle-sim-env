import * as THREE from 'three'
import Beetle from './Beetle'
import Arena from "./Arena";
import EventListeners from "./EventListeners";

global.RATIO = 25 / 21; //ratio between screen size and actual size
const HEIGHT = window.innerHeight;
const WIDTH = window.innerWidth;
const scene = new THREE.Scene();
const camera = new THREE.OrthographicCamera(-WIDTH / 2, WIDTH / 2, HEIGHT / 2, -HEIGHT / 2, -1, 100);
const renderer = new THREE.WebGLRenderer({antialias: true});
const arena = new Arena();
let beetle = new Beetle()
let eventListener = new EventListeners({beetle, arena});

function sceneInit() {
    camera.zoom = 0.9;
    camera.updateProjectionMatrix();
    renderer.setSize(WIDTH, HEIGHT);
    document.body.appendChild(renderer.domElement);
    renderer.setClearColor('#3f2a14', 1);
    scene.add(beetle.mesh);
    arena.getChildren().forEach(child => scene.add(child))
    eventListener.activateAllListeners();
}

sceneInit();

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    if (arena.paused) return;
    beetle.getVisibleBalls(arena.balls);
    beetle.moveBeetle();
}

animate();