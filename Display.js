// Display of the game
// This display class will be responsible for rendering the game to the
// screen using the HTML5 canvas element.
class Display {
  constructor(width, height) {
    this.canvas = document.getElementById('game-canvas')
    this.canvas.width = width
    this.canvas.height = height
    this.context = this.canvas.getContext('2d')
  }

  drawRectangle(x, y, width, height, color) {
    this.context.fillStyle = color
    this.context.fillRect(x, y, width, height)
  }

  drawRectangleBorder(x, y, width, height, color, lineWidth = 1) {
    this.context.strokeStyle = color
    this.context.lineWidth = lineWidth
    this.context.strokeRect(x, y, width, height)
  }

  clear() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
  }
}

export default Display
