import * as THREE from "three";
import helvetica from 'three/examples/fonts/helvetiker_regular.typeface.json'
import {Vector3} from "three";

class Ball {
    mesh;
    constructor(shape, position, id) {
        this.shape = shape;
        this.id = id;
        this.position = position;
        let geometry;

        //assign various radii to the sphere and cylinder balls. 5 if it isn't a sphere or cylinder
        this.radius = shape === 'sphere' ? 21 * RATIO
            : shape === 'cyla' ? 18.6 * RATIO
                : shape === 'cylb' ? 22.5 * RATIO
                    : shape === 'cylc' ? 21 * RATIO
                        : shape === 'cyld' ? 16.5 * RATIO
                            : shape === 'cyle' ? 10.5 * RATIO
                                : 5

        if (this.radius !== 5) geometry = new THREE.CircleGeometry(this.radius, 32)
        else {
            let [v1, v2, v3] = [new Vector3(), new Vector3(), new Vector3()];
            geometry = new THREE.Geometry();
            switch (shape) {
                case 'uwc':
                    v1.set(33 * RATIO, -21 * RATIO, 0);
                    v2.set(-33 * RATIO, -21 * RATIO, 0);
                    v3.set(0, 21 * RATIO, 0);
                    this.radius = 33*RATIO;
                    break;
                case 'iwc':
                    v1.set(-33 * RATIO, 21 * RATIO, 0);
                    v2.set(33 * RATIO, 21 * RATIO, 0);
                    v3.set(0, -21 * RATIO, 0);
                    break;
                case 'inc':
                    geometry = new THREE.Geometry()
                    v1.set(-21 * RATIO, (33 - 8) * RATIO, 0);
                    v2.set(21 * RATIO, (33 - 8) * RATIO, 0);
                    v3.set(0, -(33 + 8) * RATIO, 0);
                    break;
            }
            [v1, v2, v3].forEach(v => geometry.vertices.push(v));
            geometry.faces.push(new THREE.Face3(0, 2, 1));
        }
        let material = new THREE.MeshBasicMaterial({color: 'black', transparent: true});
        this.mesh = new THREE.Mesh(geometry, material);
        this.addTextToMesh(this.shape, 12, {x:true}, {y: 25.5*RATIO});
        this.addTextToMesh((id+1).toString(), 15, {x: true, y:true});
        this.mesh.position.set(this.position.x, this.position.y, 0);
    }

    addTextToMesh(string, size, centered, position,) {
        let loader = new THREE.FontLoader();
        let textGeometry;
        let font = loader.parse(helvetica);
        textGeometry = new THREE.TextGeometry(string, {
            font: font,
            size: size,
            height: 1,
            curveSegments: 1
        });
        let mat = new THREE.MeshBasicMaterial({color: 'white'});
        let text = new THREE.Mesh(textGeometry, mat);
        let center = new Vector3();
        textGeometry.computeBoundingBox();
        textGeometry.boundingBox.getCenter(center);
        text.position.set(centered.x ? -center.x : position.x, centered.y ? -center.y : position.y, 0);
        this.mesh.add(text);
    }
}

export default Ball