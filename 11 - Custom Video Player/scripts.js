// 3 parts: get my elements, 
const player = document.querySelector('.player');

// player is the parent element
const video = player.querySelector('.viewer');

// also need progress bar, progress filled, toggle, skip buttons, and player slider
const progress = player.querySelector('.progress');
const progressBar = player.querySelector('.progress__filled');
const toggle = player.querySelector('.toggle');
const skipButtons = player.querySelectorAll('[data-skip]');
const ranges = player.querySelectorAll('.player__slider');

// build my functions, 
// first work with toggle play
// when togglePlay is called, either call .play or .pause
function togglePlay() {
    const method = video.paused ? 'play' : 'pause';
    video[method]();
    // paused is a property that lives on the video; there is no playing property, only paused
    // if (video.paused) {
    //     video.play();
    // } else {
    //     video.pause();
    // }
}

function updateButton() {
    // updateButton is bound to the video itself
    const icon = this.paused ? '►' : '❚ ❚';
    toggle.textContent = icon;

    // console.log('Update the button');
}

function skip() {
    // how much will it skip
    // console.log(this.dataset.skip);
    video.currentTime += parseFloat(this.dataset.skip); 
}

function handleRangeUpdate() {
    video[this.name] = this.value;
    // console.log(this.name);
    // console.log(this.value);
}

// need to update the flex-basis value of the progress bar and that'll correspond with how long it is
// just need to calculate the flex-basis based on how long the video is and how far into it I currently am
function handleProgress() {
    const percent = (video.currentTime / video.duration) * 100;
    progressBar.style.flexBasis = `${percent}%`; 
}

function scrub(e) {
    // offsetX is a property of the event
    const scrubTime = (e.offsetX / progress.offsetWidth) * video.duration;
    video.currentTime = scrubTime;
    // console.log(e);
}

// when I play video, progressBar should be updating in realtime
// when I click on the progressBar and drag, it should update the video to correspond with that new place

// and then hook up the even listeners
// hook up togglePlay both to when I click the video and to when I click the button
video.addEventListener('click', togglePlay);

// listen to the video for whenever it is played or paused and then run updateButton
video.addEventListener('play', updateButton);
video.addEventListener('pause', updateButton);

// listen for the video to emit an event called timeupdate, and then when that happens, run handleProgress
// it won't run handleProgress if the video is paused
video.addEventListener('timeupdate', handleProgress);

toggle.addEventListener('click', togglePlay);
skipButtons.forEach(button => button.addEventListener('click', skip));

// listen for a change event on each of the ranges
ranges.forEach(range => range.addEventListener('change', handleRangeUpdate));
ranges.forEach(range => range.addEventListener('mousemove', handleRangeUpdate));

// listen for a click on the video bar, and wherever I have clicked is how far I should scrub the video
progress.addEventListener('click', scrub);

let mousedown = false;

// when someone moves their mouse, if mousedown is true, scrub(e) runs 
// if mousedown is false, it will just return false
// scrub requires e as an argument, so e has to be passed in the arrow function
progress.addEventListener('mousemove', (e) => mousedown && scrub(e));
progress.addEventListener('mousedown', () => mousedown = true);
progress.addEventListener('mouseup', () => mousedown = false);
