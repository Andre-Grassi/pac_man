import { GameObject } from './GameObject.js'

const tileBorderColor = 'rgb(66, 56, 217)'
const tileColor = 'black'

class Maze {
  constructor(mazeArray, display) {
    this.mazeArray = mazeArray
    this.tileWidth = display.canvas.width / mazeArray[0].length
    this.tileHeight = display.canvas.height / mazeArray.length

    // Array of game objects that represent each wall in the maze
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

    console.log(this.wallObjects)
  }

  draw(display) {
    this.wallObjects.forEach((objectArray) => {
      objectArray.forEach((object) => {
        if (object) object.drawRectangleBorder(display, tileBorderColor, 3)
        //console.log(object.width, object.height)
      })
    })
  }

  resize(display) {
    this.tileWidth = display.canvas.width / this.mazeArray[0].length
    this.tileHeight = display.canvas.height / this.mazeArray.length

    for (let i = 0; i < this.wallObjects.length; i++)
      for (let j = 0; j < this.wallObjects[i].length; j++) {
        if (this.wallObjects[i][j]) {
          console.log(this.wallObjects[i].length)
          this.wallObjects[i][j].width = this.tileWidth
          this.wallObjects[i][j].height = this.tileHeight
          this.wallObjects[i][j].x = this.tileWidth * j
          this.wallObjects[i][j].y = this.tileHeight * i
        }
      }
  }
}

// Definition of the types of tiles in the maze
const TileType = Object.freeze({
  EMPTY: 0,
  WALL: 1,
  FRUIT: 2,
})

export { Maze, TileType }
