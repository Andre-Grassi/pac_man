import { GameObject } from './GameObject.js'

const tileBorderColor = 'rgb(66, 56, 217)'
const tileColor = 'black'

// Class that represents the maze in the game
// The maze is represented by a 2D array of integers where each cell represents
// a tile in the maze. This array is called mazeArray.
// The types of tiles are defined in the TileType object
// There is also a 2D array of GameObjects that represent each wall in the maze
// that is the wallObjects array
class Maze {
  constructor(mazeArray, display) {
    this.mazeArray = mazeArray

    // The tiles are adapted to the display size
    // The bigger the display, the bigger the tiles
    this.tileWidth = display.canvas.width / mazeArray[0].length
    this.tileHeight = display.canvas.height / mazeArray.length

    // Array of game objects that represent each wall in the maze
    // It has the same number of cells as the mazeArray
    // If there is no wall in a cell, the cell is null
    this.wallObjects = Array.from({ length: mazeArray.length }, () => [])

    // Create game objects for each wall
    for (let i = 0; i < this.mazeArray.length; i++)
      for (let j = 0; j < this.mazeArray[i].length; j++) {
        let tile = null

        if (this.mazeArray[i][j] === TileType.WALL)
          tile = new GameObject(
            this.tileWidth * j,
            this.tileHeight * i,
            this.tileWidth,
            this.tileHeight,
            tileColor
          )

        this.wallObjects[i].push(tile)
      }
  }

  draw(display) {
    this.wallObjects.forEach((objectArray) => {
      objectArray.forEach((object) => {
        if (object) object.drawRectangleBorder(display, tileBorderColor, 3)
      })
    })
  }

  // Get the index of the cell in the mazeArray from display coordinates
  getIndexFromCoordinates(x, y) {
    return {
      row: Math.floor(y / this.tileHeight),
      col: Math.floor(x / this.tileWidth),
    }
  }

  // Resize the maze tiles dimensions based on the new display dimensions
  // Also reposition the wall objects based on the new tile dimensions
  resize(display) {
    this.tileWidth = display.canvas.width / this.mazeArray[0].length
    this.tileHeight = display.canvas.height / this.mazeArray.length

    // Iterate over the wall objects to resize and reposition them
    for (let i = 0; i < this.wallObjects.length; i++)
      for (let j = 0; j < this.wallObjects[i].length; j++) {
        // Ignore null cells
        if (this.wallObjects[i][j]) {
          // Redimension the wall object
          this.wallObjects[i][j].width = this.tileWidth
          this.wallObjects[i][j].height = this.tileHeight

          // Reposition the wall object
          this.wallObjects[i][j].x = this.tileWidth * j
          this.wallObjects[i][j].y = this.tileHeight * i
        }
      }
  }

  // Find a random free tile in the maze
  // If there are no free tiles, return null
  findFreeSpot() {
    let freeSpots = []
    for (let row = 0; row < this.mazeArray.length; row++) {
      for (let col = 0; col < this.mazeArray[row].length; col++) {
        if (this.mazeArray[row][col] === TileType.EMPTY) {
          freeSpots.push({ x: col * this.tileWidth, y: row * this.tileHeight })
        }
      }
    }

    if (freeSpots.length === 0) return null

    return freeSpots[Math.floor(Math.random() * freeSpots.length)]
  }
}

// Definition of the types of tiles in the maze
const TileType = Object.freeze({
  EMPTY: 0,
  WALL: 1,
  FRUIT: 2,
})

export { Maze, TileType }
