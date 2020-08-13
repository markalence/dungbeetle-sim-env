import * as THREE from "three";
import helvetica from 'three/examples/fonts/helvetiker_regular.typeface.json'
import {Vector3} from "three";

const RATIO = 25 / 21;

class Ball {
    mesh;
    inSight = false;

    constructor(shape, position, id) {
        this.shape = shape;
        this.id = id;
        this.position = position;
        this.text = null;
        let geometry;
        let [v1, v2, v3] = [new Vector3(), new Vector3(), new Vector3()];
        switch (shape) {
            case 'sphere':
                geometry = new THREE.CircleGeometry(21*RATIO, 64);
                break;
            case 'cylb':
                geometry = new THREE.CircleGeometry(22.5*RATIO);
                break;
            case 'cylc':
                geometry = new THREE.CircleGeometry(16.5*RATIO);
                break;
            case 'uwc':
                geometry = new THREE.Geometry();
                v1.set(-33 * RATIO, -21 * RATIO, 0);
                v2.set(33 * RATIO, -21 * RATIO, 0);
                v3.set(0, 21 * RATIO, 0);
                [v1, v2, v3].forEach(v => geometry.vertices.push(v));
                geometry.faces.push(new THREE.Face3(2, 0, 1));
                break;
            case 'iwc':
                geometry = new THREE.Geometry()
                v1.set(-33*RATIO, 21*RATIO, 0);
                v2.set(33*RATIO, 21*RATIO, 0);
                v3.set(0, -21*RATIO, 0);
                [v1, v2, v3].forEach(v => geometry.vertices.push(v));
                geometry.faces.push(new THREE.Face3(0, 2, 1));
                break;
            case 'inc':
                geometry = new THREE.Geometry()
                v1.set(-21*RATIO, (33-8)*RATIO,0);
                v2.set(21*RATIO, (33-8)*RATIO,0);
                v3.set(0, -(33+8)*RATIO,0);
                [v1, v2, v3].forEach(v => geometry.vertices.push(v));
                geometry.faces.push(new THREE.Face3(0, 2, 1));
                break;
        }
        let material = new THREE.MeshBasicMaterial({color: 'black', transparent: true});
        this.mesh = new THREE.Mesh(geometry, material);
        let loader = new THREE.FontLoader();

        let textGeometry;
        let font = loader.parse(helvetica);
        textGeometry = new THREE.TextGeometry((this.id + 1).toString(), {
            font: font,
            size: 20,
            height: 1,
            curveSegments: 1
        });
        let mat = new THREE.MeshBasicMaterial({color: 'white'});
        this.text = new THREE.Mesh(textGeometry, mat);
        textGeometry.computeBoundingBox();
        let center = new Vector3();
        textGeometry.boundingBox.getCenter(center);
        this.text.position.set(-center.x, -center.y, 0);
        this.mesh.add(this.text);

        font = loader.parse(helvetica);
        textGeometry = new THREE.TextGeometry(this.shape, {
            font: font,
            size: 15,
            height: 1,
            curveSegments: 100
        });
        mat = new THREE.MeshBasicMaterial({color: 'white'});
        this.text = new THREE.Mesh(textGeometry, mat);
        this.text.position.set(-5.5 * this.shape.length, 35, 0)
        this.mesh.add(this.text);
        this.mesh.position.set(this.position.x, this.position.y, 0);

    }
}

export default Ball