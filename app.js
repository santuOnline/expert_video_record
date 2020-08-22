/* global require */

const multipart = require('connect-multiparty')
const multipartMiddleware = multipart()
const path = require('path')
const os = require('os')
const fs = require('fs')

var express = require('express')
var app = express()
app.use(express.static('.'))


app.get('/', function (req, res) {
  res.redirect('/videoCapture.html')
})

app.post('/', multipartMiddleware, function(req, res) {
  console.log('files', req.files.data.path)
  
  let location = path.join(os.tmpdir(), 'upload.webm')
  fs.rename(req.files.data.path, location, ()=>{
    console.log("\nFile Renamed!\n"); 
  })
  console.log(`upload successful, file written to ${location}`)
  res.send(`upload successful, file written to ${location}`)
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
