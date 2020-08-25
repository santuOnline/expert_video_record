/* global require */
var https = require('https');
const multipart = require('connect-multiparty')
const multipartMiddleware = multipart()
const path = require('path')
const os = require('os')
const fs = require('fs')
let videoStitch = require('video-stitch');
 
let videoConcat = videoStitch.concat;

var privateKey  = fs.readFileSync('key.key', 'utf8');
var certificate = fs.readFileSync('cert.cert', 'utf8');

var credentials = {key: privateKey, cert: certificate};

var express = require('express') ;
var app = express();
app.use(express.static('./public'))

var i = 0 ;
let oldfile = ' ';
let currentfile =' ';


app.get('/', function (req, res) {
//console.log('redirecting');  
//console.log(os.tmpdir());
res.redirect('/videoCapture.html')

})

app.post('/', multipartMiddleware, function(req, res) {
 // console.log('files', req.body.fname)
  
  //let location = path.join(os.tmpdir(), 'upload' + i++ + '.webm')
  let location = path.join(os.tmpdir() ,req.body.fname + '.webm')
  let newfile = path.join(os.tmpdir() ,req.body.fname + '_new.webm')
  currentfile = path.join(os.tmpdir() ,req.body.fname + '_current.webm')
  fs.access(location, fs.constants.F_OK | fs.constants.W_OK, (err) => {
    if (err) {
   //   console.error('file not present' + location)
      oldfile = location
      fs.rename(req.files.data.path, location, ()=>{
        console.log("base file written to " + location ); 
      })
   //   console.log(`upload successful, file written to ${location}`)
      res.send(`upload successful, file written to ${location}`)
      return
    }
    else {
      
   //   console.error('file write to temp' + newfile)
      fs.rename(req.files.data.path, newfile, ()=>{
//     console.log("\nFile Renamed in temp !\n"); 

        joinVideo(oldfile,newfile)
        res.send(`upload successful, file written to ${location}`)
      })

    }
    //file exists
  })

 // res.send(`upload successful, file written to ${location}`)
})

function joinVideo( oldfile,newfile){
  //let  location1= location.replace('.webm',i + '.webm') 
  videoConcat({
    silent: true, // optional. if set to false, gives detailed output on console
    overwrite: true// optional. by default, if file already exists, ffmpeg will ask for overwriting in console and that pause the process. if set to true, it will force overwriting. if set to false it will prevent overwriting.
  })
  .clips([
    {
      "fileName": oldfile
    },
    {
      "fileName": newfile
    }
  ])
  .output(currentfile ) //optional absolute file name for output file
  .concat()
  .then((outputFileName) => {
//    console.log('concat to ' + outputFileName + ' ' )
    fs.rename(outputFileName, oldfile, ()=>{
//      console.log("\ncurrent copied to old !\n"); 
    })
    
    fs.unlink(newfile, (err) => {
      if (err) {
        console.error('delete failed' + err)
        return
      }
    })
  })
  .catch((err) =>{
    console.error('process failed' + err) ;
  });

}

app.post('/data', (req,res) =>{
  var fs = require("fs");
  var data = '';
  var readerStream = fs.createReadStream(req.file.name);
  console.log( "saving into this " + req.file.name)
  // Set the encoding to be utf8. 
readerStream.setEncoding('UTF8');

// Handle stream events --> data, end, and error
readerStream.on('data', function(chunk) {
   data += chunk;
});
})

var httpsServer = https.createServer(credentials, app)
httpsServer.listen(8080, function () {
  console.log('Video recorder app listening on port 8080!')
})
