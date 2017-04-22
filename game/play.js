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

        // this.cursors = this.game.input.keyboard.createCursorKeys();
        this.box = this.game.add.sprite(64, 64, 'box');
        this.box.anchor.set(0.5);

        // this.game.physics.startSystem(Phaser.Physics.ARCADE);
        // this.game.physics.arcade.enable(this.box);
        // this.box.body.maxAngular = 500;
        // this.box.body.angularDrag = 50;

        // this.game.camera.follow(this.box);

        this.layer.resizeWorld();
    }

    update() {

        this.cameraDebugger.update();

        // this.game.physics.arcade.collide(this.box, this.layer);

        // this.box.body.velocity.x = 0;
        // this.box.body.velocity.y = 0;
        // this.box.body.angularVelocity = 0;

        // if (this.cursors.left.isDown) {
        //     this.box.body.angularVelocity = -300;
        // } else if (this.cursors.right.isDown) {
        //     this.box.body.angularVelocity = 300;
        // }
        //
        // if (this.cursors.up.isDown) {
        //     this.game.physics.arcade.velocityFromAngle(this.box.angle, 300, this.box.body.velocity);
        // } else if (this.cursors.down.isDown) {
        //     this.game.physics.arcade.velocityFromAngle(this.box.angle, -300, this.box.body.velocity);
        // }

    }

}
