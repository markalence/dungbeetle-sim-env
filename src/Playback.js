import Ball from "./Ball";

class Playback {

    dir = {
        3: '25 March Experiment 3',
        4: '25 March Experiment 4',
        5: '25 March Experiment 5',
        6: '27 March Experiment 6',
        9: '28 March Experiment 9',
        10: '29 March Experiment 10',
        11: '29 March Experiment 11',
        12: '29 March Experiment 12',
    }

    constructor(param) {
        this.arena = param.arena;
        this.beetle = param.beetle;
        this.frame = 0;
        this.experiment = 0;
        this.beetleNum = 0;
        this.sa = [];
        this.truth = [];
        this.demonstrations = {};
        this.loadDemonstrations();
    }

    copyScene() {
        // this.arena.board.rotation.z = 0;
        let newBalls = [];
        this.arena.balls.forEach(ball => {
            this.arena.board.remove(ball.mesh);
            ball.mesh.geometry.dispose();
            ball.mesh.material.dispose();
            let n = 7 - ball.id
            let newBall = new Ball(this.truth[n].shape, this.truth[n].position, n);
            newBalls.push(newBall);
        });
        this.arena.balls = newBalls
        this.arena.balls.forEach(ball => {
            this.arena.board.add(ball.mesh);
        })
    }

    readData() {
        this.sa = [];
        this.truth = [];
        this.frame = 0;
        ['truth', 'sa'].forEach(x => {
            $.get(`Demonstrations/${this.dir[this.experiment]}/${this.demonstrations[this.experiment][this.beetleNum - 1]}_${x}.txt`, data => {
                let str = '';
                for (let i = 0; i < data.length; ++i) {
                    str += data[i];
                    if (x === 'truth') {
                        if (data[i] !== ',' && data[i - 1] === '}') {
                            this.truth.push(JSON.parse(str))
                            str = '';
                        }
                    } else {
                        if (data[i] === '}' && data[i - 1] === ']') {
                            this.sa.push(JSON.parse(str))
                            str = '';
                        }
                    }
                }
                if (x === 'truth') this.copyScene();
            })
        })
    }

    loadDemonstrations() {
        Object.keys(this.dir).forEach(key => {
            $.get(`Demonstrations/${(this.dir)[key]}`, data => {
                this.demonstrations[key] = [];
                for (let i = 1; i < $(data).find('li span.name').length; i++) {
                    let elem = $(data).find('li span.name')[i].innerHTML;
                    if (elem.includes('_sa')) {
                        elem = elem.replace('_sa.txt', '');
                        this.demonstrations[key].push(elem)
                    }
                }
            })
        })
    }

    runPlayback() {
        if (this.frame === this.sa.length - 1 || this.sa.length < 1) return;
        this.beetle.keyHandler = this.sa[this.frame + 1].action;
        this.frame++;
    }
}

export default Playback