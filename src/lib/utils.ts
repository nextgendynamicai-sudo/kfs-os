import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const compressImage = (file: File, maxWidth: number = 500, quality: number = 0.7): Promise<string> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const scaleSize = maxWidth / img.width;
        if (scaleSize < 1) {
          canvas.width = maxWidth;
          canvas.height = img.height * scaleSize;
        } else {
          canvas.width = img.width;
          canvas.height = img.height;
        }
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
};

export const readAsBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};

export const playPremiumChime = () => {
  if (typeof window === "undefined") return;
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    
    const playNote = (frequency: number, delay: number, duration: number) => {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      osc.type = "sine";
      osc.frequency.setValueAtTime(frequency, ctx.currentTime + delay);
      
      gainNode.gain.setValueAtTime(0, ctx.currentTime + delay);
      gainNode.gain.linearRampToValueAtTime(0.2, ctx.currentTime + delay + 0.05); // attack
      gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + delay + duration); // decay
      
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      osc.start(ctx.currentTime + delay);
      osc.stop(ctx.currentTime + delay + duration);
    };
    
    // Play a gorgeous progressive C major chord
    playNote(261.63, 0.0, 1.2); // C4
    playNote(329.63, 0.1, 1.2); // E4
    playNote(392.00, 0.2, 1.2); // G4
    playNote(523.25, 0.3, 1.5); // C5
  } catch (e) {
    console.error("Audio Context not supported", e);
  }
};

export const playSyncChime = () => {
  if (typeof window === "undefined") return;
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    
    const playNote = (frequency: number, delay: number, duration: number) => {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      osc.type = "sine";
      osc.frequency.setValueAtTime(frequency, ctx.currentTime + delay);
      
      gainNode.gain.setValueAtTime(0, ctx.currentTime + delay);
      gainNode.gain.linearRampToValueAtTime(0.15, ctx.currentTime + delay + 0.03); // quick attack
      gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + delay + duration); // decay
      
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      osc.start(ctx.currentTime + delay);
      osc.stop(ctx.currentTime + delay + duration);
    };
    
    playNote(392.00, 0.0, 0.6); // G4
    playNote(523.25, 0.08, 0.6); // C5
    playNote(659.25, 0.16, 0.6); // E5
    playNote(783.99, 0.24, 1.0); // G5
  } catch (e) {
    console.error("Audio Context error", e);
  }
};

export const playCashDrawerSound = () => {
  if (typeof window === "undefined") return;
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    osc.type = "triangle";
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1500, ctx.currentTime + 0.1);
    
    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.02);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.25);
    
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.25);
  } catch (e) {}
};

export const playScannerBeep = () => {
  if (typeof window === "undefined") return;
  try {
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate(50);
    }
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    osc.type = "sine";
    osc.frequency.setValueAtTime(1200, ctx.currentTime);
    
    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.25, ctx.currentTime + 0.005); // sharp attack
    gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.07); // short beep
    
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.08);
  } catch (e) {
    console.error("Scanner beep audio error", e);
  }
};

export const speakText = (text: string) => {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  try {
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "es-VE";
    
    // Find a Spanish voice if possible
    const voices = window.speechSynthesis.getVoices();
    const esVoice = voices.find(v => v.lang.startsWith("es-VE")) || 
                    voices.find(v => v.lang.startsWith("es")) ||
                    voices.find(v => v.lang.includes("Spanish"));
    if (esVoice) {
      utterance.voice = esVoice;
    }
    
    utterance.rate = 1.05; // Slightly faster but clean and direct
    utterance.pitch = 1.0;
    
    window.speechSynthesis.speak(utterance);
  } catch (e) {
    console.error("Speech synthesis failed", e);
  }
};

export const getStoreCoords = (clientId: string): { lat: number; lng: number } => {
  let hash = 0;
  const str = clientId || "default_store";
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  // Lat: 10.4700 to 10.4900
  // Lng: -66.9200 to -66.8600 (Caracas area)
  const lat = 10.4700 + (Math.abs(hash % 1000) / 1000) * 0.0200;
  const lng = -66.9200 + (Math.abs((hash >> 8) % 1000) / 1000) * 0.0600;
  return { lat, lng };
};

export const getCustomerCoords = (phoneOrId: string): { lat: number; lng: number } => {
  let hash = 0;
  const str = phoneOrId || "default_customer";
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  // Lat: 10.4900 to 10.5100 (slightly North of stores)
  // Lng: -66.9200 to -66.8600 (Caracas area)
  const lat = 10.4900 + (Math.abs(hash % 1000) / 1000) * 0.0200;
  const lng = -66.9200 + (Math.abs((hash >> 8) % 1000) / 1000) * 0.0600;
  return { lat, lng };
};


