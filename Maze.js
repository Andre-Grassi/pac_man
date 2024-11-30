class Maze {
  constructor(mazeArray, display) {
    this.mazeArray = mazeArray
    this.display = display
    this.tileWidth = display.canvas.width / mazeArray[0].length
    this.tileHeight = display.canvas.height / mazeArray.length
  }

  draw() {
    for (let i = 0; i < this.mazeArray.length; i++) {
      for (let j = 0; j < this.mazeArray[i].length; j++) {
        if (this.mazeArray[i][j] === 1) {
          this.display.drawRectangle(
            this.tileWidth * i,
            this.tileHeight * j,
            this.tileWidth,
            this.tileHeight,
            'black'
          )
        }
      }
    }
  }
}

export default Maze
