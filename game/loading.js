import Phaser from 'phaser-ce';

export default class extends Phaser.State {

    constructor() {
        super();
    }

    init() {
        this.stage.backgroundColor = '#ccc';
        this.game.load.onFileComplete.add(this.loadedFile, this);
        this.game.load.onLoadComplete.add(this.finishedLoading, this);
    }

    preload() {
        const level = this.game.currentLevel;
        this.game.load.tilemap('levelmap', '../assets/level' + level + 'map.json', null, Phaser.Tilemap.TILED_JSON);
        this.game.load.json('leveldata', '../assets/level' + level + '.json');
        // this.game.add.text(this.game.world.centerX - 300, 0, 'text', '');
    }

    create() {
        this.game.add.image(this.game.world.centerX / 2, this.game.world.centerX / 2, 'loading');
    }

    loadedFile(progress, cacheKey, success, totalLoaded, totalFiles) {
        //console.log(progress, cacheKey, success, totalLoaded, totalFiles);
    }

    finishedLoading() {
        this.state.start('Play');
    }
}
