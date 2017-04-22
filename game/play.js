import Phaser from 'phaser-ce';

import CameraDebugger from './cameradebugger';

const HORIZONTAL_VELOCITY = 150;
const VERICAL_VELOCITY = 150;
const GRAVITY = 250;

export default class extends Phaser.State {

    constructor() {
        super();
        this.boxState = 'idle';
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

        this.box = this.game.add.sprite(
            this.map.widthInPixels - 100,
            this.map.heightInPixels - 200,
            'box'
        );
        this.box.animations.add('walk-left', [1, 2, 3]);
        this.box.animations.add('walk-right', [1, 2, 3]); // TODO

        this.box.anchor.set(0.5);
        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        this.game.physics.arcade.enable(this.box);

        this.box.body.friction.set(0.8);
        this.box.body.gravity.y = GRAVITY;

        this.cameraDebugger.follow(this.box);
    }

    update() {

        this.cameraDebugger.update();

        this.game.physics.arcade.collide(this.box, this.layer, (sprite, group) => {
            this.colliding = true;
        });

        this.box.body.velocity.x = 0;

        if (this.input.keyboard.isDown(Phaser.Keyboard.W)) {
            this.jump();
        }

        if (this.input.keyboard.isDown(Phaser.Keyboard.A)) {
            this.box.body.velocity.x -= HORIZONTAL_VELOCITY;
            this.box.animations.play('walk-left');
            this.boxState = 'left';
        }
        if (this.input.keyboard.isDown(Phaser.Keyboard.D)) {
            this.box.body.velocity.x += HORIZONTAL_VELOCITY;
            this.box.animations.play('walk-right');
            this.boxState = 'right';
        }

        if (this.box.body.velocity.x === 0) {
            this.boxState = 'idle';
            this.box.animations.stop()
        }

    }

    render() {
        this.game.debug.body(this.box);
        this.game.debug.bodyInfo(this.box, 10, 10);
    }

    jump() {
        if (!this.colliding) {
            return;
        }

        this.box.body.velocity.y -= 12;
        this.boxState = 'jump';
    }

}
