const fs = require("fs");
const filePath = "c:/Users/ammar/OneDrive/Desktop/RestoCloud/src/components/AdminPanelView.tsx";
const content = fs.readFileSync(filePath, "utf8");
const lines = content.split("\n");

console.log("Analyzing branding tab content...");
let insideBranding = false;
let start = 0;
let end = 0;

for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('activeTab === "branding" && (')) {
    insideBranding = true;
    start = i;
  }
  if (insideBranding && lines[i].includes('/* TAB 3: TABLES MANAGEMENT */')) {
    insideBranding = false;
    end = i;
    break;
  }
}

console.log(`Branding Tab starts at line ${start + 1} and ends at line ${end + 1}`);
const slice = lines.slice(start, end);

// Let's print input types, select options, and labels found in the slice
slice.forEach((line, idx) => {
  const absoluteLineNumber = start + idx + 1;
  if (line.includes("<label") || line.includes("<input") || line.includes("<select") || line.includes("<button")) {
    console.log(`[L${absoluteLineNumber}] ${line.trim()}`);
  }
});
