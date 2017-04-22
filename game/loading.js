import Phaser from 'phaser-ce';

export default class extends Phaser.State {

    init() {
        this.stage.backgroundColor = '#ccc';

        this.game.load.onFileComplete.add(this.loadedFile, this);
        this.game.load.onLoadComplete.add(this.finishedLoading, this);

        //this.game.load.setPreloadSprite(sprite, direction)
    }

    preload() {
        this.game.load.image('loading', '../assets/loading.png');

        this.game.load.tilemap('map', '../assets/tilemap.json', null, Phaser.Tilemap.TILED_JSON);
        this.game.load.image('tileset', '../assets/tileset.png');

        this.game.load.spritesheet('box', '../assets/box.png', 64, 64);

        this.game.load.image('splash', '../assets/splash.png');

        // this.game.add.text(this.game.world.centerX - 300, 0, 'text', '');
    }

    create() {
        // ...

        //const image = this.game.add.image('loading', '../assets/loading.png');
        this.game.add.image(this.game.world.centerX / 2, this.game.world.centerX / 2, 'loading');

        //this.game.load.isLoading
        //this.game.load.hasLoaded
        //this.game.load.progress
    }

    loadedFile(progress, cacheKey, success, totalLoaded, totalFiles) {
        //console.log(progress, cacheKey, success, totalLoaded, totalFiles);
    }

    finishedLoading() {
        this.state.start('Splash');
    }
}
