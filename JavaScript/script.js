"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
let pageContainer = document.querySelector('.container');
let cloudContainer = document.querySelector('.cloud_container');
let gameContainer = document.querySelector('.game_container');
let keyboardContainer = document.querySelector('.keyboard');
let wordDisplay = document.querySelector('.hangman');
let imageContainer = document.querySelector('.image_container');
let playAgainContainer = document.querySelector('.play-again');
const playAgainButton = document.createElement('button');
const winningAudio = new Audio('../audio/buzz_winning_audio.mp3');
const losingAudio = new Audio('../audio/losing_audio.mp3');
playAgainButton.textContent = 'Play Again';
let cloudIncrement = 5;
function createCloud(cloudSize) {
    let spawnedClouds = document.querySelector(`.cloud${cloudIncrement}`);
    const cloud = document.createElement('div');
    cloud.classList.add('cloud', cloudSize, `cloud${cloudIncrement + 1}`);
    cloudContainer.appendChild(cloud);
    if (cloudIncrement < 20) {
        setInterval(() => {
            cloudIncrement++;
            cloud.className = `cloud ${cloudSize} cloud${cloudIncrement}`;
            spawnedClouds.style.animation = `ts-cloud-drift 12s linear infinite 2s`;
        }, 10000);
    }
    else {
        return;
    }
    setTimeout(() => createCloud(cloudSize), 12000);
}
function displayKeyboard() {
    gameContainer.appendChild(keyboardContainer);
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    letters.forEach(letter => {
        let button = document.createElement('button');
        button.textContent = letter;
        button.classList.add('key');
        keyboardContainer.appendChild(button);
    });
}
function fetchWord(objectIndex) {
    return fetch('../JSON/words.json')
        .then(function (response) {
        if (response.ok) {
            console.log('Successfully fetched words.json');
            return response.json();
        }
    })
        .then(data => {
        const wordObj = data.words[objectIndex];
        let targetWord = data.words[objectIndex].word;
        let usedWords = new Set();
        let word = wordObj.word;
        wordDisplay.innerHTML = `<strong>${'_ '.repeat(targetWord.length)}</strong>`;
        wordDisplay.appendChild(document.createElement('p')).textContent = `(${wordObj.hint})`;
        usedWords.add(word);
        return targetWord;
    })
        .catch(error => {
        console.error('Error fetching words.json:', error);
    });
}
function initializeGame() {
    return __awaiter(this, void 0, void 0, function* () {
        let targetWord = yield fetchWord(toyStoryHangman.currentJsonIndex);
        let correctGuessImage = 1;
        let falseGuessImage = 1;
        const gameImage = document.createElement('img');
        imageContainer.appendChild(gameImage);
        let displayWordState = Array.from(targetWord).map(() => '_');
        const keyHandler = (event) => {
            const keyboardKey = event.key.toUpperCase();
            const targetWordFlag = targetWord.includes(keyboardKey);
            const pressedKey = Array.from(keyboardContainer.querySelectorAll('.key')).find(btn => btn.textContent === keyboardKey);
            if (!pressedKey || pressedKey.disabled)
                return;
            if (targetWordFlag) {
                for (let i = 0; i < targetWord.length; i++) {
                    if (keyboardKey === targetWord[i]) {
                        displayWordState[i] = keyboardKey;
                    }
                }
                wordDisplay.innerHTML = `<strong>${displayWordState.join(' ')}</strong>`;
                pressedKey.style.backgroundColor = 'var(--ts-green)';
                pressedKey.disabled = true;
                gameImage.setAttribute('src', `../Images/buzz-right-${correctGuessImage}.jpg`);
                correctGuessImage++;
                if (!wordDisplay.innerHTML.includes('_')) {
                    wordDisplay.appendChild(document.createElement('p')).textContent = `Congratulations! You've guessed correctly! the word was: ${targetWord}`;
                    winningAudio.play();
                    keyboardContainer.querySelectorAll('.key').forEach(key => key.disabled = true);
                    removeEventListener('keydown', keyHandler);
                    playAgainContainer.appendChild(playAgainButton);
                    playAgainButton.onclick = () => {
                        toyStoryHangman.playAgain();
                    };
                }
            }
            else {
                pressedKey.style.backgroundColor = 'var(--ts-red)';
                pressedKey.disabled = true;
                gameImage.setAttribute('src', `../Images/buzz-wrong-${falseGuessImage}.jpg`);
                falseGuessImage++;
                falseGuessImage === 7 ? wordDisplay.innerHTML = `<p>Game Over! The correct word was: ${targetWord}</p>` : null;
                if (falseGuessImage === 7) {
                    keyboardContainer.querySelectorAll('.key').forEach(key => key.disabled = true);
                    removeEventListener('keydown', keyHandler);
                    playAgainContainer.appendChild(playAgainButton);
                    losingAudio.play();
                    playAgainButton.onclick = () => {
                        toyStoryHangman.playAgain();
                    };
                }
            }
        };
        addEventListener('keydown', keyHandler);
    });
}
const toyStoryHangman = {
    startGame: initializeGame,
    showKeyboard: displayKeyboard,
    resetKeyboard: function () {
        keyboardContainer.innerHTML = '';
        this.showKeyboard();
    },
    createClouds: createCloud,
    getJSONWord: fetchWord,
    currentJsonIndex: 0,
    incrementJsonIndex: function () {
        this.currentJsonIndex++;
        return this.currentJsonIndex;
    },
    playAgain: function () {
        this.incrementJsonIndex();
        this.resetKeyboard();
        imageContainer.innerHTML = '';
        playAgainButton.remove();
        this.startGame();
    }
};
createCloud('cloud-lg');
createCloud('cloud-md');
createCloud('cloud-sm');
toyStoryHangman.showKeyboard();
toyStoryHangman.startGame();
//# sourceMappingURL=script.js.map