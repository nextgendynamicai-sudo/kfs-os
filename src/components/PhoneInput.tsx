"use client";

import React, { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";

export interface PhoneInputProps {
  value: string;
  onChange: (fullNumber: string) => void;
  placeholder?: string;
  required?: boolean;
  className?: string;
  inputClassName?: string;
  selectClassName?: string;
  disabled?: boolean;
  name?: string;
  variant?: "dark" | "light";
}

export const COUNTRY_CODES = [
  { code: "+58", flag: "🇻🇪", country: "Venezuela", label: "🇻🇪 +58" },
  { code: "+57", flag: "🇨🇴", country: "Colombia", label: "🇨🇴 +57" },
  { code: "+1", flag: "🇺🇸", country: "EE.UU. / Canadá", label: "🇺🇸 +1" },
  { code: "+34", flag: "🇪🇸", country: "España", label: "🇪🇸 +34" },
  { code: "+51", flag: "🇵🇪", country: "Perú", label: "🇵🇪 +51" },
  { code: "+56", flag: "🇨🇱", country: "Chile", label: "🇨🇱 +56" },
  { code: "+54", flag: "🇦🇷", country: "Argentina", label: "🇦🇷 +54" },
  { code: "+52", flag: "🇲🇽", country: "México", label: "🇲🇽 +52" },
  { code: "+593", flag: "🇪🇨", country: "Ecuador", label: "🇪🇨 +593" },
  { code: "+507", flag: "🇵🇦", country: "Panamá", label: "🇵🇦 +507" },
  { code: "+1809", flag: "🇩🇴", country: "Rep. Dominicana", label: "🇩🇴 +1-809" },
];

/**
 * Parses an incoming full phone string into country prefix & body.
 * E.g. "+5841225222547" -> { prefix: "+58", body: "41225222547" }
 */
export function parsePhoneNumber(fullVal: string = ""): { prefix: string; body: string } {
  if (!fullVal) return { prefix: "+58", body: "" };
  
  const trimmed = fullVal.trim();
  const matchedCountry = COUNTRY_CODES.find(c => trimmed.startsWith(c.code));
  
  if (matchedCountry) {
    const body = trimmed.slice(matchedCountry.code.length).replace(/[^0-9]/g, "");
    return { prefix: matchedCountry.code, body };
  }
  
  // If it starts with +, but unrecognized prefix, or raw digits like 04141234567
  const digitsOnly = trimmed.replace(/[^0-9]/g, "");
  if (digitsOnly.startsWith("58") && digitsOnly.length >= 10) {
    return { prefix: "+58", body: digitsOnly.slice(2) };
  }
  
  return { prefix: "+58", body: digitsOnly };
}

/**
 * Formats prefix + body into standard international string: "+5841225222547"
 */
export function formatFullPhoneNumber(prefix: string, body: string): string {
  const cleanBody = body.replace(/[^0-9]/g, "");
  if (!cleanBody) return "";
  
  // If user typed 0414..., strip leading 0 when prefixing country code
  const bodyNoZero = cleanBody.startsWith("0") ? cleanBody.slice(1) : cleanBody;
  return `${prefix}${bodyNoZero}`;
}

export function PhoneInput({
  value,
  onChange,
  placeholder = "4141234567",
  required = false,
  className = "",
  inputClassName = "",
  selectClassName = "",
  disabled = false,
  name,
  variant = "light"
}: PhoneInputProps) {
  const { prefix: initialPrefix, body: initialBody } = parsePhoneNumber(value);
  
  const [selectedPrefix, setSelectedPrefix] = useState(initialPrefix);
  const [localBody, setLocalBody] = useState(initialBody);

  useEffect(() => {
    const parsed = parsePhoneNumber(value);
    setSelectedPrefix(parsed.prefix);
    setLocalBody(parsed.body);
  }, [value]);

  const handlePrefixChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newPrefix = e.target.value;
    setSelectedPrefix(newPrefix);
    const full = formatFullPhoneNumber(newPrefix, localBody);
    onChange(full);
  };

  const handleBodyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newBody = e.target.value.replace(/[^0-9]/g, "");
    setLocalBody(newBody);
    const full = formatFullPhoneNumber(selectedPrefix, newBody);
    onChange(full);
  };

  const isDark = variant === "dark";
  const fullNumber = formatFullPhoneNumber(selectedPrefix, localBody);

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {name && <input type="hidden" name={name} value={fullNumber} />}
      
      {/* Selector de Código de País */}
      <div className="relative flex-shrink-0">
        <select
          value={selectedPrefix}
          onChange={handlePrefixChange}
          disabled={disabled}
          className={`appearance-none font-bold text-xs cursor-pointer py-3 pl-3 pr-7 rounded-xl border focus:outline-none transition-all ${
            isDark
              ? "bg-slate-900 border-slate-800 text-white focus:border-violet-500"
              : "bg-violet-50/50 border-violet-100 text-violet-950 focus:border-violet-400"
          } ${selectClassName}`}
        >
          {COUNTRY_CODES.map((c) => (
            <option key={c.code} value={c.code} className={isDark ? "bg-slate-950 text-white" : "bg-white text-slate-900"}>
              {c.flag} {c.code}
            </option>
          ))}
        </select>
        <ChevronDown
          size={14}
          className={`absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none ${
            isDark ? "text-slate-400" : "text-violet-500"
          }`}
        />
      </div>

      {/* Input de Número Local */}
      <div className="relative flex-1">
        <input
          type="tel"
          required={required}
          disabled={disabled}
          value={localBody}
          onChange={handleBodyChange}
          placeholder={placeholder}
          className={`w-full font-medium text-sm py-3 px-4 rounded-xl border focus:outline-none transition-all ${
            isDark
              ? "bg-slate-900/50 border-slate-800 text-white placeholder:text-slate-500 focus:border-violet-500"
              : "bg-violet-50/50 border-violet-100 text-violet-950 placeholder:text-slate-400 focus:border-violet-400 focus:ring-1 focus:ring-violet-400"
          } ${inputClassName}`}
        />
      </div>
    </div>
  );
}
