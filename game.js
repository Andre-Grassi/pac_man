// Game imports
import Display from './Display.js'
import { GameObject, Direction } from './GameObject.js'
import Entity from './Entity.js'
import { Enemy, getEnemies } from './Enemy.js'
import Fruit from './Fruit.js'
import Joystick from './Joystick.js'
import { Maze, TileType } from './Maze.js'
import Database from './Database.js'

const joystick = new Joystick()

const display = new Display(800, 600)
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
const player = new Entity(100, 155, 50, 50, 'red', 2)
const enemies = await getEnemies(Database, 'enemies')
enemies.forEach((enemy) => enemy.randomizePosition(maze))

const fruits = new Fruit(50, 50, 'green')

let deltaTime = 0
player.draw(display)

let selectedEnemy = null

let paused = false

function game(timeSinceLastFrame) {
  if (!paused) {
    // Get current time
    const currentTime = performance.now()

    // Get elapsed time to make the game frame independent
    // For example, movements should multiply by the elapsed time
    // to make the movement smooth and independent of the frame rate
    deltaTime = currentTime - timeSinceLastFrame

    // Move player, that is limited by the maze tiles
    joystick.moveEntity(player, [...maze.wallObjects])

    // Move enemies
    enemies.forEach((object) =>
      object.evadePlayer(player, [...maze.wallObjects])
    )

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
    const collected = fruits.checkAndRemoveCollidedFruits(player, maze)

    // If the player has collected a fruit, pause the game and
    // show the list of enemies to update
    if (collected) {
      paused = true
      showEnemyList()
    }

    // updateEnemyList()

    display.clear()
    maze.draw(display)
    player.draw(display)

    fruits.draw(display)
    enemies.forEach((enemy) => enemy.draw(display))
  }

  // Refresh display and continue execution of the game loop
  requestAnimationFrame(game)
}

/* ----------------- Event Listeners ----------------- */
// Event listener for the update button (only show when user collects a fruit)
document.getElementById('update-button').addEventListener('click', updateEnemy)

// Event listeneres for the form of adding and deleting enemies
document.getElementById('db-form').addEventListener('submit', function (event) {
  event.preventDefault()
})
document.getElementById('create-button').addEventListener('click', createEnemy)
document.getElementById('delete-button').addEventListener('click', deleteEnemy)

/* ----------------- Create/Delete Enemy Form ----------------- */
async function createEnemy() {
  // Get value from input
  const inputName = document.getElementById('input-name').value

  // Add the enemy to the database
  const docId = await Database.post('enemies', { name: inputName })

  // TODO if the addition fails, the enemy should not be added
  // Add the new enemy to the enemies array
  enemies.push(new Enemy(100, 100, 50, 50, 'blue', 2, inputName, docId))
}

function deleteEnemy() {
  const inputName = document.getElementById('input-name').value

  // Search for the enemy with the given name
  const enemyToDelete = enemies.find((enemy) => enemy.name === inputName)

  // Delete the enemy from the database
  Database.delete('enemies', enemyToDelete.docId)

  // TODO if the deletion fails, the enemy should not be removed
  // Remove the enemy from the enemies array
  enemies.splice(enemies.indexOf(enemyToDelete), 1)
}

/* ----------------- Update Enemy Form ----------------- */
// Show the list of enemies to update and a form to update them
function showEnemyList() {
  // Get div element that contains the table of enemies
  const enemyDiv = document.getElementById('enemy-table-wrapper')

  // Make it visible
  enemyDiv.style.visibility = 'visible'

  // Clear the list of enemies
  document.getElementById('enemy-list').innerHTML = ''

  enemies.forEach((enemy) => {
    const tr = document.createElement('tr')
    const td = document.createElement('td')
    const btn = document.createElement('input')
    btn.type = 'radio'
    btn.id = `enemy-${enemy.docId}`

    const label = document.createElement('label')
    label.htmlFor = `enemy-${enemy.docId}`
    label.textContent = enemy.name
    // btn.textContent = enemy.name

    btn.addEventListener('click', function () {
      selectedEnemy = enemy
    })

    td.appendChild(btn)
    td.appendChild(label)
    tr.appendChild(td)
    document.getElementById('enemy-list').appendChild(tr)
  })
}

function updateEnemy() {
  // Get value from input
  const newName = document.getElementById('update-input').value

  Database.put('enemies', selectedEnemy.docId, { name: newName })

  // Find the enemy in the enemies array and update the name
  const enemyToUpdate = enemies.find(
    (enemy) => enemy.docId === selectedEnemy.docId
  )
  enemyToUpdate.name = newName

  paused = false

  // Hide the list of enemies again
  document.getElementById('enemy-table-wrapper').style.visibility = 'hidden'
}

game()
// display.clear();
