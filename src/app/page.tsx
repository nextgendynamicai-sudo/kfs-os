"use client";

import React from "react";
import { Sparkles, Globe, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <main className="relative min-h-screen flex items-center justify-center bg-[#030712] overflow-hidden text-slate-100 font-sans">
      {/* Background Gradient Orbs */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[30rem] h-[30rem] rounded-full bg-purple-500/10 blur-[100px] pointer-events-none animate-pulse duration-[6000ms]" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[30rem] h-[30rem] rounded-full bg-blue-500/10 blur-[100px] pointer-events-none animate-pulse duration-[8000ms]" />

      <div className="relative z-10 max-w-md w-full mx-4 p-8 rounded-3xl bg-slate-900/40 border border-white/5 backdrop-blur-xl shadow-2xl flex flex-col items-center text-center transition-all duration-300 hover:border-purple-500/20 hover:shadow-purple-500/5 group">
        
        {/* Glow Header Icon */}
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-600 to-blue-500 flex items-center justify-center shadow-lg shadow-purple-500/20 group-hover:scale-105 transition-transform duration-500">
          <Globe className="w-8 h-8 text-white animate-spin" style={{ animationDuration: '20s' }} />
        </div>

        {/* Title */}
        <h1 className="mt-8 text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
          Hello World
        </h1>

        {/* Subtitle */}
        <p className="mt-4 text-slate-400 text-sm leading-relaxed max-w-sm">
          A fresh, clean slate initialized with Next.js, React, Tailwind CSS, and Shadcn UI. Ready to build something extraordinary.
        </p>

        {/* Decorative Badge */}
        <div className="mt-6 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-purple-300">
          <Sparkles className="w-3.5 h-3.5" />
          <span>System Initialized</span>
        </div>

        {/* Bottom divider line */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-8" />

        {/* Action button */}
        <button 
          onClick={() => alert("Ready to customize! Start by editing src/app/page.tsx")}
          className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 rounded-xl bg-white text-slate-900 font-semibold hover:bg-slate-100 transition-colors shadow-lg shadow-white/5 hover:shadow-white/10 cursor-pointer"
        >
          <span>Get Started</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </main>
  );
}
