declare let pageContainer: HTMLElement;
declare let cloudContainer: HTMLElement;
declare let gameContainer: HTMLElement;
declare let keyboardContainer: HTMLElement;
declare let wordDisplay: HTMLElement;
declare let imageContainer: HTMLElement;
declare let playAgainContainer: HTMLElement;
declare const playAgainButton: HTMLButtonElement;
declare const winningAudio: HTMLAudioElement;
declare const losingAudio: HTMLAudioElement;
declare let cloudIncrement: number;
declare function createCloud(cloudSize: string): void;
declare function displayKeyboard(): void;
declare function fetchWord(objectIndex: number): Promise<string>;
declare function initializeGame(): Promise<void>;
declare const toyStoryHangman: {
    startGame: typeof initializeGame;
    showKeyboard: typeof displayKeyboard;
    resetKeyboard: () => void;
    createClouds: typeof createCloud;
    getJSONWord: typeof fetchWord;
    currentJsonIndex: number;
    incrementJsonIndex: () => number;
    playAgain: () => void;
};
//# sourceMappingURL=script.d.ts.map