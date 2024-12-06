import Entity from './Entity.js'
import { Direction } from './GameObject.js'
import { TileType } from './Maze.js'

const enemySpeed = 1.6

class Enemy extends Entity {
  constructor(x, y, width, height, color, name, docId, spritePath = null) {
    super(x, y, width, height, color, enemySpeed, spritePath)

    this.speed = enemySpeed
    this.name = name
    this.docId = docId
  }

  // Draw the enemy name above it
  drawName(display) {
    display.context.font = 'bold 12px Emulogic, Arial'
    display.context.fillStyle = 'red'
    display.context.textAlign = 'center'
    display.context.fillText(this.name, this.x + this.width / 2, this.y - 10)
  }

  // Randomize enemy position to a free position in the display
  // If there is no free position, the enemy will not move
  randomizePosition(maze) {
    const randomPosition = getRandomPosition(maze)

    if (randomPosition) {
      this.x = randomPosition.x
      this.y = randomPosition.y
    }
  }

  // Move enemy, evading player
  evadePlayer(playerEntity, collisionObjects) {
    let oldY = this.y // Save the old y position
    let oldX = this.x // Save the old x position

    // Calculate the direction to move in to evade the player
    const currDistanceFromPlayer = Math.sqrt(
      Math.pow(this.x - playerEntity.x, 2) +
        Math.pow(this.y - playerEntity.y, 2)
    )

    let maxDistance = currDistanceFromPlayer
    let bestDirection = Direction.UP

    // Get direction that maximizes the distance between the player and the
    // enemy
    for (let direction in Direction) {
      // Move the enemy until it is unable to move in the same direction again
      // This is used to get the best movement direction in the long run
      let moved = this.move(Direction[direction], collisionObjects)
      while (moved) moved = this.move(Direction[direction], collisionObjects)

      const newDistanceFromPlayer = Math.sqrt(
        Math.pow(this.x - playerEntity.x, 2) +
          Math.pow(this.y - playerEntity.y, 2)
      )
      if (newDistanceFromPlayer >= maxDistance) {
        maxDistance = newDistanceFromPlayer
        bestDirection = Direction[direction]
      }

      // Undo the test movement
      this.x = oldX
      this.y = oldY
    }

    // Move the enemy in the best direction
    this.move(bestDirection, collisionObjects)
  }
}

// Get all enemies from the database
// Return an array with all enemies
// Return null if no enemies have been retrieved
async function getEnemies(Database, userId, collectionName, maze) {
  const enemies = []
  const enemyData = await Database.get(userId, collectionName)

  if (!enemyData) return null

  enemyData.forEach((enemy) => {
    const randomPosition = getRandomPosition(maze)

    if (!randomPosition) return null

    enemies.push(
      new Enemy(
        randomPosition.x,
        randomPosition.y,
        50,
        50,
        'blue',
        enemy.name,
        enemy.docId,
        enemy.spritePath
      )
    )
  })

  return enemies
}

async function createEnemy(
  Database,
  userId,
  collectionName,
  enemyName,
  enemySpritePath,
  maze
) {
  // Turn name into lowercase for padronization
  enemyName = enemyName.toLowerCase()

  // Add the enemy to the database
  const docId = await Database.post(userId, collectionName, {
    name: enemyName,
    spritePath: enemySpritePath,
  })

  if (!docId) return null

  const position = getRandomPosition(maze)

  if (!position) return null

  return new Enemy(
    position.x,
    position.y,
    50,
    50,
    'blue',
    enemyName,
    docId,
    enemySpritePath
  )
}

async function updateEnemy(Database, userId, collectionName, enemy, newName) {
  // Turn name into lowercase for padronization
  newName = newName.toLowerCase()

  const status = await Database.put(userId, collectionName, enemy.docId, {
    name: newName,
    spritePath: enemy.sprite.src,
  })

  return status
}

async function deleteEnemy(Database, userId, collectionName, enemyId) {
  // Delete the enemy from the database
  const status = await Database.delete(userId, collectionName, enemyId)

  return status
}

// Find a free spot to place a enemy (fruit spot is also considered a free spot)
// Return an object with row and col properties, representing the selected cell
// of the maze array
// Return null if there are no free spots
function findFreeSpotEnemy(maze) {
  let freeSpots = []
  for (let row = 0; row < maze.mazeArray.length; row++) {
    for (let col = 0; col < maze.mazeArray[row].length; col++) {
      if (maze.mazeArray[row][col] !== TileType.WALL) {
        freeSpots.push({ row: row, col: col })
      }
    }
  }

  if (freeSpots.length === 0) return null

  return freeSpots[Math.floor(Math.random() * freeSpots.length)]
}

// Get a random free position in the display based on the maze grid
// Return an object with x and y properties
// Return null if there are no free spots
function getRandomPosition(maze) {
  const freeSpot = findFreeSpotEnemy(maze)

  if (!freeSpot) return null

  return { x: freeSpot.col * maze.tileWidth, y: freeSpot.row * maze.tileHeight }
}

export { Enemy, getEnemies, createEnemy, updateEnemy, deleteEnemy }
