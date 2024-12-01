import { GameObject } from './GameObject.js'

class Maze {
  constructor(mazeArray, display) {
    this.mazeArray = mazeArray
    this.tileWidth = display.canvas.width / mazeArray[0].length
    this.tileHeight = display.canvas.height / mazeArray.length

    // Array of game objects that represent each tile in the maze
    this.tiles = []

    // Create game objects for each tile
    for (let i = 0; i < this.mazeArray.length; i++)
      for (let j = 0; j < this.mazeArray[i].length; j++)
        if (this.mazeArray[i][j] === 1)
          this.tiles.push(
            new GameObject(
              this.tileWidth * j,
              this.tileHeight * i,
              this.tileWidth,
              this.tileHeight,
              'black'
            )
          )
  }

  draw(display) {
    this.tiles.forEach((object) => object.draw(display))
  }
}

export default Maze
