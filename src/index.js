import * as THREE from 'three'
import Beetle from './Beetle'
import Ball from "./Ball";
import {Vector3} from "three";

let HEIGHT = window.innerHeight;
let WIDTH = window.innerWidth;
let scene = new THREE.Scene();
let camera = new THREE.OrthographicCamera(-WIDTH / 2, WIDTH / 2, HEIGHT / 2, -HEIGHT / 2, -1, 100);
let renderer = new THREE.WebGLRenderer({antialias: true});
let beetle = new Beetle()
let balls = []
let ballMeshes = []
let visibleBalls = new Array(8).fill(0);

function ballsInit() {
    let r = Math.PI
    let id = 0;
    for (let i = r; i > -r; i -= Math.PI / 4) {
        balls.push(new Ball('circle', new THREE.Vector2(Math.cos(i) * 300, Math.sin(i) * 300), id));
        id++;
    }
}

function getIntersections() {

    balls.forEach(ball => {
        let dist = beetle.mesh.getWorldPosition(new Vector3()).distanceTo(ball.mesh.getWorldPosition(new Vector3()))
        let angle = 0;
        let H = beetle.mesh.clone(false).position.sub(ball.mesh.getWorldPosition(new Vector3()));
        if (Math.abs(H.x) < 0.01) {
            angle = H.y > 0 ? Math.PI / 2 : -Math.PI / 2;
        } else if (Math.abs(H.y) < 0.01) {
            angle = H.x > 0 ? 0 : Math.PI;
        } else {
            angle = Math.atan2(H.y, H.x);
        }
        angle += Math.PI / 2 - beetle.mesh.rotation.z

        if (angle < 0 && angle < -Math.PI) {
            angle += 2 * Math.PI;
        } else if (angle > 0 && angle > Math.PI) {
            angle -= 2 * Math.PI;
        }

        if ((Math.abs(angle) < Beetle.AOV + 0.01) && dist <= 25 + Beetle.LOV * Math.cos(Beetle.AOV) / Math.cos(angle)) {
            ball.mesh.material.color.setHex(0xA9A9A9);
            visibleBalls[ball.id] = 1;
        } else {
            ball.mesh.material.color.setHex(0x000);
            visibleBalls[ball.id] = 0;
        }
    })
}

function sceneInit() {
    camera.zoom = 0.7;
    camera.updateProjectionMatrix();
    scene.add(beetle.mesh);
    renderer.setSize(WIDTH, HEIGHT);
    document.body.appendChild(renderer.domElement);
    renderer.setClearColor('#3f2a14', 1);
    document.addEventListener("keydown", e => beetle.keyHandler[e.which] = true, true);
    document.addEventListener("keyup", e => beetle.keyHandler[e.which] = false, true);
    ballsInit();
    balls.forEach(db => {
        scene.add(db.mesh)
        ballMeshes.push(db.mesh);
    })
}

sceneInit();

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    beetle.keyDown()
    getIntersections();
}

animate();