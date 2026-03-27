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
        let targetWord = yield fetchWord(0);
        let correctGuessImage = 1;
        let falseGuessImage = 1;
        const gameImage = document.createElement('img');
        imageContainer.appendChild(gameImage);
        const keepKeyboardInViewport = () => {
            keyboardContainer.scrollIntoView({ block: 'end', inline: 'nearest' });
        };
        const setGuessImage = (source) => {
            const maintainKeyboardVisibility = () => {
                requestAnimationFrame(keepKeyboardInViewport);
            };
            gameImage.onload = maintainKeyboardVisibility;
            gameImage.onerror = maintainKeyboardVisibility;
            gameImage.setAttribute('src', source);
            if (gameImage.complete) {
                maintainKeyboardVisibility();
            }
        };
        if (window.visualViewport) {
            window.visualViewport.addEventListener('resize', keepKeyboardInViewport);
        }
        let displayWordState = Array.from(targetWord).map(() => '_');
        document.addEventListener("keydown", (event) => {
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
                setGuessImage(`../Images/buzz-right-${correctGuessImage}.jpg`);
                correctGuessImage++;
                if (!wordDisplay.innerHTML.includes('_')) {
                    wordDisplay.innerHTML = `<p>Congratulations! You've guessed correctly!</p>`;
                    keyboardContainer.querySelectorAll('.key').forEach(key => key.disabled = true);
                }
            }
            else {
                pressedKey.style.backgroundColor = 'var(--ts-red)';
                pressedKey.disabled = true;
                setGuessImage(`../Images/buzz-wrong-${falseGuessImage}.jpg`);
                falseGuessImage++;
                falseGuessImage === 6 ? wordDisplay.innerHTML = `<p>Game Over! The correct word was: ${targetWord}</p>` : null;
                if (falseGuessImage === 6) {
                    keyboardContainer.querySelectorAll('.key').forEach(key => key.disabled = true);
                }
            }
        });
    });
}
createCloud('cloud-lg');
createCloud('cloud-md');
createCloud('cloud-sm');
displayKeyboard();
fetchWord(0);
initializeGame();
//# sourceMappingURL=script.js.map