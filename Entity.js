import { GameObject, Direction } from './GameObject.js'

class Entity extends GameObject {
  constructor(x, y, width, height, color, speed) {
    super(x, y, width, height, color, speed)
  }

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
  }
}

export default Entity
