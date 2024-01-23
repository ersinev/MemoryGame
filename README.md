# Memory Game Multiplayer

**Project Link:** [Memory Game Multiplayer](https://itgaragememorygame.netlify.app)

## Overview

This is a multiplayer implementation of the classic Memory Game using React for the front end and Node.js with Socket.IO for real-time communication. The game allows multiple players to join a room, play the Memory Game together, and compete to match pairs of cards.

## Features

- **Multiplayer Functionality:** Players can join a room and play the Memory Game together in real-time.
- **Turn-Based System:** The game implements a turn-based system, allowing each player to take turns flipping cards.
- **Scalability:** The server handles multiple game rooms simultaneously, with each room having its own set of players and game state.
- **Timer:** A timer is included to limit the game duration, and the game ends when the timer reaches zero.
- **Points System:** Players earn points for successfully matching pairs of cards, and the points are updated in real-time.
- **Modal:** A modal is displayed when a pair is matched, showing the last matched pairs for a brief moment.

## Technologies Used

- **React:** The front-end of the application is built using React, providing a dynamic and interactive user interface.
- **Node.js:** The back-end server is implemented using Node.js to handle socket communication and game logic.
- **Socket.IO:** Socket.IO is used for real-time bidirectional communication between the server and clients, enabling multiplayer functionality.
- **Express:** Express is utilized as the web application framework for the Node.js server.
- **Git:** Version control is managed using Git, allowing collaborative development and code tracking.

## Usage

### Joining a Room:
Enter a room ID and your player name to join a specific game room.

### Gameplay:
- Click on cards to flip them during your turn.
- Try to match pairs of cards where each pair consists of one image and one corresponding explanation.
- The game features a turn-based system, and the timer limits the duration of each game.

### Scoring:
Players earn points for successfully matching pairs.
The points are updated in real-time and displayed on the screen.

### Game End:
The game ends when either all card pairs are matched or the timer reaches zero.
A result page is displayed, showing each player's points.

![Screenshot 2024-01-23 132028](https://github.com/ersinev/MemoryGame/assets/66500873/0a9f8b3a-ca1d-4583-a4e2-977bee27c85f)



