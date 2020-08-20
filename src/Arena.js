import * as THREE from 'three'
import helvetica from 'three/examples/fonts/helvetiker_regular.typeface.json'
import Ball from "./Ball";

class Arena {
    markers = [];
    balls = [];
    ballShapes = [];
    board;

    /**
     * This class manages the circular board, its angle markers, the balls, as well as the recording/paused status
     */
    constructor() {
        let geometry = new THREE.CircleGeometry(217.5 * global.RATIO, 64);
        let material = new THREE.MeshBasicMaterial({color: 0x855E42, transparent: true})
        this.board = new THREE.Mesh(geometry, material);
        this.setBoardMarkers();
        this.placeBalls('sphere', 'sphere')
        this.paused = false;
        let options = {size: 30, x: 0.35 * window.innerWidth, y: 0.48 * window.innerHeight}
        this.status = {
            RECORDING: this.createText('RECORDING', options),
            PAUSED: this.createText('PAUSED', options)
        };
        this.status.PAUSED.visible = false;
    }

    /**
     * @param str -> string to be rendered
     * @param options -> {size, x, y, rotation}
     * x -> x position
     * y -> y position
     * size -> size of text
     * rotation -> rotation of text
     * @returns {Mesh<TextGeometry, MeshBasicMaterial>}
     */
    createText(str, options) {
        let loader = new THREE.FontLoader();
        let textGeometry;
        let font = loader.parse(helvetica);
        textGeometry = new THREE.TextGeometry(str, {
            font: font,
            size: options.size,
            height: 1,
            curveSegments: 2
        });
        let mat = new THREE.MeshBasicMaterial({color: 'white'});
        let text = new THREE.Mesh(textGeometry, mat);
        text.position.set(options.x, options.y, 0);
        text.rotation.z = options.rotation || 0;
        return text;
    }

    /**
     *Initialise ball 0 to be north of the beetle.
     *Place each subsequent ball 45 degrees apart from each other.
     *Each ball is then offset by the initial bearing of the beetle.
     * @param shapeA -> shape of all even numbered balls
     * @param shapeB -> shape of all odd numbered balls
     */
    placeBalls(shapeA, shapeB) {
        let r = Math.PI
        let id = 0;
        for (let i = r; i > -r; i -= Math.PI / 4) {
            let shape = id % 2 === 0 ? shapeA : shapeB
            this.ballShapes[id] = shape;
            this.balls[id] = new Ball(shape,
                new THREE.Vector2(
                    Math.cos(i - Math.PI / 2) * RATIO * 145,
                    Math.sin(i - Math.PI / 2) * RATIO * 145), id);
            id++;
        }
        this.balls.forEach(db => this.board.add(db.mesh));
    }

    /**
     * Places the angle markers around the board
     */
    setBoardMarkers() {
        for (let i = 0; i < 360; i += 10) {
            let options = {
                x: -Math.cos(Math.PI * (i + 90) / 180) * 230 * global.RATIO,
                y: Math.sin(Math.PI * (i + 90) / 180) * 230 * global.RATIO,
                rotation: -Math.PI * (i) / 180,
                size: 12
            }
            let spaces = i === 0 ? '\n|'
                : i > 0 && i < 100 ? '\n |'
                    : '\n  |'
            let marker = this.createText(i.toString() + spaces, options);
            this.markers.push(marker);
        }
    }

    /**
     * @returns {[THREE.Mesh]} -> Markers meshes, status meshes, ball meshes, board mesh
     */
    getChildren() {
        let children = [];
        [this.board, this.status.RECORDING, this.status.PAUSED].forEach(item => children.push(item));
        this.markers.forEach(mark => children.push(mark));
        return children;
    }
}


export default Arena;