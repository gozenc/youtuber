#!/usr/bin/env node

const { spawn, execSync } = require("child_process");
const { convertWithFFMPEG, mp3Flags, mp4Flags } = require("./lib");
const slugify = require("slugify");
const fs = require("fs");
const youtuber = require("./youtuber");

main();

function main() {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.log("No arguments provided, please provide an url.");
    return;
  }
  const url = args[0];
  youtuber(url);
}
