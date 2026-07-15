const fs = require("fs");
const path = require("path");

function checkMissingJSXImports(filePath) {
  const content = fs.readFileSync(filePath, "utf8");
  
  // Find all JSX tags <Word ...
  const jsxTags = [...new Set(content.match(/<[A-Z][a-zA-Z0-9]*/g) || [])].map(t => t.substring(1));
  
  // Find all defined variables / imports (rough check)
  // Let's see if we can find them in the content
  const missing = [];
  jsxTags.forEach(tag => {
    // If the tag is React fragment, skip
    if (tag === "React") return;
    
    // Check if the tag name is defined or imported in the file content
    // We search for: import ... tag ... or const tag = ... or function tag( ...
    const isImported = content.includes(tag);
    if (!isImported) {
      missing.push(tag);
    } else {
      // Check if it's imported from lucide-react specifically or declared
      const isDecl = new RegExp(`\\b${tag}\\b`).test(content);
      if (!isDecl) {
        missing.push(tag);
      }
    }
  });

  console.log(`Checking JSX tags in ${path.basename(filePath)}:`);
  console.log("JSX Tags found:", jsxTags);
  
  // Let's do a strict check: does the tag name exist as a separate word token outside of its JSX usage?
  // We can strip all JSX tags <Tag and </Tag> and check if the word is defined.
  // Or simpler: check if the tag is present in the import statements.
  const importsText = content.split("export")[0]; // typically imports are at the top
  const missingImports = [];
  jsxTags.forEach(tag => {
    if (tag === "React" || tag === "Fragment") return;
    // We want to make sure the tag word is in importsText or defined as a function/const in the file
    const isDefinedInFile = content.includes(`function ${tag}`) || content.includes(`const ${tag}`);
    const isImported = new RegExp(`\\b${tag}\\b`).test(importsText);
    if (!isDefinedInFile && !isImported) {
      missingImports.push(tag);
    }
  });
  
  if (missingImports.length > 0) {
    console.error(`🔴 Missing imports in ${path.basename(filePath)}:`, missingImports);
  } else {
    console.log(`✅ All JSX tags imported/defined in ${path.basename(filePath)}.`);
  }
}

checkMissingJSXImports("c:/Users/ammar/OneDrive/Desktop/RestoCloud/src/components/LandingPageView.tsx");
checkMissingJSXImports("c:/Users/ammar/OneDrive/Desktop/RestoCloud/src/components/SaaSAuthView.tsx");
checkMissingJSXImports("c:/Users/ammar/OneDrive/Desktop/RestoCloud/src/components/TenantLoginCheckoutView.tsx");
