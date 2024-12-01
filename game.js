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
const fruits = []
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
  joystick.moveEntity(player, [...maze.tileObjects])

  // Move enemies
  enemies.forEach((object) => object.evadePlayer(player, [...maze.tileObjects]))

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
  // Find a free spot to place a fruit
  function findFreeSpot() {
    let freeSpots = []
    for (let row = 0; row < maze.mazeArray.length; row++) {
      for (let col = 0; col < maze.mazeArray[row].length; col++) {
        if (maze.mazeArray[row][col] === 0) {
          freeSpots.push({ row: row, col: col })
        }
      }
    }

    return freeSpots[Math.floor(Math.random() * freeSpots.length)]
  }

  const freeSpot = findFreeSpot()
  if (freeSpot && fruits.length < 3) {
    maze.mazeArray[freeSpot.row][freeSpot.col] = 2
    fruits.push(
      new GameObject(
        freeSpot.col * maze.tileWidth,
        freeSpot.row * maze.tileHeight,
        50,
        50,
        'green',
        0
      )
    )
    console.log(fruits)
  }

  // Check collision with fruits to delete them
  let fruitsCollided = player.getCollidingArray(fruits)
  fruitsCollided.forEach((object) => {
    // Remove the fruit from the fruit array
    fruits.splice(fruits.indexOf(object), 1)
    console.log('Collided with fruit')
  })

  display.clear()
  maze.draw(display)
  player.draw(display)

  fruits.forEach((fruit) => fruit.draw(display))
  enemies.forEach((enemy) => enemy.draw(display))

  // Refresh display and continue execution of the game loop
  requestAnimationFrame(game)
}

game()
// display.clear();
