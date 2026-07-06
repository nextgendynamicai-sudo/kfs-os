// Verify all cleaned components have required imports
const fs = require('fs');
const path = require('path');

const COMPONENTS_DIR = path.join(__dirname, 'src', 'components');

const FILES_TO_CHECK = [
  'Toast.tsx', 'StorefrontCustomizer.tsx', 'ScannerView.tsx', 'SMSConciliatorSimulator.tsx',
  'RegisterPromotoraForm.tsx', 'RegisterRiderForm.tsx', 'RegisterCustomerForm.tsx',
  'RegisterClientForm.tsx', 'RecruitmentWidget.tsx', 'OnboardingWizard.tsx',
  'KFSIoTEdgeConsole.tsx', 'KFSFinancialSplitCalculator.tsx', 'FiscalPrinterSetupWidget.tsx',
  'CvViewerModal.tsx'
];

// Utilities and functions that need importing
const UTILS_MAP = {
  'compressImage': '../lib/utils',
  'readAsBase64': '../lib/utils',
  'playPremiumChime': '../lib/utils',
  'playSyncChime': '../lib/utils',
  'playCashDrawerSound': '../lib/utils',
  'playScannerBeep': '../lib/utils',
  'getStoreCoords': '../lib/utils',
  'getCustomerCoords': '../lib/utils',
  'speakText': '../lib/utils',
  'uploadAsset': '../context/supabase',
};

// Lucide icons
const ALL_ICONS = [
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
  'ChevronRightCircle', 'ArrowDown', 'ArrowUp', 'MoreVertical', 'Download', 'Clipboard'
];

let issues = 0;

for (const fileName of FILES_TO_CHECK) {
  const filePath = path.join(COMPONENTS_DIR, fileName);
  const content = fs.readFileSync(filePath, 'utf-8');
  
  const importSection = content.split(/\nexport /)[0]; // Everything before first export
  const bodySection = content.slice(importSection.length);
  
  // Check for used but not imported icons
  for (const icon of ALL_ICONS) {
    const usedInBody = new RegExp(`<${icon}[\\s/>]|\\b${icon}\\b`, 'g');
    const importedInHeader = importSection.includes(icon);
    
    if (usedInBody.test(bodySection) && !importedInHeader) {
      console.log(`❌ ${fileName}: Uses "${icon}" but doesn't import it`);
      issues++;
    }
  }
  
  // Check for used but not imported utilities
  for (const [util, source] of Object.entries(UTILS_MAP)) {
    if (bodySection.includes(util) && !importSection.includes(util)) {
      console.log(`❌ ${fileName}: Uses "${util}" but doesn't import it from ${source}`);
      issues++;
    }
  }
  
  // Check for useKFS
  if (bodySection.includes('useKFS') && !importSection.includes('useKFS')) {
    console.log(`❌ ${fileName}: Uses "useKFS" but doesn't import it`);
    issues++;
  }
  
  // Check for KFS_BRAND
  if (bodySection.includes('KFS_BRAND') && !importSection.includes('KFS_BRAND')) {
    console.log(`❌ ${fileName}: Uses "KFS_BRAND" but doesn't import it`);
    issues++;
  }
  
  // Check for motion
  if ((bodySection.includes('<motion') || bodySection.includes('motion.')) && !importSection.includes('motion')) {
    console.log(`❌ ${fileName}: Uses "motion" but doesn't import it`);
    issues++;
  }
  
  // Check for AnimatePresence
  if (bodySection.includes('AnimatePresence') && !importSection.includes('AnimatePresence')) {
    console.log(`❌ ${fileName}: Uses "AnimatePresence" but doesn't import it`);
    issues++;
  }
  
  // Check React hooks
  const hooks = ['useState', 'useEffect', 'useRef', 'useMemo', 'useCallback'];
  for (const hook of hooks) {
    if (bodySection.includes(`${hook}(`) && !importSection.includes(hook)) {
      console.log(`❌ ${fileName}: Uses "${hook}" but doesn't import it`);
      issues++;
    }
  }
  
  // Check for QRCodeSVG
  if (bodySection.includes('QRCodeSVG') && !importSection.includes('QRCodeSVG')) {
    console.log(`❌ ${fileName}: Uses "QRCodeSVG" but doesn't import it`);
    issues++;
  }
  
  // Check uploadAsset
  if (bodySection.includes('uploadAsset') && !importSection.includes('uploadAsset')) {
    console.log(`❌ ${fileName}: Uses "uploadAsset" but doesn't import it`);
    issues++;
  }
}

if (issues === 0) {
  console.log('✅ All cleaned component files have correct imports!');
} else {
  console.log(`\n⚠️  Found ${issues} missing import(s) that need fixing.`);
}
