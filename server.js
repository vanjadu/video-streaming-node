const express = require('express')
const fs = require('fs')
const cors = require('cors')

const PORT = 3000

const app = express()
app.use(cors())

app.get('/video', (req, res) => {
  const videoPath = './Ski.mp4'
  const videoSize = fs.statSync(videoPath).size

  const range = req.headers.range
  const start = Number(range.replace(/\D/g, ''))
  const end = Math.min(start + 100000, videoSize - 1)

  const contentLength = end - start + 1

  const headers = {
    'Content-Range': `bytes ${start}-${end}/${videoSize}`,
    'Accept-Ranges': 'bytes',
    'Content-Length': contentLength,
    'Content-Type': 'video/mp4',
  }

  res.writeHead(206, headers)

  const videoStream = fs.createReadStream(videoPath, { start, end })

  videoStream.pipe(res)

  videoStream.on('error', (err) => {
    console.log(err)
  })
})

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
})
