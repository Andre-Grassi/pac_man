import { Direction } from './GameObject.js'

class Joystick {
  constructor() {
    // Initialize the key states
    this.left = false
    this.right = false
    this.up = false
    this.down = false

    // Add event listeners to the window object to detect key presses
    window.addEventListener('keydown', (event) => {
      this.setKeyState(event.keyCode, true)
    })

    window.addEventListener('keyup', (event) => {
      this.setKeyState(event.keyCode, false)
    })
  }

  setKeyState(keyCode, state) {
    switch (keyCode) {
      case 37: // Arrow Left
      case 65: // A
        this.left = state
        console.log('left')
        break
      case 38: // Arrow Up
      case 87: // W
        this.up = state
        console.log('up')
        break
      case 39: // Arrow Right
      case 68: // D
        this.right = state
        console.log('right')
        break
      case 40: // Arrow Down
      case 83: // S
        this.down = state
        console.log('down')
        break
    }
  }

  moveEntity(entity, collisionObjects) {
    if (this.up) entity.move(Direction.UP, collisionObjects)
    if (this.down) entity.move(Direction.DOWN, collisionObjects)
    if (this.left) entity.move(Direction.LEFT, collisionObjects)
    if (this.right) entity.move(Direction.RIGHT, collisionObjects)
  }
}

export default Joystick
