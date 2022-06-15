import { resolve } from "path";
import { writeFile } from "fs";

import { Job } from "bullmq";

import { SplitterJob } from "../interfaces/splitter-job";
import ffmpeg from "../util/ffmpeg";

/**
 * Transcoder Worker
 *
 * This worker concatenate the video chunks into a single video.
 *
 */
export default async function (job: Job<SplitterJob>) {
  const transcodedChunks = await job.getChildrenValues();
  const files = Object.values(transcodedChunks).sort();

  console.log("Start concatenating files", files);

  await concat(
    job.id,
    files,
    resolve(process.cwd(), `output/merged-${job.id}.mp4`)
  );
}

// https://stackoverflow.com/questions/7333232/how-to-concatenate-two-mp4-files-using-ffmpeg
async function concat(jobId: string, files: string[], output: string) {
  const listFile = resolve(process.cwd(), `output/${jobId}.txt`);
  await new Promise<void>((resolve, reject) => {
    writeFile(
      listFile,
      files.map((file) => `file '${file}'`).join("\n"),
      (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      }
    );
  });

  await ffmpeg(null, `-f concat -safe 0 -i ${listFile} -c copy`, output);
  return output;
}
