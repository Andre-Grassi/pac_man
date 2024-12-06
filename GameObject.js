// Definition of the directions a game object can move
const Direction = Object.freeze({
  UP: 0,
  DOWN: 1,
  LEFT: 2,
  RIGHT: 3,
})

// Class that represents a game object
// A game object is an object that can be drawn on the screen
// It constitues the base class for all other objects in the game
// For example a player is a game object, such as an enemy or a fruit
class GameObject {
  // x, y: defines the position of the game object. It is the top left
  // corner of the object
  // width, height: defines the dimensions of the hitbox of the game object
  // color: defines the color of the hitbox
  // speed: defines the number of pixels the game object can move at once
  // spritePath: is the path to the sprite image of the game object
  constructor(x, y, width, height, color, speed, spritePath = null) {
    this.x = x
    this.y = y
    this.width = width
    this.height = height
    this.color = color
    this.speed = speed

    if (spritePath) {
      // Load the sprite image and store in the sprite property
      this.sprite = new Image(width, height)
      this.sprite.src = spritePath
    }
  }

  // Draw the game object hitbox on the display
  drawRectangle(display) {
    display.drawRectangle(this.x, this.y, this.width, this.height, this.color)
  }

  // Draw the game object hitbox border on the display
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

  // Draw the game object sprite on the display
  drawSprite(display) {
    display.drawSprite(this.x, this.y, this.width, this.height, this.sprite)
  }

  // Move the game object in a certain direction
  // The available directions are in the Direction object
  move(direction) {
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

export { GameObject, Direction }
