import { Direction } from './GameObject.js'

// Class that captures and stores key states for the movement of entities
class Joystick {
  constructor() {
    // Initialize the key states
    this.left = false
    this.right = false
    this.up = false
    this.down = false

    this.enable = true

    // Add event listeners to the window object to detect key presses
    window.addEventListener('keydown', (event) => {
      this.setKeyState(event.key, true)
    })

    window.addEventListener('keyup', (event) => {
      this.setKeyState(event.key, false)
    })
  }

  enableJoystick() {
    this.enable = true
  }

  disableJoystick() {
    this.enable = false
  }

  setKeyState(key, state) {
    switch (key) {
      case 'ArrowLeft':
      case 'Left': // Arrow Left in some browsers
      case 'A':
      case 'a':
        this.left = state
        break
      case 'ArrowUp':
      case 'Up': // Arrow Up in some browsers
      case 'W':
      case 'w':
        this.up = state
        break
      case 'ArrowRight':
      case 'Right': // Arrow Right in some browsers
      case 'D':
      case 'd':
        this.right = state
        break
      case 'ArrowDown':
      case 'Down': // Arrow Down in some browsers
      case 'S':
      case 's':
        this.down = state
        break
    }
  }

  // Move the entity in the direction of the pressed keys
  // The collisionObjects array is used to check for collisions and prevent the
  // entity from moving into the collided objects
  moveEntity(entity, collisionObjects) {
    if (!this.enable) return

    if (this.up) entity.move(Direction.UP, collisionObjects)
    if (this.down) entity.move(Direction.DOWN, collisionObjects)
    if (this.left) entity.move(Direction.LEFT, collisionObjects)
    if (this.right) entity.move(Direction.RIGHT, collisionObjects)
  }
}

export default Joystick
