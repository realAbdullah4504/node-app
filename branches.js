const { execSync } = require("child_process");
const fs = require("fs");

function getBranches() {
  const output = execSync("git branch -a", { encoding: "utf-8" });
  const branches = output
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line && !line.includes("remotes/origin/HEAD"));
  return branches;
}

function printBranches(branches) {
  console.log("\n🔍 Available Project Branches:\n");
  branches.forEach((branch, i) => {
    console.log(`${i + 1}. ${branch}`);
  });
}

function switchBranch(branchName) {
  execSync(`git checkout ${branchName}`, { stdio: "inherit" });
}

function saveNote(branch, note) {
  const notesFile = `notes/${branch.replace("/", "_")}.md`;
  fs.mkdirSync("notes", { recursive: true });
  fs.writeFileSync(notesFile, `# Notes for ${branch}\n\n${note}`, "utf-8");
  console.log(`✅ Note saved at ${notesFile}`);
}

// Example usage
const branches = getBranches();
// saveNote("livekit", "Livekit is a video conferencing platform");
printBranches(branches);

// You can add a prompt system here using readline if you'd like interactivity
