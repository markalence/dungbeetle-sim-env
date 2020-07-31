import * as THREE from 'three'
import Beetle from './Beetle'
import DungBall from "./DungBall";

let HEIGHT = window.innerHeight;
let WIDTH = window.innerWidth;
let scene = new THREE.Scene();
let camera = new THREE.OrthographicCamera(-WIDTH / 2, WIDTH / 2, HEIGHT / 2, -HEIGHT / 2, -10, 10);
let renderer = new THREE.WebGLRenderer();
let beetle = new Beetle()
let dungballs = []
let dbmeshes = []
let rays = []


function ballsInit() {
    let r = Math.PI
    let id = 0;
    for (let i = -r; i < r; i += Math.PI / 4) {
        dungballs.push(new DungBall('circle', new THREE.Vector2(Math.cos(i) * 300, Math.sin(i) * 300), id));
        id++;
    }
}

function getIntersections() {
    // console.log(beetle.getBeetleObject().position.distanceTo(dungballs[0].getBall().position))
    // console.log(beetle.getBeetleObject().rotation.z % (2*Math.PI))
    // console.log(beetle.getBeetleObject().getWorldPosition())
    console.log(beetle.getBeetleObject().getWorldPosition().angleTo(dungballs[0].getBall().getWorldPosition()) + beetle.getBeetleObject().getWorldDirection().z)
    dungballs.forEach(ball => {
        let dist = beetle.getBeetleObject().position.distanceTo(ball.getBall().position)
        let angle = beetle.getBeetleObject().position.angleTo(ball.getBall().position) - beetle.getBeetleObject().rotation.z % (2*Math.PI)
        // let cond =
        // if (dist < 300 && (angle < Math.PI / 6 || angle > 11 * Math.PI / 6) ) {
        //     console.log(ball.id, angle)
        // }
    })
}

function sceneInit() {
    camera.position.z = 5;
    scene.add(beetle.getBeetleObject());
    renderer.setSize(WIDTH, HEIGHT);
    document.body.appendChild(renderer.domElement);
    document.addEventListener("keydown", beetle.moveBeetle, false);
    ballsInit();
    dungballs.forEach(db => {
        scene.add(db.getBall())
        dbmeshes.push(db.getBall());
    })
}

sceneInit();

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    getIntersections();
}

animate();