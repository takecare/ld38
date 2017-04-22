import Phaser from 'phaser-ce';

const SPLASH_TIMEOUT_MILLIS = 0;//3000;

export default class extends Phaser.State {

    init() {
        this.stage.backgroundColor = '#ffffffff';
    }

    preload() {
        //this.splashImage = this.game.cache.getImage('splash');
    }

    create() {
        //this.splashImage.anchor.set(0.5);
        const image = this.game.add.image(this.game.world.centerX / 2, this.game.world.centerX / 2, 'splash');
        image.anchor.set(0.5);

        // TODO fix position

        this.game.time.events.add(SPLASH_TIMEOUT_MILLIS, this.moveToMenu, this);
    }

    moveToMenu() {
        this.state.start('Menu');
    }

}
