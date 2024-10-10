document.addEventListener('DOMContentLoaded', function() {
    let themes = {
      animaux: ['koala.jpg', 'lion.jpg', 'elephant.jpg'], // Array of image filenames for "Animaux"
      fruits_legumes: ['apple.jpg', 'banana.jpg', 'carrot.jpg'], // Example for "Fruits & Légumes"
      monuments: ['eiffel_tower.jpg', 'statue_of_liberty.jpg', 'pyramids.jpg'] // Example for "Monuments"
    };
  
    let correctAnswers = {
      'koala.jpg': 'koala',
      'lion.jpg': 'lion',
      'elephant.jpg': 'elephant',
      'apple.jpg': 'apple',
      'banana.jpg': 'banana',
      'carrot.jpg': 'carrot',
      'eiffel_tower.jpg': 'eiffel tower',
      'statue_of_liberty.jpg': 'statue of liberty',
      'pyramids.jpg': 'pyramids'
    };
  
    let currentTheme = '';
    let currentImageIndex = 0;
    let score = 0;
    let timerInterval;
    let timeLeft = 30;
  
    const gameContainer = document.getElementById('game-container');
    const gameImage = document.getElementById('game-image');
    const timerDisplay = document.getElementById('time');
    const scoreDisplay = document.getElementById('score-count');
    const guessInput = document.getElementById('guess-input');
    const errorMessage = document.getElementById('error-message');
  
    // Function to start the game with the selected theme
    function startGame(theme, button) {
      currentTheme = theme;
      currentImageIndex = 0;
      score = 0;
      timeLeft = 30;
  
      scoreDisplay.textContent = score;
      showImage();
      gameContainer.style.display = 'block';
      startTimer();

      button.disabled = true;
      button.style.backgroundColor = '#d3d3d3'; // Graying out the button
      button.style.cursor = 'not-allowed';
    }
  
    // Show the current image based on the selected theme
    function showImage() {
      const themeImages = themes[currentTheme];
      if (currentImageIndex < themeImages.length) {
        gameImage.src = `images/${themeImages[currentImageIndex]}`;
      } else {
        endGame();
      }
    }
  
    // Function to handle the user guess
    function checkGuess() {
      const guess = guessInput.value.toLowerCase();
      const currentImage = themes[currentTheme][currentImageIndex];
      if (guess === correctAnswers[currentImage].toLowerCase()) {
        score++;
        scoreDisplay.textContent = score;
        currentImageIndex++;
        errorMessage.textContent = '';  // Clear any error message when the guess is correct
        guessInput.value = '';
        showImage();
      } else {
        errorMessage.textContent = 'Incorrecte! Essaye encore ou passe à l\'image suivante.';
      }
    }

    function skipImage() {
        currentImageIndex++;
        guessInput.value = '';
        errorMessage.textContent = ''; // Clear any previous error messages
        showImage();
    }
  
    // Function to start the timer
    function startTimer() {
      timerInterval = setInterval(function() {
        timeLeft--;
        timerDisplay.textContent = timeLeft;
        if (timeLeft <= 0) {
          endGame();
        }
      }, 1000);
    }
  
    // Function to end the game
    function endGame() {
      clearInterval(timerInterval);
      alert('Game over! Your score: ' + score);
      gameContainer.style.display = 'none';
    }
  
    // Attach event listener to theme buttons
    const themeButtons = document.querySelectorAll('.theme-button');
    themeButtons.forEach(button => {
      button.addEventListener('click', function() {
        const theme = this.getAttribute('data-theme');
        if (!this.disabled) {
            startGame(theme, this);
          }
      });
    });
  
    // Event listener for submitting guesses
    document.getElementById('submit-guess').addEventListener('click', checkGuess);
    document.getElementById('skip-image').addEventListener('click', skipImage);
  });
  