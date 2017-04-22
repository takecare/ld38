import Phaser from 'phaser-ce';

import Loading from './Loading';
import Splash from './Splash';
import Menu from './Menu';
import Play from './Play';
import GameOver from './GameOver';

export default class Game extends Phaser.Game {

    constructor(width, height) {
        super(width, height, Phaser.CANVAS, 'game', null);

        this.state.add('Loading', Loading, false);
        this.state.add('Splash', Splash, false);
        this.state.add('Menu', Menu, false);
        this.state.add('Play', Play, false);
        this.state.add('GameOver', GameOver, false);

        this.state.start('Loading');
    }

}
