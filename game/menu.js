import Phaser from 'phaser-ce';

export default class extends Phaser.State {

    init() {
        this.stage.backgroundColor = '#fff';
    }

    preload() {
        // TODO
    }

    create() {
        // TODO
        this.game.input.onDown.add(() => { this.state.start('Play') }, this);
    }

}
