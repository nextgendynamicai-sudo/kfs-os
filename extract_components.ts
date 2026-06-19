import fs from "fs";

const PAGE_FILE = "src/app/page.tsx";
let code = fs.readFileSync(PAGE_FILE, "utf8");

// Get universal imports
const importsEnd = code.indexOf("\nconst Toast");
const importsBlock = code.substring(0, importsEnd);

const componentsToExtract = [
  "Toast",
  "CvViewerModal",
  "SMSConciliatorSimulator",
  "KFSFinancialSplitCalculator",
  "FiscalPrinterSetupWidget",
  "KFSIoTEdgeConsole",
  "KreatekLogo",
  "Navbar",
  "RegisterClientForm",
  "RegisterPromotoraForm",
  "RegisterCustomerForm",
  "RegisterRiderForm",
  "StorefrontCustomizer",
  "OnboardingWizard",
  "RecruitmentWidget",
  "ScannerView"
];

let remainingCode = code;

for (const compName of componentsToExtract) {
  const bodyStartRegex = new RegExp(`const ${compName} = \\(.*?\\) => {`, "s");
  const match = remainingCode.match(bodyStartRegex);
  
  if (!match) {
    console.log(`Could not find ${compName}`);
    continue;
  }
  
  const startIndex = match.index;
  const functionHeader = match[0];
  const firstBraceIndex = startIndex + functionHeader.lastIndexOf("{");
  
  let bracketCount = 0;
  let endIndex = firstBraceIndex;
  
  for (let i = firstBraceIndex; i < remainingCode.length; i++) {
    if (remainingCode[i] === "{") {
      bracketCount++;
    } else if (remainingCode[i] === "}") {
      bracketCount--;
    }
    
    if (bracketCount === 0) {
      endIndex = i + 1;
      break;
    }
  }
  
  const compCode = remainingCode.substring(startIndex, endIndex);
  
  // Remove from remaining code
  remainingCode = remainingCode.substring(0, startIndex) + "\n\n/* " + compName + " EXTRACTED */\n\n" + remainingCode.substring(endIndex);
  
  // Write the file
  const outPath = `src/components/${compName}.tsx`;
  const outCode = `${importsBlock}\n\nexport ${compCode}\n`;
  fs.writeFileSync(outPath, outCode);
  console.log(`Extracted ${compName} to ${outPath}`);
}

// Inject exports in page.tsx
let importsToAdd = "";
for (const compName of componentsToExtract) {
  importsToAdd += `export { ${compName} } from "../components/${compName}";\n`;
}

remainingCode = remainingCode.replace(`import { ProfileAvatarEditor } from "../components/ProfileAvatarEditor";`, `import { ProfileAvatarEditor } from "../components/ProfileAvatarEditor";\n${importsToAdd}`);

fs.writeFileSync(PAGE_FILE, remainingCode);
console.log("Successfully updated page.tsx");
