const fs = require("fs");
const path = require("path");
const zlib = require("zlib");

// Helper to decompress a git object by hash
function readGitObject(shaHex) {
  const folder = shaHex.substring(0, 2);
  const filename = shaHex.substring(2);
  const objectPath = path.join(".git", "objects", folder, filename);
  if (!fs.existsSync(objectPath)) {
    throw new Error(`Git object not found: ${shaHex}`);
  }
  const compressed = fs.readFileSync(objectPath);
  return zlib.inflateSync(compressed);
}

// Helper to parse a tree object and find a path
function findPathInTree(treeSha, parts) {
  const data = readGitObject(treeSha);
  // Tree format: "tree <size>\0<entries>"
  const nullIdx = data.indexOf(0);
  let entries = data.slice(nullIdx + 1);
  
  const target = parts[0];
  let offset = 0;
  while (offset < entries.length) {
    // Each entry: "<mode> <name>\0<20-byte SHA-1>"
    const spaceIdx = entries.indexOf(" ", offset);
    if (spaceIdx === -1) break;
    const mode = entries.slice(offset, spaceIdx).toString("utf8");
    
    const nameNullIdx = entries.indexOf(0, spaceIdx);
    const name = entries.slice(spaceIdx + 1, nameNullIdx).toString("utf8");
    
    const sha = entries.slice(nameNullIdx + 1, nameNullIdx + 21).toString("hex");
    offset = nameNullIdx + 21;
    
    if (name === target) {
      if (parts.length === 1) {
        return sha; // found the file blob
      } else {
        return findPathInTree(sha, parts.slice(1)); // search subdirectory
      }
    }
  }
  throw new Error(`Path component ${target} not found in tree ${treeSha}`);
}

// Main function to extract file from commit
function checkoutFileFromCommit(commitSha, filePath, outputPath) {
  console.log(`Extracting ${filePath} from commit ${commitSha}...`);
  try {
    // 1. Read commit object
    const commitData = readGitObject(commitSha);
    // Format: "commit <size>\0tree <treeSha>\n..."
    const nullIdx = commitData.indexOf(0);
    const commitText = commitData.slice(nullIdx + 1).toString("utf8");
    const treeMatch = commitText.match(/^tree ([0-9a-f]{40})/);
    if (!treeMatch) {
      throw new Error("Could not find tree SHA-1 in commit object");
    }
    const treeSha = treeMatch[1];
    console.log("Commit tree SHA:", treeSha);
    
    // 2. Resolve path inside the tree
    const parts = filePath.split("/");
    const blobSha = findPathInTree(treeSha, parts);
    console.log("Resolved blob SHA:", blobSha);
    
    // 3. Read blob contents
    const blobData = readGitObject(blobSha);
    const blobNullIdx = blobData.indexOf(0);
    const fileContent = blobData.slice(blobNullIdx + 1).toString("utf8");
    
    fs.writeFileSync(outputPath, fileContent, "utf8");
    console.log(`Successfully checked out file to ${outputPath}!`);
  } catch (err) {
    console.error("Error during checkout:", err.message);
  }
}

// Let's check out src/components/POSDashboardView.tsx from the commit prior to any changes we made
const commitSha = process.argv[2] || "938d79be0b87d29badc1efaf259c644913681910";
checkoutFileFromCommit(commitSha, "src/components/POSDashboardView.tsx", "src/components/POSDashboardView.tsx");
