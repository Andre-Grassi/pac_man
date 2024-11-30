import Display from './Display.js';
import { GameObject, Direction } from './GameObject.js';

class Joystick {
  constructor() {
    this.left = false;
    this.right = false;
    this.up = false;
    this.down = false;
  }

  setKeyState(keyCode, state) {
    switch (keyCode) {
      case 37: // Arrow Left
      case 65: // A
        this.left = state;
        console.log('left');
        break;
      case 38: // Arrow Up
      case 87: // W
        this.up = state;
        console.log('up');
        break;
      case 39: // Arrow Right
      case 68: // D
        this.right = state;
        console.log('right');
        break;
      case 40: // Arrow Down
      case 83: // S
        this.down = state;
        console.log('down');
        break;
    }
  }
}

const joystick = new Joystick();

window.addEventListener('keydown', (event) => {
  joystick.setKeyState(event.keyCode, true);
});

window.addEventListener('keyup', (event) => {
  joystick.setKeyState(event.keyCode, false);
});

function handleInput() {
  if (joystick.up) {
    player.move(Direction.UP);
  }
  if (joystick.down) {
    player.move(Direction.DOWN);
  }
  if (joystick.left) {
    player.move(Direction.LEFT);
  }
  if (joystick.right) {
    player.move(Direction.RIGHT);
  }
}

const display = new Display(800, 600);
const player = new GameObject(50, 50, 50, 50, 'red', 1);
const enemy = new GameObject(100, 100, 50, 50, 'blue');
player.draw(display);

function game(timeSinceLastFrame) {
  // Get current time
  const currentTime = performance.now();

  // Get elapsed time to make the game frame independent
  // For example, movements should multiply by the elapsed time
  // to make the movement smooth and independent of the frame rate
  const deltaTime = currentTime - timeSinceLastFrame;

  handleInput();
  console.log(player.x);

  display.clear();
  player.draw(display);
  enemy.draw(display);

  // Refresh display and continue execution of the game loop
  requestAnimationFrame(game);
}

game();
// display.clear();
