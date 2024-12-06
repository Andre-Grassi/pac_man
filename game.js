// Game imports
import Display from './Display.js'
import Entity from './Entity.js'
import { getEnemies, createEnemy, updateEnemy, deleteEnemy } from './Enemy.js'
import Fruit from './Fruit.js'
import Joystick from './Joystick.js'
import { Maze } from './Maze.js'
import Database from './Database.js'

import { getElementHeight, getElementMarginsHeight } from './css-utils.js'

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

// Joystick for player control
const joystick = new Joystick()

const playerStartingPosition = maze.findFreeSpot()
const playerSpeed = 2.5
const player = new Entity(
  playerStartingPosition.x,
  playerStartingPosition.y,
  50,
  50,
  'red',
  playerSpeed,
  'sprites/pac-man.png'
)

const enemies = await getEnemies(Database, 'enemies', maze)
if (!enemies) throw new Error('Could not get enemies from the database')
const enemySpritePaths = [
  './sprites/orange-ghost.png',
  './sprites/pink-ghost.png',
  './sprites/red-ghost.png',
  './sprites/aqua-ghost.png',
]

// Create array of fruits to be collected
const fruits = new Fruit(50, 50, 'green', './sprites/fruit.png')

let deltaTime = 0

// Indicate the enemy selected to update in the update form
let selectedEnemy = null

// Indicate whether the game is paused or not
let paused = false

// Indicate whether the display is being resized or not
let resizing = false

// Game loop
// This is responsible for the game logic and rendering
async function game(timeSinceLastFrame) {
  if (!paused && !resizing) {
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
    // Using for..of loop instead of forEach to use await inside the loop (the
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
    if (collected && enemies.length > 0) {
      paused = true
      showEnemyList()
    }

    display.clear()

    // Draw the game objects
    maze.draw(display)
    player.drawSprite(display)
    fruits.drawSprite(display)
    enemies.forEach((enemy) => {
      enemy.drawSprite(display)
      enemy.drawName(display)
    })
  }

  // requestAnimationFrame schedules the game function to be called
  // before the next repaint.
  // This creates a loop that allows the game to update and render smoothly
  // at the refresh rate of the display.
  requestAnimationFrame(game)
}

/* ----------------- Event Listeners ----------------- */

// Event listeners to detect typing
// Disable joystick when typing in an input field
// Enable joystick when not typing in an input field
const inputElements = document.querySelectorAll('input[type="text"]')
inputElements.forEach((input) => {
  input.addEventListener('focus', () => {
    joystick.disableJoystick()
  })

  input.addEventListener('blur', () => {
    joystick.enableJoystick()
  })
})

// Event listener for the resize event
window.addEventListener('resize', resizeDisplay)

// Event listeners for the update form (only show when user collects a fruit)
document
  .getElementById('update-form')
  .addEventListener('submit', function (event) {
    event.preventDefault()
    handleUpdateEnemy()
  })
document
  .getElementById('update-button')
  .addEventListener('click', handleUpdateEnemy)

// Event listeners for the form of adding and deleting enemies
document.getElementById('db-form').addEventListener('submit', function (event) {
  event.preventDefault()
  handleCreateEnemy()
})
document
  .getElementById('create-button')
  .addEventListener('click', handleCreateEnemy)
document
  .getElementById('delete-button')
  .addEventListener('click', handleDeleteEnemy)

/* ----------------- Event Handlers ----------------- */
async function handleCreateEnemy() {
  const inputElement = document.getElementById('input-name')

  // Get value from input
  const inputName = inputElement.value

  // Clear input text
  inputElement.value = ''

  // Get random sprite path for the new enemy
  const randomIndex = Math.floor(Math.random() * enemySpritePaths.length)
  console.log(randomIndex)

  const newEnemy = await createEnemy(
    inputName,
    enemySpritePaths[randomIndex],
    Database,
    'enemies',
    maze
  )

  if (!newEnemy) return

  // Add the new enemy to the enemies array
  enemies.push(newEnemy)
}

async function handleDeleteEnemy() {
  const inputElement = document.getElementById('input-name')

  // Get value from input
  let inputName = inputElement.value

  // Turn input name into lowercase for padronization
  inputName = inputName.toLowerCase()

  // Clear input text
  inputElement.value = ''

  // Search for the enemy with the given name
  const enemyToDelete = enemies.find((enemy) => enemy.name === inputName)

  if (enemyToDelete) {
    // Delete the enemy from the database
    const deleted = await deleteEnemy(enemyToDelete.docId, Database, 'enemies')

    // Remove the enemy from the enemies array
    if (deleted) enemies.splice(enemies.indexOf(enemyToDelete), 1)
  }
}

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
  // If no enemy is selected, return
  if (!selectedEnemy) return

  const inputElement = document.getElementById('update-input')

  // Get value from input
  const newName = inputElement.value

  // Clear input text
  inputElement.value = ''

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

function resizeDisplay() {
  if (resizing) return
  resizing = true
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

  // Reposition enemies
  enemies.forEach((enemy) => enemy.randomizePosition(maze))

  // Delete fruits
  fruits.fruits.forEach((fruit) => fruits.removeFruit(fruit, maze))

  // Spawn new fruits
  fruits.spawnFruit(maze)

  // Reposition player
  const playerPosition = maze.findFreeSpot()
  player.x = playerPosition.x
  player.y = playerPosition.y

  resizing = false
}

game()
