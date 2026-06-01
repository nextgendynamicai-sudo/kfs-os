/* ==========================================================================
   KFS OS - OPERATING SYSTEM CORE ENGINE
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Core System Services
    SystemTray.init();
    StartMenu.init();
    WindowManager.init();
    Apps.init();
});

/* ==========================================================================
   1. SYSTEM TRAY SERVICE (CLOCK & UPTIME)
   ========================================================================== */
const SystemTray = {
    init() {
        this.updateClock();
        setInterval(() => this.updateClock(), 1000);
        this.initUptime();
    },

    updateClock() {
        const timeEl = document.getElementById('tray-time');
        const dateEl = document.getElementById('tray-date');
        if (!timeEl || !dateEl) return;

        const now = new Date();
        
        // Time
        let hours = now.getHours();
        let minutes = now.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // 0 should be 12
        minutes = minutes < 10 ? '0' + minutes : minutes;
        timeEl.textContent = `${hours}:${minutes} ${ampm}`;

        // Date
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const year = now.getFullYear();
        dateEl.textContent = `${month}/${day}/${year}`;
    },

    initUptime() {
        const uptimeEl = document.getElementById('uptime-counter');
        if (!uptimeEl) return;

        let totalSeconds = 0;
        setInterval(() => {
            totalSeconds++;
            const hrs = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
            const mins = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
            const secs = String(totalSeconds % 60).padStart(2, '0');
            uptimeEl.textContent = `${hrs}:${mins}:${secs}`;
        }, 1000);
    }
};

/* ==========================================================================
   2. START MENU SERVICE
   ========================================================================== */
const StartMenu = {
    init() {
        const startBtn = document.getElementById('btn-start');
        const startMenu = document.getElementById('start-menu');

        if (!startBtn || !startMenu) return;

        // Toggle start menu
        startBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            startMenu.classList.toggle('open');
        });

        // Close on clicking outside
        document.addEventListener('click', (e) => {
            if (!startMenu.contains(e.target) && e.target !== startBtn) {
                startMenu.classList.remove('open');
            }
        });

        // App launches from start menu
        const startItems = startMenu.querySelectorAll('.start-app-item');
        startItems.forEach(item => {
            item.addEventListener('click', () => {
                const appName = item.getAttribute('data-app');
                WindowManager.openApp(appName);
                startMenu.classList.remove('open');
            });
        });
    }
};

/* ==========================================================================
   3. WINDOW MANAGER (DRAG, FOCUS, RESIZE, MIN/MAX/CLOSE)
   ========================================================================== */
