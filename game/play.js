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

        this.map.setCollisionBetween(0, 15);

        this.bg = this.map.createLayer('bg');
        this.boundsLayer = this.map.createLayer('bounds');
        this.scaleUpLayer = this.map.createLayer('scaleup');
        this.scaleDownLayer = this.map.createLayer('scaledown');
        this.spikesLayer = this.map.createLayer('spikes');

        this.map.setTileIndexCallback([19], this.scaleDownHit, this, this.scaleDownLayer);
        //this.map.setTileIndexCallback([15], this.scaleUpHit, this, this.scaleUpLayer);

        this.boundsLayer.resizeWorld();
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
        this.box.animations.add('jump-left', [9], 1);
        this.box.animations.add('jump-right', [8], 1);
        this.box.animations.add('idle', [0], 5);

        this.box.anchor.set(0.5);

        this.game.physics.arcade.enable(this.box);

        this.box.checkWorldBounds = true;
        this.box.events.onOutOfBounds.add(this.handleOutOfBounds, this);

        this.box.body.gravity.y = GRAVITY;
        this.box.body.maxVelocity.y = 500;

        const safeWidth = this.box.body.width - BOUNDING_BOX_MARGIN;
        this.box.body.setSize(safeWidth, this.box.body.height, BOUNDING_BOX_MARGIN / 2);

        this.playerScale = this.data.scale;
        this.scalePlayer(this.playerScale);

        this.box.x -= this.box.width + this.map.tileWidth;
        this.box.y -= this.box.height + this.map.tileHeight;
    }

    update() {
        this.cameraDebugger.update();

        this.game.physics.arcade.collide(this.box, this.boundsLayer);
        this.game.physics.arcade.collide(this.box, this.bg);
        this.game.physics.arcade.collide(this.box, this.scaleDownLayer);
        this.game.physics.arcade.collide(this.box, this.scaleUpLayer);
        this.game.physics.arcade.collide(this.box, this.spikesLayer);

        this.box.body.velocity.x = 0;

        this.handleInput();

        if (this.box.body.velocity.x === 0 && this.box.body.velocity.y === 0) {
            this.box.animations.stop()
        }
    }

    render() {
        if (this.game.input.keyboard.isDown(Phaser.Keyboard.J)) {
            this.game.debug.body(this.box);
            this.game.debug.bodyInfo(this.box, 10, 10);

            this.boundsLayer.debug = true;

            const fps = 'fps: ' + this.game.time.fps;
            const time = 'time: ' + this.game.time.now;
            this.game.debug.text(fps + ' ' + time, 10, this.game.height - 10, '#ff0000');
        } else {
            this.boundsLayer.debug = false;
        }
    }

    handleInput() {
        if (this.input.keyboard.isDown(Phaser.KeyCode.W)) {
            this.jump();
        }

        if (this.game.input.keyboard.isDown(Phaser.Keyboard.K)) {
            this.playerScale -= 1;
            this.box.scale.set(this.playerScale);
        } else if (this.game.input.keyboard.isDown(Phaser.Keyboard.L)) {
            this.playerScale += 1;
            this.box.scale.set(this.playerScale);
        }

        if (this.input.keyboard.isDown(Phaser.KeyCode.A)) {
            this.box.body.velocity.x -= HORIZONTAL_VELOCITY;

            if (this.box.body.velocity.y === 0) {
                this.box.animations.play('walk-left');
            }

            this.boxState = 'left';
        } else if (this.input.keyboard.isDown(Phaser.KeyCode.D)) {
            this.box.body.velocity.x += HORIZONTAL_VELOCITY;

            if (this.box.body.velocity.y === 0) {
                this.box.animations.play('walk-right');
            }
            this.boxState = 'right';
        }
    }

    handleOutOfBounds() {
        this.game.currentLevel += 1;
        this.state.start('Loading', true, false, {});
    }

    jump() {
        if (!this.box.body.blocked.down) {
            return;
        }

        this.box.body.velocity.y -= VERTICAL_VELOCITY;

        if (this.boxState == 'left') {
            this.box.animations.play('jump-left');
        } else {
            this.box.animations.play('jump-right');
        }

        this.boxState = 'jump';
    }

    scaleDownHit(sprite, tile) {
        tile.alpha = 0.0;

        this.map.removeTile(tile.x, tile.y, this.scaleDownLayer);

        this.playerScale -= 1;
        this.box.scale.set(this.playerScale);

        this.scaleDownLayer.dirty = true;
        return false;
    }

    scaleUpHit(sprite, tile) {
        // TODO
        this.playerScale += 1;
        this.box.scale.set(this.playerScale);
    }

    scalePlayer(factor) {
        this.box.scale.set(factor);
    }

}
