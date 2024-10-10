document.addEventListener('DOMContentLoaded', () => {
  const cells = document.querySelectorAll('.cell');
  const restartButton = document.getElementById('restart-button');
  const player1Video = document.getElementById('player1-video');
  const player2Video = document.getElementById('player2-video');
  const player1CaptureBtn = document.getElementById('player1-capture');
  const player2CaptureBtn = document.getElementById('player2-capture');
  const gameStatus = document.getElementById('game-status');
  
  // Player name inputs and display elements
  const player1NameInput = document.getElementById('player1-name-input');
  const player2NameInput = document.getElementById('player2-name-input');
  const player1NameDisplay = document.getElementById('player1-name-display');
  const player2NameDisplay = document.getElementById('player2-name-display');

  let player1Name = 'Player 1';
  let player2Name = 'Player 2';

  // Variables for game logic
  let currentPlayer = 'player1'; // 'player1' or 'player2'
  let gameState = ['', '', '', '', '', '', '', '', ''];
  let player1Photo = null;
  let player2Photo = null;
  let isGameOver = false;

  let player1Stream = null;
  let player2Stream = null;

  const player1PhotoDisplay = document.getElementById('player1-photo-display');
  const player2PhotoDisplay = document.getElementById('player2-photo-display');

  // Start video stream from the webcam for Player 1
  navigator.mediaDevices.getUserMedia({ video: true })
    .then((stream) => {
      player1Video.srcObject = stream;
      player1Stream = stream; // Save Player 1's stream for stopping later
    })
    .catch((error) => {
      console.error('Error accessing Player 1 webcam: ', error);
    });

  // Start video stream from the webcam for Player 2
  navigator.mediaDevices.getUserMedia({ video: true })
    .then((stream) => {
      player2Video.srcObject = stream;
      player2Stream = stream; // Save Player 2's stream for stopping later
    })
    .catch((error) => {
      console.error('Error accessing Player 2 webcam: ', error);
    });

  // Capture player 1 photo
  player1CaptureBtn.addEventListener('click', () => {
    const canvas = document.createElement('canvas');
    canvas.width = player1Video.videoWidth;
    canvas.height = player1Video.videoHeight;
    canvas.getContext('2d').drawImage(player1Video, 0, 0, canvas.width, canvas.height);
    player1Photo = canvas.toDataURL('image/png'); // Store photo as base64 string

    // Stop the Player 1 webcam stream and replace video with captured photo
    stopStream(player1Stream);
    replaceVideoWithImage(player1Video, player1Photo);

    // Display the photo next to Player 1
    showPhotoInPlaceholder(player1PhotoDisplay, player1Photo);
  });

  // Capture player 2 photo
  player2CaptureBtn.addEventListener('click', () => {
    const canvas = document.createElement('canvas');
    canvas.width = player2Video.videoWidth;
    canvas.height = player2Video.videoHeight;
    canvas.getContext('2d').drawImage(player2Video, 0, 0, canvas.width, canvas.height);
    player2Photo = canvas.toDataURL('image/png'); // Store photo as base64 string

    // Stop the Player 2 webcam stream and replace video with captured photo
    stopStream(player2Stream);
    replaceVideoWithImage(player2Video, player2Photo);

    // Display the photo next to Player 2
    showPhotoInPlaceholder(player2PhotoDisplay, player2Photo);
  });

  // Update player names when they are entered
  player1NameInput.addEventListener('change', () => {
    player1Name = player1NameInput.value || 'Player 1';
    player1NameDisplay.textContent = player1Name;
  });

  player2NameInput.addEventListener('change', () => {
    player2Name = player2NameInput.value || 'Player 2';
    player2NameDisplay.textContent = player2Name;
  });

  // Function to stop the webcam stream
  function stopStream(stream) {
    stream.getTracks().forEach(track => track.stop());
  }

  // Function to replace video element with an image element
  function replaceVideoWithImage(videoElement, imageSrc) {
    const img = document.createElement('img');
    img.src = imageSrc;
    img.width = videoElement.width; // Match video size
    img.height = videoElement.height; // Match video size
    videoElement.parentNode.replaceChild(img, videoElement); // Replace the video with the image
  }

  // Function to display the photo next to Player's video
  function showPhotoInPlaceholder(placeholderElement, imageSrc) {
    const img = document.createElement('img');
    img.src = imageSrc;
    placeholderElement.innerHTML = ''; // Clear any existing content
    placeholderElement.appendChild(img); // Add the captured photo
  }

  // Handle cell click for the game
  cells.forEach(cell => {
    cell.addEventListener('click', () => {
      if (!isGameOver && gameState[cell.dataset.index] === '' && player1Photo && player2Photo) {
        gameState[cell.dataset.index] = currentPlayer;
        const img = document.createElement('img');
        img.src = currentPlayer === 'player1' ? player1Photo : player2Photo;
        cell.appendChild(img);

        if (checkForWinner()) {
          gameStatus.textContent = currentPlayer === 'player1' ? `${player1Name} a gagné!` : `${player2Name} a gagné!`;
          isGameOver = true; // Stop the game
        } else if (gameState.every(cell => cell !== '')) {
          gameStatus.textContent = 'C\'est un match nul!';
          isGameOver = true; // Stop the game
        }

        // Switch turn
        currentPlayer = currentPlayer === 'player1' ? 'player2' : 'player1';
      }
    });
  });

  // Restart the game
  restartButton.addEventListener('click', () => {
    gameState = ['', '', '', '', '', '', '', '', ''];
    cells.forEach(cell => {
      cell.innerHTML = ''; // Clear all images
    });
    currentPlayer = 'player1';
    isGameOver = false;
    gameStatus.textContent = 'New game started!'; // Reset game status message

    // Reload the page to restart video stream (alternative approach)
    location.reload(); // Reload the page to reset video and game state
  });

  // Function to check for winner
  function checkForWinner() {
    const winningCombinations = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ];

    return winningCombinations.some(combination => {
      const [a, b, c] = combination;
      return gameState[a] === currentPlayer && gameState[a] === gameState[b] && gameState[a] === gameState[c];
    });
  }
});
