import { GameObject } from './GameObject.js'

const tileBorderColor = 'rgb(66, 56, 217)'
const tileColor = 'black'

class Maze {
  constructor(mazeArray, display) {
    this.mazeArray = mazeArray
    this.tileWidth = display.canvas.width / mazeArray[0].length
    this.tileHeight = display.canvas.height / mazeArray.length

    // Array of game objects that represent each wall in the maze
    this.wallObjects = []

    // Create game objects for each wall
    for (let i = 0; i < this.mazeArray.length; i++)
      for (let j = 0; j < this.mazeArray[i].length; j++)
        if (this.mazeArray[i][j] === 1)
          this.wallObjects.push(
            new GameObject(
              this.tileWidth * j,
              this.tileHeight * i,
              this.tileWidth,
              this.tileHeight,
              tileColor
            )
          )
  }

  draw(display) {
    this.wallObjects.forEach((object) =>
      object.drawRectangleBorder(display, tileBorderColor, 3)
    )
  }
}

// Definition of the types of tiles in the maze
const TileType = Object.freeze({
  EMPTY: 0,
  WALL: 1,
  FRUIT: 2,
})

export { Maze, TileType }
