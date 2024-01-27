const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/index.html");
});


app.get('/video', (req, res) => {
  const videoPath = './videos/ChatGPT_Post.mp4'; // Replace with the actual path to your video file

  const stat = fs.statSync(videoPath);
  const fileSize = stat.size;
  const range = req.headers.range;

  if (range) {
    console.log({range})
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
    const chunkSize = (end - start) + 1;
    const file = fs.createReadStream(videoPath, { start, end });
    const head = {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunkSize,
      'Content-Type': 'video/mp4',
    };

    res.writeHead(206, head);
    file.pipe(res);
  } else {
    const head = {
      'Content-Length': fileSize,
      'Content-Type': 'video/mp4',
    };

    res.writeHead(200, head);
    fs.createReadStream(videoPath).pipe(res);
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
