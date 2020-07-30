import * as THREE from 'three'
import Beetle from './Beetle'
import DungBall from "./DungBall";

let HEIGHT = window.innerHeight;
let WIDTH = window.innerWidth;
let scene = new THREE.Scene();
let camera = new THREE.OrthographicCamera(-WIDTH / 2, WIDTH / 2, HEIGHT / 2, -HEIGHT / 2, -10, 10);
let renderer = new THREE.WebGLRenderer();
let beetle = new Beetle()
let dungBalls = []


function ballsInit() {
    let r = 2*Math.PI
    let id = 0;
    for (let i = -r; i <= r; i += Math.PI/4) {
        dungBalls.push(new DungBall('circle', new THREE.Vector2(Math.cos(i)*300, Math.sin(i)*300), id));
        id++;
    }
}

function sceneInit() {
    camera.position.z = 5;
    scene.add(beetle.getBeetleObject());
    renderer.setSize(WIDTH, HEIGHT);
    document.body.appendChild(renderer.domElement);
    document.addEventListener("keydown", beetle.moveBeetle, false);
    ballsInit();
    dungBalls.forEach(db => {
        scene.add(db.getBall().toMesh())
    })
}


sceneInit();

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

animate();