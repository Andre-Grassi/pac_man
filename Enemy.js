import Entity from './Entity.js'
import { Direction } from './GameObject.js'

class Enemy extends Entity {
  constructor(x, y, width, height, color, speed, name, docId) {
    super(x, y, width, height, color, speed)

    this.name = name
    this.docId = docId
  }

  draw(display) {
    // Draw the enemy
    display.drawRectangle(this.x, this.y, this.width, this.height, this.color)

    // Draw name
    display.context.font = 'bold 20px Arial'
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
      // Check if the movement is not possible
      if (!this.canMoveTo(Direction[direction], collisionObjects)) continue

      // Move to get the new distance from the player and use for comparison
      this.move(Direction[direction], collisionObjects)

      const newDistanceFromPlayer = Math.sqrt(
        Math.pow(this.x - playerEntity.x, 2) +
          Math.pow(this.y - playerEntity.y, 2)
      )
      if (newDistanceFromPlayer >= maxDistance) {
        maxDistance = newDistanceFromPlayer
        bestDirection = Direction[direction]
      }

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

  enemyData.forEach((enemy) => {
    enemies.push(
      new Enemy(100, 100, 50, 50, 'blue', 2, enemy.name, enemy.docId)
    )
  })

  return enemies
}

async function createEnemy(enemyName, Database, collectionName) {
  // Add the enemy to the database
  const docId = await Database.post(collectionName, { name: enemyName })

  // TODO if the addition fails, the enemy should not be added
  return new Enemy(100, 100, 50, 50, 'blue', 2, inputName, docId)
}

async function deleteEnemy(enemyId, Database, collectionName) {
  // Delete the enemy from the database
  await Database.delete('enemies', enemyId)

  // TODO if the deletion fails, the enemy should not be removed
  return true
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

export { Enemy, getEnemies, createEnemy, deleteEnemy }
