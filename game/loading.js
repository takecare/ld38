import Phaser from 'phaser-ce';

export default class extends Phaser.State {

    init() {
        this.stage.backgroundColor = '#ccc';
        // TODO set preloading sprite
    }

    preload() {
        // TODO load loading bar sprite
        this.game.load.tilemap('map', '../assets/tilemap.json');
        this.game.load.image('tileset', '../assets/tileset.png');
    }

    create() {
        // ...
        this.state.start('Menu');
    }

}
