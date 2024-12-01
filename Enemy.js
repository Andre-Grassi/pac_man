import Entity from './Entity.js'
import { Direction } from './GameObject.js'

class Enemy extends Entity {
  constructor(x, y, width, height, color, speed) {
    super(x, y, width, height, color, speed)
  }

  // Move enemy, evading player
  evadePlayer(playerEntity, collisionObjects) {
    let oldY = this.y // Save the old y position
    let oldX = this.x // Save the old x position

    // Calculate the direction to move in to evade the player
    const currDistanceFromPlayer = Math.sqrt(
      Math.pow(this.x - playerEntity.x, 2) +
        Math.pow(this.y - playerEntity.y, 2)
    )

    let maxDistance = currDistanceFromPlayer
    let bestDirection = Direction.UP

    // Get direction that maximizes the distance between the player and the
    // enemy
    for (let direction in Direction) {
      // Check if the movement is not possible
      if (!this.canMoveTo(Direction[direction], collisionObjects)) continue

      // Move to get the new distance from the player and use for comparison
      this.move(Direction[direction], collisionObjects)

      const newDistanceFromPlayer = Math.sqrt(
        Math.pow(this.x - playerEntity.x, 2) +
          Math.pow(this.y - playerEntity.y, 2)
      )
      if (newDistanceFromPlayer >= maxDistance) {
        maxDistance = newDistanceFromPlayer
        bestDirection = Direction[direction]
      }

      this.x = oldX
      this.y = oldY
    }

    // Move the enemy in the best direction
    this.move(bestDirection, collisionObjects)
  }
}

export default Enemy
