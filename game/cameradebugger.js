const CAMERA_MOVEMENT_UNITS = 5;

export default class {

    constructor() {
        // ?
    }

    bindTo(state) {
        this.state = state;
        state.camera.setBoundsToWorld();
        this.cursors = state.game.input.keyboard.createCursorKeys();
    }

    update() {
        const camera = this.state.game.camera;

        if (this.cursors.left.isDown) {
            camera.x -= CAMERA_MOVEMENT_UNITS;
        } else if (this.cursors.right.isDown) {
            camera.x += CAMERA_MOVEMENT_UNITS;
        }

        if (this.cursors.up.isDown) {
            camera.y -= CAMERA_MOVEMENT_UNITS;
        } else if (this.cursors.down.isDown) {
            camera.y += CAMERA_MOVEMENT_UNITS;
        }

        camera.update();
    }

}
