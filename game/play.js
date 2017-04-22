import Phaser from 'phaser-ce';

import CameraDebugger from './cameradebugger';

const HORIZONTAL_VELOCITY = 150;
const VERTICAL_VELOCITY = 200;
const GRAVITY = 250;

const SCALE_FACTOR = 2;

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
        this.map.setCollisionBetween(1, 4); // 1: wall, 2: spikes, 3: coin, 4: exit

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

        this.box.checkWorldBounds = true;
        this.box.events.onOutOfBounds.add(this.handleOutOfBounds, this);

        this.box.body.gravity.y = GRAVITY;

        this.cameraDebugger.follow(this.box);
    }

    update() {

        this.cameraDebugger.update();

        this.game.physics.arcade.collide(this.box, this.layer, (sprite, group) => {
            // maybe useful to find out collision data
        });

        this.box.body.velocity.x = 0;

        this.handleInput();

        if (this.box.body.velocity.x === 0) {
            this.boxState = 'idle';
            this.box.animations.stop()
        }

    }

    render() {
        this.game.debug.body(this.box);
        this.game.debug.bodyInfo(this.box, 10, 10);
    }

    handleInput() {
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
    }

    handleOutOfBounds() {
        this.state.start('GameOver');
    }

    jump() {
        if (!this.box.body.blocked.down) {
            return;
        }
        this.box.body.velocity.y -= VERTICAL_VELOCITY;
        this.boxState = 'jump';
    }

    scaleUp() {
        this.box.width *= SCALE_FACTOR;
        this.box.height *= SCALE_FACTOR;
        this.box.body.width *= SCALE_FACTOR;
        this.box.body.height *= SCALE_FACTOR;
    }

    scaleDown() {
        this.box.width /= SCALE_FACTOR;
        this.box.height /= SCALE_FACTOR;
        this.box.body.width /= SCALE_FACTOR;
        this.box.body.height /= SCALE_FACTOR;
    }

}
