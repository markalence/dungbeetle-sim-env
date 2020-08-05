import * as THREE from "three";
import helvetica from 'three/examples/fonts/helvetiker_regular.typeface.json'
class Ball {
    mesh;
    inSight = false;
    constructor(shape, position, id) {
        this.shape = shape;
        this.id = id;
        this.position = position;
        let geometry = new THREE.CircleGeometry(25, 64);
        let material = new THREE.MeshBasicMaterial({color:'green', transparent:true});
        this.mesh = new THREE.Mesh(geometry, material);
        let loader = new THREE.FontLoader();
        let textGeometry;
        let font = loader.parse(helvetica);
            textGeometry = new THREE.TextGeometry(this.id.toString(), {
                font: font,
                size: 20,
                height: 1,
                curveSegments: 100
            });
            let mat = new THREE.MeshBasicMaterial({color: 'white'});
            let num = new THREE.Mesh(textGeometry, mat);
            num.position.set(-8, -9, 0)
            this.mesh.add(num);

        this.mesh.position.set(this.position.x, this.position.y, 0);

    }

}

export default Ball