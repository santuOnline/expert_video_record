"#video_record from browser to web server" 

This is a nodejs project which can record video from webcam and continously upload to web server. This can be used as a plug and play solution for cases where recording of user video is required. 

The code by Mike Rissem https://gist.github.com/rissem/d51b1997457a7f6dc4cf05064f5fe984 does this job in a much simpler way, but it had a major problem. Rissem's code uploads the video at the end of the session. If the recording session is too long, then the upload file will be huge. Low network speed can't handle such huge uploads. 

So I have changed it to upload in intervals of 10 secs each. Every 10 sec the video recorded is uploaded to server and stitched to the older video. At the end of the recording session, you have the whole video on the server. Low network speed or choppy internet connection isn't an issue in this. 

## Getting Started

1. Clone the project into your target/ Download and unzip.
2. Run "npm install" in cmd.
3. Install ffmpeg on your machine.
4. In case of windows machine place the path to ffmpeg.exe to 'PATH' variable on your windows machine.
5. For linux just install it from your  respective software repo with "apt-get" or "yum". 
6. Check if "ffmpeg" command gives any output on the command line terminal. If not, check the installation. It is necessary.
7. Go to the project folder and deploy with  "nodemon app.js" in command line terminal.
8. Go to "server address:8080/videoCapture.html?name=filename" on your browser. The "filename" is the name of the video file saved to server, passed as a parm.
9. press "start" to start the recording and "stop" to stop the recording


### Prerequisites
1. Server environment with FFMPEG installed. "FFMPEG" command should give output on command line terminal, else get it installed.
2. NodeJS and NPM
3. The server has to be on HTTPS:// or else you can test on localhost. HTTP:// does not allow user media access.


## Authors

* **Somesh Mahanty** - *Initial work* - modification on Mike Rissem's code https://gist.github.com/rissem/d51b1997457a7f6dc4cf05064f5fe984

## License

You it as you see fit. 

## Acknowledgments

* I built upon code provided by Mike Rissem. The code repo is https://gist.github.com/rissem/d51b1997457a7f6dc4cf05064f5fe984

