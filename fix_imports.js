// Script to clean bloated imports from all KFS OS component files
// Run with: bun run fix_imports.js

const fs = require('fs');
const path = require('path');

const COMPONENTS_DIR = path.join(__dirname, 'src', 'components');

// The bloated import block that appears in all these files (exact match for the common pattern)
const BLOATED_IMPORT_PATTERN = /^"use client";\s*\n\s*\nimport { KFS_BRAND }[^]*?\/\/ ==========================================\n\/\/ UTILITIES\n\/\/ ==========================================\n/m;

const BLOATED_IMPORT_PATTERN_2 = /^"use client";\s*\n\s*\nimport React[^]*?\/\/ ==========================================\n\/\/ UTILITIES\n\/\/ ==========================================\n/m;

// Files to clean - all files that have the bloated import pattern
const FILES_TO_CLEAN = [
  'StorefrontCustomizer.tsx',
  'ScannerView.tsx',
  'SMSConciliatorSimulator.tsx',
  'RegisterPromotoraForm.tsx',
  'RegisterRiderForm.tsx',
  'RegisterCustomerForm.tsx',
  'RegisterClientForm.tsx',
  'RecruitmentWidget.tsx',
  'OnboardingWizard.tsx',
  'KFSIoTEdgeConsole.tsx',
  'KFSFinancialSplitCalculator.tsx',
  'CvViewerModal.tsx',
];

