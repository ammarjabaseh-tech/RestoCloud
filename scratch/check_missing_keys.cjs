const fs = require("fs");
const path = require("path");

function checkFile(filePath, translationsPattern) {
  const content = fs.readFileSync(filePath, "utf8");
  
  // Extract translations object from content
  const startIdx = content.indexOf(translationsPattern);
  if (startIdx === -1) {
    console.log(`Could not find ${translationsPattern} in ${filePath}`);
    return;
  }
  
  // Match all t.<key> where <key> is valid word
  // Avoid e.target.value (et.value), React.FC (ct.FC), React.FormEvent (ct.FormEvent), React.ReactNode (ct.ReactNode), etc.
  const rawMatches = content.match(/t\.[a-zA-Z0-9_]+/g) || [];
  const keys = [...new Set(rawMatches)].map(k => k.substring(2)).filter(k => {
    // Filter out false positives
    if (k === "FC" || k === "ReactNode" || k === "FormEvent" || k === "value" || k === "com") return false;
    return true;
  });

  console.log(`Checking ${path.basename(filePath)} keys:`, keys);

  // Parse translations object (rough approximation)
  // Let's search the translation blocks using regex
  const blockRegex = /ar:\s*\{([\s\S]*?)\},\s*en:\s*\{([\s\S]*?)\},\s*tr:\s*\{([\s\S]*?)\}/;
  const match = content.match(blockRegex);
  if (!match) {
    console.log(`Could not parse translations block in ${filePath}`);
    return;
  }

  const arBlock = match[1];
  const enBlock = match[2];
  const trBlock = match[3];

  keys.forEach(key => {
    // Check if key exists in all blocks as a property/key
    const keyRegex = new RegExp(`\\b${key}\\b\\s*:`);
    const inAr = keyRegex.test(arBlock);
    const inEn = keyRegex.test(enBlock);
    const inTr = keyRegex.test(trBlock);

    if (!inAr || !inEn || !inTr) {
      console.error(`🔴 Missing key "${key}" in ${path.basename(filePath)}: AR=${inAr}, EN=${inEn}, TR=${inTr}`);
    } else {
      console.log(`✅ Key "${key}" verified.`);
    }
  });
}

checkFile("c:/Users/ammar/OneDrive/Desktop/RestoCloud/src/components/LandingPageView.tsx", "const landingTranslations =");
checkFile("c:/Users/ammar/OneDrive/Desktop/RestoCloud/src/components/SaaSAuthView.tsx", "const authTranslations =");
checkFile("c:/Users/ammar/OneDrive/Desktop/RestoCloud/src/components/TenantLoginCheckoutView.tsx", "const checkoutTranslations =");
