const fs = require("fs");
const readline = require("readline");

async function run() {
  const logPath = "C:/Users/ammar/.gemini/antigravity/brain/89a0c34b-0d0d-412c-bea9-9552900b4a0a/.system_generated/logs/transcript_full.jsonl";
  if (!fs.existsSync(logPath)) {
    console.log("Log path does not exist:", logPath);
    return;
  }
  
  const fileStream = fs.createReadStream(logPath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });
  
  console.log("Reading logs to find previous file content...");
  let lastSuccessfulAdminPanelCode = null;
  
  for await (const line of rl) {
    try {
      const obj = JSON.parse(line);
      if (obj.type === "PLANNER_RESPONSE" && obj.tool_calls) {
        for (const tc of obj.tool_calls) {
          if (tc.name === "default_api:replace_file_content" && tc.args && tc.args.TargetFile && tc.args.TargetFile.includes("AdminPanelView.tsx")) {
            // Found a replace on AdminPanelView.tsx
            console.log("Found replace on AdminPanelView.tsx inside planner response.");
          }
        }
      }
    } catch (e) {
      // ignore
    }
  }
}

run();