for (const fileName of FILES_TO_CLEAN) {
  const filePath = path.join(COMPONENTS_DIR, fileName);
  if (!fs.existsSync(filePath)) {
    console.log(`SKIP: ${fileName} not found`);
    continue;
  }
  
  const content = fs.readFileSync(filePath, 'utf-8');
  
  // Find where the actual export starts
  const exportMatch = content.match(/\nexport\s+(const|function|default)/);
  if (!exportMatch) {
    console.log(`SKIP: ${fileName} - no export found`);
    continue;
  }
  
  const exportIndex = content.indexOf(exportMatch[0]);
  const componentBody = content.slice(exportIndex);
  
  // Analyze what the component body actually uses
  const usedLucideIcons = [];
  const allLucideIcons = [
    'Camera', 'Upload', 'ShoppingCart', 'TrendingUp', 'Users', 'DollarSign',
    'LogOut', 'Shield', 'Package', 'Activity', 'Search', 'QrCode', 'Lock',
    'ChevronRight', 'CheckCircle', 'CreditCard', 'Bell', 'X', 'Info',
    'Store', 'Star', 'ChevronLeft', 'Clock', 'UserCheck', 'Palette',
    'Zap', 'BookOpen', 'Printer', 'Smartphone', 'Settings', 'DownloadCloud', 'Terminal', 'Truck',
    'Briefcase', 'FileText', 'Award', 'Check', 'ArrowUpRight', 'WifiOff', 'Gift', 'MapPin', 
    'UserPlus', 'LogIn', 'Eye', 'Database', 'Trash2', 'ChevronDown', 'ChevronUp',
    'Copy', 'Share2', 'ExternalLink', 'Plus', 'Minus', 'RefreshCw', 'AlertCircle',
    'AlertTriangle', 'ArrowLeft', 'ArrowRight', 'Sparkles', 'Link2', 'Hash', 'Globe',
    'Heart', 'Phone', 'Mail', 'Calendar', 'Edit', 'Edit2', 'Edit3',
    'MessageSquare', 'Send', 'Image', 'PlayCircle', 'PauseCircle', 'StopCircle',
    'Wifi', 'Bluetooth', 'Monitor', 'Cpu', 'HardDrive', 'Key',
    'BarChart2', 'PieChart', 'TrendingDown', 'Percent', 'CircleDollarSign',
    'Target', 'Crosshair', 'Navigation', 'Layers', 'Grid',
    'ChevronRightCircle', 'ArrowDown', 'ArrowUp'
  ];
  
  for (const icon of allLucideIcons) {
    // Match the icon being used as a JSX component <Icon or as a reference {Icon}
    const regex = new RegExp(`<${icon}[\\s/>]|\\{${icon}\\}|${icon}\\s*size=`, 'g');
    if (regex.test(componentBody)) {
      usedLucideIcons.push(icon);
    }
  }
  
  // Check for other imports needed
  const needsKFS = componentBody.includes('useKFS');
  const needsKFSBrand = componentBody.includes('KFS_BRAND');
  const needsMotion = componentBody.includes('motion.') || componentBody.includes('<motion') || componentBody.includes('AnimatePresence');
  const needsSupabase = componentBody.includes('supabase');
  const needsRecharts = componentBody.includes('AreaChart') || componentBody.includes('ResponsiveContainer') || componentBody.includes('BarChart');
  const needsCompressImage = componentBody.includes('compressImage');
  const needsReadAsBase64 = componentBody.includes('readAsBase64');
  const needsQRCode = componentBody.includes('QRCodeSVG') || componentBody.includes('qrcode');
  const needsUseState = componentBody.includes('useState');
  const needsUseEffect = componentBody.includes('useEffect');
  const needsUseRef = componentBody.includes('useRef');
  const needsUseMemo = componentBody.includes('useMemo');
  const needsUseCallback = componentBody.includes('useCallback');
  
  // Build clean imports
  const imports = ['"use client";\n'];
  
  // React imports
  const reactHooks = [];
  if (needsUseState) reactHooks.push('useState');
  if (needsUseEffect) reactHooks.push('useEffect');
  if (needsUseRef) reactHooks.push('useRef');
  if (needsUseMemo) reactHooks.push('useMemo');
  if (needsUseCallback) reactHooks.push('useCallback');
  
  if (reactHooks.length > 0) {
    imports.push(`import React, { ${reactHooks.join(', ')} } from "react";`);
  } else {
    imports.push('import React from "react";');
  }
  
  if (needsKFSBrand) {
    imports.push('import { KFS_BRAND } from "../config/brandConfig";');
  }
  
  if (usedLucideIcons.length > 0) {
    imports.push(`import { ${usedLucideIcons.join(', ')} } from "lucide-react";`);
  }
  
  if (needsKFS) {
    imports.push('import { useKFS } from "../context/KFSContext";');
  }
  
  if (needsMotion) {
    imports.push('import { motion, AnimatePresence } from "framer-motion";');
  }
  
  if (needsSupabase) {
    imports.push('import { supabase } from "../context/supabase";');
  }
  
  if (needsRecharts) {
    // Find which recharts components are used
    const rechartsComponents = ['AreaChart', 'Area', 'XAxis', 'Tooltip', 'ResponsiveContainer', 'BarChart', 'Bar', 'CartesianGrid', 'YAxis'];
    const usedRecharts = rechartsComponents.filter(c => componentBody.includes(c));
    if (usedRecharts.length > 0) {
      imports.push(`import { ${usedRecharts.join(', ')} } from "recharts";`);
    }
  }
  
  if (needsCompressImage || needsReadAsBase64) {
    const utils = [];
    if (needsCompressImage) utils.push('compressImage');
    if (needsReadAsBase64) utils.push('readAsBase64');
    // Check for other utils
    const allUtils = ['playPremiumChime', 'playSyncChime', 'playCashDrawerSound', 'playScannerBeep', 'getStoreCoords', 'getCustomerCoords', 'speakText'];
    for (const u of allUtils) {
      if (componentBody.includes(u)) utils.push(u);
    }
    imports.push(`import { ${utils.join(', ')} } from "../lib/utils";`);
  }
  
  if (needsQRCode) {
    imports.push('import { QRCodeSVG } from "qrcode.react";');
  }
  
  const newContent = imports.join('\n') + '\n\n' + componentBody.trimStart();
  
  fs.writeFileSync(filePath, newContent, 'utf-8');
  console.log(`FIXED: ${fileName} — ${usedLucideIcons.length} icons, ${imports.length - 1} imports (was ~48 imports)`);
}

console.log('\nDone! All bloated imports cleaned.');
