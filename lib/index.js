import { spawn } from "child_process";

export async function convertWithFFMPEG(opts) {
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

export function twirlLoading() {
  var P = ["\\", "|", "/", "-"];
  var x = 0;
  return setInterval(function () {
    process.stdout.write("\r" + P[x++]);
    x &= 3;
  }, 250);
}

// ffmpeg -i "${FILE}" -vn -ab 128k -ar 33000 -y "${FILE%. webm}.
// ffmpeg -i input.webm -vn audio_only.mp3
// ffmpeg -i "${FILE}" -vn -ab 128k -ar 33000 -y "${FILE%.webm}.mp3";

/*
The -i flag indicates the file name of the input WEBM video.

The -vn flag instructs ffmpeg to stop video recording.

 The -ab flag sets bitrate to 128k.

The -ar flag sets audio sample rate to 33000 Hz.

The -y flag overwrites the output file. Those of you who are not familiar with command lines should first go through the guide on how to use FFmpeg.
*/
export function mp3Flags(filename) {
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

export function mp4Flags(filename) {
  const filenameMP4 = filename.replace(".webm", ".mp4");
  return ["-fflags", "+genpts", "-i", filename, "-r", "24", filenameMP4];
}
