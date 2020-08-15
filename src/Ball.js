import * as THREE from "three";
import helvetica from 'three/examples/fonts/helvetiker_regular.typeface.json'
import {Vector3} from "three";

class Ball {
    mesh;

    constructor(shape, position, id) {
        this.shape = shape;
        this.id = id;
        this.position = position;
        this.radius = 5;
        let geometry;
        let [v1, v2, v3] = [new Vector3(), new Vector3(), new Vector3()];

        switch (shape) {
            case 'sphere':
                this.radius = 21 * global.RATIO;
                geometry = new THREE.CircleGeometry(this.radius, 64);
                break;
            case 'cyla':
                this.radius = 18.6*global.RATIO;
                geometry = new THREE.CircleGeometry(this.radius, 64);
                break;
            case 'cylb':
                this.radius = 22.5 * global.RATIO;
                geometry = new THREE.CircleGeometry(this.radius, 64);
                break;
            case 'cylc':
                this.radius = 21 * global.RATIO;
                geometry = new THREE.CircleGeometry(this.radius, 64);
                break;
            case 'cyld':
                this.radius = 16.5 * global.RATIO;
                geometry = new THREE.CircleGeometry(this.radius, 64);
                break;
            case 'cyle':
                this.radius = 10.5 * global.RATIO;
                geometry = new THREE.CircleGeometry(this.radius, 64);
                break;
            case 'uwc':
                geometry = new THREE.Geometry();
                v1.set(-33 * global.RATIO, -21 * global.RATIO, 0);
                v2.set(33 * global.RATIO, -21 * global.RATIO, 0);
                v3.set(0, 21 * global.RATIO, 0);
                [v1, v2, v3].forEach(v => geometry.vertices.push(v));
                geometry.faces.push(new THREE.Face3(2, 0, 1));
                break;
            case 'iwc':
                geometry = new THREE.Geometry()
                v1.set(-33 * global.RATIO, 21 * global.RATIO, 0);
                v2.set(33 * global.RATIO, 21 * global.RATIO, 0);
                v3.set(0, -21 * global.RATIO, 0);
                [v1, v2, v3].forEach(v => geometry.vertices.push(v));
                geometry.faces.push(new THREE.Face3(0, 2, 1));
                break;
            case 'inc':
                geometry = new THREE.Geometry()
                v1.set(-21 * global.RATIO, (33 - 8) * global.RATIO, 0);
                v2.set(21 * global.RATIO, (33 - 8) * global.RATIO, 0);
                v3.set(0, -(33 + 8) * global.RATIO, 0);
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
            size: 15,
            height: 1,
            curveSegments: 1
        });
        let mat = new THREE.MeshBasicMaterial({color: 'white'});
        let text = new THREE.Mesh(textGeometry, mat);
        let center = new Vector3();
        textGeometry.computeBoundingBox();
        textGeometry.boundingBox.getCenter(center);
        text.position.set(-center.x, -center.y, 0);
        this.mesh.add(text);

        textGeometry = new THREE.TextGeometry(this.shape, {
            font: font,
            size: 12,
            height: 1,
            curveSegments: 1
        });
        text = new THREE.Mesh(textGeometry, mat);
        textGeometry.computeBoundingBox();
        textGeometry.boundingBox.getCenter(center);
        text.position.set(-center.x, 25*global.RATIO, 0);
        this.mesh.add(text);

        this.mesh.position.set(this.position.x, this.position.y, 0);

    }
}


export default Ball