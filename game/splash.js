import Phaser from 'phaser-ce';

export default class extends Phaser.State {

    // TODO

    init() {
        this.stage.backgroundColor = '#0f0';
    }

    preload() {
        // ...
    }

    create() {
        this.state.start('Loading');
    }

}
