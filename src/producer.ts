import { Queue } from "bullmq";
import { splitterQueueName } from "./types";
import { SplitterJob } from "./interfaces/splitter-job";
import path from "path";

const connection = {
  host: "localhost",
  port: 6379,
};

const splitterQueue = new Queue<SplitterJob>(splitterQueueName, { connection });

async function addJobs() {
  console.log("Adding jobs...");
  await splitterQueue.add("split", {
    videoFile: path.join(__dirname, "../assets/earth.mp4"),
  });
  console.log("Done");
  await splitterQueue.close();
}

addJobs();
