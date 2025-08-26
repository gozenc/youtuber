#!/usr/bin/env node

const { spawn } = require("child_process");

module.exports = function youtuber(url) {
  return new Promise((res) => {
    let filename = null;
    let downloaded = false;
    const yt = spawn(`yt-dlp`, [
      url,
      // "--cookies-from-browser=chrome",
      "-x",
      "--audio-format=mp3",
    ]);

    yt.stdout.on("data", (data) => {
      data = data.toString();
      console.log(`[yt-dlp] ${data}`);
      if (data.includes("Destination: ")) {
        filename = data.split("Destination: ")[1].trim();
        downloaded = true;
        console.log("filename", filename);
      }
    });

    yt.stderr.on("data", (data) => {
      console.error(`[yt-dlp] [error] ${data}`);
    });

    yt.stdout.on("end", async () => {
      console.log("Finished downloading.");
      res({ downloaded, filename });
    });
  });
};
