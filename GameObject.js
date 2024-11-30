class GameObject {
  constructor(x, y, width, height, color, speed) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
    this.speed = speed;
  }

  draw(display) {
    display.drawRectangle(this.x, this.y, this.width, this.height, this.color);
  }

  move() {
    this.x += this.speed;
    this.y += this.speed;
  }
}

export default GameObject;
