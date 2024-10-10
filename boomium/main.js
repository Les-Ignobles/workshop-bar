document.addEventListener('DOMContentLoaded', function() {
    let currentTheme = '';
    let currentImageIndex = 0;
    let score = 0;
    let timerInterval;
    let timeLeft = 30;
    let currentAnswers = [];

    const gameContainer = document.getElementById('game-container');
    const gameImage = document.getElementById('game-image');
    const timerDisplay = document.getElementById('time');
    const scoreDisplay = document.getElementById('score-count');
    const guessInput = document.getElementById('guess-input');
    const errorMessage = document.getElementById('error-message');
    const themeSelectionDiv = document.getElementById('theme-selection');
    const endGameModal = document.getElementById('end-game-modal'); // Modal
    const finalScoreDisplay = document.getElementById('final-score'); // Score in modal
    const playAgainButton = document.getElementById('play-again');

    const getThemes = async () => {
        const apiKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9teXVjb2p5YWxwZGRwZ21ua2x0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjg1NDc3ODEsImV4cCI6MjA0NDEyMzc4MX0.HEywW3UJjYSrSTyqMsRCk7HcXKFweSertdVGidkm91U"
        const header = new Headers({
          'Content-Type': 'application/json',
          'apikey': apiKey
        });
        const response = await fetch('https://omyucojyalpddpgmnklt.supabase.co/rest/v1/themes', {
          method: 'GET',
          headers: header
        });
      
        const data = await response.json();
        console.log(data);

        populateThemes(data);

        return data;
    };

    function populateThemes(apiData) {
        apiData.forEach(themeData => {
            const button = document.createElement('button');
            button.classList.add('theme-button');
            
            // Clean up the theme name (remove newline or extra spaces)
            const themeName = themeData.name.trim();
            button.textContent = themeName.toUpperCase(); // Display name in uppercase
            button.setAttribute('data-theme-id', themeData.id);

            // Add click event listener to the button
            button.addEventListener('click', function() {
                if (!button.classList.contains('disabled')) {
                    startGame(themeData, button);
                }
            });

            // Append the button to the theme selection div
            themeSelectionDiv.appendChild(button);
        });
    }

    function startGame(themeData, button) {
        currentTheme = themeData;
        console.log(currentTheme);
        currentAnswers = Object.entries(themeData.answers); // Get the answers as an array of [key, value] pairs
        currentImageIndex = 0;
        score = 0;
        timeLeft = 30;
    
        scoreDisplay.textContent = score;
        showImage();
        gameContainer.style.display = 'block';
        startTimer();
    
        // Disable the theme button after the game starts
        button.disabled = true;
        button.classList.add('disabled'); // Graying out the button
      }
    
      // Show the current image based on the selected theme
      function showImage() {
        if (currentImageIndex < currentAnswers.length) {
          const [answer, image] = currentAnswers[currentImageIndex];
          gameImage.src = `images/${image}`;
          errorMessage.textContent = ''; // Clear any previous error messages
        } else {
          endGame();
        }
      }
    
      // Function to handle the user guess
      function checkGuess() {
        const guess = guessInput.value.toLowerCase();
        const [correctAnswer, image] = currentAnswers[currentImageIndex]; // Get the current correct answer
        
        if (guess === correctAnswer.toLowerCase()) {
          score++;
          scoreDisplay.textContent = score;
          errorMessage.textContent = '';  // Clear any error message when the guess is correct
          currentImageIndex++;
          guessInput.value = '';
          showImage();
        } else {
          errorMessage.textContent = 'Incorrect! Try again or skip the image.';
        }
      }
    
      // Function to skip the current image without affecting the score
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
    
      function endGame() {
        clearInterval(timerInterval);
        gameContainer.style.display = 'none';
        showEndGameModal(); // Show cool modal
      }

      function showEndGameModal() {
        finalScoreDisplay.textContent = score; // Set final score
        endGameModal.style.display = 'flex'; // Show the modal
      }
    
      // Disable the theme button after a theme is finished
      function disableThemeButton(themeId) {
        const themeButton = document.querySelector(`[data-theme-id="${themeId}"]`);
        if (themeButton) {
          themeButton.disabled = true;
          themeButton.classList.add('disabled'); // Grayed out
        }
      }

      playAgainButton.addEventListener('click', function() {
        endGameModal.style.display = 'none'; // Hide modal
      });
    
      // Event listener for submitting guesses
      document.getElementById('submit-guess').addEventListener('click', checkGuess);
    
      // Event listener for skipping images
      document.getElementById('skip-image').addEventListener('click', skipImage);

    getThemes();
  });
  