const WindowManager = {
    activeZIndex: 100,

    init() {
        this.windows = document.querySelectorAll('.window');
        this.taskbarButtons = document.querySelectorAll('.app-pin');
        this.desktopIcons = document.querySelectorAll('.shortcut');

        // Setup Desktop Icon Launchers
        this.desktopIcons.forEach(icon => {
            icon.addEventListener('click', () => {
                const appName = icon.getAttribute('data-app');
                this.openApp(appName);
            });
        });

        // Setup Taskbar Indicators & Toggle
        this.taskbarButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const appName = btn.getAttribute('data-app');
                this.toggleApp(appName);
            });
        });

        // Setup Window Action Listeners
        this.windows.forEach(win => {
            const appName = win.id.replace('win-', '');
            
            // Header dragging setup
            const header = win.querySelector('.window-header');
            this.makeDraggable(win, header);

            // Focus on window click
            win.addEventListener('mousedown', () => this.focusWindow(win));

            // Controls setup
            const minBtn = win.querySelector('.btn-minimize');
            const maxBtn = win.querySelector('.btn-maximize');
            const closeBtn = win.querySelector('.btn-close');

            if (minBtn) minBtn.addEventListener('click', (e) => { e.stopPropagation(); this.minimizeApp(appName); });
            if (maxBtn) maxBtn.addEventListener('click', (e) => { e.stopPropagation(); this.maximizeApp(appName); });
            if (closeBtn) closeBtn.addEventListener('click', (e) => { e.stopPropagation(); this.closeApp(appName); });
        });
    },

    makeDraggable(win, header) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        header.onmousedown = dragMouseDown;

        function dragMouseDown(e) {
            e = e || window.event;
            // Only allow left click drag
            if (e.button !== 0) return;
            
            // Prevent dragging if maximized
            if (win.classList.contains('maximized')) return;

            e.preventDefault();
            // Get the mouse cursor position at startup
            pos3 = e.clientX;
            pos4 = e.clientY;
            
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;

            // Set active focus style immediately on drag start
            WindowManager.focusWindow(win);
        }

        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            // Calculate the new cursor position
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            
            // Set the element's new position
            let newTop = win.offsetTop - pos2;
            let newLeft = win.offsetLeft - pos1;

            // Simple screen boundaries constraints
            const desktopHeight = document.getElementById('desktop').clientHeight - 60;
            const desktopWidth = document.getElementById('desktop').clientWidth;

            if (newTop < 0) newTop = 0;
            if (newTop > desktopHeight - 100) newTop = desktopHeight - 100;
            if (newLeft < -win.clientWidth + 100) newLeft = -win.clientWidth + 100;
            if (newLeft > desktopWidth - 100) newLeft = desktopWidth - 100;

            win.style.top = newTop + "px";
            win.style.left = newLeft + "px";
        }

        function closeDragElement() {
            // Stop moving when mouse button is released
            document.onmouseup = null;
            document.onmousemove = null;
        }
    },

    focusWindow(win) {
        this.windows.forEach(w => w.classList.remove('active-window'));
        win.classList.remove('minimized');
        win.classList.add('active-window');
        this.activeZIndex++;
        win.style.zIndex = this.activeZIndex;

        // Update taskbar active state
        const appName = win.id.replace('win-', '');
        this.taskbarButtons.forEach(btn => {
            if (btn.getAttribute('data-app') === appName) {
                btn.classList.add('active');
            } else if (btn.classList.contains('active')) {
                // Remove active if another window gets focused
                const otherWin = document.getElementById(`win-${btn.getAttribute('data-app')}`);
                if (!otherWin || !otherWin.classList.contains('active-window')) {
                    btn.classList.remove('active');
                }
            }
        });
    },

    openApp(appName) {
        const win = document.getElementById(`win-${appName}`);
        const taskbarBtn = document.getElementById(`taskbar-${appName}`);

        if (!win) return;

        // Show window
        win.style.display = 'flex';
        win.classList.remove('minimized');
        
        // Add running indicators
        if (taskbarBtn) {
            taskbarBtn.classList.add('running');
        }

        // Focus
        this.focusWindow(win);

        // Custom App Trigger callbacks
        if (appName === 'terminal') {
            const input = document.getElementById('terminal-input');
            if (input) input.focus();
        }
    },

    toggleApp(appName) {
        const win = document.getElementById(`win-${appName}`);
        if (!win) return;

        const isVisible = win.style.display !== 'none';
        const isMinimized = win.classList.contains('minimized');
        const isActive = win.classList.contains('active-window');

        if (!isVisible) {
            // If closed, open it
            this.openApp(appName);
        } else if (isMinimized) {
            // If minimized, restore it
            this.openApp(appName);
        } else if (!isActive) {
            // If open but not in focus, focus it
            this.focusWindow(win);
        } else {
            // If open and in focus, minimize it
            this.minimizeApp(appName);
        }
    },

    minimizeApp(appName) {
        const win = document.getElementById(`win-${appName}`);
        const taskbarBtn = document.getElementById(`taskbar-${appName}`);
        
        if (!win) return;

        win.classList.add('minimized');
        win.classList.remove('active-window');
        
        if (taskbarBtn) {
            taskbarBtn.classList.remove('active');
        }

        // Find next active window to focus
        const visibleWindows = Array.from(this.windows)
            .filter(w => w.style.display !== 'none' && !w.classList.contains('minimized'))
            .sort((a, b) => parseInt(a.style.zIndex || 0) - parseInt(b.style.zIndex || 0));
        
        if (visibleWindows.length > 0) {
            this.focusWindow(visibleWindows[visibleWindows.length - 1]);
        }
    },

    maximizeApp(appName) {
        const win = document.getElementById(`win-${appName}`);
        if (!win) return;
        
        win.classList.toggle('maximized');
        this.focusWindow(win);
    },

    closeApp(appName) {
        const win = document.getElementById(`win-${appName}`);
        const taskbarBtn = document.getElementById(`taskbar-${appName}`);

        if (!win) return;

        win.style.display = 'none';
        win.classList.remove('minimized');
        win.classList.remove('maximized');
        win.classList.remove('active-window');

        if (taskbarBtn) {
            taskbarBtn.classList.remove('running');
            taskbarBtn.classList.remove('active');
        }
    }
};

