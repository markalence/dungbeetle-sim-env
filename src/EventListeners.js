class EventListeners {

    // this class manages all inputs
    // listens to changes in initial bearing, ball at initial bearing, experiment number, and keyboard events
    constructor(param) {
        this.beetle = param.beetle;
        this.arena = param.arena;
        this.initialBearing = document.getElementById('bearing');
        this.randomBall = document.getElementById('ball');
        this.experiment = document.getElementById('experiment');
    }

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
     * Rotate the board when the ball that is set to be at 'initialBearing' has changed
     */
    activateBallListener() {
        this.randomBall.addEventListener("input", _ => this.rotateBoard())
    }

    /**
     * change shape of the balls depending on which experiment is being run
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
     * 'r' resets the episode/demonstration
     * Spacebar pauses demonstration
     * Arrow keys are handled by the beetle class
     */
    activateKeyboardListeners() {
        document.addEventListener("keydown", e => {
            //if r key is pressed, reset the beetle rotation and position. episode starts afresh
            //if space key is pressed, pause the episode
            if (e.key === 'r') {
                this.beetle.mesh.position.set(0, 0, 0);
                this.beetle.mesh.rotation.z = 0;
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
    }
}

export default EventListeners;