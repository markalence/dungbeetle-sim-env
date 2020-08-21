import * as THREE from 'three'
import $ from 'jquery';
import Beetle from './Beetle'
import Arena from "./Arena";
import EventListeners from "./EventListeners";
import Playback from "./Playback";

global.RATIO = 25 / 21; //ratio between screen size and actual size in mm
const HEIGHT = window.innerHeight;
const WIDTH = window.innerWidth;
const scene = new THREE.Scene();
const camera = new THREE.OrthographicCamera(-WIDTH / 2, WIDTH / 2, HEIGHT / 2, -HEIGHT / 2, -1, 100);
const renderer = new THREE.WebGLRenderer({antialias: true});
let isPlayback = true;
const arena = new Arena();
let beetle = new Beetle();
let playback = new Playback({arena, beetle});
let eventListener = new EventListeners({beetle, arena, playback});


function sceneInit() {
    camera.zoom = 0.9;
    camera.updateProjectionMatrix();
    renderer.setSize(WIDTH, HEIGHT);
    document.body.appendChild(renderer.domElement);
    renderer.setClearColor('#3f2a14', 1);
    scene.add(beetle.mesh);
    arena.getChildren().forEach(child => scene.add(child))
    eventListener.activateAllListeners();
    eventListener.activateToggleListener(() => {
        arena.status.RECORDING.visible = !isPlayback;
        isPlayback = !isPlayback;
    })
}

sceneInit();

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    if (arena.paused) return;
    if (playback) playback.runPlayback();
    beetle.getVisibleBalls(arena.balls);
    beetle.moveBeetle();
}

animate();