class GameObject {
  constructor(x, y, width, height, color, speed, spritePath = null) {
    this.x = x
    this.y = y
    this.width = width
    this.height = height
    this.color = color
    this.speed = speed

    if (spritePath) {
      this.sprite = new Image(width, height)
      this.sprite.src = spritePath
    }
  }

  drawRectangle(display) {
    display.drawRectangle(this.x, this.y, this.width, this.height, this.color)
  }

  drawRectangleBorder(display, color, lineWidth = 1) {
    display.drawRectangleBorder(
      this.x,
      this.y,
      this.width,
      this.height,
      color,
      lineWidth
    )
  }

  drawSprite(display) {
    display.drawSprite(this.x, this.y, this.width, this.height, this.sprite)
  }

  // Move the game object in a certain direction
  // The available directions are in the Direction object
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

  // Check if the game object is colliding with another game object
  isColliding(otherGameObject) {
    let xIsOverlapping =
      this.x + this.width >= otherGameObject.x &&
      this.x <= otherGameObject.x + otherGameObject.width
    let yIsOverlapping =
      this.y + this.height >= otherGameObject.y &&
      this.y <= otherGameObject.y + otherGameObject.height

    return xIsOverlapping && yIsOverlapping
  }

  // Check if the game object is colliding with any of the other game objects
  isCollidingArray(otherGameObjects) {
    return otherGameObjects.some((object) => this.isColliding(object))
  }

  // Get array of game objects that the game object is colliding with
  getCollidingArray(otherGameObjects) {
    return otherGameObjects.filter((object) => this.isColliding(object))
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
