import * as THREE from 'three'
import Beetle from './Beetle'
import DungBall from "./DungBall";
import {Vector3} from "three";

let HEIGHT = window.innerHeight;
let WIDTH = window.innerWidth;
let scene = new THREE.Scene();
let camera = new THREE.OrthographicCamera(-WIDTH / 2, WIDTH / 2, HEIGHT / 2, -HEIGHT / 2, -1, 100);
let renderer = new THREE.WebGLRenderer();
let beetle = new Beetle()
let dungballs = []
let dbmeshes = []


function ballsInit() {
    let r = Math.PI
    let id = 0;
    for (let i = r; i > -r; i -= Math.PI / 4) {
        dungballs.push(new DungBall('circle', new THREE.Vector2(Math.cos(i) * 300, Math.sin(i) * 300), id));
        id++;
    }
}

function getIntersections() {

    dungballs.forEach(ball => {
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

        if ((Math.abs(angle) < Math.PI / 4 + 0.01) && dist <= 25 + 300*Math.sin(Math.PI/4)/Math.cos(angle)) {
            ball.mesh.material.color.setHex(0xA9A9A9);
        } else {
            ball.mesh.material.color.setHex(0x000);
        }
    })
}

function sceneInit() {
    camera.zoom = 0.7;
    camera.updateProjectionMatrix();
    scene.add(beetle.mesh);
    renderer.setSize(WIDTH, HEIGHT);
    document.body.appendChild(renderer.domElement);
    renderer.setClearColor( '#3f2a14', 1 );
    document.addEventListener("keydown", beetle.moveBeetle, false);
    ballsInit();
    dungballs.forEach(db => {
        scene.add(db.mesh)
        dbmeshes.push(db.mesh);
    })
}

sceneInit();

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    getIntersections();
}

animate();