class EventListeners {

    /**
     * This class manages all inputs and
     * listens to changes in initial bearing, ball at initial bearing, experiment number, and keyboard events.
     * Requires the beetle as well as the arena to be passed into the param object
     * @param param -> {Beetle, Arena, Playback}
     */
    constructor(param) {
        this.playback = param.playback;
        this.beetle = param.beetle;
        this.arena = param.arena;
        this.initialBearing = document.getElementById('bearing');
        this.randomBall = document.getElementById('ball');
        this.experiment = document.getElementById('experiment');
        this.experimentPlayback = document.getElementById('experimentPlayback');
        this.beetlePlayback = document.getElementById('beetlePlayback');
        this.playbackToggle = document.getElementById('toggle');
        this.toggle = true;
    }

    /**
     * Rotate the board so that the selected ball is at the selected bearing
     */
    rotateBoard() {
        let offset = (this.randomBall.value - 1) * 45;
        let bearing = -Math.PI * (this.initialBearing.value - offset) / 180;
        this.arena.board.rotation.z = bearing;
        this.arena.balls.forEach(ball => ball.mesh.rotation.z = -bearing);
    }

    /**
     * Rotate the board when the initial bearing is changed
     */
    activateBearingListener() {
        this.initialBearing.addEventListener("input", _ => this.rotateBoard());
    }

    /**
     * Rotate the board when the ball that is set to be at 'initialBearing' is changed
     */
    activateBallListener() {
        this.randomBall.addEventListener("input", _ => this.rotateBoard())
    }

    /**
     * Change shape of the balls depending on which experiment is being run
     */
    activateExperimentListener() {
        this.experiment.addEventListener("input", _ => {
            let shapeA, shapeB;
            let shapeObj = {
                3: ['sphere', 'cyla'],
                4: ['sphere', 'uwc'],
                5: ['uwc', 'iwc'],
                6: ['uwc', 'inc'],
                9: ['cylc', 'cyle'],
                10: ['cyld', 'cyle'],
                11: ['cylb', 'cyld'],
                12: ['cylc', 'cyld']
            }
            shapeA = shapeObj[this.experiment.value][0];
            shapeB = shapeObj[this.experiment.value][1];
            this.arena.balls.forEach(ball => {
                this.arena.board.remove(ball.mesh);
                ball.mesh.geometry.dispose();
                ball.mesh.material.dispose();
            });
            this.arena.placeBalls(shapeA, shapeB);
            this.rotateBoard();
        })
    }

    /**
     * Listens to keyboard inputs.
     * 'r' resets the episode/demonstration, and sets beetle's position and rotation to 0.
     * Space bar pauses/unpauses demonstration
     * Arrow keys are handled by the beetle class
     */
    activateKeyboardListeners() {
        document.addEventListener("keydown", e => {
            if (e.key === 'r') {
                this.beetle.reset();
                this.beetle.keyHandler[e.key] = true
            } else if (e.key === ' ') {
                this.arena.paused = !this.arena.paused
                this.arena.status.RECORDING.visible = !this.arena.paused;
                this.arena.status.PAUSED.visible = this.arena.paused;
            } else {
                this.beetle.keyHandler[e.key] = true
            }
        });
        document.addEventListener("keyup", e => this.beetle.keyHandler[e.key] = false);
    }

    activateAllListeners() {
        this.activateBearingListener();
        this.activateBallListener();
        this.activateExperimentListener();
        this.activateKeyboardListeners();
        this.activatePlaybackListeners();
    }


    activatePlaybackListeners() {
        [this.experimentPlayback, this.beetlePlayback].forEach(l => {
            l.addEventListener("input", _ => {
                this.playback.experiment = +this.experimentPlayback.value;
                this.playback.beetleNum = +this.beetlePlayback.value;
                if (0 < this.playback.beetleNum && this.playback.beetleNum < 20
                    && [3, 4, 5, 6, 9, 10, 11, 12].includes(this.playback.experiment)) {
                    this.beetle.reset();
                    this.playback.readData();
                    this.rotateBoard();
                }
            });
        });
    }

    doToggle(){
        this.toggle = !this.toggle;
        document.getElementById('toggle').innerHTML = this.toggle ? 'Playback' : 'Recording'
        document.getElementById('playbackid').style.display = this.toggle ? 'none' : 'block'
        document.getElementById('labelid').style.display = this.toggle ? 'block' : 'none'
    }
    activateToggleListener(callback) {
        this.doToggle();
        callback();
        this.playbackToggle.addEventListener("click", _ => {
           this.doToggle();
            callback();
        });
    }
}

export default EventListeners;