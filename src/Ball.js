import * as THREE from "three";
import helvetica from 'three/examples/fonts/helvetiker_regular.typeface.json'
class Ball {
    mesh;
    inSight = false;
    constructor(shape, position, id) {
        this.shape = shape;
        this.id = id;
        this.position = position;
        this.text = null;

        let geometry = new THREE.CircleGeometry(25, 64);
        let material = new THREE.MeshBasicMaterial({color:'transparent', transparent:true});
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
            this.text = new THREE.Mesh(textGeometry, mat);
            this.text.position.set(-8.5, -9, 0)
            this.mesh.add(this.text);

        this.mesh.position.set(this.position.x, this.position.y, 0);

    }

}

export default Ball