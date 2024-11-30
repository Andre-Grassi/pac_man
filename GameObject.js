class GameObject {
  constructor(x, y, width, height, color, speed) {
    this.x = x
    this.y = y
    this.width = width
    this.height = height
    this.color = color
    this.speed = speed
  }

  draw(display) {
    display.drawRectangle(this.x, this.y, this.width, this.height, this.color)
  }

  move(direction, deltaTime) {
    switch (direction) {
      case Direction.UP:
        this.y -= this.speed
        break
      case Direction.DOWN:
        this.y += this.speed
        break
      case Direction.LEFT:
        this.x -= this.speed
        break
      case Direction.RIGHT:
        this.x += this.speed
        break
      default:
        break
    }
  }

  isColliding(otherGameObject) {
    let xIsOverlapping =
      this.x + this.width >= otherGameObject.x &&
      this.x <= otherGameObject.x + otherGameObject.width
    let yIsOverlapping =
      this.y + this.height >= otherGameObject.y &&
      this.y <= otherGameObject.y + otherGameObject.height

    return xIsOverlapping && yIsOverlapping
  }
}

// Definition of the directions a game object can move
const Direction = Object.freeze({
  UP: 0,
  DOWN: 1,
  LEFT: 2,
  RIGHT: 3,
})

export { GameObject, Direction }