/* ==========================================================================
   4. BUILT-IN APPLICATIONS ENGINE (TERMINAL, FLOWEDIT, EXPLORER, SETTINGS)
   ========================================================================== */
const Apps = {
    init() {
        this.Terminal.init();
        this.FlowEdit.init();
        this.FileExplorer.init();
        this.Settings.init();
    },

    /* 📟 APPLICATION: KFS TERMINAL */
    Terminal: {
        history: [],
        historyIdx: -1,

        init() {
            const input = document.getElementById('terminal-input');
            const container = document.querySelector('.terminal-body');

            if (!input || !container) return;

            // Auto-focus when clicking anywhere inside terminal body
            container.addEventListener('click', () => {
                input.focus();
            });

            // Parse commands on Enter
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    const cmd = input.value.trim();
                    if (cmd) {
                        this.executeCommand(cmd);
                        this.history.push(cmd);
                        this.historyIdx = this.history.length;
                    } else {
                        this.writeLine('');
                    }
                    input.value = '';
                } else if (e.key === 'ArrowUp') {
                    // History traversal
                    if (this.historyIdx > 0) {
                        this.historyIdx--;
                        input.value = this.history[this.historyIdx];
                    }
                    e.preventDefault();
                } else if (e.key === 'ArrowDown') {
                    if (this.historyIdx < this.history.length - 1) {
                        this.historyIdx++;
                        input.value = this.history[this.historyIdx];
                    } else {
                        this.historyIdx = this.history.length;
                        input.value = '';
                    }
                    e.preventDefault();
                }
            });
        },

        writeLine(text, type = '') {
            const log = document.getElementById('terminal-log');
            if (!log) return;

            const line = document.createElement('div');
            line.className = `terminal-line ${type}`;
            line.innerHTML = text;
            log.appendChild(line);

            // Auto scroll to bottom
            log.scrollTop = log.scrollHeight;
        },

        executeCommand(cmdLine) {
            const parts = cmdLine.split(' ');
            const cmd = parts[0].toLowerCase();
            const args = parts.slice(1);

            // Print the entered command first
            this.writeLine(`<span style="color:#a855f7;">kfs@kreatek-flow:~#</span> ${cmdLine}`);

            switch(cmd) {
                case 'help':
                    this.writeLine('KFS Core Shell Commands:');
                    this.writeLine('  help                           Show this diagnostics list');
                    this.writeLine('  neofetch | sysfetch            Render system architecture info');
                    this.writeLine('  sysinfo                        Retrieve browser details & system specifications');
                    this.writeLine('  theme [purple|blue|emerald|sunset]   Switch desktop gradient wallpapers');
                    this.writeLine('  accent [purple|blue|emerald|rose]    Override global accent theme color');
                    this.writeLine('  clear                          Wipe terminal display buffer');
                    this.writeLine('  about                          Overview of Kreatek Flow Systems');
                    this.writeLine('  apps                           Open other application interfaces');
                    break;
                
                case 'neofetch':
                case 'sysfetch':
                    const neofetchArt = 
`      .---.
     /     \\        <span style="color:#a855f7; font-weight:700;">kfs@kreatek-flow-systems</span>
     \\  O  /        -----------------------
      '---'         OS: Kreatek Flow Systems v1.0 (Stable)
      /   \\         Kernel: WebOS Engine v1.0.254-JS
     / | | \\        Uptime: ${document.getElementById('uptime-counter').textContent}
    |  | |  |       Shell: FiraCode CSS Canvas Shell
    |  | |  |       Resolution: ${window.innerWidth}x${window.innerHeight}
    |  |_|_|        Theme: Purple Cybernetic
   /___\\/___\\       CPU: Kreatek Flow Engine x16
                    Memory: 32.0 GB Virtual RAM
                    Host: Browser Environment`;
                    this.writeLine(neofetchArt, 'success-msg');
                    break;

                case 'sysinfo':
                    this.writeLine('System Diagnostics:');
                    this.writeLine(`  Screen Resolution: ${window.screen.width}x${window.screen.height} px`);
                    this.writeLine(`  Workspace Size: ${window.innerWidth}x${window.innerHeight} px`);
                    this.writeLine(`  Logical Cores: ${navigator.hardwareConcurrency || 'Undetected'} threads`);
                    this.writeLine(`  User Agent: ${navigator.userAgent}`);
                    break;

                case 'theme':
                    if (args.length === 0) {
                        this.writeLine('Usage: theme [purple | blue | emerald | sunset]', 'error-msg');
                    } else {
                        const newTheme = args[0].toLowerCase();
                        if (['purple', 'blue', 'emerald', 'sunset'].includes(newTheme)) {
                            document.body.className = `theme-${newTheme}`;
                            // Sync with Settings Wallpaper
                            document.querySelectorAll('.wp-opt').forEach(opt => {
                                if (opt.getAttribute('data-theme') === newTheme) {
                                    opt.classList.add('active');
                                } else {
                                    opt.classList.remove('active');
                                }
                            });
                            this.writeLine(`Wallpaper background shifted to: theme-${newTheme}`, 'success-msg');
                        } else {
                            this.writeLine(`Theme '${newTheme}' not recognized. Try purple, blue, emerald, or sunset.`, 'error-msg');
                        }
                    }
                    break;

                case 'accent':
                    if (args.length === 0) {
                        this.writeLine('Usage: accent [purple | blue | emerald | rose]', 'error-msg');
                    } else {
                        const newAccent = args[0].toLowerCase();
                        if (['purple', 'blue', 'emerald', 'rose'].includes(newAccent)) {
                            document.body.setAttribute('data-accent', newAccent);
                            // Sync with Settings App Selectors
                            document.querySelectorAll('.accent-opt').forEach(opt => {
                                if (opt.getAttribute('data-accent') === newAccent) {
                                    opt.classList.add('active');
                                } else {
                                    opt.classList.remove('active');
                                }
                            });
                            this.writeLine(`Accent color updated to: ${newAccent}`, 'success-msg');
                        } else {
                            this.writeLine(`Accent '${newAccent}' not recognized. Try purple, blue, emerald, or rose.`, 'error-msg');
                        }
                    }
                    break;

                case 'clear':
                    const log = document.getElementById('terminal-log');
                    if (log) log.innerHTML = '';
                    break;
                
                case 'about':
                    this.writeLine('<b>Kreatek Flow Systems OS (KFS OS)</b>', 'success-msg');
                    this.writeLine('A premium experimental browser-based operating system built by Kreatek Flow Systems. Designed to maximize creative coding productivity and visualize data architectures.', 'system-msg');
                    this.writeLine('Created entirely with modern HTML5 APIs, high-fidelity glassmorphic stylesheet rules, and object-oriented vanilla modules.');
                    break;

                case 'apps':
                    if (args.length === 0) {
                        this.writeLine('Usage: apps [editor | explorer | settings]', 'error-msg');
                    } else {
                        const targetApp = args[0].toLowerCase();
                        if (['editor', 'explorer', 'settings'].includes(targetApp)) {
                            WindowManager.openApp(targetApp);
                            this.writeLine(`Opening application node: win-${targetApp}`, 'success-msg');
                        } else {
                            this.writeLine(`App node '${targetApp}' not available.`, 'error-msg');
                        }
                    }
                    break;
                
                default:
                    this.writeLine(`kfs: command not found: '${cmd}'. Type 'help' for diagnostics diagnostics.`, 'error-msg');
            }
        }
    },

    /* ✍️ APPLICATION: FLOWEDIT TEXT EDITOR */
    FlowEdit: {
        init() {
            const clearBtn = document.getElementById('editor-btn-clear');
            const saveBtn = document.getElementById('editor-btn-save');
            const textarea = document.getElementById('editor-text');

            if (!clearBtn || !saveBtn || !textarea) return;

            // Clear editor
            clearBtn.addEventListener('click', () => {
                textarea.value = '';
                textarea.focus();
            });

            // Save notes locally as text file download
            saveBtn.addEventListener('click', () => {
                const textVal = textarea.value;
                if (!textVal) return;

                const blob = new Blob([textVal], { type: 'text/plain;charset=utf-8' });
                const url = URL.createObjectURL(blob);
                
                const link = document.createElement('a');
                link.href = url;
                link.download = 'kfs_flow_notes.txt';
                document.body.appendChild(link);
                link.click();
                
                // Cleanup
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
            });
        },

        loadFileContent(content, filename) {
            const titleEl = document.querySelector('#win-editor .window-title span');
            const textarea = document.getElementById('editor-text');

            if (titleEl) titleEl.textContent = `FlowEdit - ${filename}`;
            if (textarea) {
                textarea.value = content;
            }
            WindowManager.openApp('editor');
        }
    },

    /* 📂 APPLICATION: FILE EXPLORER */
    FileExplorer: {
        // Virtual Mock Filesystem Structure
        db: {
            root: [
                { name: 'system', type: 'dir' },
                { name: 'documents', type: 'dir' },
                { name: 'network', type: 'dir' },
                { name: 'readme.txt', type: 'file', content: 'KFS OS Browser Shell v1.0.254\n============================\nDeveloped by Kreatek Flow Systems.\n\nWelcome to your new virtual workstation. This operating system runs directly inside your web browser.\n\nBuilt-in Apps:\n- KFS Terminal\n- FlowEdit\n- System Control Center\n\nEnjoy the cybernetic workspace flow states!' }
            ],
            system: [
                { name: 'kernel.sys', type: 'file', content: '[KFS KERNEL LOADED]\nVersion: 1.0.254\nModules: 18 active\nVirtual CPU cores: 16 threads detected.' },
                { name: 'drivers.config', type: 'file', content: '# KFS Hardware Drivers\nhost_monitor=enabled\nhost_gpu_acceleration=enabled\nmouse_drag_physics=enabled\nglassmorphic_compositing=high_quality' },
                { name: 'core_modules.dll', type: 'file', content: 'BINARY_KFS_MODULE_CORE_EXEC' }
            ],
            documents: [
                { name: 'kfs_project_plan.txt', type: 'file', content: 'KFS Project Roadmap:\n1. Initialize Local Project [DONE]\n2. Construct Glassmorphic UI Shell [DONE]\n3. Program Window Physics [DONE]\n4. Establish Git Repository [PENDING]\n5. Connect GitHub Host [PENDING]' },
                { name: 'ideas.md', type: 'file', content: '# Creative Sandbox Ideas\n- Add a JS-based calculator app.\n- Build a visual canvas node-linking editor app.\n- Integrate sound synthesis drivers.' },
                { name: 'flow_states.txt', type: 'file', content: 'Kreatek Flow State Logs:\n- 2026-05-31: KFS OS initialized. Seamless terminal experience active.' }
            ],
            network: [
                { name: 'subgrid_node_1.net', type: 'file', content: 'IP: 192.168.1.254\nSubnet Mask: 255.255.255.0\nNode Name: KFS Gateway Node 1' },
                { name: 'remote_uplink.gateway', type: 'file', content: 'STATUS: CONNECTED\nProtocol: Secure Quantum Tunnel\nUplink speed: 10.4 Gbps' }
            ]
        },

        init() {
            this.sidebarItems = document.querySelectorAll('.explorer-sidebar .sidebar-item');
            this.gridEl = document.getElementById('explorer-files-view');
            this.currentPathEl = document.getElementById('explorer-current-path');

            if (!this.gridEl) return;

            // Load root directory contents first
            this.loadDirectory('root');

            // Sidebar navigation
            this.sidebarItems.forEach(item => {
                item.addEventListener('click', () => {
                    this.sidebarItems.forEach(i => i.classList.remove('active'));
                    item.classList.add('active');
                    
                    const dirName = item.getAttribute('data-dir');
                    this.loadDirectory(dirName);
                });
            });
        },

        loadDirectory(dirName) {
            this.gridEl.innerHTML = '';
            const dirContents = this.db[dirName] || [];

            if (this.currentPathEl) {
                this.currentPathEl.textContent = dirName === 'root' ? 'root' : `root / ${dirName}`;
            }

            dirContents.forEach(node => {
                const item = document.createElement('div');
                item.className = 'file-item';
                
                // SVG Selector
                const iconSvg = node.type === 'dir' ? 
                    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>` : 
                    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line></svg>`;

                item.innerHTML = `
                    <div class="file-icon ${node.type}">
                        ${iconSvg}
                    </div>
                    <span class="file-name">${node.name}</span>
                `;

                // Single or double click action
                item.addEventListener('dblclick', () => {
                    if (node.type === 'dir') {
                        // Switch folder in view
                        this.loadDirectory(node.name);
                        // Highlight appropriate sidebar item
                        this.sidebarItems.forEach(si => {
                            if (si.getAttribute('data-dir') === node.name) {
                                si.classList.add('active');
                            } else {
                                si.classList.remove('active');
                            }
                        });
                    } else if (node.type === 'file') {
                        // Open and load file content inside FlowEdit editor
                        Apps.FlowEdit.loadFileContent(node.content, node.name);
                    }
                });

                // Support touch/single tap for easier user experience
                item.addEventListener('click', (e) => {
                    // Visual active node select feedback
                    document.querySelectorAll('.file-item').forEach(fi => fi.style.background = 'transparent');
                    item.style.background = 'rgba(255,255,255,0.05)';
                });

                this.gridEl.appendChild(item);
            });
        }
    },

    /* ⚙️ APPLICATION: SYSTEM SETTINGS */
    Settings: {
        init() {
            this.menuItems = document.querySelectorAll('.settings-menu-item');
            this.tabs = document.querySelectorAll('.settings-tab');
            this.wpOpts = document.querySelectorAll('.wp-opt');
            this.accentOpts = document.querySelectorAll('.accent-opt');
            this.blurSlider = document.getElementById('blur-slider');
            this.blurValLabel = document.getElementById('blur-slider-val');

            // Specs tab host browser info detection
            const browserInfoEl = document.getElementById('browser-info');
            if (browserInfoEl) {
                browserInfoEl.textContent = this.detectBrowser();
            }

            // Tab toggling
            this.menuItems.forEach(item => {
                item.addEventListener('click', () => {
                    this.menuItems.forEach(mi => mi.classList.remove('active'));
                    this.tabs.forEach(t => t.classList.remove('active'));

                    item.classList.add('active');
                    const tabId = item.getAttribute('data-tab');
                    const targetTab = document.getElementById(tabId);
                    if (targetTab) targetTab.classList.add('active');
                });
            });

            // Wallpaper background theme switcher
            this.wpOpts.forEach(opt => {
                opt.addEventListener('click', () => {
                    this.wpOpts.forEach(o => o.classList.remove('active'));
                    opt.classList.add('active');
                    
                    const newTheme = opt.getAttribute('data-theme');
                    document.body.className = `theme-${newTheme}`;
                    
                    // Sync Terminal output if running
                    Apps.Terminal.writeLine(`System wallpaper updated in Settings: theme-${newTheme}`, 'success-msg');
                });
            });

            // Accent color overrides switcher
            this.accentOpts.forEach(opt => {
                opt.addEventListener('click', () => {
                    this.accentOpts.forEach(o => o.classList.remove('active'));
                    opt.classList.add('active');
                    
                    const newAccent = opt.getAttribute('data-accent');
                    document.body.setAttribute('data-accent', newAccent);
                    
                    Apps.Terminal.writeLine(`Global system accent color modified in Settings: ${newAccent}`, 'success-msg');
                });
            });

            // Live backdrop-filter glass blur settings slider
            if (this.blurSlider && this.blurValLabel) {
                this.blurSlider.addEventListener('input', (e) => {
                    const blurVal = e.target.value;
                    this.blurValLabel.textContent = `${blurVal}px`;
                    document.documentElement.style.setProperty('--glass-blur', `${blurVal}px`);
                });
            }
        },

        detectBrowser() {
            const userAgent = navigator.userAgent;
            let browser = "Unknown Browser";

            if (userAgent.indexOf("Firefox") > -1) {
                browser = "Mozilla Firefox";
            } else if (userAgent.indexOf("Chrome") > -1) {
                browser = "Google Chrome";
            } else if (userAgent.indexOf("Safari") > -1) {
                browser = "Apple Safari";
            } else if (userAgent.indexOf("MSIE") > -1 || !!document.documentMode == true) {
                browser = "Microsoft Internet Explorer";
            } else if (userAgent.indexOf("Edge") > -1) {
                browser = "Microsoft Edge";
            }
            return browser;
        }
    }
};
