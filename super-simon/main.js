document.addEventListener('DOMContentLoaded', function() {
    const simonBoard = document.getElementById('simon-board');
    const startButton = document.getElementById('start-button');
    const currentScoreDisplay = document.getElementById('current-score');
    const highScoreDisplay = document.getElementById('high-score');
  
    let gameSequence = [];
    let playerSequence = [];
    let score = 0;
    let highScore = 0;
    let inGame = false;
    let simonButtons = {}; // To store dynamically created buttons

    const getColors = async () => {
        const apiKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9teXVjb2p5YWxwZGRwZ21ua2x0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjg1NDc3ODEsImV4cCI6MjA0NDEyMzc4MX0.HEywW3UJjYSrSTyqMsRCk7HcXKFweSertdVGidkm91U"
        const header = new Headers({
          'Content-Type': 'application/json',
          'apikey': apiKey
        });

        const response = await fetch('https://omyucojyalpddpgmnklt.supabase.co/rest/v1/colors', {
          method: 'GET',
          headers: header
        });
      
        const data = await response.json();
        console.log(data);

        createSimonBoard(data);

        return data;
    };

    function createSimonBoard(apiData) {
        apiData.forEach((colorData) => {
          const colorName = colorData.name.trim(); // Clean up the name
          const button = document.createElement('div');
          button.id = colorName;
          button.style.backgroundColor = colorName; // Add color name as class
          button.classList.add('simon-button'); // Add color name as class
    
          // Add event listener for clicks on each button
          button.addEventListener('click', () => {
            handlePlayerInput(colorName);
            lightUpButton(colorName);
          });
    
          console.log(colorData);
          console.log(simonBoard);
          // Append button to the simon-board
          simonBoard.appendChild(button);
    
          // Save reference to the button in the simonButtons object
          simonButtons[colorName] = button;
        });
      }
  
    // Utility function to play button light-up animation
    function lightUpButton(color) {
      simonButtons[color].classList.add('active');
      setTimeout(() => {
        simonButtons[color].classList.remove('active');
      }, 500); // Keep the light on for 500ms
    }
  
    // Function to play the sequence to the player
    function playSequence() {
      let delay = 1000; // Start delay at 1 second
      gameSequence.forEach((color, index) => {
        setTimeout(() => {
          lightUpButton(color);
        }, delay * (index + 1)); // Light up each color after a delay
      });
    }
  
    // Function to add a new color to the sequence
    function addNewColorToSequence() {
      const colors = ['green', 'red', 'yellow', 'blue'];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      gameSequence.push(randomColor);
      playerSequence = []; // Reset player sequence for the next round
      setTimeout(playSequence, 1000); // Give a small delay before starting the sequence
    }
  
    // Function to start the game
    function startGame() {
      console.log("start")
      if (!inGame) {
        inGame = true; // Flag to ensure game is active
        gameSequence = [];
        playerSequence = [];
        score = 0;
        currentScoreDisplay.textContent = score;
        addNewColorToSequence();
        addNewColorToSequence();
        addNewColorToSequence();
      }
    }
  
    // Function to handle player input
    function handlePlayerInput(color) {
      if (!inGame) return; // Ignore input if the game hasn't started
  
      playerSequence.push(color);
      const currentStep = playerSequence.length - 1;
  
      // Check if the player's input matches the game's sequence
      if (playerSequence[currentStep] !== gameSequence[currentStep]) {
        // Player made a mistake, end the game
        alert('You lost! Try again.');
        if (score > highScore) {
          highScore = score;
          highScoreDisplay.textContent = highScore;
        }
        inGame = false; // Game over
        return;
      }
  
      // If player successfully matches the full sequence
      if (playerSequence.length === gameSequence.length) {
        score++;
        currentScoreDisplay.textContent = score;
        setTimeout(() => {
          addNewColorToSequence(); // Add a new color after the correct input
        }, 1000);
      }
    }
  
    // Add event listeners to Simon buttons
    Object.keys(simonButtons).forEach(color => {
      simonButtons[color].addEventListener('click', () => {
        handlePlayerInput(color);
        lightUpButton(color);
      });
    });
  
    // Start button listener
    startButton.addEventListener('click', startGame);
    getColors();
  });
  