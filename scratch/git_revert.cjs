const fs = require("fs");
const path = require("path");
const zlib = require("zlib");

// Let's find the hash of the file in git index
function getGitObject() {
  const gitIndex = fs.readFileSync(".git/index");
  // The git index is a binary file containing file paths and their object SHA-1 hashes
  // Let's search for "src/components/POSDashboardView.tsx" in the binary buffer
  const filePathStr = "src/components/POSDashboardView.tsx";
  const pathIdx = gitIndex.indexOf(filePathStr);
  if (pathIdx === -1) {
    console.error("File path not found in Git index");
    return;
  }
  
  // The SHA-1 hash is 20 bytes located right before the path or in the entry header
  // Git index entry format:
  // ctime, mtime, dev, ino, mode, uid, gid, file_size, SHA-1 (20 bytes), flags, path
  // Let's search backwards from pathIdx to find the SHA-1 hash
  // Since Mode is 4 bytes and file size is 4 bytes, SHA-1 is 20 bytes.
  // The flags is 2 bytes. So SHA-1 is 2 bytes before the path.
  // Let's read 20 bytes starting at pathIdx - 22
  const shaBuffer = gitIndex.slice(pathIdx - 22, pathIdx - 2);
  const shaHex = shaBuffer.toString("hex");
  console.log("Found SHA-1 in index:", shaHex);
  
  // Locate the object in .git/objects
  const folder = shaHex.substring(0, 2);
  const filename = shaHex.substring(2);
  const objectPath = path.join(".git", "objects", folder, filename);
  
  if (!fs.existsSync(objectPath)) {
    console.error("Git object file not found:", objectPath);
    return;
  }
  
  // Decompress the object
  const compressed = fs.readFileSync(objectPath);
  const decompressed = zlib.inflateSync(compressed);
  
  // Git object format: "blob <size>\0<content>"
  const nullIdx = decompressed.indexOf(0);
  const content = decompressed.slice(nullIdx + 1).toString("utf8");
  
  fs.writeFileSync("src/components/POSDashboardView.tsx", content, "utf8");
  console.log("Successfully reverted src/components/POSDashboardView.tsx to HEAD!");
}

getGitObject();
