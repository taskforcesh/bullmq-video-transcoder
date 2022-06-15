import pathToFfmpeg from "ffmpeg-static";
import shell from "any-shell-escape";
const { exec } = require("child_process");

const ffmpeg = (input: string | null, flags: string, output: string) => {
  const args = `${pathToFfmpeg} ${
    input ? "-i " + input : ""
  } ${flags} ${output}`;

  const transcode = shell(args.split(" "));

  return new Promise<string>((resolve, reject) => {
    exec(transcode, (err, stderr, stdout) => {
      if (err) {
        reject(err);
      } else {
        resolve(stdout);
      }
    });
  });
};

export default ffmpeg;
