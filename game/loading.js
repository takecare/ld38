import Phaser from 'phaser-ce';

export default class extends Phaser.State {

    init() {
        this.stage.backgroundColor = '#ccc';
        // TODO set preloading sprite
    }

    preload() {
        // TODO load loading bar sprite
        this.game.load.tilemap('map', '../assets/tilemap.json', null, Phaser.Tilemap.TILED_JSON);
        this.game.load.image('tileset', '../assets/tileset.png');

        this.game.load.spritesheet('box', '../assets/box.png', 64, 64);

    }

    create() {
        // ...

        this.state.start('Menu');
    }

}
