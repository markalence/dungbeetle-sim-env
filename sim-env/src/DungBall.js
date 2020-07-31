import * as THREE from "three";

class DungBall {
    constructor(shape, position, id) {
        this.shape = shape;
        this.id = id;
        let geometry = new THREE.CircleGeometry(25, 64);
        let material = new THREE.MeshBasicMaterial({color: 'white'});
        this.ball = new THREE.Mesh(geometry, material)
        this.ball.position.set(position.x, position.y, 0);
    }

    getBall() {
        return this.ball;
    }
}

export default DungBall