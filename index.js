#!/usr/bin/env node

const { spawn, execSync } = require("child_process");
const { convertWithFFMPEG, mp3Flags, mp4Flags } = require("./lib");
const slugify = require("slugify");
const fs = require("fs");

main();

function main() {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.log("No arguments provided, please provide an url.");
    return;
  }
  const url = args[0];

  if (args.includes("--conv")) {
    const filepath = args[0];
    convertWithFFMPEG(mp4Flags(filepath));
    return;
  }

  let filename = "";
  const yt = spawn(`yt-dlp`, [url]);
  yt.stdout.on("data", (data) => {
    data = data.toString();
    console.log(`[yt-dlp] ${data}`);
    if (data.toString().includes('Merging formats into "')) {
      filename = data
        .toString()
        .split('Merging formats into "')[1]
        .trim()
        .slice(0, -1);
    }
  });
  yt.stderr.on("data", (data) => {
    console.error(`[yt-dlp] [error] ${data}`);
  });
  yt.stdout.on("end", async () => {
    if (args.includes("--noconv")) {
      return;
    }
    if (args.includes("--mp3")) {
      console.log("Downloaded .webm, starting .mp3 conversion for", filename);
      const slugified = slugify(filename);
      fs.renameSync(filename, slugified);
      await convertWithFFMPEG(mp3Flags(slugified));
      return;
    }
    console.log("Downloaded .webm, starting .mp4 conversion for", filename);
    const slugified = slugify(filename);
    fs.renameSync(filename, slugified);
    await convertWithFFMPEG(mp4Flags(slugified));
  });
}
