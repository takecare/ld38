import Phaser from 'phaser-ce';

import CameraDebugger from './cameradebugger';

const HORIZONTAL_VELOCITY = 250;
const VERTICAL_VELOCITY = 600;
const GRAVITY = 1000;

const BOUNDING_BOX_MARGIN = 6;

export default class extends Phaser.State {

    // TODO @RUI scale jump height along with player size

    constructor() {
        super();
        this.boxState = 'idle';
    }

    init(level) {
        this.stage.backgroundColor = '#ccc';
        this.level = level;

        this.game.time.advancedTiming = true;
    }

    preload() {
        this.data = this.game.cache.getJSON('leveldata');
    }

    create() {

        this.cameraDebugger = new CameraDebugger();
        this.cameraDebugger.bindTo(this);

        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        this.game.physics.arcade.gravity.y = 300;

        this.createLevel();
        this.createPlayer();

        this.cameraDebugger.follow(this.box);
    }

    createLevel() {
        this.map = this.game.add.tilemap('levelmap');
        this.map.addTilesetImage('wall');
        this.map.addTilesetImage('coin');
        this.map.addTilesetImage('spikes');

        this.boundsLayer = this.map.createLayer('bounds');
        this.coinsLayer = this.map.createLayer('coins');
        this.spikesLayer = this.map.createLayer('spikes');

        this.game.physics.arcade.enable(this.boundsLayer);

        this.map.setCollisionBetween(1, 12);

        this.boundsLayer.resizeWorld();

        this.game.physics.arcade.enable(this.boundsLayer);
    }

    createPlayer() {
        this.box = this.game.add.sprite(
            this.map.widthInPixels,
            this.map.heightInPixels,
            'box'
        );

        // TODO animations
        this.box.animations.add('walk-left', [0, 1, 2, 3], 15, true);
        this.box.animations.add('walk-right', [4, 5, 6, 7], 15, true);
        this.box.animations.add('jump', [8, 9], 10);
        this.box.animations.add('idle', [0], 5);

        this.box.anchor.set(0.5);

        this.game.physics.arcade.enable(this.box);

        //
        this.box.body.collideWorldBounds = true;
        //

        this.box.checkWorldBounds = true;
        this.box.events.onOutOfBounds.add(this.handleOutOfBounds, this);

        this.box.body.gravity.y = GRAVITY;
        this.box.body.maxVelocity.y = 500;

        this.scalePlayer(this.data.scale);

        this.box.x -= this.box.width + this.map.tileWidth;
        this.box.y -= this.box.height + this.map.tileHeight;
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

        // game.time.msMax = he maximum amount of time the game has taken between consecutive frames.
        // game.time.msMin = he minimum amount of time the game has taken between consecutive frames.
        // game.time.now = An increasing value representing cumulative milliseconds since an undisclosed epoch.
        // game.time.prevTime = The now when the previous update occurred.
        // game.time.time = The Date.now() value when the time was last updated.

        this.game.debug.body(this.box);
        this.game.debug.bodyInfo(this.box, 10, 10);

        this.boundsLayer.debug = true;

        const fps = 'fps: ' + this.game.time.fps;
        const time = 'time: ' + this.game.time.now;
        this.game.debug.text(fps + ' ' + time, 10, this.game.height - 10, '#ff0000');
    }

    handleInput() {
        if (this.input.keyboard.isDown(Phaser.KeyCode.W)) {
            this.jump();
        }

        if (this.input.keyboard.isDown(Phaser.KeyCode.A)) {
            this.box.body.velocity.x -= HORIZONTAL_VELOCITY;
            this.box.animations.play('walk-left');
            this.boxState = 'left';
        } else if (this.input.keyboard.isDown(Phaser.KeyCode.D)) {
            this.box.body.velocity.x += HORIZONTAL_VELOCITY;
            this.box.animations.play('walk-right');
            this.boxState = 'right';
        }
    }

    handleOutOfBounds() {
        //this.state.start('GameOver');
        // TODO move to next level
        this.game.currentLevel += 1;
        this.state.start('Loading', true, false, {});
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
