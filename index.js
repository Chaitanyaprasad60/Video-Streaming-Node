const express = require('express');
const fs = require('fs');
const path = require('path');
const config = require('./config.json')

const app = express();
const port = 3000;
const chunkSize = config.chunkSize || 5 * 10 ** 5; //500KB // This is the size of video we want to send in one go. 

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/index.html");
});


app.get('/video/:filename', (req, res) => {

  let fileName = req.params.filename || "defaultVideo";
  const videoPath = `./videos/${fileName}.mp4`; // Replace with the actual path to your video file

  const stat = fs.statSync(videoPath);
  const fileSize = stat.size;
  const range = req.headers.range;

  if (range) {
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : Math.min(start+chunkSize,fileSize - 1); //If end is not mention we decide the chunk size
    //const chunkSize = (end - start) + 1;
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
