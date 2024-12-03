// Game imports
import Display from './Display.js'
import { GameObject, Direction } from './GameObject.js'
import Entity from './Entity.js'
import {
  Enemy,
  getEnemies,
  createEnemy,
  updateEnemy,
  deleteEnemy,
} from './Enemy.js'
import Fruit from './Fruit.js'
import Joystick from './Joystick.js'
import { Maze, TileType } from './Maze.js'
import Database from './Database.js'

import { getElementHeight, getElementMarginsHeight } from './utils.js'

/* ----------------- Display (canvas) Setup ----------------- */
const windowWidth = window.innerWidth
let displayWidth = window.innerWidth

// Limit the canvas width to 800px
if (window.innerWidth > 800) displayWidth = 800

// Calculate display height
const form = document.getElementById('db-form')
const formHeight = getElementHeight(form)
const gameCanvas = document.getElementById('game-canvas')
const gameCanvasMarginsHeight = getElementMarginsHeight(gameCanvas)
const displayHeight = window.innerHeight - formHeight - gameCanvasMarginsHeight
const display = new Display(displayWidth, displayHeight)

/* ----------------- Game Objects Setup ----------------- */
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
const joystick = new Joystick()
const player = new Entity(100, 155, 50, 50, 'red', 2, 'sprites/pac-man.png')
const enemies = await getEnemies(Database, 'enemies')
enemies.forEach((enemy) => enemy.randomizePosition(maze))
const enemySpritePaths = [
  './sprites/orange-ghost.png',
  './sprites/pink-ghost.png',
  './sprites/red-ghost.png',
  './sprites/aqua-ghost.png',
]

const fruits = new Fruit(50, 50, 'green', './sprites/fruit.png')

let deltaTime = 0
player.drawRectangle(display)

let selectedEnemy = null

let paused = false

async function game(timeSinceLastFrame) {
  if (!paused) {
    // Get current time
    const currentTime = performance.now()

    // Get elapsed time to make the game frame independent
    // For example, movements should multiply by the elapsed time
    // to make the movement smooth and independent of the frame rate
    deltaTime = currentTime - timeSinceLastFrame

    // Get non-null wall objects from the maze
    const wallObjects = maze.wallObjects.flat().filter((tile) => tile)

    // Move player, that is limited by the maze walls
    joystick.moveEntity(player, wallObjects)

    // Move enemies
    enemies.forEach((object) => object.evadePlayer(player, wallObjects))

    // Check collision with enemies
    let enemiesCollided = player.getCollidingArray(enemies)

    // Iterate over the enemies that collided with the player and delete them
    // from the database and the enemies array
    // Using for of loop instead of forEach to use await inside the loop (the
    // deleteEnemy function is asynchronous)
    for (const enemy of enemiesCollided) {
      const deleted = await deleteEnemy(enemy.docId, Database, 'enemies')

      // Remove the enemy from the enemy array
      if (deleted) enemies.splice(enemies.indexOf(enemy), 1)
      console.log(enemies)
    }

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
    player.drawSprite(display)

    fruits.drawSprite(display)
    enemies.forEach((enemy) => {
      enemy.drawSprite(display)
      enemy.drawName(display)
    })
  }

  requestAnimationFrame(game)
}

/* ----------------- Event Listeners ----------------- */
window.addEventListener('resize', resizeDisplay)

function resizeDisplay() {
  console.log('resizing')
  const body = document.querySelector('body')
  const windowWidth = body.offsetWidth
  let displayWidth = windowWidth

  // Limit the canvas width to 800px
  if (windowWidth > 800) displayWidth = 800

  // Calculate display height
  const form = document.getElementById('db-form')
  const formHeight = getElementHeight(form)
  const gameCanvas = document.getElementById('game-canvas')
  const gameCanvasMarginsHeight = getElementMarginsHeight(gameCanvas)
  const displayHeight =
    window.innerHeight - formHeight - gameCanvasMarginsHeight
  display.resize(displayWidth, displayHeight)
  maze.resize(display)
}

// Event listener for the update button (only show when user collects a fruit)
document
  .getElementById('update-button')
  .addEventListener('click', handleUpdateEnemy)

// Event listeneres for the form of adding and deleting enemies
document.getElementById('db-form').addEventListener('submit', function (event) {
  event.preventDefault()
})

document
  .getElementById('create-button')
  .addEventListener('click', handleCreateEnemy)

document
  .getElementById('delete-button')
  .addEventListener('click', handleDeleteEnemy)

/* ----------------- Create/Delete Enemy Form ----------------- */
async function handleCreateEnemy() {
  // Get value from input
  const inputName = document.getElementById('input-name').value

  // Get random sprite path for the new enemy
  const randomIndex = Math.floor(Math.random() * enemySpritePaths.length)
  console.log(randomIndex)

  const newEnemy = await createEnemy(
    inputName,
    enemySpritePaths[randomIndex],
    Database,
    'enemies'
  )

  // TODO if the addition fails, the enemy should not be added
  // Add the new enemy to the enemies array
  enemies.push(newEnemy)
}

async function handleDeleteEnemy() {
  const inputName = document.getElementById('input-name').value

  // Search for the enemy with the given name
  const enemyToDelete = enemies.find((enemy) => enemy.name === inputName)

  // Delete the enemy from the database
  const deleted = await deleteEnemy(enemyToDelete.docId, Database, 'enemies')

  // TODO if the deletion fails, the enemy should not be removed
  // Remove the enemy from the enemies array
  if (deleted) enemies.splice(enemies.indexOf(enemyToDelete), 1)
}

/* ----------------- Update Enemy Form ----------------- */
// Show the list of enemies to update and a form to update them
function showEnemyList() {
  // Make the form element visible
  document.getElementById('update-form').style.visibility = 'visible'

  // Clear the list of enemies
  document.getElementById('enemy-list').innerHTML = ''

  enemies.forEach((enemy) => {
    const li = document.createElement('li')
    const btn = document.createElement('input')
    btn.name = 'enemy-radio'
    btn.type = 'radio'
    btn.id = `enemy-${enemy.docId}`

    const label = document.createElement('label')
    label.htmlFor = `enemy-${enemy.docId}`
    label.textContent = enemy.name
    // btn.textContent = enemy.name

    btn.addEventListener('click', function () {
      selectedEnemy = enemy
    })

    li.appendChild(btn)
    li.appendChild(label)
    document.getElementById('enemy-list').appendChild(li)
  })
}

async function handleUpdateEnemy() {
  // Get value from input
  const newName = document.getElementById('update-input').value

  // Update the enemy in the database
  let updated = await updateEnemy(selectedEnemy, newName, Database, 'enemies')

  if (!updated) return

  // Find the enemy in the enemies array and update the name
  const enemyToUpdate = enemies.find(
    (enemy) => enemy.docId === selectedEnemy.docId
  )
  enemyToUpdate.name = newName

  paused = false

  // Hide the list of enemies again
  document.getElementById('update-form').style.visibility = 'hidden'
}

game()
