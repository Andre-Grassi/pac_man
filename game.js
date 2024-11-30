// Display of the game
// This display class will be responsible for rendering the game to the
// screen using the HTML5 canvas element.
class Display {
  constructor(width, height) {
    this.canvas = document.getElementById('game-canvas');
    this.canvas.width = width;
    this.canvas.height = height;
    this.context = this.canvas.getContext('2d');
  }

  drawRectangle(x, y, width, height, color) {
    this.context.fillStyle = color;
    this.context.fillRect(x, y, width, height);
  }

  clear() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}

class GameObject {
  constructor(x, y, width, height, color, speed) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
    this.speed = speed;
  }

  draw(display) {
    display.drawRectangle(this.x, this.y, this.width, this.height, this.color);
  }

  move() {
    this.x += this.speed;
    this.y += this.speed;
  }
}

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
    player.move(0, -player.speed);
  }
  if (joystick.down) {
    player.move(0, player.speed);
  }
  if (joystick.left) {
    player.move(-player.speed, 0);
  }
  if (joystick.right) {
    player.move(player.speed, 0);
  }
}

const display = new Display(800, 600);
const player = new GameObject(50, 50, 50, 50, 'red');
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

  display.clear();
  player.draw(display);
  enemy.draw(display);

  // Refresh display and continue execution of the game loop
  requestAnimationFrame(game);
}

game();
// display.clear();
