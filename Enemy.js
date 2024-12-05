import Entity from './Entity.js'
import { Direction } from './GameObject.js'

const enemySpeed = 1.6
class Enemy extends Entity {
  constructor(x, y, width, height, color, name, docId, spritePath = null) {
    super(x, y, width, height, color, enemySpeed, spritePath)

    this.speed = enemySpeed
    this.name = name
    this.docId = docId
  }

  drawName(display) {
    display.context.font = 'bold 12px Emulogic, Arial'
    display.context.fillStyle = 'red'
    display.context.textAlign = 'center'
    display.context.fillText(this.name, this.x + this.width / 2, this.y - 10)
  }

  // Randomize enemy position in a free spot in the maze (fruit spot is also
  // considered a free spot)
  randomizePosition(maze) {
    const freeSpot = findFreeSpotEnemy(maze)

    if (freeSpot) {
      this.x = freeSpot.col * maze.tileWidth
      this.y = freeSpot.row * maze.tileHeight
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

async function getEnemies(Database, collectionName) {
  const enemies = []
  const enemyData = await Database.get(collectionName)

  if (!enemyData) return null

  enemyData.forEach((enemy) => {
    enemies.push(
      new Enemy(
        100,
        100,
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
  enemyName,
  enemySpritePath,
  Database,
  collectionName
) {
  // Turn name into lowercase for padronization
  enemyName = enemyName.toLowerCase()

  // Add the enemy to the database
  const docId = await Database.post(collectionName, {
    name: enemyName,
    spritePath: enemySpritePath,
  })

  if (!docId) return null

  return new Enemy(100, 100, 50, 50, 'blue', enemyName, docId, enemySpritePath)
}

async function updateEnemy(enemy, newName, Database, collectionName) {
  // Turn name into lowercase for padronization
  newName = newName.toLowerCase()

  const status = await Database.put(collectionName, enemy.docId, {
    name: newName,
    spritePath: enemy.sprite.src,
  })

  return status
}

async function deleteEnemy(enemyId, Database, collectionName) {
  // Delete the enemy from the database
  const status = await Database.delete(collectionName, enemyId)

  return status
}

// Find a free spot to place a enemy (fruit spot is also considered a free spot)
function findFreeSpotEnemy(maze) {
  let freeSpots = []
  for (let row = 0; row < maze.mazeArray.length; row++) {
    for (let col = 0; col < maze.mazeArray[row].length; col++) {
      if (maze.mazeArray[row][col] !== 1) {
        freeSpots.push({ row: row, col: col })
      }
    }
  }

  return freeSpots[Math.floor(Math.random() * freeSpots.length)]
}

export { Enemy, getEnemies, createEnemy, updateEnemy, deleteEnemy }
