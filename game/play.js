import Phaser from 'phaser-ce';

import CameraDebugger from './cameradebugger';

const HORIZONTAL_VELOCITY = 250;
const VERTICAL_VELOCITY = 600;
const GRAVITY = 1000;

const BOUNDING_BOX_MARGIN = 6;

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
        this.data = this.game.cache.getJSON('level1');
    }

    create() {

        this.cameraDebugger = new CameraDebugger();
        this.cameraDebugger.bindTo(this);

        this.game.physics.arcade.gravity.y = 300;

        this.createLevel();
        this.createPlayer();

        this.cameraDebugger.follow(this.box);
    }

    createLevel() {
        this.map = this.game.add.tilemap('map');
        this.map.addTilesetImage('tileset');
        this.map.setCollisionBetween(1, 4); // 1: wall, 2: spikes, 3: coin, 4: exit

        this.layer = this.map.createLayer('bounds');
        this.layer.resizeWorld();
    }

    createPlayer() {
        this.box = this.game.add.sprite(
            this.map.widthInPixels,
            this.map.heightInPixels,
            'box'
        );

        // TODO animations
        this.box.animations.add('walk-left', [1, 2, 3], 10, true);
        this.box.animations.add('walk-right', [1, 2, 3], 10, true);
        this.box.animations.add('jump', [2, 3], 10);
        this.box.animations.add('idle', [1, 2, 3], 5);

        this.box.anchor.set(0.5);
        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        this.game.physics.arcade.enable(this.box);

        this.box.checkWorldBounds = true;
        this.box.events.onOutOfBounds.add(this.handleOutOfBounds, this);

        this.box.body.gravity.y = GRAVITY;
        this.box.body.maxVelocity.y = 500;

        this.scalePlayer(this.data.scale);

        this.box.x -= this.box.width / 2 + this.map.tileWidth;
        this.box.y -= this.box.height / 2 + this.map.tileHeight;
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
            this.box.animations.play('idle');
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
        } else if (this.input.keyboard.isDown(Phaser.Keyboard.D)) {
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
        this.box.animations.play('jump');
        this.boxState = 'jump';
    }

    scalePlayer(factor) {
        this.box.scale.set(factor);
        const safeWidth = this.box.body.width - BOUNDING_BOX_MARGIN;
        this.box.body.setSize(safeWidth, this.box.body.height, BOUNDING_BOX_MARGIN / 2);
    }

}
