// work in the console to start
// global variable
let countdown;

const timerDisplay = document.querySelector('.display__time-left');

const endTime = document.querySelector('.display__end-time');

const buttons = document.querySelectorAll('[data-time]');

function timer(seconds) {
    // need to clear any existing timers
    clearInterval(countdown);


    // 1. how much time I would like in seconds
    // 2. elapse that time over the number of seconds

    // setInterval does not run sometimes when I step away from the time
    // and in ios, when I am scrolling, the interval will be paused
    // setInterval(function() {
    //     seconds--;
    // }, 1000);

    // 1. need to figure out when the timer started
    const now = Date.now();

    // now is in ms, so seconds needs to be multipled by 1000
    const then = now + seconds * 1000;

    // console.log({now, then});

    // displayTimeLeft runs immediately once
    displayTimeLeft(seconds);

    displayEndTime(then);

    // 2. every single second I need to display the amount of time left on the clock
    // using setInterval, and it's ok if it's not running every single second
    // ex. if it skips two seconds, it will still update seconds later

    countdown = setInterval(() => {
        const secondsLeft = Math.round((then - Date.now()) /1000);

        // check if I should stop the setInterval
        if (secondsLeft <= 0) {
            clearInterval(countdown);
            return;
        }

        // displayTimeLeft(secondsLeft);
        // the Interval needs to be stored in its own variable

        // problem here, setInterval only runs after the second has elapsed because it does not run immediately
        // setInterval waits for first second to elapse
        
        // displayTimeLeft runs again every single time I do the interval
        displayTimeLeft(secondsLeft);
    }, 1000);
}

function displayTimeLeft(seconds) {

    const minutes = Math.floor(seconds / 60);

    const remainderSeconds = seconds % 60;

    const display = `${minutes}:${remainderSeconds < 10 ? '0' : ''}${remainderSeconds}`;

    document.title = display;

    timerDisplay.textContent = display;

    // console.log(seconds);
}

// Date.now() number of ms since 1/1/1970
// to convert what Date.now() returns into a date: new Date((Date.now())
// I can put new Date((Date.now()) in a variable called x
// I can call x.getDay(), x.getMonth()

// timestamp is then, when I want to finish
function displayEndTime(timestamp) {
    
    // create a new date object here
    const end = new Date(timestamp);

    const hour = end.getHours();

    const adjustedHour = hour > 12 ? hour - 12: hour;

    const minutes = end.getMinutes();

    endTime.textContent = `Be Back At ${adjustedHour}:${minutes < 10 ? '0' : ''}${minutes}`;
}

function startTimer() {
    // this.dataset gives me an object wiht the time
    // this.dataset.time gives me a string of the number of seconds
    // console.log(this.dataset.time);

    const seconds = parseInt(this.dataset.time);

    // console.log(seconds);

    timer(seconds);
}

buttons.forEach(button => button.addEventListener('click', startTimer));

// if I click on the buttons too quickly, I would queue up all the timers

// if a form has a name attribute, document.name gives me the form element
// if the input in the form has a name, it nests: document.customForm.minutes gives me the input element
document.customForm.addEventListener('submit', function(e) {
    
    // prevents the page refreshing and sending the data over at get
    e.preventDefault();

    //this.minutes is the input
    const mins = this.minutes.value;
    
    // console.log(mins);
    
    timer(mins * 60);
    this.reset();
});
