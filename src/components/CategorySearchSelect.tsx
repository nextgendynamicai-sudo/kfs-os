"use client";

import React, { useState, useRef, useEffect } from "react";
import { Search, ChevronDown, Check, X, Sparkles, Tag } from "lucide-react";
import { 
  BUSINESS_CATEGORIES, 
  BUSINESS_CATEGORY_MAP, 
  BusinessCategoryInfo, 
  searchBusinessCategories,
  getCategoryPreset 
} from "../lib/businessCategories";

interface CategorySearchSelectProps {
  value: string;
  onChange: (categoryKey: string) => void;
  label?: string;
  required?: boolean;
  className?: string;
  placeholder?: string;
}

export const CategorySearchSelect: React.FC<CategorySearchSelectProps> = ({
  value,
  onChange,
  label = "Rubro / Categoría *",
  required = true,
  className = "",
  placeholder = "Buscar rubro o producto (ej: farmacia, repuestos, pan, cerveza, perro, tenis)..."
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Active category info
  const activeCategory: BusinessCategoryInfo = getCategoryPreset(value);

  // Filtered categories based on real-time search
  const filteredCategories = searchBusinessCategories(searchQuery);

  // Popular quick-selection chips
  const popularKeys = ["bodegon", "comida", "farmacia", "automotriz", "tecnologia", "mascotas", "ropa"];
  const popularCategories = popularKeys
    .map(key => BUSINESS_CATEGORY_MAP[key])
    .filter(Boolean);

  // Handle outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setHighlightedIndex(0);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    } else {
      setSearchQuery("");
    }
  }, [isOpen]);

  // Scroll highlighted item into view
  useEffect(() => {
    if (isOpen && listRef.current) {
      const items = listRef.current.querySelectorAll<HTMLButtonElement>("[data-category-item]");
      if (items[highlightedIndex]) {
        items[highlightedIndex].scrollIntoView({ block: "nearest" });
      }
    }
  }, [highlightedIndex, isOpen]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === "Enter" || e.key === "ArrowDown" || e.key === " ") {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex(prev => (prev + 1) % Math.max(1, filteredCategories.length));
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex(prev => (prev - 1 + filteredCategories.length) % Math.max(1, filteredCategories.length));
        break;
      case "Enter":
        e.preventDefault();
        if (filteredCategories[highlightedIndex]) {
          handleSelect(filteredCategories[highlightedIndex].key);
        }
        break;
      case "Escape":
        e.preventDefault();
        setIsOpen(false);
        break;
    }
  };

  const handleSelect = (catKey: string) => {
    onChange(catKey);
    setIsOpen(false);
    setSearchQuery("");
  };

  return (
    <div className={`relative ${className}`} ref={containerRef} onKeyDown={handleKeyDown}>
      {label && (
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
            <span>{label}</span>
          </label>
          <span className="text-[10px] font-medium text-slate-500">
            {BUSINESS_CATEGORIES.length} rubros comerciales
          </span>
        </div>
      )}

      {/* Main Selector Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className={`w-full bg-slate-950 border transition-all rounded-xl px-4 py-3 text-xs text-white font-bold cursor-pointer flex items-center justify-between gap-3 group text-left ${
          isOpen 
            ? "border-amber-400 ring-2 ring-amber-400/20 shadow-lg shadow-amber-500/10" 
            : "border-slate-800 hover:border-slate-700 hover:bg-slate-900/60"
        }`}
      >
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <span className="text-base shrink-0 leading-none">{activeCategory.emoji}</span>
          <span className="truncate text-white font-bold">{activeCategory.name.replace(/^..\s*/, '')}</span>
          <span 
            className="w-2.5 h-2.5 rounded-full shrink-0 ml-1 border border-white/20"
            style={{ backgroundColor: activeCategory.color }}
            title={`Color sugerido: ${activeCategory.color}`}
          />
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-slate-800/80 text-slate-400 group-hover:text-amber-300 transition-colors">
            Cambiar
          </span>
          <ChevronDown 
            size={16} 
            className={`text-slate-400 transition-transform duration-200 ${isOpen ? "rotate-180 text-amber-400" : "group-hover:text-slate-200"}`} 
          />
        </div>
      </button>

      {/* Dropdown Floating Panel */}
      {isOpen && (
        <div className="absolute z-50 left-0 right-0 mt-2 bg-slate-950/95 backdrop-blur-2xl border border-slate-700/80 rounded-2xl shadow-2xl shadow-black/80 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          {/* Search Header */}
          <div className="p-3 border-b border-slate-800/80 bg-slate-900/60">
            <div className="relative flex items-center">
              <Search size={15} className="absolute left-3 text-amber-400 shrink-0 pointer-events-none" />
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={e => {
                  setSearchQuery(e.target.value);
                  setHighlightedIndex(0);
                }}
                placeholder={placeholder}
                className="w-full bg-slate-950 border border-slate-800 focus:border-amber-400 rounded-xl pl-9 pr-8 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-400/30 transition-all font-medium"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    inputRef.current?.focus();
                  }}
                  className="absolute right-2.5 text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-800 transition-colors"
                >
                  <X size={13} />
                </button>
              )}
            </div>

            {/* Popular Quick Chips (when not actively searching) */}
            {!searchQuery && (
              <div className="mt-2 pt-2 border-t border-slate-800/40">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <Sparkles size={11} className="text-amber-400" />
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Más populares:
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {popularCategories.map(cat => (
                    <button
                      key={cat.key}
                      type="button"
                      onClick={() => handleSelect(cat.key)}
                      className={`text-[11px] px-2.5 py-1 rounded-lg font-bold transition-all flex items-center gap-1 border cursor-pointer ${
                        cat.key === value
                          ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                          : "bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700 hover:bg-slate-800 hover:text-white"
                      }`}
                    >
                      <span>{cat.emoji}</span>
                      <span>{cat.shortName}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Results Summary Bar */}
          <div className="px-3 py-1.5 bg-slate-950/80 border-b border-slate-800/40 flex items-center justify-between text-[10px] text-slate-400 font-medium">
            <span>
              {filteredCategories.length === 1 
                ? "1 rubro coincidente" 
                : `${filteredCategories.length} rubros disponibles`}
            </span>
            {searchQuery && (
              <span className="text-amber-400 font-mono">
                Filtrado por &ldquo;{searchQuery}&rdquo;
              </span>
            )}
          </div>

          {/* Scrollable Categories List */}
          <div 
            ref={listRef}
            className="max-h-60 overflow-y-auto p-1.5 space-y-1 custom-scrollbar"
            role="listbox"
          >
            {filteredCategories.length > 0 ? (
              filteredCategories.map((cat, idx) => {
                const isSelected = cat.key === value;
                const isHighlighted = idx === highlightedIndex;

                return (
                  <button
                    key={cat.key}
                    type="button"
                    data-category-item
                    onClick={() => handleSelect(cat.key)}
                    onMouseEnter={() => setHighlightedIndex(idx)}
                    role="option"
                    aria-selected={isSelected}
                    className={`w-full px-3 py-2.5 rounded-xl text-left transition-all flex items-center justify-between gap-3 cursor-pointer group border ${
                      isSelected
                        ? "bg-amber-500/15 border-amber-500/30 text-white shadow-sm"
                        : isHighlighted
                        ? "bg-slate-800/80 border-slate-700 text-white"
                        : "border-transparent text-slate-300 hover:bg-slate-900/80 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div 
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-lg shrink-0 border border-white/10"
                        style={{ backgroundColor: `${cat.color}22` }}
                      >
                        {cat.emoji}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold truncate text-white">
                            {cat.name.replace(/^..\s*/, '')}
                          </span>
                          <span 
                            className="w-2 h-2 rounded-full shrink-0" 
                            style={{ backgroundColor: cat.color }} 
                            title={`Color de marca: ${cat.color}`}
                          />
                        </div>
                        <p className="text-[10px] text-slate-400 truncate mt-0.5 font-normal">
                          {cat.defaultProds.map(p => p.name).slice(0, 3).join(" • ")}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {isSelected && (
                        <span className="flex items-center gap-1 text-[10px] font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-md border border-amber-400/20">
                          <Check size={12} />
                          <span>Activo</span>
                        </span>
                      )}
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="py-8 px-4 text-center">
                <p className="text-xs text-slate-400 font-medium">
                  No se encontró ningún rubro coincidente con &ldquo;{searchQuery}&rdquo;.
                </p>
                <p className="text-[11px] text-slate-500 mt-1">
                  Intenta buscar por producto (ej: pan, aceite, pastillas, frenos, perro, cargador).
                </p>
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-amber-400 font-bold transition-colors cursor-pointer border border-slate-700"
                >
                  <X size={12} />
                  <span>Ver todos los rubros</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
