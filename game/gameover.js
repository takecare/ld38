import Phaser from 'phaser-ce';

export default class extends Phaser.State {

    init() {
        this.stage.backgroundColor = '#f00';
        const ensureCallback = (func) => !func ? () => {} : func;
        this.onPressCallback = ensureCallback(this.game.input.keyboard.onPressCallback);
        this.onDownCallback = ensureCallback(this.game.input.keyboard.onDownCallback);
        this.onUpCallback = ensureCallback(this.game.input.keyboard.onUpCallback);
    }

    preload() {
        // ...
    }

    create() {
        this.game.input.onDown.add(this.moveOn, this);
        this.game.input.keyboard.addCallbacks(this, this.onDownCallback, this.onUpCallback, this.moveOn);
    }

    moveOn() {
        this.game.input.keyboard.addCallbacks(this, this.onDownCallback, this.onUpCallback, this.onPressCallback);
        this.state.start('Menu');
    }

}
