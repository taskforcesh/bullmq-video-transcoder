import { resolve, basename } from "path";
import { Job } from "bullmq";

import { SplitterJob } from "../interfaces/splitter-job";
import ffmpeg from "../util/ffmpeg";

/**
 * Transcoder Worker
 *
 * This worker transcodes the video input into a different format.
 *
 */
export default async function (job: Job<SplitterJob>) {
  const { videoFile } = job.data;
  console.log(`Start transcoding video ${videoFile}`);

  // Transcode video
  return transcodeVideo(videoFile, job.id!);
}

async function transcodeVideo(videoFile: string, jobId: string) {
  const srcName = basename(videoFile);
  const output = resolve(process.cwd(), `output/transcoded-${srcName}`);

  await ffmpeg(
    resolve(process.cwd(), videoFile),
    "-c:v libx264 -preset slow -crf 20 -c:a aac -b:a 16k -vf scale=320:240",
    output
  );

  return output;
}
