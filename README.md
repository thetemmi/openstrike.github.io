# Open Strike 

Open Strike is a high-performance, browser-based 3D multiplayer PvP shooter. Built with **Three.js** for rendering and **PeerJS** for peer-to-peer networking, it offers a fast-paced competitive experience directly in the browser.

![Open Strike Banner](https://img.shields.io/badge/Status-Beta-orange)
![Three.js](https://img.shields.io/badge/Engine-Three.js-black?logo=three.js)
![PeerJS](https://img.shields.io/badge/Networking-PeerJS-blue)

## Features

- **Real-time Multiplayer**: P2P connectivity using PeerJS for low-latency gameplay.
- **Multiple Game Modes**:
  - **Deathmatch**: High-octane combat where every player is for themselves.
  - **Duel (1v1)**: Strategic 13-round competitive match.
- **Advanced 3D Graphics**:
  - Detailed weapon models (AK-47, AWP, Deagle, M4A4, etc.).
  - Immersive maps with dynamic lighting and fog.
  - Smooth character animations and weapon swaying.
- **Modern UI/UX**:
  - Sleek, cinematic main menu.
  - Real-time scoreboard and HUD.
  - Responsive design for various screen sizes.

## Controls

- **WASD**: Move your character.
- **SPACE**: Jump.
- **MOUSE**: Aim and look around.
- **LEFT CLICK**: Fire weapon.
- **ESC**: Release mouse cursor.

## Tech Stack

- **Frontend**: HTML5, Vanilla CSS3, JavaScript (ES6+).
- **3D Engine**: [Three.js](https://threejs.org/) with GLTF & Draco loaders.
- **Networking**: [PeerJS](https://peerjs.com/) for WebRTC signaling and data channels.
- **Development Tooling**: `serve` for local development.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v14 or higher recommended)
- [npm](https://www.npmjs.com/)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/thetemmi/openstrike.git
   cd openstrike
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Access the game**:
   Open your browser and navigate to `http://localhost:3000` (or the port specified in your terminal).

## Project Structure

- `index.html` & `main.js`: Main menu and lobby logic.
- `game/`: Core gameplay directory.
  - `game.js`: Primary game loop, input handling, and physics.
  - `Weapon.js`: Weapon logic, shooting, and animations.
  - `style.css`: Gameplay HUD and UI styling.
- `*.glb`: 3D models for maps, weapons, and characters.

## Contributing

Contributions are welcome! If you'd like to improve Open Strike, feel free to fork the repository and submit a pull request.

---

*Created with ❤️ by the Open Strike Team.*
