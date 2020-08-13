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
        let geometry;
        switch (shape){
            case 'sphere' || 'cylinder':
                geometry = new THREE.CircleGeometry(25, 64);
                break;
            case 'cone':
                geometry = new THREE.Geometry();
                geometry = new THREE.Geometry();
                let v1 = new THREE.Vector3(-30,-25,0);   // Vector3 used to specify position
                let v2 = new THREE.Vector3(30,-25,0);
                let v3 = new THREE.Vector3(0,25,0);   // 2d = all vertices in the same plane.. z = 0
                geometry.vertices.push(v1);
                geometry.vertices.push(v2);
                geometry.vertices.push(v3);
                geometry.faces.push(new THREE.Face3(2, 0, 1));
        }
        let material = new THREE.MeshBasicMaterial({color:'black', transparent:true});
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
            if (shape === 'sphere' || shape === 'cylinder') this.text.position.set(-8.5, -9, 0);
            else if (shape === 'cone') this.text.position.set(-9, -15, 0);

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
        this.text.position.set(-28, 35, 0)
        this.mesh.add(this.text);

        this.mesh.position.set(this.position.x, this.position.y, 0);

    }

}

export default Ball