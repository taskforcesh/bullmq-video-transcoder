# BullMQ Video Transcoding

This repo includes example source code for how to split a lengthy job into smaller chunks that can be processed in parallel, specifically for video transcoding, but the the same concept can be used for any other lengthy operation.

In order to test it, just build the source code with ```yarn build```. You  can then add an example video to the "splitter" queue with ```node dist/producer.js``` and then
run the workers in order to process the video ```yarn start```. The results and temporary files will be placed in the output directory.

Please check this blog post for more information: https://blog.taskforce.sh/splitting-heavy-jobs-using-bullmq-flows/
