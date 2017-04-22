import Phaser from 'phaser-ce';

import CameraDebugger from './cameradebugger';

export default class extends Phaser.State {

    constructor() {
        super();

    }

    init(level) {
        this.stage.backgroundColor = '#ccc';
        this.level = level;
    }

    preload() {
        // TODO
    }

    create() {

        this.cameraDebugger = new CameraDebugger();
        this.cameraDebugger.bindTo(this);

        // TODO
        this.map = this.game.add.tilemap('map');
        this.map.addTilesetImage('tileset');
        this.map.setCollisionBetween(1, 3);

        this.layer = this.map.createLayer('bounds');
        this.layer.resizeWorld();

        this.box = this.game.add.sprite(this.map.widthInPixels - 100, this.map.heightInPixels - 100, 'box');

        this.box.anchor.set(0.5);
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.game.physics.arcade.enable(this.box);

        this.box.body.gravity.y = 100;

        this.cameraDebugger.follow(this.box);
    }

    update() {

        this.cameraDebugger.update();

        this.game.physics.arcade.collide(this.box, this.layer);

    }

}
