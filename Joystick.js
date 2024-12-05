import { Direction } from './GameObject.js'

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
      this.setKeyState(event.keyCode, true)
    })

    window.addEventListener('keyup', (event) => {
      this.setKeyState(event.keyCode, false)
    })
  }

  enableJoystick() {
    this.enable = true
  }

  disableJoystick() {
    this.enable = false
  }

  setKeyState(keyCode, state) {
    switch (keyCode) {
      case 37: // Arrow Left
      case 65: // A
        this.left = state
        break
      case 38: // Arrow Up
      case 87: // W
        this.up = state
        break
      case 39: // Arrow Right
      case 68: // D
        this.right = state
        break
      case 40: // Arrow Down
      case 83: // S
        this.down = state
        break
    }
  }

  moveEntity(entity, collisionObjects) {
    if (!this.enable) return

    if (this.up) entity.move(Direction.UP, collisionObjects)
    if (this.down) entity.move(Direction.DOWN, collisionObjects)
    if (this.left) entity.move(Direction.LEFT, collisionObjects)
    if (this.right) entity.move(Direction.RIGHT, collisionObjects)
  }
}

export default Joystick
