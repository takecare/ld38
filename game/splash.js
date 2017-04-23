import Phaser from 'phaser-ce';

const SPLASH_TIMEOUT_MILLIS = 0;

export default class extends Phaser.State {

    constructor(...args) {
        super(...args);
        this.timedOut = false;
    }

    init() {
        this.stage.backgroundColor = '#ffffffff';
        this.game.load.onFileComplete.add(this.loadedFile, this);
        this.game.load.onLoadComplete.add(this.moveToMenu, this);
    }

    preload() {
        this.game.load.image('loading', '../assets/loading.png');
        this.game.load.image('splash', '../assets/splash.png');
        this.game.load.image('wall', '../assets/wall.png');
        this.game.load.image('spikes', '../assets/spikes.png');
        this.game.load.image('coin', '../assets/coin.png');

        this.game.load.spritesheet('box', '../assets/box.png', 64, 64);

        this.game.load.tilemap('levelmap', '../assets/level1map.json', null, Phaser.Tilemap.TILED_JSON);
        this.game.load.json('leveldata', '../assets/level1.json');

        // this.game.add.text(this.game.world.centerX - 300, 0, 'text', '');
    }

    create() {
        const image = this.game.add.image(this.game.world.centerX / 2, this.game.world.centerX / 2, 'splash');
        image.anchor.set(0.5);

        // TODO fix position

        this.event = this.game.time.events.add(SPLASH_TIMEOUT_MILLIS, this.splashTimeOut, this);
    }

    loadedFile(progress, cacheKey, success, totalLoaded, totalFiles) {
        //console.log(progress, cacheKey, success, totalLoaded, totalFiles);
    }

    splashTimeOut() {
        this.timedOut = true;
        this.moveToMenu();
    }

    moveToMenu() {
        if (this.game.load.hasLoaded && this.timedOut) {
            this.state.start('Menu');
        } else {
            this.game.time.events.add(SPLASH_TIMEOUT_MILLIS / 4, this.moveToMenu, this);
        }
    }

}
