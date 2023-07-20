#!/usr/bin/env node

const { spawn, execSync } = require("child_process");
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
  yt.stdout.on("end", () => {
    if (args.includes("--noconv")) {s
      return;
    }
    if (args.includes("--mp3")) {
      console.log("Downloaded .webm, starting .mp3 conversion for", filename);
      const slugified = slugify(filename);
      fs.renameSync(filename, slugified);
      convertWithFFMPEG(mp3Flags(slugified));
      return;
    }
    console.log("Downloaded .webm, starting .mp4 conversion for", filename);
    const slugified = slugify(filename);
    fs.renameSync(filename, slugified);
    convertWithFFMPEG(mp4Flags(slugified));
  });
}

function mp3Flags(filename) {
  const filenameMP3 = filename.replace(".webm", ".mp3");
  return [
    `-i`,
    filename,
    `-vn`,
    `-ab`,
    `128k`,
    `-ar`,
    `44100`,
    `-y`,
    filenameMP3,
  ];
}

function mp4Flags(filename) {
  const filenameMP4 = filename.replace(".webm", ".mp4");
  return ["-fflags", "+genpts", "-i", filename, "-r", "24", filenameMP4];
}

function convertWithFFMPEG(opts) {
  console.log(`ffmpeg`, opts);
  const ffmpeg = spawn(`ffmpeg`, opts);
  ffmpeg.stdout.on("data", (data) => {
    console.log(`[ffmpeg] ${data.toString()}`);
  });
  ffmpeg.stderr.on("data", (data) => {
    console.error(`[ffmpeg] ${data.toString()}`);
  });
  ffmpeg.stdout.on("end", () => {
    console.log("Finished conversion.");
    // execSync(`rm ${filenameMP4}`);
  });
  ffmpeg.on("close", (code) => {
    console.log(`[ffmpeg] exited with code (${code})`);
  });
}

function slugify(str) {
  const letters = {
    Š: "S",
    š: "s",
    Đ: "Dj",
    đ: "dj",
    Ž: "Z",
    ž: "z",
    Č: "C",
    č: "c",
    Ć: "C",
    ć: "c",
    À: "A",
    Á: "A",
    Â: "A",
    Ã: "A",
    Ä: "A",
    Å: "A",
    Æ: "A",
    Ç: "C",
    È: "E",
    É: "E",
    Ê: "E",
    Ë: "E",
    Ì: "I",
    Í: "I",
    Î: "I",
    Ï: "I",
    Ñ: "N",
    Ò: "O",
    Ó: "O",
    Ô: "O",
    Õ: "O",
    Ö: "O",
    Ø: "O",
    Ù: "U",
    Ú: "U",
    Û: "U",
    Ü: "U",
    Ý: "Y",
    Þ: "B",
    ß: "Ss",
    à: "a",
    á: "a",
    â: "a",
    ã: "a",
    ä: "ae",
    å: "a",
    æ: "a",
    ç: "c",
    è: "e",
    é: "e",
    ê: "e",
    ë: "e",
    ì: "i",
    í: "i",
    î: "i",
    ï: "i",
    ð: "o",
    ñ: "n",
    ò: "o",
    ó: "o",
    ô: "o",
    õ: "o",
    ö: "o",
    ø: "o",
    ù: "u",
    ú: "u",
    û: "u",
    ý: "y",
    ý: "y",
    þ: "b",
    ÿ: "y",
    Ŕ: "R",
    ŕ: "r",
    "/": "-",
    " ": "-",
    "|": "-",
  };

  const keys = Object.keys(letters);
  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    if (keys.includes(char)) {
      str = str.replace(char, letters[char]);
    }
  }
  return str.toLowerCase();
}
