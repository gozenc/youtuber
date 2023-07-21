async function convertWithFFMPEG(opts) {
  return new Promise((resolve, reject) => {
    console.log(`ffmpeg`, opts);
    const ffmpeg = spawn(`ffmpeg`, opts);
    ffmpeg.stdout.on("data", (data) => {
      console.log(`[ffmpeg] ${data.toString()}`);
    });
    ffmpeg.stderr.on("data", (data) => {
      console.error(`[ffmpeg-err] ${data.toString()}`);
      reject(data.toString());
    });
    ffmpeg.stdout.on("end", () => {
      console.log("Finished conversion.");
      resolve();
      // execSync(`rm ${filenameMP4}`);
    });
    ffmpeg.on("close", (code) => {
      console.log(`[ffmpeg] exited with code (${code})`);
    });
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

module.exports = {
  mp3Flags,
  mp4Flags,
  convertWithFFMPEG,
};
