let pageContainer = document.querySelector('.container') as HTMLElement;
let cloudContainer = document.querySelector('.cloud_container') as HTMLElement;
let gameContainer = document.querySelector('.game_container') as HTMLElement;
let keyboardContainer = document.querySelector('.keyboard') as HTMLElement;
let wordDisplay = document.querySelector('.hangman') as HTMLElement;
let imageContainer = document.querySelector('.image_container') as HTMLElement;
let cloudIncrement: number = 5;
function createCloud(cloudSize: string) {
    
    let spawnedClouds = document.querySelector(`.cloud${cloudIncrement}`) as HTMLElement;
    const cloud = document.createElement('div') as HTMLDivElement;
    cloud.classList.add('cloud', cloudSize, `cloud${cloudIncrement+1}`);
    cloudContainer.appendChild(cloud);
    if(cloudIncrement <20) {
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


function displayKeyboard(){
    gameContainer.appendChild(keyboardContainer);
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    letters.forEach(letter => {
        let button = document.createElement('button') as HTMLButtonElement;
        button.textContent = letter;
        button.classList.add('key');
        keyboardContainer.appendChild(button);
    });

}

function fetchWord(objectIndex: number): Promise<string> {
    
    return fetch('../JSON/words.json')
        .then(function(response) {
            if(response.ok) {
                console.log('Successfully fetched words.json');
                return response.json();
            }
        })
        .then(data => {
            const wordObj = data.words[objectIndex];
            let targetWord = data.words[objectIndex].word;
            let usedWords = new Set<string>();
            let word = wordObj.word;
            

            wordDisplay.innerHTML =`<strong>${'_ '.repeat(targetWord.length)}</strong>`;
            wordDisplay.appendChild(document.createElement('p')).textContent = `(${wordObj.hint})`;
            usedWords.add(word);
            return targetWord;

        })
        .catch(error => {
            console.error('Error fetching words.json:', error);
        });

}



async function initializeGame() {
    let targetWord = await fetchWord(0);
    let correctGuessImage: number = 1;
    let falseGuessImage: number = 1;
    const gameImage = document.createElement('img') as HTMLImageElement;
    imageContainer.appendChild(gameImage);
    const keepKeyboardInViewport = () => {
        keyboardContainer.scrollIntoView({ block: 'end', inline: 'nearest' });
    };
    const setGuessImage = (source: string) => {
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
    let displayWordState: string []= Array.from(targetWord).map(() => '_');
    document.addEventListener("keydown", (event) => {
        const keyboardKey = event.key.toUpperCase();
        const targetWordFlag = targetWord.includes(keyboardKey);
        
        const pressedKey = Array.from(keyboardContainer.querySelectorAll('.key')).find(btn => btn.textContent === keyboardKey) as HTMLButtonElement;
        if (!pressedKey || pressedKey.disabled) return;

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
                keyboardContainer.querySelectorAll('.key').forEach(key => (key as HTMLButtonElement).disabled = true);
            }
        } else  {
            pressedKey.style.backgroundColor = 'var(--ts-red)';
            pressedKey.disabled = true;
            setGuessImage(`../Images/buzz-wrong-${falseGuessImage}.jpg`);
            falseGuessImage++;
            falseGuessImage === 6? wordDisplay.innerHTML = `<p>Game Over! The correct word was: ${targetWord}</p>`: null;
            if (falseGuessImage === 6) {
                keyboardContainer.querySelectorAll('.key').forEach(key => (key as HTMLButtonElement).disabled = true);
            }
        }
    });
}

createCloud('cloud-lg');
createCloud('cloud-md');
createCloud('cloud-sm');
displayKeyboard();
fetchWord(0);
initializeGame();
