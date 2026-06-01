"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Terminal as TerminalIcon, 
  FileText, 
  FolderOpen, 
  Settings as SettingsIcon, 
  X, 
  Maximize2, 
  Minimize2, 
  Minus, 
  Trash2, 
  Download, 
  Cpu, 
  HardDrive, 
  Layers, 
  Monitor, 
  Wifi, 
  Volume2, 
  Clock, 
  Calendar,
  FolderClosed,
  Folder,
  ArrowRight
} from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

// Type definitions
interface WindowItem {
  id: string;
  title: string;
  icon: React.ReactNode;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
}

interface TerminalLine {
  text: string;
  type?: "system" | "success" | "error" | "accent" | "default";
}

export default function Home() {
  // Accent & Wallpaper Theme Management
  const [wallpaper, setWallpaper] = useState<"purple" | "blue" | "emerald" | "sunset">("purple");
  const [accent, setAccent] = useState<"purple" | "blue" | "emerald" | "rose">("purple");
  const [blurIntensity, setBlurIntensity] = useState<number>(16);

  const accentColors = {
    purple: { rgb: "168, 85, 247", hex: "#a855f7" },
    blue: { rgb: "59, 130, 246", hex: "#3b82f6" },
    emerald: { rgb: "16, 185, 129", hex: "#10b981" },
    rose: { rgb: "244, 63, 94", hex: "#f43f5e" }
  };

  // Uptime & Tray Clock Management
  const [uptime, setUptime] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<string>("12:00 PM");
  const [currentDate, setCurrentDate] = useState<string>("05/31/2026");

  // Window Manager States
  const [activeWindow, setActiveWindow] = useState<string>("terminal");
  const [startMenuOpen, setStartMenuOpen] = useState<boolean>(false);
  const [windows, setWindows] = useState<WindowItem[]>([
    {
      id: "terminal",
      title: "kfs_terminal.sys [KFS OS v2.0]",
      icon: <TerminalIcon className="w-4 h-4 text-purple-400" />,
      isOpen: true,
      isMinimized: false,
      isMaximized: false,
      x: 80,
      y: 60,
      width: 620,
      height: 420,
      zIndex: 100
    },
    {
      id: "editor",
      title: "FlowEdit - Untitled.txt",
      icon: <FileText className="w-4 h-4 text-indigo-400" />,
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      x: 180,
      y: 110,
      width: 580,
      height: 400,
      zIndex: 10
    },
    {
      id: "explorer",
      title: "File Explorer - Root (/)",
      icon: <FolderOpen className="w-4 h-4 text-amber-400" />,
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      x: 240,
      y: 160,
      width: 660,
      height: 440,
      zIndex: 10
    },
    {
      id: "settings",
      title: "System Control Center",
      icon: <SettingsIcon className="w-4 h-4 text-slate-400" />,
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      x: 320,
      y: 200,
      width: 600,
      height: 420,
      zIndex: 10
    }
  ]);

  // App-Specific States
  // 1. KFS Terminal
  const [termLog, setTermLog] = useState<TerminalLine[]>([
    { text: "Kreatek Flow Systems Next-OS [Version 2.0.254]", type: "system" },
    { text: "Initializing React components & Shadcn elements... OK", type: "system" },
    { text: "Type 'help' to view available commands.", type: "system" },
    { text: " " }
  ]);
  const [termInput, setTermInput] = useState<string>("");
  const termLogEndRef = useRef<HTMLDivElement>(null);
  const termHistory = useRef<string[]>([]);
  const termHistoryIdx = useRef<number>(-1);

  // 2. FlowEdit Text Editor
  const [editorText, setEditorText] = useState<string>("");
  const [editorFile, setEditorFile] = useState<string>("Untitled.txt");

  // 3. File Explorer
  const [explorerDir, setExplorerDir] = useState<string>("root");
  const filesDb = {
    root: [
      { name: "system", type: "dir" },
      { name: "documents", type: "dir" },
      { name: "network", type: "dir" },
      { name: "readme.txt", type: "file", content: "KFS OS Browser Shell v2.0-NEXT\n===============================\nDeveloped by Kreatek Flow Systems.\n\nThis Next.js + Tailwind CSS + Shadcn UI workstation has been successfully deployed!\n\nUse your mouse to drag windows, minimize them to the taskbar, or double-click folder shortcuts in the File Explorer.\n\nEnjoy the creative flow states!" }
    ],
    system: [
      { name: "kernel.sys", type: "file", content: "[KFS NEXT-KERNEL LOADED]\nVersion: 2.0.254-Next\nStatus: RUNNING\nThread scheduling: Reactive\nVirtual memory pool: 32 GB active" },
      { name: "tailwind.config.json", type: "file", content: "{\n  \"v4\": true,\n  \"theme\": \"inline\",\n  \"plugins\": [\"tw-animate-css\"]\n}" },
      { name: "shadcn.json", type: "file", content: "{\n  \"style\": \"default\",\n  \"rsc\": true,\n  \"tsx\": true,\n  \"tailwind\": {\n    \"config\": \"tailwindcss v4\"\n  }\n}" }
    ],
    documents: [
      { name: "kfs_project_plan.txt", type: "file", content: "KFS OS v2.0 Next.js Project Plan:\n--------------------------------\n1. Port system shell to Next.js v16 App Router [DONE]\n2. Add Tailwind CSS v4 styling sheet [DONE]\n3. Add custom shadcn components [DONE]\n4. Complete local Git commit [DONE]\n5. Push to remote GitHub host [PENDING]" },
      { name: "ideas.md", type: "file", content: "# KFS Future Roadmap\n- Integrate sound synthesis drivers.\n- Build a visual canvas node-linking editor app.\n- Add support for third-party mock web frames." },
      { name: "flow_states.txt", type: "file", content: "Kreatek Flow State Logs:\n- 2026-05-31: KFS OS Next.js port successfully completed. Aesthetics are pristine." }
    ],
    network: [
      { name: "subgrid_node_1.net", type: "file", content: "IP: 192.168.1.254\nSubnet Mask: 255.255.255.0\nNode Name: KFS Gateway Node 1" },
      { name: "remote_uplink.gateway", type: "file", content: "STATUS: ACTIVE\nProtocol: Secure Quantum Tunnel\nUplink speed: 10.4 Gbps" }
    ]
  };

  // 4. Settings Specs Detection
  const [browserSpec, setBrowserSpec] = useState<string>("Detecting...");

  // Synchronous clocks & timers on load
  useEffect(() => {
    // 1. Clock Updates
    const updateTime = () => {
      const now = new Date();
      let hrs = now.getHours();
      let mins = now.getMinutes();
      const ampm = hrs >= 12 ? "PM" : "AM";
      hrs = hrs % 12;
      hrs = hrs ? hrs : 12;
      const formattedMins = mins < 10 ? "0" + mins : mins;
      setCurrentTime(`${hrs}:${formattedMins} ${ampm}`);

      const month = String(now.getMonth() + 1).padStart(2, "0");
      const day = String(now.getDate()).padStart(2, "0");
      setCurrentDate(`${month}/${day}/${now.getFullYear()}`);
    };
    updateTime();
    const clockInterval = setInterval(updateTime, 1000);

    // 2. Uptime Counter
    const uptimeInterval = setInterval(() => {
      setUptime(prev => prev + 1);
    }, 1000);

    // 3. Browser Detect
    const userAgent = navigator.userAgent;
    if (userAgent.indexOf("Firefox") > -1) setBrowserSpec("Mozilla Firefox");
    else if (userAgent.indexOf("Chrome") > -1) setBrowserSpec("Google Chrome");
    else if (userAgent.indexOf("Safari") > -1) setBrowserSpec("Apple Safari");
    else if (userAgent.indexOf("Edge") > -1) setBrowserSpec("Microsoft Edge");
    else setBrowserSpec("Modern Browser");

    return () => {
      clearInterval(clockInterval);
      clearInterval(uptimeInterval);
    };
  }, []);

  // Terminal Auto Scroll
  useEffect(() => {
    if (termLogEndRef.current) {
      termLogEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [termLog]);

  // Window Focus Helpers
  const focusWindow = (windowId: string) => {
    setWindows(prev => {
      const maxZIndex = prev.reduce((max, w) => Math.max(max, w.zIndex), 10);
      return prev.map(w => 
        w.id === windowId 
          ? { ...w, isMinimized: false, zIndex: maxZIndex + 1 } 
          : w
      );
    });
    setActiveWindow(windowId);
  };

  const openApp = (windowId: string) => {
    setWindows(prev => prev.map(w => w.id === windowId ? { ...w, isOpen: true, isMinimized: false } : w));
    focusWindow(windowId);
    setStartMenuOpen(false);
  };

  const closeApp = (windowId: string) => {
    setWindows(prev => prev.map(w => w.id === windowId ? { ...w, isOpen: false } : w));
  };

  const minimizeApp = (windowId: string) => {
    setWindows(prev => prev.map(w => w.id === windowId ? { ...w, isMinimized: true } : w));
    
    // Focus next available window
    setWindows(prev => {
      const visible = prev.filter(w => w.isOpen && !w.isMinimized && w.id !== windowId);
      if (visible.length > 0) {
        const sorted = [...visible].sort((a, b) => a.zIndex - b.zIndex);
        setActiveWindow(sorted[sorted.length - 1].id);
      }
      return prev;
    });
  };

  const maximizeApp = (windowId: string) => {
    setWindows(prev => prev.map(w => w.id === windowId ? { ...w, isMaximized: !w.isMaximized } : w));
    focusWindow(windowId);
  };

  const toggleApp = (windowId: string) => {
    const win = windows.find(w => w.id === windowId);
    if (!win) return;

    if (!win.isOpen) {
      openApp(windowId);
    } else if (win.isMinimized) {
      setWindows(prev => prev.map(w => w.id === windowId ? { ...w, isMinimized: false } : w));
      focusWindow(windowId);
    } else if (activeWindow !== windowId) {
      focusWindow(windowId);
    } else {
      minimizeApp(windowId);
    }
  };

  // Pure React Window Dragging physics
  const startDrag = (e: React.MouseEvent, windowId: string) => {
    if (e.button !== 0) return; // Only left click drag
    
    const win = windows.find(w => w.id === windowId);
    if (!win || win.isMaximized) return;

    focusWindow(windowId);

    const startX = e.clientX;
    const startY = e.clientY;
    const initialX = win.x;
    const initialY = win.y;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;

      let newX = initialX + deltaX;
      let newY = initialY + deltaY;

      // Constrain screen top
      if (newY < 0) newY = 0;

      setWindows(prev => prev.map(w => w.id === windowId ? { ...w, x: newX, y: newY } : w));
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  // Uptime formatting
  const formatUptime = (seconds: number) => {
    const hrs = String(Math.floor(seconds / 3600)).padStart(2, "0");
    const mins = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
    const secs = String(seconds % 60).padStart(2, "0");
    return `${hrs}:${mins}:${secs}`;
  };

  // KFS Terminal Command Execution Logic
  const handleTerminalCommand = (cmdLine: string) => {
    const trimmed = cmdLine.trim();
    if (!trimmed) {
      setTermLog(prev => [...prev, { text: "kfs@kreatek-flow:~#", type: "accent" }]);
      return;
    }

    termHistory.current.push(trimmed);
    termHistoryIdx.current = termHistory.current.length;

    const parts = trimmed.split(" ");
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1);

    const outputLines: TerminalLine[] = [
      { text: `kfs@kreatek-flow:~# ${trimmed}`, type: "accent" }
    ];

    switch(cmd) {
      case "help":
        outputLines.push(
          { text: "KFS Core Next-Shell Commands:" },
          { text: "  help                           Show this diagnostics list" },
          { text: "  neofetch | sysfetch            Render system architecture info" },
          { text: "  sysinfo                        Retrieve browser details & system specifications" },
          { text: "  theme [purple|blue|emerald|sunset]   Switch desktop gradient wallpapers" },
          { text: "  accent [purple|blue|emerald|rose]    Override global accent theme color" },
          { text: "  clear                          Wipe terminal display buffer" },
          { text: "  about                          Overview of Kreatek Flow Systems" },
          { text: "  apps                           Open other application interfaces" }
        );
        break;

      case "neofetch":
      case "sysfetch":
        outputLines.push({
          text: `      .---.
     /     \\        kfs@kreatek-flow-systems
     \\  O  /        -----------------------
      '---'         OS: Kreatek Flow Systems v2.0 (Next-Stable)
      /   \\         Kernel: NextJS App Engine 16.2.6
     / | | \\        Uptime: ${formatUptime(uptime)}
    |  | |  |       Shell: Monospace Shadcn Console
    |  | |  |       Resolution: ${window.innerWidth}x${window.innerHeight}
    |  |_|_|        Theme: Tailwind Glass
   /___\\/___\\       CPU: Flow Core x16 (React-Thread)
                    Memory: 32.0 GB Virtual RAM
                    Host: Browser Environment`,
          type: "success"
        });
        break;

      case "sysinfo":
        outputLines.push(
          { text: "System Diagnostics:", type: "system" },
          { text: `  Screen Resolution: ${window.screen.width}x${window.screen.height} px` },
          { text: `  Workspace Size: ${window.innerWidth}x${window.innerHeight} px` },
          { text: `  Logical Cores: ${navigator.hardwareConcurrency || "Undetected"} threads` },
          { text: `  User Agent: ${navigator.userAgent}` }
        );
        break;

      case "theme":
        if (args.length === 0) {
          outputLines.push({ text: "Usage: theme [purple | blue | emerald | sunset]", type: "error" });
        } else {
          const t = args[0].toLowerCase();
          if (["purple", "blue", "emerald", "sunset"].includes(t)) {
            setWallpaper(t as any);
            outputLines.push({ text: `Wallpaper background shifted to: theme-${t}`, type: "success" });
          } else {
            outputLines.push({ text: `Theme '${t}' not recognized. Try purple, blue, emerald, or sunset.`, type: "error" });
          }
        }
        break;

      case "accent":
        if (args.length === 0) {
          outputLines.push({ text: "Usage: accent [purple | blue | emerald | rose]", type: "error" });
        } else {
          const a = args[0].toLowerCase();
          if (["purple", "blue", "emerald", "rose"].includes(a)) {
            setAccent(a as any);
            outputLines.push({ text: `Accent color updated to: ${a}`, type: "success" });
          } else {
            outputLines.push({ text: `Accent '${a}' not recognized. Try purple, blue, emerald, or rose.`, type: "error" });
          }
        }
        break;

      case "clear":
        setTermLog([]);
        return;

      case "about":
        outputLines.push(
          { text: "Kreatek Flow Systems OS (KFS OS) v2.0-NEXT", type: "success" },
          { text: "A premium experimental browser-based operating system powered by Next.js, React 19, Tailwind CSS v4, and Shadcn UI. Designed to maximize creative coding productivity and visualize data architectures.", type: "system" },
          { text: "Created entirely with modern HTML5 APIs, high-fidelity glassmorphic stylesheet rules, and object-oriented vanilla modules." }
        );
        break;

      case "apps":
        if (args.length === 0) {
          outputLines.push({ text: "Usage: apps [editor | explorer | settings]", type: "error" });
        } else {
          const target = args[0].toLowerCase();
          if (["editor", "explorer", "settings"].includes(target)) {
            openApp(target);
            outputLines.push({ text: `Opening application node: win-${target}`, type: "success" });
          } else {
            outputLines.push({ text: `App node '${target}' not available.`, type: "error" });
          }
        }
        break;

      default:
        outputLines.push({ text: `kfs: command not found: '${cmd}'. Type 'help' for available commands.`, type: "error" });
    }

    setTermLog(prev => [...prev, ...outputLines, { text: " " }]);
  };

  // FlowEdit note download
  const handleFlowEditDownload = () => {
    if (!editorText) return;
    const blob = new Blob([editorText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = editorFile;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Double-clicking files loads them into FlowEdit
  const handleFileDblClick = (file: { name: string; type: string; content?: string }) => {
    if (file.type === "dir") {
      setExplorerDir(file.name);
    } else if (file.type === "file" && file.content !== undefined) {
      setEditorText(file.content);
      setEditorFile(file.name);
      openApp("editor");
    }
  };

  return (
    <div 
      className={`relative w-screen h-screen flex flex-col overflow-hidden theme-${wallpaper}`}
      style={{
        "--accent-rgb": accentColors[accent].rgb,
        "--accent-hex": accentColors[accent].hex,
        "--glass-blur": `${blurIntensity}px`
      } as React.CSSProperties}
    >
      {/* 1. Interactive Desktop grid */}
      <div className="absolute inset-0 bg-transparent flex flex-col z-10">
        
        {/* Desktop Shortcuts */}
        <div className="flex flex-col gap-6 p-6 items-start h-[calc(100vh-80px)] flex-wrap select-none">
          <div 
            className="flex flex-col items-center justify-center w-24 h-24 rounded-2xl hover:bg-white/10 hover:border hover:border-white/10 cursor-pointer group active:scale-95 transition-all"
            onClick={() => openApp("terminal")}
          >
            <div className="w-12 h-12 rounded-xl bg-slate-900 border border-white/20 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <TerminalIcon className="w-6 h-6 text-emerald-400" />
            </div>
            <span className="text-xs text-white mt-2 text-center font-medium drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              KFS Terminal
            </span>
          </div>

          <div 
            className="flex flex-col items-center justify-center w-24 h-24 rounded-2xl hover:bg-white/10 hover:border hover:border-white/10 cursor-pointer group active:scale-95 transition-all"
            onClick={() => openApp("editor")}
          >
            <div className="w-12 h-12 rounded-xl bg-indigo-600 border border-white/10 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <span className="text-xs text-white mt-2 text-center font-medium drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              FlowEdit
            </span>
          </div>

          <div 
            className="flex flex-col items-center justify-center w-24 h-24 rounded-2xl hover:bg-white/10 hover:border hover:border-white/10 cursor-pointer group active:scale-95 transition-all"
            onClick={() => openApp("explorer")}
          >
            <div className="w-12 h-12 rounded-xl bg-amber-600 border border-white/10 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <FolderOpen className="w-6 h-6 text-white" />
            </div>
            <span className="text-xs text-white mt-2 text-center font-medium drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              Explorer
            </span>
          </div>

          <div 
            className="flex flex-col items-center justify-center w-24 h-24 rounded-2xl hover:bg-white/10 hover:border hover:border-white/10 cursor-pointer group active:scale-95 transition-all"
            onClick={() => openApp("settings")}
          >
            <div className="w-12 h-12 rounded-xl bg-slate-700 border border-white/10 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <SettingsIcon className="w-6 h-6 text-white" />
            </div>
            <span className="text-xs text-white mt-2 text-center font-medium drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              Settings
            </span>
          </div>
        </div>

        {/* 2. Draggable Window Manager Layer */}
        <div className="absolute inset-0 bottom-[60px] pointer-events-none z-20">
          
          {windows.map((win) => {
            if (!win.isOpen) return null;

            const isCurrentActive = activeWindow === win.id;

            return (
              <div
                key={win.id}
                style={{
                  top: win.isMaximized ? "10px" : `${win.y}px`,
                  left: win.isMaximized ? "10px" : `${win.x}px`,
                  width: win.isMaximized ? "calc(100% - 20px)" : `${win.width}px`,
                  height: win.isMaximized ? "calc(100% - 20px)" : `${win.height}px`,
                  zIndex: win.zIndex,
                  display: win.isMinimized ? "none" : "flex",
                  backdropFilter: `blur(${blurIntensity}px)`,
                  WebkitBackdropFilter: `blur(${blurIntensity}px)`
                }}
                className={`absolute flex flex-col rounded-2xl overflow-hidden glass-panel border pointer-events-auto transition-shadow duration-200 ${
                  isCurrentActive 
                    ? "border-[rgba(var(--accent-rgb),0.55)] shadow-[0_25px_60px_rgba(var(--accent-rgb),0.22)]" 
                    : "border-white/10 shadow-[0_20px_40px_rgba(0,0,0,0.5)]"
                }`}
                onMouseDown={() => focusWindow(win.id)}
              >
                {/* Window Titlebar */}
                <div 
                  className="h-10 bg-black/30 border-b border-white/5 flex items-center justify-between px-4 cursor-move select-none"
                  onMouseDown={(e) => startDrag(e, win.id)}
                >
                  <div className="flex items-center gap-2 text-xs font-semibold tracking-wide">
                    {win.icon}
                    <span className={isCurrentActive ? "text-white drop-shadow-[0_0_8px_rgba(var(--accent-rgb),0.5)]" : "text-slate-400"}>
                      {win.title}
                    </span>
                  </div>
                  
                  {/* Titlebar Action Buttons */}
                  <div className="flex items-center gap-2 pointer-events-auto">
                    <button 
                      className="w-5 h-5 rounded-full bg-white/5 hover:bg-blue-500/80 text-slate-300 hover:text-white flex items-center justify-center text-[10px] transition-colors"
                      onClick={() => minimizeApp(win.id)}
                      title="Minimize"
                    >
                      <Minus className="w-2.5 h-2.5" />
                    </button>
                    <button 
                      className="w-5 h-5 rounded-full bg-white/5 hover:bg-amber-500/80 text-slate-300 hover:text-white flex items-center justify-center text-[10px] transition-colors"
                      onClick={() => maximizeApp(win.id)}
                      title={win.isMaximized ? "Restore" : "Maximize"}
                    >
                      <Maximize2 className="w-2.5 h-2.5" />
                    </button>
                    <button 
                      className="w-5 h-5 rounded-full bg-white/5 hover:bg-rose-600 text-slate-300 hover:text-white flex items-center justify-center text-[10px] transition-colors"
                      onClick={() => closeApp(win.id)}
                      title="Close"
                    >
                      <X className="w-2.5 h-2.5" />
                    </button>
                  </div>
                </div>

                {/* Window Body Container */}
                <div className="flex-1 overflow-auto relative bg-transparent flex flex-col">
                  
                  {/* APP 1: TERMINAL CONTENT */}
                  {win.id === "terminal" && (
                    <div 
                      className="flex-1 bg-slate-950/95 p-4 font-mono text-emerald-400 text-xs flex flex-col overflow-auto select-text cursor-text"
                      onClick={() => document.getElementById("terminal-input-el")?.focus()}
                    >
                      <div className="flex-1 overflow-y-auto mb-4 space-y-1">
                        {termLog.map((line, idx) => (
                          <div 
                            key={idx} 
                            className={`whitespace-pre-wrap break-all ${
                              line.type === "system" ? "text-purple-400/90" :
                              line.type === "success" ? "text-emerald-400" :
                              line.type === "error" ? "text-rose-500" :
                              line.type === "accent" ? "text-purple-300" : "text-slate-200"
                            }`}
                          >
                            {line.text}
                          </div>
                        ))}
                        <div ref={termLogEndRef} />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-purple-400 font-bold shrink-0">kfs@kreatek-flow:~#</span>
                        <input
                          id="terminal-input-el"
                          type="text"
                          className="flex-1 bg-transparent border-none outline-none text-slate-200 caret-emerald-400 p-0"
                          value={termInput}
                          onChange={(e) => setTermInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              handleTerminalCommand(termInput);
                              setTermInput("");
                            }
                          }}
                          autoComplete="off"
                          autoFocus
                        />
                      </div>
                    </div>
                  )}

                  {/* APP 2: FLOWEDIT CONTENT */}
                  {win.id === "editor" && (
                    <div className="flex-1 bg-slate-900/95 flex flex-col">
                      <div className="h-11 bg-black/20 border-b border-white/5 flex items-center px-4 justify-between shrink-0">
                        <div className="flex items-center gap-2">
                          <Input 
                            value={editorFile} 
                            onChange={(e) => setEditorFile(e.target.value)}
                            className="h-7 w-40 text-xs bg-white/5 border-white/10 text-white rounded"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => setEditorText("")}
                            className="h-7 text-xs text-slate-300 hover:text-white"
                          >
                            <Trash2 className="w-3.5 h-3.5 mr-1" />
                            Clear
                          </Button>
                          <Button 
                            size="sm" 
                            onClick={handleFlowEditDownload}
                            className="h-7 text-xs bg-purple-600/80 hover:bg-purple-600 text-white border border-purple-500/30 rounded"
                          >
                            <Download className="w-3.5 h-3.5 mr-1" />
                            Download File
                          </Button>
                        </div>
                      </div>
                      <Textarea
                        value={editorText}
                        onChange={(e) => setEditorText(e.target.value)}
                        className="flex-1 bg-transparent border-none outline-none resize-none p-4 text-xs font-mono text-slate-200 leading-relaxed placeholder:text-slate-600"
                        placeholder="Write your notes here... KFS FlowEdit automatically preserves local states."
                      />
                    </div>
                  )}

                  {/* APP 3: FILE EXPLORER CONTENT */}
                  {win.id === "explorer" && (
                    <div className="flex-1 bg-slate-950/95 flex select-none">
                      {/* Explorer Left Sidebar */}
                      <div className="w-44 border-r border-white/5 p-3 flex flex-col gap-1 shrink-0">
                        <div 
                          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs cursor-pointer transition-colors ${
                            explorerDir === "root" ? "bg-purple-600/20 text-white font-semibold" : "text-slate-400 hover:bg-white/5 hover:text-white"
                          }`}
                          onClick={() => setExplorerDir("root")}
                        >
                          <FolderOpen className="w-4 h-4 text-amber-500" />
                          <span>Quick Access</span>
                        </div>
                        <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mt-4 px-3 mb-1">
                          System Nodes
                        </span>
                        {["system", "documents", "network"].map((node) => (
                          <div 
                            key={node}
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs capitalize cursor-pointer transition-colors ${
                              explorerDir === node ? "bg-purple-600/20 text-white font-semibold" : "text-slate-400 hover:bg-white/5 hover:text-white"
                            }`}
                            onClick={() => setExplorerDir(node)}
                          >
                            <FolderClosed className="w-4 h-4 text-amber-500/80" />
                            <span>{node}</span>
                          </div>
                        ))}
                      </div>

                      {/* Explorer Files Main Grid */}
                      <div className="flex-1 flex flex-col">
                        <div className="h-10 border-b border-white/5 px-4 flex items-center gap-2 text-[10px] text-slate-400 shrink-0 select-none">
                          <span className="hover:text-white cursor-pointer" onClick={() => setExplorerDir("root")}>root</span>
                          {explorerDir !== "root" && (
                            <>
                              <span>/</span>
                              <span className="text-white font-medium">{explorerDir}</span>
                            </>
                          )}
                        </div>
                        
                        <div className="flex-1 p-4 grid grid-cols-5 auto-rows-max gap-4 overflow-y-auto">
                          {(filesDb[explorerDir as keyof typeof filesDb] || []).map((file, idx) => (
                            <div 
                              key={idx}
                              className="flex flex-col items-center justify-center p-3 rounded-xl border border-transparent hover:border-white/5 hover:bg-white/5 cursor-pointer group transition-all"
                              onDoubleClick={() => handleFileDblClick(file)}
                            >
                              <div className="w-10 h-10 flex items-center justify-center mb-2">
                                {file.type === "dir" ? (
                                  <Folder className="w-8 h-8 text-amber-500 group-hover:scale-105 transition-transform" />
                                ) : (
                                  <FileText className="w-8 h-8 text-sky-500 group-hover:scale-105 transition-transform" />
                                )}
                              </div>
                              <span className="text-[10px] text-white text-center break-all font-medium leading-tight max-w-[80px]">
                                {file.name}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* APP 4: SETTINGS CONTENT */}
                  {win.id === "settings" && (
                    <div className="flex-1 bg-slate-900/95">
                      <Tabs defaultValue="aesthetics" className="w-full h-full flex">
                        
                        {/* Tab lists */}
                        <TabsList className="w-40 border-r border-white/5 bg-transparent p-3 rounded-none flex flex-col gap-1 shrink-0 justify-start items-stretch">
                          <TabsTrigger 
                            value="aesthetics" 
                            className="justify-start gap-2 py-2 px-3 hover:bg-white/5 rounded-lg text-xs data-[state=active]:bg-purple-600/20 data-[state=active]:text-white font-medium cursor-pointer"
                          >
                            <Layers className="w-4 h-4 text-purple-400" />
                            Aesthetics
                          </TabsTrigger>
                          <TabsTrigger 
                            value="specs" 
                            className="justify-start gap-2 py-2 px-3 hover:bg-white/5 rounded-lg text-xs data-[state=active]:bg-purple-600/20 data-[state=active]:text-white font-medium cursor-pointer"
                          >
                            <Cpu className="w-4 h-4 text-emerald-400" />
                            Specs
                          </TabsTrigger>
                        </TabsList>

                        <div className="flex-1 p-6 overflow-y-auto">
                          
                          {/* Aesthetics Controls */}
                          <TabsContent value="aesthetics" className="m-0 space-y-6">
                            <div>
                              <h3 className="text-sm font-semibold text-white mb-3">Wallpaper Aesthetics</h3>
                              <div className="grid grid-cols-2 gap-3">
                                {[
                                  { id: "purple", name: "Deep Purple", grad: "from-[#090a0f] via-[#151124] to-[#2f114c]" },
                                  { id: "blue", name: "Abyssal Blue", grad: "from-[#050811] via-[#0c1c38] to-[#0d385f]" },
                                  { id: "emerald", name: "Cyber Emerald", grad: "from-[#030605] via-[#0a1f18] to-[#0f3d2f]" },
                                  { id: "sunset", name: "Neon Sunset", grad: "from-[#0a0408] via-[#1c0615] to-[#46092d]" }
                                ].map(wp => (
                                  <button
                                    key={wp.id}
                                    className={`h-10 rounded-lg bg-gradient-to-r ${wp.grad} text-[10px] font-bold text-white border-2 border-transparent transition-all cursor-pointer ${
                                      wallpaper === wp.id ? "border-[var(--accent-hex)] shadow-[0_0_12px_rgba(var(--accent-rgb),0.4)]" : "opacity-85 hover:opacity-100"
                                    }`}
                                    onClick={() => setWallpaper(wp.id as any)}
                                  >
                                    {wp.name}
                                  </button>
                                ))}
                              </div>
                            </div>

                            <Separator className="bg-white/5" />

                            <div>
                              <h3 className="text-sm font-semibold text-white mb-3">System Accent Palette</h3>
                              <div className="flex gap-4">
                                {[
                                  { id: "purple", color: "bg-purple-500 shadow-purple-500/40" },
                                  { id: "blue", color: "bg-blue-500 shadow-blue-500/40" },
                                  { id: "emerald", color: "bg-emerald-500 shadow-emerald-500/40" },
                                  { id: "rose", color: "bg-rose-500 shadow-rose-500/40" }
                                ].map(c => (
                                  <button
                                    key={c.id}
                                    className={`w-8 h-8 rounded-full cursor-pointer border-2 border-transparent ${c.color} shadow-lg transition-transform active:scale-90 ${
                                      accent === c.id ? "border-white scale-110" : "hover:scale-105"
                                    }`}
                                    onClick={() => setAccent(c.id as any)}
                                  />
                                ))}
                              </div>
                            </div>

                            <Separator className="bg-white/5" />

                            <div className="space-y-2">
                              <div className="flex justify-between items-center text-xs font-semibold text-slate-400">
                                <span>Glassmorphism Blur Strength</span>
                                <span className="text-white font-mono">{blurIntensity}px</span>
                              </div>
                              <Slider
                                min={5}
                                max={30}
                                step={1}
                                value={[blurIntensity]}
                                onValueChange={(val: any) => setBlurIntensity(Array.isArray(val) ? val[0] : val)}
                                className="cursor-pointer py-2"
                              />
                            </div>
                          </TabsContent>

                          {/* Diagnostics Specs */}
                          <TabsContent value="specs" className="m-0">
                            <Card className="bg-black/20 border-white/5 text-white">
                              <CardHeader className="p-4 border-b border-white/5 select-none">
                                <CardTitle className="text-sm font-bold flex items-center gap-2">
                                  <Monitor className="w-4 h-4 text-emerald-400" />
                                  System Diagnostics
                                </CardTitle>
                                <CardDescription className="text-[10px] text-slate-400">
                                  Live Node Control Specifications
                                </CardDescription>
                              </CardHeader>
                              <CardContent className="p-4 space-y-3 font-mono text-[11px]">
                                <div className="flex justify-between border-b border-white/5 pb-2">
                                  <span className="text-slate-400">BOS Shell Name:</span>
                                  <span className="font-semibold">KFS OS Next-Platform</span>
                                </div>
                                <div className="flex justify-between border-b border-white/5 pb-2">
                                  <span className="text-slate-400">Core Architecture:</span>
                                  <span className="font-semibold">NextJS App Router 16</span>
                                </div>
                                <div className="flex justify-between border-b border-white/5 pb-2">
                                  <span className="text-slate-400">Styling Compositor:</span>
                                  <span className="font-semibold">Tailwind CSS v4 + Radix UI</span>
                                </div>
                                <div className="flex justify-between border-b border-white/5 pb-2">
                                  <span className="text-slate-400">Logical Cores:</span>
                                  <span className="font-semibold">{navigator.hardwareConcurrency || 16} Threads</span>
                                </div>
                                <div className="flex justify-between border-b border-white/5 pb-2">
                                  <span className="text-slate-400">Graphics Composite:</span>
                                  <span className="font-semibold">HTML Canvas / WebGL Layer</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-slate-400">Host Agent Device:</span>
                                  <span className="font-semibold">{browserSpec}</span>
                                </div>
                              </CardContent>
                            </Card>
                          </TabsContent>

                        </div>
                      </Tabs>
                    </div>
                  )}

                </div>
              </div>
            );
          })}

        </div>

        {/* 3. Start Menu Floating Panel */}
        <div 
          style={{
            backdropFilter: `blur(${blurIntensity}px)`,
            WebkitBackdropFilter: `blur(${blurIntensity}px)`
          }}
          className={`absolute left-1/2 -translate-x-1/2 w-[340px] h-[390px] rounded-t-3xl rounded-b-xl border border-white/10 glass-panel flex flex-col overflow-hidden z-[1000] duration-300 cubic-bezier(0.1, 0.9, 0.2, 1) transition-all ${
            startMenuOpen ? "bottom-[72px] opacity-100" : "-bottom-[420px] opacity-0"
          }`}
        >
          <div className="h-16 bg-black/20 border-b border-white/5 flex items-center px-4 gap-3 select-none">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-600 shadow-md shadow-purple-500/30 flex items-center justify-center font-bold text-white text-sm">
              K
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-white leading-none">KFS Administrator</span>
              <span className="text-[10px] text-slate-400 mt-1">Node Controller</span>
            </div>
          </div>
          
          <div className="flex-1 p-4 grid grid-cols-2 gap-3 auto-rows-max overflow-y-auto">
            {[
              { id: "terminal", icon: <TerminalIcon className="w-5 h-5" />, label: "Terminal" },
              { id: "editor", icon: <FileText className="w-5 h-5" />, label: "FlowEdit" },
              { id: "explorer", icon: <FolderOpen className="w-5 h-5" />, label: "Explorer" },
              { id: "settings", icon: <SettingsIcon className="w-5 h-5" />, label: "Settings" }
            ].map(app => (
              <div
                key={app.id}
                className="flex items-center gap-3 p-3 bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 rounded-xl cursor-pointer transition-all active:scale-95 group"
                onClick={() => openApp(app.id)}
              >
                <div className="text-[var(--accent-hex)] group-hover:scale-105 transition-transform">
                  {app.icon}
                </div>
                <span className="text-xs text-white font-medium">{app.label}</span>
              </div>
            ))}
          </div>

          <div className="h-10 bg-black/20 border-t border-white/5 flex items-center justify-between px-4 text-[10px] text-slate-400 shrink-0 select-none">
            <div className="flex items-center gap-1">
              <span>Uptime:</span>
              <span className="font-mono text-white font-bold">{formatUptime(uptime)}</span>
            </div>
            <span className="text-[9px] text-slate-500">Kreatek Flow Systems</span>
          </div>
        </div>

        {/* 4. Center-Aligned MacOS Style Taskbar */}
        <div 
          style={{
            backdropFilter: `blur(${blurIntensity}px)`,
            WebkitBackdropFilter: `blur(${blurIntensity}px)`
          }}
          className="absolute bottom-3 left-1/2 -translate-x-1/2 w-[calc(100%-24px)] max-w-[620px] h-14 rounded-full border border-white/10 glass-panel flex items-center justify-between px-4 z-[10000] select-none"
        >
          {/* Start Toggle Button */}
          <button 
            className={`w-9 h-9 rounded-xl flex items-center justify-center cursor-pointer transition-all hover:bg-white/10 border ${
              startMenuOpen 
                ? "border-[rgba(var(--accent-rgb),0.5)] bg-[rgba(var(--accent-rgb),0.2)] text-white shadow-[0_0_12px_rgba(var(--accent-rgb),0.35)]" 
                : "border-white/10 bg-white/5 text-slate-300"
            }`}
            onClick={() => setStartMenuOpen(!startMenuOpen)}
          >
            {/* Custom Grid Start Icon */}
            <div className="grid grid-cols-2 gap-0.5 w-4 h-4 text-[var(--accent-hex)]">
              <span className="border border-current rounded-[1px] bg-current opacity-80" />
              <span className="border border-current rounded-[1px] bg-current opacity-85" />
              <span className="border border-current rounded-[1px] bg-current opacity-90" />
              <span className="border border-current rounded-[1px] bg-current opacity-95" />
            </div>
          </button>

          <Separator orientation="vertical" className="bg-white/10 h-6 mx-2" />

          {/* Running & Pinned Apps Icons Tray */}
          <div className="flex items-center gap-3">
            {[
              { id: "terminal", icon: <TerminalIcon className="w-5 h-5" />, label: "Terminal" },
              { id: "editor", icon: <FileText className="w-5 h-5" />, label: "FlowEdit" },
              { id: "explorer", icon: <FolderOpen className="w-5 h-5" />, label: "Explorer" },
              { id: "settings", icon: <SettingsIcon className="w-5 h-5" />, label: "Settings" }
            ].map(app => {
              const win = windows.find(w => w.id === app.id);
              const isRunning = win?.isOpen;
              const isActive = isRunning && !win.isMinimized && activeWindow === app.id;

              return (
                <button
                  key={app.id}
                  onClick={() => toggleApp(app.id)}
                  className={`w-9 h-9 rounded-xl flex flex-col items-center justify-center cursor-pointer relative hover:-translate-y-0.5 transition-all text-slate-400 hover:text-white ${
                    isActive ? "bg-white/10 text-white" : ""
                  }`}
                  title={app.label}
                >
                  {app.icon}
                  {/* Active Indicator Dot */}
                  {isRunning && (
                    <span 
                      className={`absolute bottom-0.5 rounded-full transition-all ${
                        isActive 
                          ? "w-2.5 h-1 bg-[var(--accent-hex)] shadow-[0_0_8px_var(--accent-hex)]" 
                          : "w-1.5 h-1.5 bg-slate-400"
                      }`}
                    />
                  )}
                </button>
              );
            })}
          </div>

          <Separator orientation="vertical" className="bg-white/10 h-6 mx-2" />

          {/* Tray Widgets Clock / Date */}
          <div className="flex items-center gap-3">
            <div className="flex gap-2">
              <span title="Connected to KFS Cloud Uplink">
                <Wifi className="w-4 h-4 text-slate-400 hover:text-white cursor-pointer" />
              </span>
              <span title="Volume: 100%">
                <Volume2 className="w-4 h-4 text-slate-400 hover:text-white cursor-pointer" />
              </span>
            </div>
            
            <Separator orientation="vertical" className="bg-white/10 h-4" />

            <div 
              className="flex flex-col items-end justify-center cursor-pointer select-none pl-1"
              title="Show Calendar"
            >
              <span className="text-[10px] font-bold text-white font-mono leading-none tracking-tight">
                {currentTime}
              </span>
              <span className="text-[8px] text-slate-400 mt-0.5 leading-none">
                {currentDate}
              </span>
            </div>
          </div>

        </div>

      </div>

      {/* Cybernetic Gradient Wallpaper Layer */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className={`absolute inset-0 z-0 theme-${wallpaper}`} id="desktop-wallpaper" />
        <div className="absolute inset-0 bg-transparent bg-[radial-gradient(rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:32px_32px] z-1" />
      </div>
    </div>
  );
}
