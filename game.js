import Display from './Display.js'
import { GameObject, Direction } from './GameObject.js'
import Entity from './Entity.js'
import Enemy from './Enemy.js'
import Joystick from './Joystick.js'
import Maze from './Maze.js'

const joystick = new Joystick()

const display = new Display(800, 600)
const player = new Entity(100, 155, 50, 50, 'red', 2)
const enemies = [new Enemy(100, 100, 50, 50, 'blue', 2)]
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

  // Move player, that is limited by the maze tiles
  joystick.moveEntity(player, [...maze.tiles])

  // Move enemies
  enemies.forEach((object) => object.evadePlayer(player, [...maze.tiles]))

  console.log(player.x)

  // Check collision with enemies to delete them
  /*
  let enemiesCollided = player.getCollidingArray(enemies)
  enemiesCollided.forEach((object) => {
    // Remove the enemy from the enemy array
    enemies.splice(enemies.indexOf(object), 1)
    console.log('Collided with enemy')
  })
    */

  display.clear()
  maze.draw(display)
  player.draw(display)

  enemies.forEach((enemy) => enemy.draw(display))

  // Refresh display and continue execution of the game loop
  requestAnimationFrame(game)
}

game()
// display.clear();
