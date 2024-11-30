import Display from './Display.js'
import { GameObject, Direction } from './GameObject.js'
import Joystick from './Joystick.js'
import Maze from './Maze.js'

const joystick = new Joystick()

const display = new Display(800, 600)
const player = new GameObject(50, 50, 50, 50, 'red', 3)
const enemy = new GameObject(100, 100, 50, 50, 'blue')
const maze = new Maze(
  [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 1, 1, 1, 0, 1],
    [1, 0, 1, 0, 0, 0, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 1, 0, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  ],
  display
)
let deltaTime = 0
player.draw(display)

function game(timeSinceLastFrame) {
  // Get current time
  const currentTime = performance.now()

  // Get elapsed time to make the game frame independent
  // For example, movements should multiply by the elapsed time
  // to make the movement smooth and independent of the frame rate
  deltaTime = currentTime - timeSinceLastFrame

  joystick.moveObject(player, deltaTime)
  console.log(player.x)

  display.clear()
  maze.draw()
  player.draw(display)
  enemy.draw(display)

  // Refresh display and continue execution of the game loop
  requestAnimationFrame(game)
}

game()
// display.clear();
