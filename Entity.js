import { GameObject, Direction } from './GameObject.js'

// Class that represents an entity in the game
// An entity is a being, such as the player or an enemy
class Entity extends GameObject {
  constructor(x, y, width, height, color, speed, spritePath = null) {
    super(x, y, width, height, color, speed, spritePath)
  }

  // Check if the entity can move to a certain direction without colliding with
  // any of the collision objects
  canMoveTo(direction, collisionObjects) {
    let x = this.x // Save the x position
    let y = this.y // Save the y position
    let canMove = true

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
    }

    if (this.isCollidingArray(collisionObjects)) canMove = false

    this.x = x // Reset the x position
    this.y = y // Reset the y position

    return canMove
  }

  // Move the entity in a certain direction, checking for collisions with the
  // collisionObjects array
  // Returns true if the entity moved, false otherwise
  move(direction, collisionObjects) {
    let oldY = this.y // Save the old y position
    let oldX = this.x // Save the old x position

    switch (direction) {
      case Direction.UP:
        this.y -= this.speed

        // If the entity collided with anything, set the y position back to the
        // old position
        if (this.isCollidingArray(collisionObjects)) this.y = oldY

        break
      case Direction.DOWN:
        this.y += this.speed

        // If the entity collided with anything, set the y position back to the
        // old position
        if (this.isCollidingArray(collisionObjects)) this.y = oldY

        break
      case Direction.LEFT:
        this.x -= this.speed

        // If the entity collided with anything, set the x position back to the
        // old position
        if (this.isCollidingArray(collisionObjects)) this.x = oldX

        break
      case Direction.RIGHT:
        this.x += this.speed

        // If the entity collided with anything, set the x position back to the
        // old position
        if (this.isCollidingArray(collisionObjects)) this.x = oldX

        break
      default:
        break
    }

    // If x or y is different than the old x or y, the entity moved, so return
    // true. False othwerwise
    return oldX !== this.x || oldY !== this.y
  }
}

export default Entity
