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
        
        // Strict 4:5 Aspect Ratio target (width = 4, height = 5) -> targetRatio = 0.8
        const targetRatio = 4 / 5;
        const sourceRatio = img.width / img.height;
        
        let cropWidth = img.width;
        let cropHeight = img.height;
        let cropX = 0;
        let cropY = 0;

        if (sourceRatio > targetRatio) {
          // Image is too wide, bottleneck is height
          cropHeight = img.height;
          cropWidth = cropHeight * targetRatio;
          cropX = (img.width - cropWidth) / 2;
        } else {
          // Image is too tall, bottleneck is width
          cropWidth = img.width;
          cropHeight = cropWidth / targetRatio;
          cropY = (img.height - cropHeight) / 2;
        }

        // Output canvas dimensions
        canvas.width = maxWidth;
        canvas.height = maxWidth / targetRatio;

        const ctx = canvas.getContext('2d');
        // Draw cropped and scaled image
        ctx?.drawImage(img, cropX, cropY, cropWidth, cropHeight, 0, 0, canvas.width, canvas.height);
        
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

export function hashPasswordSecure(password: string): string {
  function rotateRight(n: number, x: number) {
    return (x >>> n) | (x << (32 - n));
  }
  
  const K = [
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
    0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
  ];

  let H = [
    0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19
  ];

  const words: number[] = [];
  const ascii = password;
  for (let i = 0; i < ascii.length; i++) {
    words[i >>> 2] |= (ascii.charCodeAt(i) & 0xff) << (24 - (i % 4) * 8);
  }
  
  const asciiBitLength = ascii.length * 8;
  const wordCount = ((ascii.length + 9) >>> 6 << 4) + 16;
  
  words[ascii.length >>> 2] |= 0x80 << (24 - (ascii.length % 4) * 8);
  words[wordCount - 1] = asciiBitLength;

  const w: number[] = new Array(64);
  for (let i = 0; i < words.length; i += 16) {
    let a = H[0], b = H[1], c = H[2], d = H[3], e = H[4], f = H[5], g = H[6], h = H[7];

    for (let j = 0; j < 64; j++) {
      if (j < 16) {
        w[j] = words[i + j] || 0;
      } else {
        const s0 = rotateRight(7, w[j - 15]) ^ rotateRight(18, w[j - 15]) ^ (w[j - 15] >>> 3);
        const s1 = rotateRight(17, w[j - 2]) ^ rotateRight(19, w[j - 2]) ^ (w[j - 2] >>> 10);
        w[j] = (w[j - 16] + s0 + w[j - 7] + s1) | 0;
      }

      const S1 = rotateRight(6, e) ^ rotateRight(11, e) ^ rotateRight(25, e);
      const ch = (e & f) ^ (~e & g);
      const temp1 = (h + S1 + ch + K[j] + w[j]) | 0;
      const S0 = rotateRight(2, a) ^ rotateRight(13, a) ^ rotateRight(22, a);
      const maj = (a & b) ^ (a & c) ^ (b & c);
      const temp2 = (S0 + maj) | 0;

      h = g;
      g = f;
      f = e;
      e = (d + temp1) | 0;
      d = c;
      c = b;
      b = a;
      a = (temp1 + temp2) | 0;
    }

    H[0] = (H[0] + a) | 0;
    H[1] = (H[1] + b) | 0;
    H[2] = (H[2] + c) | 0;
    H[3] = (H[3] + d) | 0;
    H[4] = (H[4] + e) | 0;
    H[5] = (H[5] + f) | 0;
    H[6] = (H[6] + g) | 0;
    H[7] = (H[7] + h) | 0;
  }

  return H.map(x => {
    const hex = (x >>> 0).toString(16);
    return "00000000".slice(hex.length) + hex;
  }).join("");
}

export function comparePasswordSecure(password: string, hash: string): boolean {
  return hashPasswordSecure(password) === hash;
}


