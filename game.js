// Game imports
import Display from './Display.js'
import { GameObject, Direction } from './GameObject.js'
import Entity from './Entity.js'
import Enemy from './Enemy.js'
import Fruit from './Fruit.js'
import Joystick from './Joystick.js'
import { Maze, TileType } from './Maze.js'
import Database from './Database.js'

const joystick = new Joystick()

const display = new Display(800, 600)
const player = new Entity(100, 155, 50, 50, 'red', 2)
const enemies = []
const fruits = new Fruit(50, 50, 'green')
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
  joystick.moveEntity(player, [...maze.wallObjects])

  // Move enemies
  enemies.forEach((object) => object.evadePlayer(player, [...maze.wallObjects]))

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
  fruits.spawnFruit(maze)

  // Check collision with fruits to delete them
  fruits.checkAndRemoveCollidedFruits(player, maze)

  display.clear()
  maze.draw(display)
  player.draw(display)

  fruits.draw(display)
  enemies.forEach((enemy) => enemy.draw(display))

  // Refresh display and continue execution of the game loop
  requestAnimationFrame(game)
}

// Add event listener to the form to add enemies
document.getElementById('db-form').addEventListener('submit', function (event) {
  event.preventDefault()
})

document
  .getElementById('create-button')
  .addEventListener('click', async function () {
    const inputName = document.getElementById('input-name').value

    // Add the enemy to the database
    const docId = await Database.post('enemies', { name: inputName })

    // TODO if the addition fails, the enemy should not be added
    enemies.push(new Enemy(100, 100, 50, 50, 'blue', 2, inputName, docId))
  })

document.getElementById('delete-button').addEventListener('click', function () {
  const inputName = document.getElementById('input-name').value

  // Search for the enemy with the given name
  const enemyToDelete = enemies.find((enemy) => enemy.name === inputName)

  // Delete the enemy from the database
  Database.delete('enemies', enemyToDelete.docId)

  // TODO if the deletion fails, the enemy should not be removed
  // Remove the enemy from the enemies array
  enemies.splice(enemies.indexOf(enemyToDelete), 1)
})

game()
// display.clear();
