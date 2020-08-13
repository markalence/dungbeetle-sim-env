import * as THREE from 'three'
import helvetica from 'three/examples/fonts/helvetiker_regular.typeface.json'

class Board {

    constructor() {
        let geometry = new THREE.CircleGeometry(400, 64);
        let material = new THREE.MeshBasicMaterial({color: 0x855E42, transparent: true})
        this.board = new THREE.Mesh(geometry, material);
        this.board.renderOrder = 0
        let loader = new THREE.FontLoader();
        for (let i = 0; i < 360; i += 10) {
            let textGeometry;
            let font = loader.parse(helvetica);
            let spaces = i === 0 ? '\n|' :
                i > 0 && i < 100 ? '\n |' : '\n  |'
            textGeometry = new THREE.TextGeometry(i.toString() + spaces, {
                font: font,
                size: 15,
                height: 1,
                curveSegments: 1
            });
            let mat = new THREE.MeshBasicMaterial({color: 'white'});
            this.text = new THREE.Mesh(textGeometry, mat);
            this.text.rotation.z = -Math.PI * (i) / 180;
            this.text.position.set(-Math.cos(Math.PI * (i + 90) / 180) * 420, Math.sin(Math.PI * (i + 90) / 180) * 420, 0);
            this.board.add(this.text);
        }
    }
}

export default Board;