import { GameObject } from './GameObject.js'
import { TileType } from './Maze.js'

class Fruit {
  constructor(width, height, color) {
    this.width = width
    this.height = height
    this.color = color

    this.fruits = []
  }

  draw(display) {
    this.fruits.forEach((fruit) => fruit.draw(display))
  }

  spawnFruit(maze) {
    const freeSpot = findFreeSpotFruit(maze)

    // Place a fruit in the free spot
    // Limit the number of fruits to 3
    if (freeSpot && this.fruits.length < 3) {
      maze.mazeArray[freeSpot.row][freeSpot.col] = 2
      this.fruits.push(
        new GameObject(
          freeSpot.col * maze.tileWidth,
          freeSpot.row * maze.tileHeight,
          50,
          50,
          'green',
          0
        )
      )
    }
  }

  // Delete a fruit when the player collides with it
  checkAndRemoveCollidedFruits(player, maze) {
    let collided = false

    // Check collision with fruits to delete them
    const fruitsCollided = player.getCollidingArray(this.fruits)
    fruitsCollided.forEach((object) => {
      // Remove the fruit from the fruit array
      this.fruits.splice(this.fruits.indexOf(object), 1)

      // Set tile to be empty again
      const row = object.y / maze.tileHeight
      const col = object.x / maze.tileWidth

      maze.mazeArray[row][col] = TileType.EMPTY

      collided = true
    })

    return collided
  }
}

// Find a free spot to place a fruit
function findFreeSpotFruit(maze) {
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

export default Fruit
