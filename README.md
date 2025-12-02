# Globant-Piscine---2048

Globant piscine intended to develop the 2048 game using HTML, CSS and JavaScript

# 🎮 2048 Game

A classic tile-matching puzzle game developed using **HTML, CSS, and vanilla JavaScript**. This project focuses on implementing core game logic, dynamic DOM manipulation, and smooth CSS-based animations.

## ✨ Project Overview

The 2048 game is a single-player sliding block puzzle. The goal is to slide numbered tiles on a $4 \times 4$ grid to combine them and create a tile with the number 2048.

### Key Features Implemented:

- **Core Game Logic:** Complete implementation of tile spawning, sliding (Compress), and merging.
- **Move Handling:** Efficient handling of all four directions (Up, Down, Left, Right) using **matrix transposition** and **mirroring** to simplify the core logic.
- **Game State Management:** Logic to detect the game-over condition (board full and no valid merges).
- **Data Structure:** The game state is managed using a $4 \times 4$ array of **objects** to efficiently track tile values, unique IDs, and previous coordinates (`previousPos`, `mergedFrom` metadata) required for animation.

---

## 🚀 How to Run/Test the Project Locally

This project uses **Docker** to provide a consistent, containerized environment that includes a high-performance **Nginx** web server to serve the static HTML, CSS, and JavaScript files.

### Prerequisites

You must have [Docker](https://www.docker.com/get-started) installed on your system.

### 1. Clone the Repository

Open your terminal or command prompt and clone the project:

```bash
git clone [Your-GitHub-Repository-URL]
cd 2048-game
```
