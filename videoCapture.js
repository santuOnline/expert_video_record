/* global MediaRecorder $ */
/*eslint no-console: 0*/

const record = document.getElementById('record')
const stop = document.getElementById('stop')
let filename= "video" + Date.now();
const param = (new URLSearchParams(window.location.search)).get('name')
if (param === ' '){
  console.log(param)
  filename= "video" + Date.now();
}
else {
  filename= param + Date.now();
}
 console.log('filename: ' + filename)

if (!navigator.mediaDevices){
  alert('getUserMedia support required to use this page')
}

 let  chunks = []
 let myVar 
let onDataAvailable = (e) => {
  chunks.push(e.data)
}

// Not showing vendor prefixes.
navigator.mediaDevices.getUserMedia({
  audio: true,
  video: {
    width: { ideal: 1280 },
    height: { ideal: 720 }
  }
}).then((mediaStream) => {
  const recorder = new MediaRecorder(mediaStream)
  recorder.ondataavailable = onDataAvailable
  const video = document.querySelector('video')
 /* const url = window.URL.createObjectURL(mediaStream)
  video.src = url*/
  video.srcObject = mediaStream

  record.onclick = () => {
    recorder.start()

     myVar = setInterval(myTimer, 10000);

    function myTimer() {
        recorder.stop();
        chunks = [];
        recorder.start();

    }

    document.getElementById('status').innerHTML = 'recorder started'
    console.log(recorder.state)
    console.log('recorder started')
  }

  stop.onclick = ()=> {
    clearInterval(myVar);
    recorder.stop()
    console.log(recorder.state)
    document.getElementById('status').innerHTML = 'recorder stopped'
    console.log('recorder stopped')
  }

  video.onloadedmetadata = (e) => {
    console.log('onloadedmetadata', e)
  }

  recorder.onstop = (e) => {   
    console.log('e', e)
    console.log('chunks', chunks)
    const bigVideoBlob = new Blob(chunks, {'type' : 'video/webm; codecs=webm'})
    let fd = new FormData()
    fd.append('fname', filename)
    fd.append('data', bigVideoBlob)
    $.ajax({
      type: 'POST',
      url: '/',
      data: fd,
      processData: false,
      contentType: false
    }).done(function(data) {
      console.log(data)
    })
  }
}).catch(function(err){
  console.log('error', err)
})
