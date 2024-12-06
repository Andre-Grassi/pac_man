# Pac-Man Game

This is a simple Pac-Man game implemented using HTML5, JavaScript, and the Firebase Firestore database. The game allows players to control Pac-Man, collect fruits, and interact with enemies.

## Table of Contents
- [Pac-Man Game](#pac-man-game)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Playing](#playing)
  - [Usage](#usage)
  - [Game Controls](#game-controls)
  - [Implementation Overview](#implementation-overview)

## Features
- Control Pac-Man using arrow keys or WASD.
- Collect fruits to update enemy names.
- Create and delete enemies using the input form.
- Dynamic resizing of the game canvas.
- Persistent data storage using Firebase Firestore.

## Playing
You can just open the github page of the project [here](https://andre-grassi.github.io/pac_man/).

## Usage
- Use the input form at the top of the page to create or delete enemies.
- Click the "How to play" button for instructions on how to play the game.
- Collect fruits to update enemy names.

## Game Controls
- **Arrow Keys / WASD**: Move Pac-Man around the maze.
- **Create Button**: Create a new enemy with the specified name.
- **Delete Button**: Delete an enemy with the specified name.
- **How to Play Button**: Show instructions on how to play the game.

## Implementation Overview

The Pac-Man game is implemented using HTML5, JavaScript, and Firebase Firestore for persistent data storage. Here is a brief explanation of how the game was built:

1. **HTML5 Canvas**: The game is rendered on an HTML5 canvas element. The `Display` class is responsible for managing the canvas and drawing game elements such as Pac-Man, enemies, and fruits.

2. **JavaScript Classes**: The game logic is organized into several JavaScript classes:
   - `GameObject`: The base class for all game objects, including methods for drawing and collision detection.
   - `Entity`: Extends `GameObject` and represents movable entities like Pac-Man and enemies.
   - `Fruit`: Represents collectible fruits in the game.
   - `Enemy`: Represents enemy characters that Pac-Man can interact with.
   - `Maze`: Manages the maze layout and handles the placement of walls and free spots.
   - `Joystick`: Handles player input for controlling Pac-Man.
   - `Database`: Interacts with Firebase Firestore to store and retrieve game data.

3. **Firebase Firestore**: The game uses Firebase Firestore to store persistent data such as user IDs, enemies, and their attributes. The `Database` class contains methods for CRUD operations (Create, Read, Update, Delete) on the Firestore database.

4. **Game Loop**: The main game loop is implemented using `requestAnimationFrame` to ensure smooth rendering and updates at the display's refresh rate. The loop handles player movement, enemy behavior, collision detection, and rendering.

5. **Event Listeners**: Various event listeners are set up to handle user interactions, such as creating and deleting enemies, updating enemy names, and resizing the game canvas.
