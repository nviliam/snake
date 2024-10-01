const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startScreen = document.getElementById('startScreen');
const gameOverScreen = document.getElementById('gameOverScreen');
const restartBtn = document.getElementById('restart');
const mainMenuBtn = document.getElementById('mainMenu');
const character1Btn = document.getElementById('character1');
const character2Btn = document.getElementById('character2');

let snake, apple, direction, characterColor, isGameOver, appleCount, gameSpeed;
const gridSize = 20;

const resizeCanvas = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
};

// Hangfájlok tömbje
const eatSounds = [
    'Sound/eat_sound1.mp3',
    'Sound/eat_sound2.mp3',
    'Sound/eat_sound3.mp3'
];

// Véletlenszerű hang lejátszása
const playRandomEatSound = () => {
    const randomIndex = Math.floor(Math.random() * eatSounds.length);
    const audio = new Audio(eatSounds[randomIndex]);
    audio.volume = 0.2;
    audio.play();
};

const resetGame = () => {
    resizeCanvas();
    snake = [{ x: Math.floor(canvas.width / 2 / gridSize), y: Math.floor(canvas.height / 2 / gridSize) }];
    apple = {
        x: Math.floor(Math.random() * (canvas.width / gridSize)),
        y: Math.floor(Math.random() * (canvas.height / gridSize))
    };
    direction = { x: 1, y: 0 }; // Kígyó kezdetben jobbra mozog
    isGameOver = false;
    appleCount = 0;
    gameSpeed = 100;  
    drawGame();
};

const drawGame = () => {
    if (isGameOver) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Alma kirajzolása
    ctx.fillStyle = 'red';
    ctx.fillRect(apple.x * gridSize, apple.y * gridSize, gridSize, gridSize);

    // Kígyó kirajzolása
    ctx.fillStyle = characterColor;  
    snake.forEach(segment => ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize, gridSize));

    // Mozgás
    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

    // Kígyó növelése, ha megeszi az almát
    if (head.x === apple.x && head.y === apple.y) {
        apple = {
            x: Math.floor(Math.random() * (canvas.width / gridSize)),
            y: Math.floor(Math.random() * (canvas.height / gridSize))
        };
        appleCount++;

        // Játsszunk le egy véletlenszerű hangot
        playRandomEatSound();

        if (appleCount % 5 === 0) gameSpeed = Math.max(50, gameSpeed - 10); 
    } else {
        snake.pop();
    }

    snake.unshift(head);

    // Ütközés ellenőrzése
    if (
        head.x < 0 || head.x >= canvas.width / gridSize ||
        head.y < 0 || head.y >= canvas.height / gridSize ||
        snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y)
    ) {
        gameOver();
    }

    setTimeout(drawGame, gameSpeed);
};

const gameOver = () => {
    isGameOver = true;
    gameOverScreen.style.display = 'block';
    canvas.style.display = 'none';
};

document.addEventListener('keydown', (event) => {
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
        const newDirection = {
            ArrowUp: { x: 0, y: -1 },
            ArrowDown: { x: 0, y: 1 },
            ArrowLeft: { x: -1, y: 0 },
            ArrowRight: { x: 1, y: 0 }
        }[event.key];

        if (newDirection.x !== -direction.x && newDirection.y !== -direction.y) {
            direction = newDirection;
        }
    }
});

window.addEventListener('resize', resizeCanvas);

restartBtn.addEventListener('click', () => {
    gameOverScreen.style.display = 'none';
    canvas.style.display = 'block';
    resetGame();
});

mainMenuBtn.addEventListener('click', () => {
    gameOverScreen.style.display = 'none';
    startScreen.style.display = 'block';
    canvas.style.display = 'none';
});

character1Btn.addEventListener('click', () => {
    characterColor = 'green';  
    startScreen.style.display = 'none';
    canvas.style.display = 'block';
    resetGame();
});

character2Btn.addEventListener('click', () => {
    characterColor = 'blue';  
    startScreen.style.display = 'none';
    canvas.style.display = 'block';
    resetGame();
});
