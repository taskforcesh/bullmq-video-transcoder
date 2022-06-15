import { resolve } from "path";

import { Job, FlowProducer } from "bullmq";
import pathToFfmpeg from "ffmpeg-static";

import { SplitterJob } from "../interfaces/splitter-job";
import { concatQueueName, transcoderQueueName } from "../types";

import ffmpeg from "../util/ffmpeg";

/**
 * Splitter Worker
 *
 * This worker splits the video input into chunks and queues them for processing.
 *
 */
export default async function (job: Job<SplitterJob>) {
  const { videoFile } = job.data;

  console.log(
    `Start splitting video ${videoFile} using ${pathToFfmpeg}`,
    job.id,
    job.data
  );

  // Split the video into chunks
  const chunks = await splitVideo(videoFile, job.id!);
  await addChunksToQueue(chunks);
}

async function splitVideo(videoFile: string, jobId: string) {
  // Split the video into chunks
  // around 20 seconds chunks
  const stdout = await ffmpeg(
    resolve(process.cwd(), videoFile),
    "-c copy -map 0 -segment_time 00:00:20 -f segment",
    resolve(process.cwd(), `output/${jobId}-part%03d.mp4`)
  );

  return getChunks(stdout);
}

function getChunks(s: string) {
  const lines = s.split(/\n|\r/);
  const chunks = lines
    .filter((line) => line.startsWith("[segment @"))
    .map((line) => line.match("'(.*)'")[1]);

  return chunks;
}

async function addChunksToQueue(chunks: string[]) {
  const flowProducer = new FlowProducer();

  return flowProducer.add({
    name: "transcode",
    queueName: concatQueueName,
    children: chunks.map((chunk) => ({
      name: "transcode-chunk",
      queueName: transcoderQueueName,
      data: { videoFile: chunk } as SplitterJob,
    })),
  });
}
