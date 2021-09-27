const inputContainer = document.getElementById('input-container');
const countdownForm = document.getElementById('countdownForm');
const dateEl = document.getElementById('date-picker');

const countdownEl = document.getElementById('countdown');
const countdownElTitle = document.getElementById('countdown-title');
const countdownBtn = document.getElementById('countdown-btn');
const timeElements = document.querySelectorAll('span');

const completeEl = document.getElementById('complete');
const completeElInfo = document.getElementById('complete-info');
const completeElBtn = document.getElementById('complete-button');

let countdownTitle = '';
let countdownDate = '';
let countdownValue = Date;
let countdownActive;
let savedCountdown;

const second = 1000;
const minute = second * 60;
const hour = minute * 60;
const day = hour * 24;

// Set today/minimum date
const today = new Date().toISOString().split('T')[0];
dateEl.setAttribute('min', today);

// Update DOM
function updateDOM() {
    countdownActive = setInterval(() => {
        const now = new Date().getTime();
        const distance = countdownValue - now;

        const days = Math.floor(distance / day);
        const hours = Math.floor((distance % day) / hour);
        const minutes = Math.floor((distance % hour) / minute);
        const seconds = Math.floor((distance % minute) / second);

        // Hide input
        inputContainer.hidden = true;

        // Countdown complete messege
        if (distance < 0) {
            countdownEl.hidden = true;
            clearInterval(countdownActive);
            completeElInfo.textContent = `${countdownTitle} is completed on ${countdownDate}`;
            completeEl.hidden = false;
        } else {
            // Populate countdown
            countdownElTitle.textContent = `${countdownTitle}`;
            timeElements[0].textContent = `${days}`;
            timeElements[1].textContent = `${hours}`;
            timeElements[2].textContent = `${minutes}`;
            timeElements[3].textContent = `${seconds}`;

            // Hide complete messege
            completeEl.hidden = true;

            // Show Countdown
            countdownEl.hidden = false;
        }
    }, second);
}

// Take values form "form" input
function updateCountdown(e) {
    e.preventDefault();
    countdownTitle = e.srcElement[0].value;
    countdownDate = e.srcElement[1].value;

    // Creating object and saving on local storage
    savedCountdown = {
        title: countdownTitle,
        date: countdownDate,
    };
    localStorage.setItem('countdown', JSON.stringify(savedCountdown));

    // Checking for a valid date
    if (countdownDate === '') {
        alert('Please select a date properly.');
    } else {
        // Get number version of current date & update DOM
        countdownValue = new Date(countdownDate).getTime();
        updateDOM();
    }
}

// Reset Countdown
function reset() {
    // Hide countdown
    countdownEl.hidden = true;

    // Show Input container
    inputContainer.hidden = false;

    // Hide complete messege
    completeEl.hidden = true;

    // Stop countdown
    clearInterval(countdownActive);

    // Reset Title and Date
    countdownTitle = '';
    countdownDate = '';

    // Remove countdown form local storage
    localStorage.removeItem('countdown');
}

// Restoring previous session form local storage if available
function restorePreviousCountdown() {
    if (localStorage.getItem('countdown')) {
        inputContainer.hidden = true;
        savedCountdown = JSON.parse(localStorage.getItem('countdown'));
        countdownTitle = savedCountdown.title;
        countdownDate = savedCountdown.date;
        countdownValue = new Date(countdownDate).getTime();
        updateDOM();
    }
}

// Event listeners
countdownForm.addEventListener('submit', updateCountdown);
countdownBtn.addEventListener('click', reset);
completeElBtn.addEventListener('click', reset);

// On load, check local storage
restorePreviousCountdown();