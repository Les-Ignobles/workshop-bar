const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const startButton = document.getElementById('start-btn');
const countdownElement = document.getElementById('countdown');
const resultMessage = document.getElementById('result-message');
const capturedPhoto = document.getElementById('captured-photo');

let countdownInterval;

// Start video stream from the user's camera
function startVideoStream() {
  navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
      video.srcObject = stream;
    })
    .catch(err => {
      console.error("Error accessing camera: ", err);
    });
}

// Countdown before capturing the photo
function startCountdown(seconds) {
  countdownElement.textContent = seconds;

  countdownInterval = setInterval(() => {
    seconds--;
    countdownElement.textContent = seconds;

    if (seconds === 0) {
      clearInterval(countdownInterval);
      capturePhoto();
    }
  }, 1000);
}

// Capture a photo from the video stream
function capturePhoto() {
  const context = canvas.getContext('2d');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  context.drawImage(video, 0, 0, canvas.width, canvas.height);

  const dataURL = canvas.toDataURL('image/png');
  capturedPhoto.src = dataURL;
  capturedPhoto.style.display = 'block';

  simulateOpenAICall(dataURL); // Fake call to OpenAI
}

// Simulate the response from OpenAI for whether the user can drive or not
function simulateOpenAICall(photoData) {
  // Fake response after a short delay
  setTimeout(() => {
    const randomDecision = Math.random() > 0.5 ? "Tu peux conduire!" : "T'as aucune dégaine ! Laisse le volant à un pote à toi";
    resultMessage.textContent = randomDecision;
    resultMessage.style.color = randomDecision === "Tu peux conduire!" ? "green" : "red";
  }, 2000);
}

// Start the test flow when the button is clicked
startButton.addEventListener('click', () => {
  resultMessage.textContent = "";
  capturedPhoto.style.display = "none";
  startCountdown(3);
});

// Start the camera stream on page load
window.onload = startVideoStream;