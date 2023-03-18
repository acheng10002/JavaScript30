// getting a user's webcam, I need a server, and it must be tied to a secure origin
// SECURE ORIGIN -  website that is https or local host

// selectors below
// video selector that is class player
// video will come in off the webcam, and it'll be piped into the video element
// then every 16 ms, take a snapshot of the video and dump the snapshot into the canvas
const video = document.querySelector('.player');

// manipulate pixels, change color, apply filters
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');

// strip is where I will put all my image
const strip = document.querySelector('.strip');

// snap is the audio element that will play when user takes photo
const snap = document.querySelector('.snap');

function getVideo() {
    navigator.mediaDevices.getUserMedia({video: true, audio: false})
    // above with return with a promise
    // PROMISE - special object is JS that represents the eventual completion or failure of an asynchronous operation 
    // and its result value; a promise is a way to handle asynchronous operations such as fetching data from a server 
    // or reading a file from disk without blocking the main thread of execution in the browser
    // const promise = new Promise((resolve, reject) => {
        // do some asynchronous operation
        // and call resolve() if it succeeds
        // or reject() if it fails
    // })

    // promise.then((value) => {
        // handle the resolved state
        // inside the .then(), I can access the resolved value, which I can pass as an argument to the callback function
    // }).catch((error) => {
        // handle the rejected state
        // inside the .catch(), I can access the reason for the rejection, which is passed as an argument to the callback function
    // });
        .then(localMediaStream => {
            console.log(localMediaStream);

            // below won't work automatically because localMediaStream is an object, and in order for video to work, it needs
            // video.src = localMediaStream;
            // to be converted to a URL for a live video feed
            // so now the video feed is converted into something the player can understand
            video.srcObject = localMediaStream;
            video.play();

            // video source is a blob, meaning it's raw data off the webcam
        })
        // need to handle error in case user doesn't allow access to their webcam
        .catch(err => {
            console.error(`OH NO!!!`, err);
        });

        // take a frame from the video and paint onto the canvas
}
function paintToCanvas() {
    const width = video.videoWidth;
    const height = video.videoHeight;
    
    // console.log(width, height);
    // I need to make sure the canvas width and height is the same size as the canvas width and height

    canvas.width = width;
    canvas.height = height;

    // every 16 ms, take a frame from the video and put it into the canvas
    // requestAnimationFrame ???
    // return the interval in case I ever need to stop it from painting and I can still access the interval
    return setInterval(() => {
        // call drawImage on context passing in video
        // 0, 0 start at the top left corner and paint the image to the width and height
        ctx.drawImage(video, 0, 0, width, height);

        // take the pixels out 
        let pixels = ctx.getImageData(0, 0, width, height);

        // mess with the pixels
        // pixels = redEffect(pixels);

        pixels = rgbSplit(pixels);
        // ctx.globalAlpha = 0.1;

        // pixels = greenScreen(pixels);

        // put the pixels back
        ctx.putImageData(pixels, 0, 0);

        // I get a special type of array meant for large numbers
        // console.log(pixels);

        // for every one pixel of the photo, there are 4 entries in the array: r, g, b, and alpha

    }, 16);
}

function takePhoto() {
    // play the snap sound
    snap.currentTime = 0;
    snap.play();

    // take the data out of the canvas
    const data = canvas.toDataURL('image/jpeg');
    // console.log(data);

    // in the console when I run takePhoto, I get a base64, a text-based representation of the photo
    // each snippet of the base64 is an attribute
    // I can create an image in a link to go into strip

    // url is data image, browser knows the text string stores an image
    const link = document.createElement('a');
    link.href = data;
    link.setAttribute('download', 'image1');

    // link.textContent = 'Download Image';
    // both the href and the src will be equal to the data
    // make the image visible in the window
    link.innerHTML = `<img src="${data}" alt="image1"/>`

    // hook takePhoto() up to the button

    strip.insertBefore(link, strip.firstChild);
}
// filters! 
// how filters work: get the pixels out of the canvas, mess with the pixels, and put them back in

function redEffect(pixels) {
    // data image array is missing some array methods, so I can't use map
    for (let i = 0; i < pixels.data.length; i+=4) {
        pixels.data[i + 0] = pixels.data[i + 0] + 100; // r
        pixels.data[i + 1] = pixels.data[i + 1] - 50; // g
        pixels.data[i + 2] = pixels.data[i + 2] * 0.5;// b
    } 
    return pixels;
}

function rgbSplit(pixels) {
    for (let i = 0; i < pixels.data.length; i+=4) {
        pixels.data[i - 150] = pixels.data[i + 0]; // r
        pixels.data[i + 100] = pixels.data[i + 1]; // g
        pixels.data[i - 150] = pixels.data[i + 2];// b
    } 
    return pixels;
}

function greenScreen(pixels) {
    // levels will hold the min and max green
    const levels = {};

    // this is all 6 slider buttons
    document.querySelectorAll('.rgb input').forEach((input) => {
        levels[input.name] = input.value;
    });

    // console.log(levels);

    for (i = 0; i < pixels.data.length; i = 1 + 4) {
        red = pixels.data[i + 0];
        green = pixels.data[i + 1];
        blue = pixels.data[i + 2];
        alpha = pixels.data[i + 3];

        if (red >= levels.rmin 
            && green >= levels.gmin 
            && blue >= levels.bmin 
            && red <= levels.rmax 
            && green <= levels.gmax 
            && blue <= levels.bmax) {
            // take it out
            pixels.data[i + 3] = 0;
        }
    }
    return pixels;
}

getVideo();

// listen for an event on the video element, and when listener is triggered, run paintToCanvas
// once the video is played, an event is emitted, call canplay, and then run paintToCanvas
video.addEventListener('canplay', paintToCanvas);

// have a mediastream, some id, active: true, but really not much to deal with