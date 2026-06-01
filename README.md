# KFS OS (Kreatek Flow Systems OS) 🌌

A premium, highly interactive, and visually stunning **Browser Operating System (BOS)** running entirely in the web browser. KFS OS delivers a futuristic cybernetic desktop environment using ultra-modern glassmorphic styling, smooth micro-animations, and fluid multi-window management.

---

## ✨ Features

- **🛸 Glassmorphic Desktop Environment**: An interactive workspace with smooth-animated desktop shortcuts and dynamic cybernetic wallpaper gradients.
- **🎛️ Dynamic Taskbar & Start Menu**: A centered, macOS/Windows 11-inspired taskbar displaying open apps, a real-time system clock/calendar, and a sleek Start Menu containing all system utilities.
- **🖥️ Multi-Window Manager**: 
  - Drag-and-drop support across the desktop workspace.
  - Smooth scale and fade animations for Opening, Closing, Minimizing, and Maximizing windows.
  - Active-window detection (clicking any window dynamically brings it to the foreground with proper z-indexing).
- **📟 Interactive KFS Terminal**: A fully functional mock console containing retro-futuristic terminal syntax. Type commands like `neofetch`, `sysinfo`, `theme`, `clear`, and `help`.
- **✍️ FlowEdit Text Editor**: A streamlined notes application where you can write custom texts and download them directly as `.txt` files to your physical disk.
- **📂 File Explorer**: Navigate mock system directories and check details about files and hardware system specs.
- **⚙️ Settings App**: Change the desktop wallpaper dynamically, customize system accent colors, and toggle advanced glassmorphic blur effects.

---

## 🛠️ Architecture & Tech Stack

- **Core Structure**: HTML5 (semantic layout representing OS shells, panels, and desktop viewports).
- **Styling & Aesthetics**: Vanilla CSS3 featuring:
  - Custom HSL styling tokens for fluid light and dark elements.
  - `backdrop-filter: blur(...)` for state-of-the-art glassmorphism.
  - Keyframe animations and transitions for premium desktop feel.
- **Desktop Logic**: Pure Vanilla ES6 Javascript. Uses custom classes to manage multiple window states, coordinate mouse-dragging parameters, execute terminal commands, and coordinate desktop system states.

---

## 🚀 How to Run Locally

Since KFS OS is built entirely with pure client-side technologies (HTML, CSS, JS), you can run it instantly:

1. Open `index.html` directly in any modern web browser.
2. Alternatively, run a local development server (such as Live Server or Python's HTTP Server):
   ```bash
   # If you have python installed
   python -m http.server 8000
   ```
   Then open `http://localhost:8000` in your web browser.

---

## 📂 Directory Layout

```
kfs-os/
│
├── index.html     # Main browser viewport and OS layout shell
├── style.css      # Design tokens, CSS variables, glassmorphic UI, animations
├── app.js         # Window manager class, app routers, interactive terminal commands
├── .gitignore     # Git ignore configurations
└── README.md      # Project documentation
```

---

*Engineered by Kreatek Flow Systems.* 🚀
